/**
 * Network-wide publisher and per-site editorial team. MedCheckWize publishes
 * as an organization — the editorial team is the named reviewer, with public
 * CMS / KFF / Census data sources cited inline on every page.
 *
 * Vintage 6-layer split (HCU 2026-05-06):
 *   Distinct page families have distinct review cadences. Treating procedure
 *   data, state aggregates, methodology, about, homepage, and legal as one
 *   DB_UPDATED stamp is the freshness-coupling trap that Google's HCU
 *   classifier penalizes ("everything updated on the same day = nothing
 *   actually updated"). Each layer reflects when that artifact was actually
 *   reviewed.
 *
 * SOURCE_AUTHORITIES (Phase 6 v6.2 honest E-E-A-T):
 *   Only the data providers that actually back numbers on this site. YMYL
 *   HIGHEST tier (Medicare reimbursement / patient cost-share) — keep this
 *   list tight and inline-cited on every entity page. Padding with
 *   non-backing authorities = HCU bait. The methodology page enumerates the
 *   8 granular CMS / KFF / Census datasets; AuthorBox cites the 3 umbrella
 *   organizations.
 */

export const ENTITY_VINTAGE = '2026-04-19';      // Procedure × state CMS snapshot (data)
export const STATE_VINTAGE = '2026-03-22';       // state-level aggregate roll-up
export const METHODOLOGY_VINTAGE = '2026-04-08'; // methodology page review
export const ABOUT_VINTAGE = '2026-04-12';       // about page review
export const SITE_VINTAGE = '2026-03-15';        // homepage editorial review
export const LEGAL_VINTAGES = {
  privacy: '2026-05-12',
  terms: '2026-05-12',
  disclaimer: '2026-05-12',
  editorialPolicy: '2026-05-12',
  correctionsPolicy: '2026-05-12',
} as const;

// Backwards compatibility — existing imports of DB_UPDATED resolve to ENTITY_VINTAGE
// (the most-frequently-touched layer, which matches prior single-stamp behaviour for
// procedure / state pages).
export const DB_UPDATED = ENTITY_VINTAGE;

export const PUBLISHER = {
  name: 'DataPeek Research Network',
  url: 'https://datapeekfacts.com',
  description: 'A public-data network aggregating government and public datasets across US housing, tax, healthcare, and other civic domains.',
};

export const EDITORIAL_TEAM = {
  name: 'MedCheckWize Editorial Team',
  url: 'https://datapeekfacts.com/editorial-policy/',
  parentOrganization: PUBLISHER,
};

/**
 * Honest SOURCE_AUTHORITIES — only data providers actually backing numbers
 * on this site. CMS provider data (umbrella over 4 payment systems +
 * enrollment + geographic variation), KFF (Medicaid / Medigap / Part D),
 * Census ACS (uninsured rate). Methodology page lists all 8 granular
 * datasets; this is the inline-cite umbrella.
 */
export const SOURCE_AUTHORITIES = [
  {
    name: 'CMS Provider Data',
    url: 'https://data.cms.gov/',
  },
  {
    name: 'KFF Health Policy',
    url: 'https://www.kff.org/medicare/',
  },
  {
    name: 'US Census ACS',
    url: 'https://www.census.gov/programs-surveys/acs/',
  },
] as const;

/**
 * YMYL HIGHEST tier reviewer disclaimer — Medicare reimbursement decisions
 * affect 65M Americans and interact with assignment status, supplemental
 * insurance, and plan type. We surface CMS-published averages, not coverage
 * determinations or medical advice.
 */
export const REVIEWER_DISCLAIMER =
  'Cost figures are CMS-published averages; your actual out-of-pocket depends on Original Medicare vs Medicare Advantage, assignment, and supplemental insurance. For your coverage, call 1-800-MEDICARE or your plan directly.';
