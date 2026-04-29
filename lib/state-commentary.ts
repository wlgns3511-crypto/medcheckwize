// State commentary — 4-slot deterministic narrative based on Medicare profile.
// Slots: spendingSummary | maMixSummary | medigapAffordability | coverageGap
// Each slot has 3 variants per relevant band; pickVariant by state slug for SSR/CSR consistency.

import { pickVariant } from "@/lib/content-helpers";
import {
  type StateFacts,
  type SpendingBand,
  type MaBand,
  type MedigapQuartile,
  type UninsuredBand,
  getSpendingBand,
  getMaBand,
  getMedigapQuartile,
  getUninsuredBand,
  getMaPenetration,
} from "@/lib/state-facts";

interface SpendingVariants {
  low: readonly string[];
  "below-avg": readonly string[];
  "near-avg": readonly string[];
  "above-avg": readonly string[];
  high: readonly string[];
}

interface MaVariants {
  low: readonly string[];
  moderate: readonly string[];
  high: readonly string[];
  "very-high": readonly string[];
}

interface MedigapVariants {
  lowest: readonly string[];
  low: readonly string[];
  high: readonly string[];
  highest: readonly string[];
}

interface CoverageVariants {
  "very-low": readonly string[];
  low: readonly string[];
  moderate: readonly string[];
  high: readonly string[];
}

const SPENDING: SpendingVariants = {
  low: [
    "{state}'s per-capita Medicare spending of ${perCapita} runs below the national midpoint, partly reflecting a younger MA-heavy mix and lower utilization in rural areas.",
    "Medicare in {state} averages ${perCapita} per beneficiary — among the lower bands nationally; care intensity per enrollee tends to be lower here.",
    "{state} sits at the lower end of state Medicare spending at ${perCapita}, which often correlates with higher MA enrollment that caps fee-for-service utilization.",
  ],
  "below-avg": [
    "Medicare beneficiaries in {state} cost the program about ${perCapita} per person — slightly under the national midpoint.",
    "{state} averages ${perCapita} per Medicare beneficiary, a touch below the national figure; cost growth here has tracked broader trends without sharp outliers.",
    "Per-capita Medicare spending in {state} runs around ${perCapita}, close to but below the national average.",
  ],
  "near-avg": [
    "Per-capita Medicare spending in {state} averages ${perCapita} — close to the national midpoint, with no major regional outlier effects.",
    "{state} hovers near the national average at ${perCapita} per Medicare beneficiary.",
    "At ${perCapita} per beneficiary, {state}'s Medicare spending is in line with national norms.",
  ],
  "above-avg": [
    "Medicare in {state} averages ${perCapita} per beneficiary — above the national midpoint, often reflecting higher provider density and use of specialists.",
    "{state}'s ${perCapita} per-capita spending sits above the national average; both the inpatient and outpatient mix tend to be more intensive.",
    "Per-capita Medicare spending in {state} reaches ${perCapita}, above the national figure.",
  ],
  high: [
    "{state} runs among the highest-cost Medicare states at ${perCapita} per beneficiary — driven by hospital intensity and specialist utilization.",
    "Medicare beneficiaries in {state} cost the program about ${perCapita} on average, placing the state in the upper band nationally.",
    "At ${perCapita} per beneficiary, {state} is in the high-spending tier; both inpatient and post-acute use are above national norms.",
  ],
};

const MA_MIX: MaVariants = {
  low: [
    "Medicare Advantage enrollment in {state} is relatively low at {maPct}% — most beneficiaries here remain in Original Medicare.",
    "About {maPct}% of {state}'s Medicare beneficiaries are in MA plans; the rest stay on Original Medicare with a Medigap or no supplement.",
    "{state}'s MA penetration is ${maPct}%, lower than the national figure; Original Medicare with supplement is the dominant route.",
  ],
  moderate: [
    "{maPct}% of {state}'s Medicare beneficiaries enrolled in Medicare Advantage — close to the national split.",
    "Medicare Advantage covers about {maPct}% of beneficiaries in {state}; the remainder stay on Original Medicare.",
    "MA enrollment in {state} sits near the national norm at {maPct}%.",
  ],
  high: [
    "Medicare Advantage now covers {maPct}% of {state}'s beneficiaries — above the national split and growing.",
    "{maPct}% of {state}'s Medicare population is in an MA plan, an above-average MA share.",
    "MA enrollment reaches {maPct}% in {state}, putting the state on the higher side of the MA-vs-Original Medicare split.",
  ],
  "very-high": [
    "Medicare Advantage dominates in {state} at {maPct}% of all beneficiaries — far above the national split.",
    "{maPct}% of {state}'s Medicare population enrolled in MA, one of the highest MA-share states nationally.",
    "{state}'s MA penetration sits at {maPct}%, in the top tier of MA enrollment states.",
  ],
};

