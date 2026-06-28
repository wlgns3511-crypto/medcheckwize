import type { Metadata } from "next";
import Link from "next/link";
import { AuthorBox } from "@/components/AuthorBox";
import { ABOUT_VINTAGE } from "@/lib/authorship"; // used inline for Last updated timestamp
import { breadcrumbSchema } from "@/lib/schema";

const desc =
  "Corrections policy for MedCheckWize — how factual errors in CMS Medicare cost data, KFF Medicaid and Part D figures, KFF/NAIC Medigap rates, Census ACS B19013 income, and the CMS-SSA-IRS IRMAA schedule are reported, routed (MedCheckWize-side fix, federal-source resync, or referral to CMS/KFF/NAIC/SSA), and resolved.";

export const metadata: Metadata = {
  title: "Corrections Policy — MedCheckWize",
  description: desc,
  alternates: { canonical: "/corrections-policy/" },
  openGraph: { title: "Corrections Policy — MedCheckWize", description: desc, url: "/corrections-policy/" },
};

function formatVintage(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function CorrectionsPolicyPage() {
  const crumbs = [
    { name: 'Home', url: '/' },
    { name: 'Corrections Policy', url: '/corrections-policy/' },
  ];

  return (
    <article className="prose prose-slate max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />

      <h1>Corrections Policy</h1>
      <p className="text-sm text-slate-500 mb-6">
        Last updated:{' '}
        <time dateTime={ABOUT_VINTAGE}>
          {formatVintage(ABOUT_VINTAGE)}
        </time>
      </p>
      <p className="lead text-lg text-slate-600">
        MedCheckWize publishes Medicare and Medicaid reference data
        anchored to the Centers for Medicare and Medicaid Services
        (CMS), the Kaiser Family Foundation (KFF) analyses of CMS data,
        the National Association of Insurance Commissioners (NAIC) Model
        Regulation §6 compendium of state Medigap rules, the U.S.
        Census Bureau American Community Survey (ACS), and the
        CMS-Social Security Administration-Internal Revenue Service
        Income-Related Monthly Adjustment Amount (IRMAA) schedule under
        42 USC §1395r(i). When a CMS, KFF, NAIC, Census ACS, or
        CMS-IRMAA figure on this site disagrees with the federal source,
        we route the correction through the policy below.
      </p>

      <h2>Three buckets of errors</h2>
      <ol>
        <li>
          <strong>MedCheckWize-side display fix.</strong> The CMS, KFF,
          NAIC, Census ACS, or CMS-IRMAA source row is correct, but
          MedCheckWize is showing the wrong value, formatting, or label.
          Examples: a Medicare Part B premium displayed in the wrong
          state column, a KFF Plan G Medigap age-65 baseline rounded
          incorrectly, a CMS-published IRMAA Tier 3 surcharge displayed
          as Tier 4, a Medigap Access Tier mis-classified against the
          NAIC compendium. Fix time: within 5 business days of
          verification.
        </li>
        <li>
          <strong>Federal-source resync.</strong> The CMS, KFF, NAIC,
          Census ACS, or CMS-IRMAA source row has been updated by the
          federal agency or federally-aligned analyst, but
          MedCheckWize is still showing the prior vintage. Examples: a
          CMS Medicare Geographic Variation refresh, a KFF Medicaid
          enrollment update, a KFF Part D plan landscape revision, a
          KFF/NAIC Medigap rate-filing refresh, a Census ACS 5-Year
          B19013 update, or a CMS-IRMAA schedule update for the new
          benefit year. Fix time: within 30 days of the federal
          release.
        </li>
        <li>
          <strong>Outside our control.</strong> The CMS, KFF, NAIC,
          Census ACS, or SSA-handled IRMAA value is itself contested.
          Examples: a CMS Medicare allowed amount the beneficiary
          believes is calculated incorrectly under 42 USC §1395 (refer
          to CMS); a KFF Medicaid eligibility figure (refer to KFF and
          the state Medicaid agency); a NAIC Medigap regulation
          classification (refer to the state DOI); an SSA-handled
          IRMAA determination based on IRS-reported MAGI (refer to SSA
          via Form SSA-44 Life-Changing Event appeal). We refer the
          reporter to the appropriate federal or state agency and do
          not change the MedCheckWize page.
        </li>
      </ol>

      <h2>How to report a correction</h2>
      <p>
        Email{' '}
        <a href="mailto:datapeekfacts@gmail.com">datapeekfacts@gmail.com</a>{' '}
        with:
      </p>
      <ul>
        <li>
          The MedCheckWize URL where the CMS, KFF, NAIC, Census ACS, or
          CMS-IRMAA value appears (state page, procedure page, guide,
          methodology, or composite verdict).
        </li>
        <li>
          The specific Medicare, Medicaid, Medigap, Part D, IRMAA, or
          ACS figure or label you are disputing.
        </li>
        <li>
          The CMS, KFF, NAIC, Census ACS, or CMS-IRMAA federal source
          row or schedule you are citing as the correct value (CMS data
          file URL, KFF analysis URL, NAIC document, ACS B19013 table
          number, or CMS-IRMAA schedule page).
        </li>
        <li>
          Optional: any context that helps the MedCheckWize Editorial
          Team triage between the three buckets above (a recent CMS
          Medicare Monthly Enrollment refresh, a state DOI Medigap
          rule change, a CMS IRMAA schedule announcement, etc.).
        </li>
      </ul>

      <h2>How corrections are applied</h2>
      <p>
        For bucket 1 (MedCheckWize-side display fix), the Editorial
        Team reproduces the discrepancy, verifies against the CMS,
        KFF, NAIC, Census ACS, or CMS-IRMAA source row, applies the
        fix, and bumps the reviewed date on the affected Medicare or
        Medicaid pages. The reviewed-date bump means the change is
        visible on every affected state page, procedure page, guide,
        or methodology page in the AuthorBox.
      </p>
      <p>
        For bucket 2 (federal-source resync), the Editorial Team waits
        for the federal vintage in the MedCheckWize data ingestion to
        match the CMS, KFF, NAIC, Census ACS, or CMS-IRMAA release,
        then republishes. The data vintage in the AuthorBox is updated
        independently of the editorial review date.
      </p>
      <p>
        For bucket 3 (outside our control), the Editorial Team
        confirms the dispute and refers the reporter to the
        appropriate federal or state pathway: CMS for Medicare
        allowed-amount disputes, KFF for Medicaid Performance
        Indicator analyses, NAIC and state DOI for Medigap regulation
        questions, the Census Bureau for ACS sampling issues, or SSA
        via Form SSA-44 for IRMAA Life-Changing Event appeals under
        42 USC §1395r(i)(4).
      </p>

      <h2>What we will not change</h2>
      <ul>
        <li>
          <strong>CMS small-cell suppression.</strong> CMS suppresses
          state-level rows in the Medicare Inpatient by Geography, the
          Physician Fee Schedule, and the Hospital Outpatient HOPPS
          when the cell count is fewer than 11 services or discharges.
          MedCheckWize omits the suppressed row rather than back-filling
          with a synthetic estimate. We do not unsuppress CMS data.
        </li>
        <li>
          <strong>MS-DRG vs beneficiary cost.</strong> CMS-published
          MS-DRG bundled payments reflect what Medicare paid the
          hospital, not what one beneficiary was billed. We do not
          change a CMS-published MS-DRG payment to reflect a specific
          beneficiary&apos;s Part A deductible or Medigap coverage; the
          beneficiary-side cost is documented separately in the
          methodology page.
        </li>
        <li>
          <strong>IRMAA approximation flag.</strong> The MedCheckWize
          IRMAA Tier uses the Census ACS B19013 statewide median as a
          proxy for MAGI. We disclose the approximation honestly inline
          on every IRMAA Tier card: "Approximation; CMS uses
          2-year-prior tax MAGI per 42 USC §1395r(i)(4)." We will not
          change the proxy to claim a per-beneficiary MAGI
          determination; per-beneficiary IRMAA is an SSA determination
          based on IRS data.
        </li>
        <li>
          <strong>Medigap Access Tier defaults.</strong> States without
          a documented state DOI Medigap overlay default to Tier D
          (attained-age, federal floor under NAIC Model Regulation §6
          and 42 CFR §403.205). We will not reclassify a state to a
          stronger tier without verbatim citation to the state DOI
          regulation that establishes the overlay.
        </li>
      </ul>

      <h2>Contact</h2>
      <p>
        Corrections email:{' '}
        <a href="mailto:datapeekfacts@gmail.com">datapeekfacts@gmail.com</a>.
        Editorial concerns: see the{' '}
        <Link href="/editorial-policy/">editorial policy</Link>. General
        contact: see the{' '}
        <Link href="/contact/">contact page</Link>. For CMS Medicare,
        KFF Medicaid, NAIC Medigap, Census ACS, or CMS-IRMAA disputes
        outside MedCheckWize&apos;s control, the federal contact paths
        are linked from the{' '}
        <Link href="/methodology/">methodology page</Link>.
      </p>

      <AuthorBox layer="about" />
    </article>
  );
}
