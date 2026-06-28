import type { Metadata } from "next";
import Link from "next/link";
import { AuthorBox } from "@/components/AuthorBox";
import { ABOUT_VINTAGE } from "@/lib/authorship";
import { breadcrumbSchema } from "@/lib/schema";

const desc =
  "Editorial policy for MedCheckWize — what we publish, how the MedCheckWize Editorial Team reviews CMS, KFF, NAIC, Census ACS, and CMS-SSA-IRS IRMAA-sourced Medicare and Medicaid pages, the role of the federal Medigap floor at 42 USC §1395ss and 42 CFR §403.205, and the standards we apply across state pages, procedure pages, methodology, and guides.";

export const metadata: Metadata = {
  title: "Editorial Policy — MedCheckWize",
  description: desc,
  alternates: { canonical: "/editorial-policy/" },
  openGraph: { title: "Editorial Policy — MedCheckWize", description: desc, url: "/editorial-policy/" },
};

function formatVintage(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function EditorialPolicyPage() {
  const crumbs = [
    { name: 'Home', url: '/' },
    { name: 'Editorial Policy', url: '/editorial-policy/' },
  ];

  return (
    <article className="prose prose-slate max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />

      <h1>Editorial Policy</h1>
      <p className="text-sm text-slate-500 mb-6">
        Last updated:{' '}
        <time dateTime={ABOUT_VINTAGE}>
          {formatVintage(ABOUT_VINTAGE)}
        </time>
      </p>
      <p className="lead text-lg text-slate-600">
        MedCheckWize publishes Medicare and Medicaid cost data for every
        U.S. state, anchored in the Centers for Medicare and Medicaid
        Services (CMS) administrative payment files, the Kaiser Family
        Foundation (KFF) analyses of CMS Medicaid and Part D data, KFF
        and National Association of Insurance Commissioners (NAIC)
        compilations of state DOI Medigap rate filings, the U.S. Census
        Bureau American Community Survey (ACS), and the CMS-SSA-IRS
        Income-Related Monthly Adjustment Amount (IRMAA) schedule under
        42 USC §1395r(i) (Part B) and 42 USC §1395w-113(a)(7) (Part D).
        Readers use this CMS, KFF, NAIC, Census ACS, and CMS-IRMAA data
        for Medicare enrollment, Medicaid eligibility, Medigap plan
        selection, Part D plan comparison, and IRMAA appeal decisions
        &mdash; decisions where source provenance and federal anchor
        precision matter. This page documents the editorial standards
        the MedCheckWize Editorial Team applies.
      </p>

      <h2>Who reviews what</h2>
      <p>
        The MedCheckWize Editorial Team is responsible for the site&apos;s
        editorial output. Review responsibilities are split by content
        layer:
      </p>
      <ul>
        <li>
          <strong>Methodology, About, and policy pages</strong> are
          reviewed line-by-line by the MedCheckWize Editorial Team before
          publication and on every material update. These pages document
          how MedCheckWize reads CMS, KFF, NAIC, Census ACS, and
          CMS-IRMAA data, and must remain accurate against the current
          federal source schedule.
        </li>
        <li>
          <strong>Long-form guides</strong> &mdash; including the Medicare
          Stack Index explainer, the Medigap Access Tier methodology, the
          IRMAA Tier methodology, the composite verdict explainer, and
          the &ldquo;how to read a MedCheckWize state page&rdquo; guide
          &mdash; are reviewed by the MedCheckWize Editorial Team before
          publication. Any material update to a guide (e.g., a CMS IRMAA
          schedule refresh, a state DOI Medigap rule change, a KFF Part
          D weighted-average revision) triggers re-review.
        </li>
        <li>
          <strong>State pages, procedure pages, and comparison pages</strong>{' '}
          are template-driven from CMS, KFF, NAIC, Census ACS, and
          CMS-IRMAA data. The Editorial Team reviews the template, the
          classifier code, and the underlying CMS/KFF/NAIC/Census/IRMAA
          calculations &mdash; not every individual page. A change to the
          template, to the Medicare Stack Index summation logic, to the
          Medigap Access Tier classifier (lib/medigap-access-tier.ts), to
          the IRMAA Tier application (lib/irmaa-tier.ts), or to the
          composite verdict priority ladder
          (lib/medcheckwize-interpretation.ts) bumps the reviewed date so
          the change is visible on every affected Medicare or Medicaid
          state page.
        </li>
      </ul>

      <h2>Sourcing standards</h2>
      <p>
        Every figure displayed on MedCheckWize traces to a row in a
        federal or federally aligned database. We do not synthesize,
        blend, or estimate Medicare-allowed amounts, KFF Medicaid roll-up
        figures, NAIC-anchored Medigap rates, Census ACS uninsured-rate
        values, or CMS-published IRMAA surcharges.
      </p>
      <p>
        We rely on five primary authorities for the Medicare, Medicaid,
        Medigap, Part D, and IRMAA data on each page:
      </p>
      <ul>
        <li>
          <strong>{' '}
            <a
              href="https://data.cms.gov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Centers for Medicare and Medicaid Services (CMS) administrative datasets
            </a>
          </strong>{' '}
          &mdash; the CMS Inpatient by Geography (MS-DRG bundled payments),
          the CMS Physician &amp; Other Practitioners by Geography (PFS
          allowed amounts), the CMS Outpatient HOPPS APC (facility fees),
          the CMS Clinical Laboratory Fee Schedule (uniform lab rates),
          CMS Medicare Monthly Enrollment, and CMS Medicare Geographic
          Variation are the primary sources for Medicare procedure cost
          and enrollment data on MedCheckWize.
        </li>
        <li>
          <strong>{' '}
            <a
              href="https://www.kff.org/medicare/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kaiser Family Foundation (KFF) Medicare and Medicaid analyses
            </a>
          </strong>{' '}
          &mdash; KFF aggregates the CMS Medicaid Performance Indicator
          data, the CMS Part D plan landscape, and state DOI Medigap rate
          filings into the per-state Medicaid enrollment, expansion-status,
          Part D weighted-average premium, and Plan G Medigap age-65
          baseline values surfaced on each MedCheckWize state page.
        </li>
        <li>
          <strong>{' '}
            <a
              href="https://content.naic.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              National Association of Insurance Commissioners (NAIC) Model Regulation §6 compendium
            </a>
          </strong>{' '}
          &mdash; the canonical reference for state DOI Medigap
          underwriting overlays atop the federal 42 USC §1395ss floor
          (guaranteed-issue year-round, community rating, issue-age
          rating with birthday-rule windows, attained-age rating). The
          MedCheckWize Medigap Access Tier (A-E) classifier
          (lib/medigap-access-tier.ts) is verbatim-anchored to the NAIC
          compendium and state DOI rulemakings.
        </li>
        <li>
          <strong>{' '}
            <a
              href="https://www.census.gov/programs-surveys/acs/"
              target="_blank"
              rel="noopener noreferrer"
            >
              U.S. Census Bureau American Community Survey (ACS)
            </a>
          </strong>{' '}
          &mdash; the Census Bureau ACS 1-Year provides state uninsured
          rates; the ACS 5-Year B19013 series provides the statewide
          median household income used as a proxy for the typical
          Medicare-eligible household&apos;s MAGI in the IRMAA Tier
          application.
        </li>
        <li>
          <strong>{' '}
            <a
              href="https://www.cms.gov/medicare/medicare-part-b-premiums-irmaa"
              target="_blank"
              rel="noopener noreferrer"
            >
              CMS-published IRMAA schedule (42 USC §1395r(i) and §1395w-113(a)(7))
            </a>
          </strong>{' '}
          &mdash; CMS publishes the IRMAA schedule for Part B and Part D
          annually in October or November preceding the year. The
          MedCheckWize IRMAA Tier classifier (lib/irmaa-tier.ts) uses the
          CMS-published 2026 schedule with surcharges applied to the
          ACS B19013 statewide median household income as a proxy. The
          SSA implements IRMAA determinations based on IRS-reported MAGI.
        </li>
      </ul>
      <p>
        For Medicare-eligible beneficiaries who wish to verify CMS,
        KFF, NAIC, Census ACS, or CMS-IRMAA figures directly at the
        federal source, the MedCheckWize methodology page and disclaimer
        link to Medicare.gov Care Compare, the CMS PFS Search, the SSA
        Medicare portal, and the KFF tracker. We treat those federal
        and federally-aligned interfaces as the source of truth.
      </p>

      <h2>What we do not do</h2>
      <ul>
        <li>
          <strong>No proprietary &ldquo;best state for Medicare&rdquo; ranking.</strong>{' '}
          We do not collapse CMS Medicare administrative data, KFF
          Medicaid analyses, NAIC Medigap classifications, Census ACS
          B19013 income, and CMS-IRMAA surcharges into a single aggregate
          score. Single-number rankings hide the trade-offs that matter
          for a specific household decision. We surface the underlying
          classifications (Medicare Stack Index, Medigap Access Tier,
          IRMAA Tier, composite verdict) instead.
        </li>
        <li>
          <strong>Federal-sourced figures, deterministic classifiers.</strong>{' '}
          Every number on a Medicare or Medicaid state page comes from
          CMS, KFF, NAIC, Census ACS, or the CMS-IRMAA schedule. The
          site uses deterministic classifiers (pure functions of CMS,
          KFF, NAIC, ACS, and IRMAA inputs &mdash; see
          <code>lib/medicare-stack.ts</code>,{' '}
          <code>lib/medigap-access-tier.ts</code>,{' '}
          <code>lib/irmaa-tier.ts</code>, and{' '}
          <code>lib/medcheckwize-interpretation.ts</code>) for derived
          labels; the underlying values are the published federal row,
          not a recomputed estimate.
        </li>
        <li>
          <strong>No undisclosed Medicare-plan conflicts.</strong>{' '}
          MedCheckWize earns ad revenue through Google AdSense. We do
          not have Medicare Advantage broker partnerships, Part D
          sponsor placements, Medigap carrier affiliate relationships,
          or referral fees from Medicaid managed-care plans, SHIP
          counselors, or SSA-adjacent IRMAA appeal services. If that
          ever changes, the relationship will be disclosed on the
          relevant CMS, KFF, NAIC, or CMS-IRMAA page.
        </li>
        <li>
          <strong>Reference data only.</strong> Page content describes
          federally reported Medicare, Medicaid, Medigap, Part D, IRMAA,
          and Census ACS data and how it is classified.
          For personalized Medicare, Medicaid, Medigap, Part D, or IRMAA
          decisions, consult a CMS SHIP counselor (1-877-839-2675), a
          licensed Medicare broker authorized in your state, the SSA
          Medicare hotline (1-800-MEDICARE), or a certified financial
          planner.
        </li>
        <li>
          <strong>No fabricated IRMAA or Medigap rate data.</strong>{' '}
          The IRMAA schedule is the CMS-published 2026 schedule. The
          Medigap Access Tier classifier is anchored verbatim to state
          DOI regulations and the NAIC compendium. We do not synthesize
          per-state CMS-IRMAA values or fabricate Medigap underwriting
          regimes; states without a state DOI overlay default to the
          federal 42 USC §1395ss floor under NAIC Model Regulation §6.
        </li>
      </ul>

      <h2>Data vintage and reviewed dates</h2>
      <p>
        Each page surfaces two distinct dates in the AuthorBox at the
        bottom. The data vintage is the federal release our snapshot
        reflects (separate vintages per source: CMS Medicare Geographic
        Variation year, CMS Medicare Monthly Enrollment year, KFF
        Medicaid analysis year, KFF Part D plan landscape year,
        KFF/NAIC Medigap rate-filing year, Census ACS 1-Year and 5-Year,
        and CMS-IRMAA schedule year). The editorial review date is when
        the page template, methodology language, or classifier code
        (the Medicare Stack Index logic, the Medigap Access Tier
        classifier, the IRMAA Tier application, the composite verdict
        ladder) last changed. Keeping the two separate prevents
        methodology updates from falsely refreshing CMS, KFF, NAIC,
        Census ACS, or CMS-IRMAA data freshness, and prevents a CMS or
        KFF sync from masking editorial-review staleness.
      </p>
      <p>
        Federal release cadences vary: CMS Medicare Geographic Variation
        publishes annually with a ~2-year lag; CMS Medicare Monthly
        Enrollment updates monthly; KFF Medicaid and Part D analyses
        update annually following CMS releases; KFF/NAIC Medigap rate
        compilations update annually with a ~6-month lag from state DOI
        filings; Census ACS 5-Year publishes annually in December; the
        CMS-IRMAA schedule updates annually in October/November
        preceding the year. We refresh within days of each release.
      </p>

      <h2>Corrections and updates</h2>
      <p>
        Errors fall into three buckets, each handled differently &mdash;
        see the{' '}
        <Link href="/corrections-policy/">corrections policy</Link> for
        the full path. Material corrections to classifier thresholds
        (the Medicare Stack Index summation, the Medigap Access Tier
        state assignments, the IRMAA Tier MAGI cutoffs and CMS surcharge
        values, the composite verdict priority ladder) or to display
        logic trigger a bumped reviewed date so the change is visible
        on every affected Medicare or Medicaid state page.
      </p>

      <h2>Contact</h2>
      <p>
        Editorial concerns: see the{' '}
        <Link href="/contact/">contact page</Link>. For factual data
        errors against a specific CMS Medicare, KFF Medicaid, KFF
        Part D, KFF/NAIC Medigap, Census ACS, or CMS-IRMAA row, the{' '}
        <Link href="/corrections-policy/">corrections policy</Link>{' '}
        explains what we can fix on our side, what needs a CMS, KFF,
        NAIC, Census, or SSA-source resync, and what is outside our
        control (e.g., CMS small-cell suppression in Medicare
        Geographic Variation, or SSA-handled IRMAA Life-Changing Event
        appeals on Form SSA-44).
      </p>

      <AuthorBox layer="about" />
    </article>
  );
}
