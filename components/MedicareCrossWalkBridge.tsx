/**
 * Phase 7 P5 — DataPeek Network cross-walk bridge for medcheckwize.
 *
 * Links the composed Medicare-Stack verdict on /state/[slug]/ to the four
 * portfolio siblings that carry the matching state-keyed entity. The join
 * key is the kebab-case state slug — the same convention netpaypeek /
 * propertytaxpeek / fairrentwize / evictionlawpeek use across the network.
 *
 * Why these four:
 *  - netpaypeek      = state income tax + take-home pay (IRMAA exposure
 *                      is sensitive to state-tax structure for the still-
 *                      earning beneficiary cohort)
 *  - propertytaxpeek = state-level property tax burden (Medicare-age
 *                      homeowners on fixed income are rate-sensitive)
 *  - fairrentwize    = state-level rent affordability (renter-cohort
 *                      Medicare beneficiaries)
 *  - evictionlawpeek = state-level landlord-tenant law (eviction-risk
 *                      context for senior-renter cohort)
 */
interface Props {
  /** Kebab-case state slug (e.g., "california", "district-of-columbia"). */
  stateSlug: string;
  /** USPS abbreviation (e.g., "CA", "DC"). */
  stateAbbr: string;
  /** Full state name (e.g., "California", "District of Columbia"). */
  stateName: string;
}

const SIBLING_SITES = [
  {
    domain: 'netpaypeek.com',
    label: 'NetPayPeek',
    anchor: 'Take-Home Pay',
    role: 'state income tax + IRMAA-relevant earning-side context',
  },
  {
    domain: 'propertytaxpeek.com',
    label: 'PropertyTaxPeek',
    anchor: 'Property Tax',
    role: 'state-level property-tax burden for fixed-income beneficiaries',
  },
  {
    domain: 'fairrentwize.com',
    label: 'FairRentWize',
    anchor: 'Rent Affordability',
    role: 'state-level rent affordability for renter-cohort beneficiaries',
  },
  {
    domain: 'evictionlawpeek.com',
    label: 'EvictionLawPeek',
    anchor: 'Eviction Protection',
    role: 'state-level landlord-tenant defense + federal-bridge availability',
  },
] as const;

export function MedicareCrossWalkBridge({ stateSlug, stateAbbr, stateName }: Props) {
  return (
    <section className="mt-10 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-700 mb-2">
        DataPeek cross-walk · {stateName} ({stateAbbr})
      </h2>
      <p className="text-xs text-slate-600 leading-relaxed mb-4">
        Medicare cost never sits in isolation — adjacent state-keyed context
        shapes the beneficiary&apos;s total exposure. These sibling surfaces
        carry the matching state-level entity for {stateName}:
      </p>
      <ul className="grid sm:grid-cols-2 gap-3">
        {SIBLING_SITES.map((site) => (
          <li key={site.domain}>
            <a
              href={`https://${site.domain}/state/${stateSlug}/`}
              rel="external noopener"
              className="block rounded-lg border border-slate-200 p-3 hover:border-teal-400 transition-colors"
            >
              <div className="text-sm font-semibold text-slate-900">
                {site.anchor} · {stateName}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{site.label}</div>
              <div className="text-xs text-slate-600 mt-1">{site.role}</div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
