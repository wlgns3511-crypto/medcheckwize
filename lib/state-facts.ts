// Authoritative state-level Medicare/Medicaid facts loader.
// Source: data/state-facts.json (built by scripts/build-state-facts.py).
// Frozen import; no runtime mutation.

import stateFactsData from "@/data/state-facts.json";

export interface StateFacts {
  state: string;
  abbr: string;
  slug: string;
  medicare_enrollees: number;
  medicare_enrollees_year: number;
  medicare_original_benes: number;
  medicare_advantage_benes: number;
  medicare_part_d_benes: number;
  medicare_dual_eligible_benes: number;
  avg_medicare_spending_per_capita: number;
  avg_medicare_spending_year: number;
  stdzd_medicare_spending_per_capita: number;
  part_b_premium: number;
  part_b_premium_year: number;
  medicaid_enrollees: number;
  medicaid_enrollees_year: number;
  medicaid_expansion: "yes" | "no";
  uninsured_rate: number;
  uninsured_rate_year: number;
  part_d_premium_avg: number;
  part_d_premium_avg_year: number;
  medigap_avg_premium: number;
  medigap_avg_premium_year: number;
}

interface StateFactsFile {
  _meta: {
    title: string;
    sources: Record<string, unknown>;
    state_count: number;
    missing: string[];
  };
  by_state: Record<string, StateFacts>;
}

const STATE_FACTS = stateFactsData as unknown as StateFactsFile;

export function getStateFactsByAbbr(abbr: string): StateFacts | null {
  return STATE_FACTS.by_state[abbr] ?? null;
}

// Cost band — based on per-capita Medicare spending.
// 2023 national avg ~$13,000; bands set so each band holds roughly 10-12 states.
export type SpendingBand = "low" | "below-avg" | "near-avg" | "above-avg" | "high";

export function getSpendingBand(perCapita: number): SpendingBand {
  if (perCapita < 11000) return "low";
  if (perCapita < 12500) return "below-avg";
  if (perCapita < 13800) return "near-avg";
  if (perCapita < 15000) return "above-avg";
  return "high";
}

// Medigap quartile (from KFF 2024 data) — within roughly $130-$270/mo range.
export type MedigapQuartile = "lowest" | "low" | "high" | "highest";

export function getMedigapQuartile(premium: number): MedigapQuartile {
  if (premium < 140) return "lowest";
  if (premium < 152) return "low";
  if (premium < 170) return "high";
  return "highest";
}

// Patient burden — uninsured rate band.
export type UninsuredBand = "very-low" | "low" | "moderate" | "high";

export function getUninsuredBand(rate: number): UninsuredBand {
  if (rate < 5) return "very-low";
  if (rate < 8) return "low";
  if (rate < 11) return "moderate";
  return "high";
}

// Medicare Advantage market share — fraction of beneficiaries in MA plans.
export function getMaPenetration(facts: StateFacts): number {
  if (facts.medicare_enrollees === 0) return 0;
  return facts.medicare_advantage_benes / facts.medicare_enrollees;
}

export type MaBand = "low" | "moderate" | "high" | "very-high";

export function getMaBand(facts: StateFacts): MaBand {
  const pct = getMaPenetration(facts);
  if (pct < 0.35) return "low";
  if (pct < 0.50) return "moderate";
  if (pct < 0.60) return "high";
  return "very-high";
}

export function getStateFactsMeta() {
  return STATE_FACTS._meta;
}

export const DATA_LAST_UPDATED = "2026-04-29";
