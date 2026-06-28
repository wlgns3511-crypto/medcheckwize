/**
 * medcheckwize composite interpretation layer.
 *
 * Synthesises four state-level signals into a single dominant-signal
 * verdict and a 4-paragraph cross-synthesis:
 *
 *   1. MedicareStackIndex (Part B + Part D + Medigap monthly premium rank
 *      across 50 states, where rank 1 = cheapest combined premium stack)
 *   2. MedigapAccessTier (federal §1395ss floor + state DOI overlay, A–E)
 *   3. IrmaaTier (CMS-published 2026 IRMAA Part B + Part D surcharge band,
 *      0–5, applied per state via Census ACS B19013 statewide median)
 *   4. Medicaid expansion flag (state.medicaid_expansion === 'yes')
 *
 * Pure deterministic function. Dominant signal is selected from a
 * priority-ordered ladder so that any one state resolves to exactly
 * one signal (mutually exclusive). The 4-paragraph synthesis is
 * generated for the chosen signal, with state-level facts spliced in.
 */

import type { State } from './db';
import type { MedicareStackIndex } from './medicare-stack';
import type { MedigapAccessClassification } from './medigap-access-tier';
import type { IrmaaStateApplication } from './irmaa-tier';
import { formatCurrency } from './format';

export type DominantSignal =
  | 'BirthdayWindowOpen'
  | 'IrmaaHighEarnerBurden'
  | 'MedigapUnderwritingTrap'
  | 'StackLowMedigapOpen'
  | 'ExpansionStateMedicaidBridge'
  | 'StandardSelfPayLane';

export interface MedcheckwizeInterpretation {
  dominantSignal: DominantSignal;
  verdict: string;
  paragraphs: [string, string, string, string];
}

export interface InterpretationInputs {
  state: State;
  stack: MedicareStackIndex | null;
  medigap: MedigapAccessClassification;
  irmaa: IrmaaStateApplication;
}

const SIGNAL_VERDICT: Record<DominantSignal, string> = {
  BirthdayWindowOpen: 'Annual birthday-rule switching window protects you here',
  IrmaaHighEarnerBurden: 'IRMAA high-earner surcharge dominates the income side of cost',
  MedigapUnderwritingTrap: 'Outside the 6-month OEP, medical underwriting can lock you out',
  StackLowMedigapOpen: 'Low premium stack and year-round guaranteed-issue Medigap',
  ExpansionStateMedicaidBridge: 'Medicaid expansion bridges the 65-gap for low-income enrollees',
  StandardSelfPayLane: 'Standard federal Medicare lane — federal floor with no state overlay',
};

/**
 * Priority-ordered ladder. Each state lands on the first signal whose
 * predicate fires; the rest are skipped. This guarantees mutual exclusivity.
 */
function pickDominantSignal(inp: InterpretationInputs): DominantSignal {
  const { state, medigap, irmaa } = inp;

  // 1. Birthday-rule states get the most reader-actionable signal first.
  if (medigap.birthdayRule) return 'BirthdayWindowOpen';

  // 2. Tier 3+ IRMAA on the statewide median = high-earner-state pattern
  //    (the median household already crosses the Tier 3 floor of $167K).
  if (irmaa.magiTier >= 3) return 'IrmaaHighEarnerBurden';

  // 3. Tier D/E Medigap with no state overlay = federal underwriting risk.
  if (medigap.tier === 'D' || medigap.tier === 'E') {
    // But only flag as the dominant signal if there is no expansion-state
    // bridge softening the gap — otherwise expansion takes priority below.
    if (state.medicaid_expansion !== 'yes') return 'MedigapUnderwritingTrap';
  }

  // 4. Tier A/B guaranteed-issue + low premium stack = best-case combo.
  if ((medigap.tier === 'A' || medigap.tier === 'B') && inp.stack && inp.stack.nationalRank <= 15) {
    return 'StackLowMedigapOpen';
  }

  // 5. Expansion states give a Medicaid bridge for low-income near-retirees.
  if (state.medicaid_expansion === 'yes') return 'ExpansionStateMedicaidBridge';

  // 6. Default: standard federal lane.
  return 'StandardSelfPayLane';
}

