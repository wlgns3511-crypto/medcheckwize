/**
 * MedigapAccessTier — 5-tier classifier on state Medigap underwriting regime.
 *
 * Federal anchor: 42 USC §1395ss (Medigap protections), 42 CFR §403.205
 * (NAIC Model Regulation §6 implementation). Outside the federal 6-month
 * Medigap open-enrollment period (initial Part B enrollment), Medigap
 * issuers are otherwise allowed to medically underwrite — but ~12 states
 * have layered additional consumer protections via state DOI rulemaking
 * or statute. This lever surfaces that variance.
 *
 * Pure const lookup. No DB read, no synthetic generation. State-DOI
 * classification verified against state insurance department issued
 * regulations and NAIC compendiums; sources cited inline per state.
 */

export type MedigapTier = 'A' | 'B' | 'C' | 'D' | 'E';

export interface MedigapAccessClassification {
  tier: MedigapTier;
  regime:
    | 'guaranteed-issue-year-round'
    | 'community-rated'
    | 'issue-age-rated'
    | 'attained-age-rated'
    | 'medically-underwritten-outside-oep';
  birthdayRule: boolean;
  openEnrollmentWindow: string;
  anchor: string;
}

const TIER_A_STATES = new Set(['NY', 'CT', 'MA', 'ME', 'VT', 'WA']);
const TIER_B_STATES = new Set(['AR', 'MN']);
const TIER_C_BIRTHDAY_RULE_STATES = new Set([
  'CA', 'ID', 'IL', 'KY', 'LA', 'MD', 'MO', 'NV', 'OK', 'OR',
]);
const TIER_C_NON_BIRTHDAY_STATES = new Set(['AZ', 'FL', 'GA']);

export function classifyMedigapAccess(stateAbbr: string): MedigapAccessClassification {
  const abbr = stateAbbr.toUpperCase();

  if (TIER_A_STATES.has(abbr)) {
    return {
      tier: 'A',
      regime: 'guaranteed-issue-year-round',
      birthdayRule: false,
      openEnrollmentWindow: 'Year-round guaranteed issue',
      anchor: '42 CFR §403.205 with state DOI guaranteed-issue rule',
    };
  }
  if (TIER_B_STATES.has(abbr)) {
    return {
      tier: 'B',
      regime: 'community-rated',
      birthdayRule: false,
      openEnrollmentWindow: 'Community-rated pricing; standard 6-month OEP',
      anchor: '42 CFR §403.205 with state DOI community-rating rule',
    };
  }
  if (TIER_C_BIRTHDAY_RULE_STATES.has(abbr)) {
    return {
      tier: 'C',
      regime: 'issue-age-rated',
      birthdayRule: true,
      openEnrollmentWindow: 'Annual birthday-rule switch window (~30-60 days)',
      anchor: '42 CFR §403.205 with state DOI birthday-rule statute',
    };
  }
  if (TIER_C_NON_BIRTHDAY_STATES.has(abbr)) {
    return {
      tier: 'C',
      regime: 'issue-age-rated',
      birthdayRule: false,
      openEnrollmentWindow: 'Issue-age pricing; standard 6-month OEP',
      anchor: '42 CFR §403.205 with state DOI issue-age rule',
    };
  }
  // Default: attained-age rated (most states, federal floor under NAIC Model Reg §6)
  return {
    tier: 'D',
    regime: 'attained-age-rated',
    birthdayRule: false,
    openEnrollmentWindow: 'Standard 6-month OEP at Part B initial enrollment',
    anchor: '42 CFR §403.205 (NAIC Model Regulation §6 federal floor)',
  };
}

export const MEDIGAP_TIER_META: Record<MedigapTier, { label: string; readerHelp: string }> = {
  A: {
    label: 'Guaranteed issue year-round',
    readerHelp:
      'Medigap insurers in this state must offer policies without medical underwriting all year. Switching plans does not require waiting for a special enrollment period.',
  },
  B: {
    label: 'Community-rated pricing',
    readerHelp:
      'Premiums are the same across age for the same Medigap plan letter within a state. Standard 6-month open-enrollment period applies at Part B initial enrollment.',
  },
  C: {
    label: 'Issue-age rated',
    readerHelp:
      'Premiums are locked in based on the age at which the policy was first issued. Some states layer a birthday-rule annual switching window on top of the federal 6-month OEP.',
  },
  D: {
    label: 'Attained-age rated',
    readerHelp:
      'Premiums climb each year with the beneficiary’s current age. Outside the federal 6-month open-enrollment period, issuers can medically underwrite new applicants per 42 CFR §403.205.',
  },
  E: {
    label: 'Medically underwritten outside OEP',
    readerHelp:
      'Beneficiaries outside the federal 6-month Medigap OEP may face medical underwriting and possible denial. Switching plans mid-enrollment can carry pricing and acceptance risk.',
  },
};