const MEDIGAP: MedigapVariants = {
  lowest: [
    "Medigap is comparatively cheap in {state} — Plan G averages about ${medigap}/mo, well below the high-cost states.",
    "Average Medigap Plan G premiums in {state} run around ${medigap}/mo, among the most affordable nationally.",
    "{state}'s Medigap market is cost-friendly: the typical Plan G runs about ${medigap}/mo at age 65.",
  ],
  low: [
    "Medigap Plan G in {state} averages roughly ${medigap}/mo — below the national midpoint.",
    "{state}'s typical Medigap Plan G premium is around ${medigap}/mo.",
    "At about ${medigap}/mo, Medigap Plan G in {state} is cheaper than the national average.",
  ],
  high: [
    "Medigap Plan G in {state} runs above the national midpoint at about ${medigap}/mo.",
    "{state}'s typical Medigap Plan G premium is around ${medigap}/mo, on the higher side of the state range.",
    "At about ${medigap}/mo, Medigap is more expensive than average in {state}.",
  ],
  highest: [
    "{state} sits at the top of the Medigap pricing range — Plan G averages about ${medigap}/mo, partly because community-rating rules level pricing across all ages here.",
    "Medigap Plan G in {state} runs about ${medigap}/mo, among the highest premiums nationally.",
    "{state}'s Medigap market is among the priciest: Plan G averages roughly ${medigap}/mo at age 65.",
  ],
};

const COVERAGE: CoverageVariants = {
  "very-low": [
    "{state} has one of the lowest under-65 uninsured rates in the country at {uninsured}%, easing the path to Medicare for those aging in.",
    "At {uninsured}%, {state}'s uninsured rate (under 65) is well below the national figure.",
    "Coverage for the under-65 population in {state} is strong: only {uninsured}% are uninsured.",
  ],
  low: [
    "{state}'s under-65 uninsured rate of {uninsured}% is below the national midpoint.",
    "At {uninsured}%, the under-65 uninsured rate in {state} is lower than the U.S. average.",
    "Pre-Medicare coverage in {state} is broader than average — only {uninsured}% of those under 65 are uninsured.",
  ],
  moderate: [
    "{state}'s under-65 uninsured rate of {uninsured}% is close to the national figure.",
    "About {uninsured}% of {state}'s under-65 population is uninsured, near the national norm.",
    "Pre-Medicare uninsurance in {state} runs at {uninsured}%, in line with national patterns.",
  ],
  high: [
    "{state}'s under-65 uninsured rate of {uninsured}% is among the highest nationally — many beneficiaries arrive at age 65 with care delayed during uninsured years.",
    "At {uninsured}%, the under-65 uninsured rate in {state} sits well above the national figure.",
    "Pre-Medicare coverage gaps are substantial in {state}: {uninsured}% of those under 65 are uninsured.",
  ],
};

function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

export interface StateCommentary {
  spendingSummary: string;
  maMixSummary: string;
  medigapAffordability: string;
  coverageGap: string;
}

export function getStateCommentary(facts: StateFacts): StateCommentary {
  const seed = facts.slug;

  const spendingBand: SpendingBand = getSpendingBand(facts.avg_medicare_spending_per_capita);
  const maBand: MaBand = getMaBand(facts);
  const medigapBand: MedigapQuartile = getMedigapQuartile(facts.medigap_avg_premium);
  const uninsuredBand: UninsuredBand = getUninsuredBand(facts.uninsured_rate);

  const vars = {
    state: facts.state,
    perCapita: facts.avg_medicare_spending_per_capita.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    }),
    maPct: Math.round(getMaPenetration(facts) * 100).toString(),
    medigap: facts.medigap_avg_premium.toFixed(0),
    uninsured: facts.uninsured_rate.toFixed(1),
  };

  return {
    spendingSummary: fillTemplate(pickVariant(SPENDING[spendingBand], seed + "spend"), vars),
    maMixSummary: fillTemplate(pickVariant(MA_MIX[maBand], seed + "ma"), vars),
    medigapAffordability: fillTemplate(pickVariant(MEDIGAP[medigapBand], seed + "gap"), vars),
    coverageGap: fillTemplate(pickVariant(COVERAGE[uninsuredBand], seed + "cov"), vars),
  };
}