function paragraphsFor(signal: DominantSignal, inp: InterpretationInputs): [string, string, string, string] {
  const { state, stack, medigap, irmaa } = inp;
  const stackMonthly = stack ? formatCurrency(stack.monthlyStackUsd) : '—';
  const stackRank = stack ? `${stack.nationalRank} of ${stack.totalRanked}` : 'unranked';
  const irmaaTotal = formatCurrency(irmaa.bracket.totalAnnualUsd);
  const acsMedian = formatCurrency(irmaa.statewideMedianMagi);
  const partB = formatCurrency(state.part_b_premium);
  const partD = formatCurrency(state.part_d_premium_avg);
  const medigapPrem = formatCurrency(state.medigap_avg_premium);

  switch (signal) {
    case 'BirthdayWindowOpen':
      return [
        `${state.state} is one of ~10 birthday-rule states where Medigap issuers must offer a 30-to-60-day annual switching window without medical underwriting. The federal 6-month open-enrollment period (42 USC §1395ss, 42 CFR §403.205) still applies at Part B initial enrollment, but ${state.state} layers a state-DOI-mandated annual reissue right on top — the most reader-actionable Medigap protection a state offers.`,
        `The combined premium stack in ${state.state} is ${stackMonthly}/month (national rank ${stackRank}): ${partB} Part B + ${partD} Part D + ${medigapPrem} Plan G Medigap. The birthday window means a beneficiary can shop the Medigap layer once per year for a comparable plan letter without health questions — a structural escape from carrier-specific rate creep.`,
        `${state.state}'s statewide ACS B19013 median household income is ${acsMedian}, placing the median beneficiary at IRMAA tier ${irmaa.magiTier} (${irmaaTotal} additional annual Medicare premium per affected enrollee). Combined with the standard premium stack, the typical income-side Medicare cost is the stack itself for most beneficiaries, and the stack plus IRMAA for those with MAGI above the Tier 1 floor.`,
        `Reader takeaway: in ${state.state}, the timing of the Medigap shop matters less than in attained-age states — the birthday window resets the carrier comparison every year. Track the window start date with your current carrier and treat the federal 6-month OEP as the floor, not the only access path.`,
      ];

    case 'IrmaaHighEarnerBurden':
      return [
        `${state.state}'s ACS B19013 statewide median household income is ${acsMedian}, which places the typical household at IRMAA tier ${irmaa.magiTier}. The 2026 CMS schedule (42 USC §1395r(i)) attaches an additional ${formatCurrency(irmaa.bracket.partBSurchargeUsd)}/month Part B surcharge and ${formatCurrency(irmaa.bracket.partDSurchargeUsd)}/month Part D surcharge — totaling ${irmaaTotal} per beneficiary per year.`,
        `The standard premium stack is ${stackMonthly}/month (national rank ${stackRank}): ${partB} Part B + ${partD} Part D + ${medigapPrem} Plan G. IRMAA stacks on top of Part B and Part D, so the high-MAGI beneficiary in ${state.state} faces a true combined monthly cost meaningfully higher than the stack number on its own.`,
        `Medigap access in ${state.state} is tier ${medigap.tier} (${medigap.regime}). ${medigap.birthdayRule ? 'A state-DOI birthday-rule annual switching window applies.' : 'The federal 6-month OEP under 42 CFR §403.205 is the primary access path.'} The IRMAA surcharge is independent of Medigap pricing — it applies to original Medicare Parts B and D regardless of which supplemental plan letter the beneficiary chooses.`,
        `Reader takeaway: in ${state.state}, the income-side cost driver is IRMAA, not the standard premium stack. Beneficiaries who can manage 2-year-prior MAGI via Roth conversion timing, capital-gain harvesting, or QCD strategy may avoid Tier 1+ surcharges — but those are individualized tax-plan decisions, not Medicare ones.`,
      ];

    case 'MedigapUnderwritingTrap':
      return [
        `${state.state} operates under the federal Medigap floor (42 CFR §403.205, NAIC Model Regulation §6) with no state-DOI overlay. Outside the federal 6-month open-enrollment period at Part B initial enrollment, Medigap issuers in ${state.state} are permitted to medically underwrite — denying coverage or charging higher premiums for applicants with qualifying conditions.`,
        `The combined premium stack is ${stackMonthly}/month (national rank ${stackRank}): ${partB} Part B + ${partD} Part D + ${medigapPrem} Plan G. But the headline Medigap premium assumes the applicant clears underwriting. Beneficiaries who try to switch carriers or upgrade plan letters outside the OEP may receive a higher quote — or no quote at all — depending on health history.`,
        `${state.state} has not expanded Medicaid, so low-income near-retirees do not have a Medicaid bridge to cover the 60-to-64 pre-Medicare gap. ACS B19013 median household income is ${acsMedian} (IRMAA tier ${irmaa.magiTier}), so the typical beneficiary pays the stack plus, in some cases, an IRMAA surcharge of ${irmaaTotal}/year.`,
        `Reader takeaway: the federal 6-month OEP is the most important window in ${state.state}. Missing it can lock a beneficiary into the carrier and plan letter chosen at Part B initial enrollment for the rest of their Medicare tenure, or into Medicare Advantage as the only practical alternative.`,
      ];

    case 'StackLowMedigapOpen':
      return [
        `${state.state} combines two structural advantages: a low combined premium stack (${stackMonthly}/month, national rank ${stackRank}) and a state-DOI Medigap protection (tier ${medigap.tier}, ${medigap.regime}) that goes beyond the federal §1395ss floor.`,
        `The stack breaks down as ${partB} Part B + ${partD} Part D + ${medigapPrem} Plan G Medigap. ${medigap.tier === 'A' ? 'The year-round guaranteed-issue rule means Medigap carriers must offer policies to any eligible applicant in any month, without medical underwriting.' : 'Community-rated Medigap pricing means premiums are uniform across age within a plan letter.'} This combination materially reduces the lifetime Medigap cost trajectory.`,
        `${state.state}'s ACS B19013 statewide median is ${acsMedian}, placing the typical household at IRMAA tier ${irmaa.magiTier}. ${irmaa.magiTier === 0 ? 'The median beneficiary pays no income-related surcharge.' : `Beneficiaries above the Tier 1 floor pay an additional ${irmaaTotal}/year.`} Medicaid expansion ${state.medicaid_expansion === 'yes' ? 'is in effect, providing a 60-to-64 pre-Medicare bridge for low-income near-retirees.' : 'is not in effect.'}`,
        `Reader takeaway: ${state.state} is structurally one of the cheaper and more flexible Medicare-supplemental markets in the country. The federal 6-month OEP still matters, but the state overlay means a beneficiary has a credible recovery path if they miss it.`,
      ];

    case 'ExpansionStateMedicaidBridge':
      return [
        `${state.state} expanded Medicaid under the Affordable Care Act, opening eligibility to households up to 138% of the federal poverty line. For near-retirees aged 60 to 64, this provides a coverage bridge to age 65 Medicare eligibility, particularly important in households where employer-sponsored insurance has lapsed.`,
        `Once on Medicare, the combined premium stack in ${state.state} is ${stackMonthly}/month (national rank ${stackRank}): ${partB} Part B + ${partD} Part D + ${medigapPrem} Plan G Medigap. Medigap access is tier ${medigap.tier} (${medigap.regime}). ${medigap.birthdayRule ? 'A state-DOI birthday-rule annual switching window applies.' : 'The federal 6-month OEP under 42 CFR §403.205 is the primary access path.'}`,
        `${state.state}'s ACS B19013 statewide median household income is ${acsMedian}, placing the typical household at IRMAA tier ${irmaa.magiTier}. Combined with the standard premium stack, the typical income-side Medicare cost is the stack itself for most beneficiaries, plus ${irmaaTotal}/year of IRMAA for those whose 2-year-prior MAGI crosses the Tier 1 floor.`,
        `Reader takeaway: in ${state.state}, the under-65 Medicaid bridge is the structural protection that distinguishes the state from non-expansion peers. At age 65, the federal Medicare lane takes over, and the access decisions narrow to Medigap-versus-Advantage and the timing of the federal 6-month OEP.`,
      ];

    case 'StandardSelfPayLane':
    default:
      return [
        `${state.state} operates under the federal Medicare floor — 42 USC §1395 and 42 CFR §403.205 — with no state-DOI Medigap overlay and without Medicaid expansion. This is the standard self-pay lane: federal premiums, federal OEP, federal underwriting rules outside the 6-month window.`,
        `The combined premium stack is ${stackMonthly}/month (national rank ${stackRank}): ${partB} Part B + ${partD} Part D + ${medigapPrem} Plan G Medigap. Medigap access is tier ${medigap.tier} (${medigap.regime}). The federal 6-month OEP at Part B initial enrollment is the primary access path; after that, issuers may medically underwrite.`,
        `${state.state}'s ACS B19013 statewide median household income is ${acsMedian}, placing the typical household at IRMAA tier ${irmaa.magiTier} (${irmaaTotal}/year of IRMAA at this income level per CMS 2026 schedule).`,
        `Reader takeaway: in ${state.state}, the federal 6-month OEP is the most important window. Beneficiaries should pre-arrange their Medigap shop within that window and treat the choice as durable — switching carriers later in life requires clearing medical underwriting under §1395ss.`,
      ];
  }
}

export function interpretMedcheckwizeState(inp: InterpretationInputs): MedcheckwizeInterpretation {
  const dominantSignal = pickDominantSignal(inp);
  return {
    dominantSignal,
    verdict: SIGNAL_VERDICT[dominantSignal],
    paragraphs: paragraphsFor(dominantSignal, inp),
  };
}

export const DOMINANT_SIGNAL_META: Record<DominantSignal, { label: string; color: string }> = {
  BirthdayWindowOpen: { label: 'Birthday-rule annual switching window', color: 'emerald' },
  IrmaaHighEarnerBurden: { label: 'IRMAA high-earner surcharge dominant', color: 'rose' },
  MedigapUnderwritingTrap: { label: 'Federal-floor underwriting risk', color: 'amber' },
  StackLowMedigapOpen: { label: 'Low stack + state-DOI Medigap protection', color: 'emerald' },
  ExpansionStateMedicaidBridge: { label: 'Medicaid expansion 60-to-64 bridge', color: 'sky' },
  StandardSelfPayLane: { label: 'Standard federal Medicare lane', color: 'slate' },
};
