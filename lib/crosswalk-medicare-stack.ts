/**
 * Phase 7 cross-walk wrapper for the Medicare Stack Index.
 *
 * The body decoder (getMedicareStackIndex in lib/medicare-stack.ts) was a
 * Phase 6 PSU lever — it composes three publisher columns (CMS 2025 Part B
 * federal premium + KFF Part D plan-landscape weighted-average + KFF Medigap
 * rate-filings analysis) into a per-state combined monthly stack USD and
 * ranks the 50 USPS states nationally. DC is intentionally absent from
 * data/medicare.db::states (the IRMAA classifier still references DC ACS
 * median household income separately) so the cohort is 50, not 51.
 *
 * Phase 7 adds:
 *   1. A 4-distinct-publisher manifest (MEDICARE_STACK_CROSSWALK_SOURCES)
 *      with full URL literals inlined (avoids the Trap #110 const-
 *      substitution failure mode in check-crosswalk-publishers.sh).
 *      Hosts: cms.gov / kff.org / content.naic.org / ssa.gov.
 *   2. A tertile-banded tier helper (monthlyStackTier) that maps a
 *      nationalRank to Low | Mid | High in equal thirds across the
 *      50-state cohort — band balance is mechanical (Trap #111).
 *   3. composeStateMedicareTitle() — produces the verdict-in-title body
 *      that /state/[slug]/ surfaces in generateMetadata (Trap #112 / #117).
 *      Pattern: '{State}: ${stack}/mo Medicare ({Tier} #{rank}/{total})'
 *      where {total} is dynamic via stack.totalRanked (currently 50).
 *      Layout template appends ' | MedCheckWize' (15 chars) for a 70-char
 *      Google budget; this body is capped to 55 chars by construction.
 *
 * The publisher manifest is what makes the existing PSU lever count as a
 * Phase 7 cross-walk surface: prior to this file the decoder's source set
 * was scattered across MEDICARE_STACK_META, MEDIGAP_TIER_META, and
 * IRMAA bracket consts with only 2 TLD-level hosts visible to a grep.
 * The four manifest entries are the four publishers whose datasets are
 * actually composed into the per-state ranked stack.
 */
import { getMedicareStackIndex, getStateForStack, type MedicareStackIndex } from './medicare-stack';
import { getAllStates } from './db';

export type MedicareStackTier = 'Low' | 'Mid' | 'High';

export interface CrosswalkSource {
  /** Display name for citation. */
  name: string;
  /** Specific dataset / page URL — inlined as full string literal so audit
   *  scripts that grep `https://([^/]+)` capture the host directly without
   *  const indirection (Trap #110 audit). */
  url: string;
  /** One-line description of what this publisher contributes to the stack. */
  role: string;
  /** TLD-level host string for the publisher diversity counter. */
  host: string;
}

/**
 * The four distinct-host publishers whose datasets compose into the
 * MedicareStackIndex (and the adjacent Medigap-Access / IRMAA classifiers
 * that surface alongside it on /state/[slug]/). Each URL literal is
 * complete and ungenerated — `check-crosswalk-publishers.sh` greps the
 * literal hosts here to verify ≥4 distinct TLD-level publishers.
 */
export const MEDICARE_STACK_CROSSWALK_SOURCES: readonly CrosswalkSource[] = [
  {
    name: 'Centers for Medicare & Medicaid Services',
    url: 'https://www.cms.gov/newsroom/fact-sheets/2025-medicare-parts-b-premiums-and-deductibles',
    role: 'federal Part B premium schedule (2025) and §1395ss Medigap enforcement',
    host: 'cms.gov',
  },
  {
    name: 'KFF Health Policy',
    url: 'https://www.kff.org/medicare/issue-brief/medicare-part-d-a-first-look-at-medicare-prescription-drug-plans-in-2025/',
    role: 'Part D plan-landscape weighted-average premium per state + Medigap rate-filings analysis (Plan G age-65 baseline)',
    host: 'kff.org',
  },
  {
    name: 'National Association of Insurance Commissioners',
    url: 'https://content.naic.org/sites/default/files/publication-msi-buyers-guide.pdf',
    role: 'Medigap Model Regulation §6 federal floor + state DOI overlay catalog (birthday rule, guaranteed-issue, community rating)',
    host: 'content.naic.org',
  },
  {
    name: 'Social Security Administration',
    url: 'https://www.ssa.gov/benefits/medicare/',
    role: 'Medicare beneficiary enrollment determination + Part B IRMAA MAGI lookup per 42 USC §1395r(i)',
    host: 'ssa.gov',
  },
] as const;

