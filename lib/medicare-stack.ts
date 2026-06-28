/**
 * Medicare Stack Index — medcheckwize-original metric.
 *
 * Most Medicare cost guides quote a single premium ($185 Part B in 2025).
 * The reality is a STACK: Original Medicare beneficiaries also pay an
 * average state-level Part D premium (KFF) and an average state-level
 * Medigap premium (KFF) on top of the federal Part B floor.
 *
 * This index synthesises those three columns from the `states` table into
 * a single "True Monthly Medicare Cost" per state, ranks all 50 states +
 * DC nationally, and normalises to a 0-100 affordability score (lower
 * stack = higher score).
 *
 * Why this is unique:
 *   - Medicare.gov surfaces premiums but never stacks them.
 *   - KFF tables show each premium component but never summed.
 *   - No other Medicare-cost site ranks states by total monthly premium.
 *
 * The metric is purely arithmetic on existing DB columns — no fake data,
 * no fabricated weights. The methodology (sources + formula) is disclosed
 * inline on every state page that renders this index.
 */

import { getDb } from './db';
import type { State } from './db';

export interface MedicareStackIndex {
  state: string;
  abbr: string;
  partBPremiumUsd: number;
  partDPremiumUsd: number;
  medigapPremiumUsd: number;
  monthlyStackUsd: number;
  annualStackUsd: number;
  nationalRank: number;        // 1 = cheapest, 51 = most expensive (50 states + DC)
  totalRanked: number;
  affordabilityScore: number;  // 0-100, higher = cheaper
  pctVsNationalMedian: number; // signed %; +/- relative to median monthlyStackUsd
  nationalMedianStackUsd: number;
}

interface StackRow {
  state: string;
  abbr: string;
  part_b_premium: number;
  part_d_premium_avg: number;
  medigap_avg_premium: number;
}

function getAllStackRows(): StackRow[] {
  return getDb()
    .prepare(
      'SELECT state, abbr, part_b_premium, part_d_premium_avg, medigap_avg_premium FROM states ORDER BY (part_b_premium + part_d_premium_avg + medigap_avg_premium) ASC',
    )
    .all() as StackRow[];
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function getMedicareStackIndex(abbr: string): MedicareStackIndex | null {
  const rows = getAllStackRows();
  const totalRanked = rows.length;
  if (totalRanked === 0) return null;

  const stacks = rows.map(r => r.part_b_premium + r.part_d_premium_avg + r.medigap_avg_premium);
  const nationalMedianStackUsd = median(stacks);
  const minStack = stacks[0];
  const maxStack = stacks[stacks.length - 1];
  const range = maxStack - minStack || 1;

  const targetIdx = rows.findIndex(r => r.abbr === abbr);
  if (targetIdx === -1) return null;

  const row = rows[targetIdx];
  const monthlyStackUsd = row.part_b_premium + row.part_d_premium_avg + row.medigap_avg_premium;
  const annualStackUsd = monthlyStackUsd * 12;
  const nationalRank = targetIdx + 1; // already sorted asc
  const affordabilityScore = Math.round(((maxStack - monthlyStackUsd) / range) * 100);
  const pctVsNationalMedian = ((monthlyStackUsd - nationalMedianStackUsd) / nationalMedianStackUsd) * 100;

  return {
    state: row.state,
    abbr: row.abbr,
    partBPremiumUsd: row.part_b_premium,
    partDPremiumUsd: row.part_d_premium_avg,
    medigapPremiumUsd: row.medigap_avg_premium,
    monthlyStackUsd,
    annualStackUsd,
    nationalRank,
    totalRanked,
    affordabilityScore,
    pctVsNationalMedian,
    nationalMedianStackUsd,
  };
}

/**
 * Provenance metadata surfaced in the collapsible methodology panel on
 * every page that renders MedicareStackIndex. Sources are the same KFF /
 * CMS references already cited site-wide.
 */
export const MEDICARE_STACK_META = {
  partBSourceName: 'CMS 2025 Medicare Parts B Premiums & Deductibles',
  partBSourceUrl: 'https://www.cms.gov/newsroom/fact-sheets/2025-medicare-parts-b-premiums-and-deductibles',
  partBVintage: '2025',
  partDSourceName: 'KFF Part D plan landscape analysis',
  partDSourceUrl: 'https://www.kff.org/medicare/issue-brief/medicare-part-d-a-first-look-at-medicare-prescription-drug-plans-in-2025/',
  partDVintage: '2025',
  medigapSourceName: 'KFF Medigap rate filings analysis',
  medigapSourceUrl: 'https://www.kff.org/medicare/issue-brief/key-facts-about-medigap-enrollment-and-premiums-for-medicare-beneficiaries/',
  medigapVintage: '2024',
} as const;

export function getStateForStack(abbr: string): State | undefined {
  return getDb().prepare('SELECT * FROM states WHERE abbr = ?').get(abbr) as State | undefined;
}
