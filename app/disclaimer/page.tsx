import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL_VINTAGES } from "@/lib/authorship";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Disclaimer, limitations of liability, and source-data scope for MedCheckWize — covering CMS Medicare administrative datasets, KFF Medicaid and Medigap analyses, the Census Bureau American Community Survey, NAIC Medigap regulation, and the IRS/SSA IRMAA schedule under 42 USC §1395r(i).",
  alternates: { canonical: "/disclaimer/" },
  openGraph: { url: "/disclaimer/" },
};

function formatLegal(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function DisclaimerPage() {
  const vintage = LEGAL_VINTAGES.disclaimer;
  return (
    <article className="prose prose-slate max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-700 mb-6">Disclaimer</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: <time dateTime={vintage}>{formatLegal(vintage)}</time></p>

      <h2 className="text-xl font-semibold mt-8 mb-3">General information</h2>
      <p>
        MedCheckWize publishes Medicare and Medicaid cost reference data for
        every U.S. state, anchored in the Centers for Medicare and Medicaid
        Services (CMS) administrative payment files, Kaiser Family Foundation
        (KFF) analyses of CMS Medicare Part D and Medigap rate filings, the
        U.S. Census Bureau American Community Survey (ACS) 5-Year median
        household income series, the National Association of Insurance
        Commissioners (NAIC) Model Regulation §6 compendium of state Medigap
        rules, and the Social Security Administration (SSA) and Internal
        Revenue Service (IRS) IRMAA schedule under 42 USC §1395r(i). While we
        refresh within days of each CMS, KFF, Census ACS, NAIC, and CMS-IRMAA
        release, we make no warranties about the completeness, accuracy, or
        suitability of the information for any individual Medicare or
        Medicaid coverage decision.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Reference data, not personalized Medicare or Medicaid advice</h2>
      <p>
        Original Medicare, Medicare Advantage, Medicare Part D, Medigap, and
        Medicaid coverage decisions are multi-year financial commitments that
        interact with assignment status, plan-letter choice, the federal
        6-month Medigap open-enrollment period (42 USC §1395ss, 42 CFR
        §403.205), the CMS Annual Election Period for Part D and Medicare
        Advantage, state DOI Medigap underwriting rules, and IRMAA tier
        eligibility. The figures on MedCheckWize &mdash; CMS-published average
        cost per CPT/HCPCS, state-level Part B and Part D premiums, KFF Plan
        G Medigap baselines, the Medicare Stack Index, the Medigap Access
        Tier classifier, the IRMAA Tier surcharge, and the composite verdict
        &mdash; describe federal-data patterns for the state.
      </p>
      <p>
        Specifically:
      </p>
      <ul className="list-disc pl-6 my-3 space-y-1 text-slate-700">
        <li>
          <strong>CMS data describes population averages, not your enrollment.</strong>{' '}
          The CMS Medicare Physician &amp; Other Practitioners by Geography
          and Service file, the CMS Medicare Inpatient Hospitals by Geography
          and Service file, the CMS Medicare Outpatient Hospitals HOPPS APC
          file, and the CMS Clinical Laboratory Fee Schedule report Medicare
          allowed amounts averaged across all assignment-accepting providers
          in a state. They do not predict any individual beneficiary&apos;s
          Part B deductible, coinsurance, or Medigap-covered share.
        </li>
        <li>
          <strong>Medigap underwriting outside the federal OEP.</strong> The
          MedCheckWize Medigap Access Tier classifier (A-E) summarises
          whether the state layers DOI-mandated Medigap protections on top of
          the federal 42 USC §1395ss floor. In a Tier D state, Medigap
          issuers are otherwise allowed to medically underwrite under
          42 CFR §403.205 outside the 6-month OEP. The tier is descriptive of
          state DOI regulation as of the page&apos;s reviewed date, not a
          coverage guarantee for any specific applicant.
        </li>
        <li>
          <strong>IRMAA approximation.</strong> The MedCheckWize IRMAA Tier
          card applies the CMS-published 2026 IRMAA schedule (42 USC
          §1395r(i) for Part B, §1395w-113(a)(7) for Part D) to the Census
          ACS B19013 statewide median household income. ACS reports current
          household income; CMS IRMAA uses 2-year-prior tax-return MAGI
          (modified adjusted gross income) per §1395r(i)(4). The two are
          correlated but not identical. Individual IRMAA determinations are
          made by SSA based on IRS-reported MAGI.
        </li>
        <li>
          <strong>The Medicare Stack Index is a deterministic rank, not a CMS rating.</strong>{' '}
          The 1-to-50 national rank in the Medicare Stack Index is a
          MedCheckWize-original computation summing the federal Part B
          premium, the state KFF-published weighted-average Part D premium,
          and the state KFF/NAIC-published Plan G Medigap age-65 baseline
          premium. It is not an official CMS, KFF, NAIC, or AHRQ rating.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">Reference data, not personalized advice</h2>
      <p>
        Content on MedCheckWize provides federally reported Medicare,
        Medicaid, IRMAA, Medigap, and Census ACS data for informational
        purposes. For decisions about your specific Medicare or Medicaid
        coverage, premium-stack obligations, IRMAA exposure, or Medigap plan
        selection, work with a CMS State Health Insurance Assistance
        Program (SHIP) counselor (1-877-839-2675), a licensed Medicare
        broker authorized in your state, the SSA Medicare hotline
        (1-800-MEDICARE), the SSA IRMAA appeal pathway via Form SSA-44, or a
        certified financial planner. Any reliance you place on the
        information here is at your own risk.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Data accuracy and limits of CMS, KFF, NAIC, and Census ACS sources</h2>
      <p>
        Data displayed on MedCheckWize is sourced from publicly available
        federal databases &mdash; the CMS Inpatient by Geography, the CMS
        Physician &amp; Other Practitioners by Geography, the CMS Outpatient
        HOPPS APC file, and the CMS Clinical Laboratory Fee Schedule, plus
        CMS Medicare Monthly Enrollment, CMS Medicare Geographic Variation,
        KFF analyses of CMS Medicaid Performance Indicator data and CMS Part
        D plan landscape, KFF compilations of state DOI Medigap rate
        filings, the U.S. Census Bureau ACS 1-Year and 5-Year (B19013), and
        the CMS-SSA-IRS IRMAA schedule under 42 USC §1395r(i) and
        §1395w-113(a)(7). While we make reasonable efforts to ensure
        accuracy and to refresh within days of each annual federal release,
        federal data has known limitations:
      </p>
      <ul className="list-disc pl-6 my-3 space-y-1 text-slate-700">
        <li>
          <strong>CMS small-cell suppression.</strong> CMS suppresses
          state-level rows with fewer than 11 services or discharges to
          protect beneficiary privacy. The corresponding state-level row is
          omitted rather than back-filled with synthetic numbers.
        </li>
        <li>
          <strong>MS-DRG bundled payments.</strong> CMS hospital inpatient
          figures reflect what Medicare paid the hospital under the
          Medicare Severity Diagnosis Related Group (MS-DRG) bundled payment
          system, not what one beneficiary was billed. Real beneficiary
          cost depends on Part A deductible, length of stay, and Medigap
          coverage.
        </li>
        <li>
          <strong>Outpatient surgical totals.</strong> Outpatient surgical
          procedure totals combine the CMS Physician Fee Schedule (PFS)
          surgeon fee with the CMS Hospital Outpatient Prospective Payment
          System (HOPPS) facility fee. Reporting either alone would
          understate the true Medicare cost.
        </li>
        <li>
          <strong>Medicare Advantage out-of-band.</strong> Medicare
          Advantage payment rates are negotiated between MA plans and
          providers; CMS-published Original Medicare rates may not reflect
          what an MA plan pays. The Medicare Stack Index is computed for
          Original Medicare plus Part D plus Plan G Medigap.
        </li>
        <li>
          <strong>Census ACS sampling variance.</strong> ACS 1-Year
          estimates for low-population states carry wider margins of error
          than 5-Year aggregations. The B19013 median household income used
          for the IRMAA proxy is the ACS 2024 5-Year point estimate.
        </li>
        <li>
          <strong>Data lag.</strong> CMS Geographic Variation publishes
          annually with a ~2-year lag; CMS Medicare Monthly Enrollment
          updates monthly; KFF Medigap rate filings update annually with
          a ~6-month lag; ACS 5-Year publishes annually in December; the
          CMS IRMAA schedule updates annually in October/November preceding
          the year.
        </li>
      </ul>
      <p>
        Users should independently verify critical figures via{" "}
        <a href="https://www.medicare.gov/care-compare/" target="_blank" rel="noopener noreferrer"
           className="text-slate-700 hover:underline">Medicare.gov Care Compare</a>,{" "}
        the official{" "}
        <a href="https://www.cms.gov/medicare/physician-fee-schedule/search" target="_blank"
           rel="noopener noreferrer" className="text-slate-700 hover:underline">CMS PFS Search</a>,{" "}
        the{" "}
        <a href="https://www.ssa.gov/medicare/" target="_blank" rel="noopener noreferrer"
           className="text-slate-700 hover:underline">SSA Medicare portal</a>,{" "}
        or by calling 1-800-MEDICARE before making any Medicare, Medicaid,
        Medigap, Part D, or IRMAA-related decision.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">External links</h2>
      <p>
        This website contains links to external websites &mdash; including
        the Centers for Medicare and Medicaid Services (CMS), the Kaiser
        Family Foundation (KFF), the U.S. Census Bureau, the National
        Association of Insurance Commissioners (NAIC), the Social Security
        Administration (SSA), the Internal Revenue Service (IRS), and the
        Agency for Healthcare Research and Quality (AHRQ) &mdash; that are
        not under our control. We have no responsibility for the content,
        accuracy, or privacy practices of those third-party sites; we link
        to them so readers can verify CMS, KFF, Census ACS, NAIC, SSA, IRS,
        and Medigap data directly at its federal source.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Advertising</h2>
      <p>
        MedCheckWize displays third-party advertisements through Google
        AdSense. These advertisements are provided by third parties and do
        not imply endorsement by MedCheckWize or by the Editorial Team. No
        CMS provider, KFF analyst, Medigap carrier, Part D plan sponsor, MA
        plan sponsor, or Medicaid managed-care organization pays to appear
        on MedCheckWize, to be re-ordered in the Medicare Stack Index, or
        to have flattering language inserted into a state, procedure, or
        guide page. The CMS, KFF, NAIC, Census ACS, and IRMAA figures and
        the Medigap Access Tier, IRMAA Tier, and Stack Index labels are
        computed identically for every state.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Limitation of liability</h2>
      <p>
        In no event shall MedCheckWize, its owners, operators, or
        contributors be liable for any direct, indirect, incidental,
        consequential, or punitive damages arising from the use of this
        website or the information contained herein. Medicare, Medicaid,
        Medigap, Part D, IRMAA, and Medicare Advantage decisions should be
        verified directly with a CMS SHIP counselor, the SSA Medicare line
        (1-800-MEDICARE), and against the CMS, KFF, NAIC, Census ACS, and
        CMS-IRMAA source rows before being acted on.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Contact</h2>
      <p>
        Concerns about specific content: visit our{" "}
        <Link href="/contact" className="text-slate-700 hover:underline">contact page</Link>.
        Editorial concerns: see the{" "}
        <Link href="/editorial-policy/" className="text-slate-700 hover:underline">editorial policy</Link>.
        Factual data corrections against a specific CMS, KFF, Census ACS,
        NAIC, or CMS-IRMAA source row: see the{" "}
        <Link href="/corrections-policy/" className="text-slate-700 hover:underline">corrections policy</Link>.
      </p>
    </article>
  );
}