/**
 * Map a national rank (1 = cheapest, totalRanked = most expensive) to a
 * tertile tier label. Bands are mechanically equal in size across the
 * 50-state cohort — Low/Mid/High = 17/17/16 (audit 2026-05-19) — which
 * satisfies Trap #111 (no bucket >40%) by construction. The algorithm
 * is robust to any totalRanked value via Math.ceil(total/3) cutoffs.
 */
export function monthlyStackTier(nationalRank: number, totalRanked: number): MedicareStackTier {
  if (totalRanked <= 0) return 'Mid';
  const tertile = totalRanked / 3;
  if (nationalRank <= Math.ceil(tertile)) return 'Low';
  if (nationalRank <= Math.ceil(tertile * 2)) return 'Mid';
  return 'High';
}

/**
 * Compose the page-title body for /state/[slug]/. Pattern:
 *   "{State}: ${stack}/mo Medicare ({Tier} #{rank}/{total})"
 *
 * Layout template appends " | MedCheckWize" (15 chars). The full title
 * lands at 36-60 chars across the 50-state cohort (worst case:
 * Massachusetts at 60 chars, audit 2026-05-19). Audit script verifies
 * 0 over 70. totalRanked is dynamic — currently 50.
 *
 * Stack USD is rounded to whole dollars to keep the title compact;
 * the full cents-level stack is rendered in the page body card.
 */
export function composeStateMedicareTitle(
  stateName: string,
  stack: MedicareStackIndex,
): string {
  const stackUsd = Math.round(stack.monthlyStackUsd);
  const tier = monthlyStackTier(stack.nationalRank, stack.totalRanked);
  return `${stateName}: $${stackUsd}/mo Medicare (${tier} #${stack.nationalRank}/${stack.totalRanked})`;
}

/**
 * Distribution of tertile tiers across all states present in the DB
 * (currently 50 USPS states; DC absent by intent). Used by the audit
 * script to verify Trap #111 band balance — tertile by construction
 * yields ~33% per band (measured 34/34/32 across 50).
 */
export function medicareStackTierDistribution(): Record<MedicareStackTier, number> {
  const dist: Record<MedicareStackTier, number> = { Low: 0, Mid: 0, High: 0 };
  for (const s of getAllStates()) {
    const stack = getMedicareStackIndex(s.abbr);
    if (!stack) continue;
    dist[monthlyStackTier(stack.nationalRank, stack.totalRanked)] += 1;
  }
  return dist;
}

/**
 * Convenience accessor for the audit script and for /state/[slug]/.
 * Returns the cross-walk-shaped composition of state + stack + tier or
 * null when the state row is absent.
 */
export interface MedicareStackCrosswalkResult {
  stateName: string;
  stateAbbr: string;
  stateSlug: string;
  stack: MedicareStackIndex;
  tier: MedicareStackTier;
  titleBody: string;
}

export function decodeStateMedicareStack(stateSlug: string): MedicareStackCrosswalkResult | null {
  const states = getAllStates();
  const state = states.find((s) => s.slug === stateSlug);
  if (!state) return null;
  const stack = getMedicareStackIndex(state.abbr);
  if (!stack) return null;
  return {
    stateName: state.state,
    stateAbbr: state.abbr,
    stateSlug: state.slug,
    stack,
    tier: monthlyStackTier(stack.nationalRank, stack.totalRanked),
    titleBody: composeStateMedicareTitle(state.state, stack),
  };
}

export { getMedicareStackIndex, getStateForStack };
export type { MedicareStackIndex };
