import type { Metadata } from "next";
import { AuthorBox } from "@/components/AuthorBox";

export const metadata: Metadata = {
  title: "About MedCheckWize",
  description:
    "What MedCheckWize covers, which CMS, KFF, Census ACS, NAIC, and CMS-SSA-IRS IRMAA datasets power the pages, what the Medicare Stack Index, Medigap Access Tier, and IRMAA Tier classifiers do, and what the site does not do.",
  alternates: { canonical: "/about/" },
  openGraph: { url: "/about/" },
};

export default function AboutPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12 prose prose-slate">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">About MedCheckWize</h1>
      <p>
        MedCheckWize is a public-data reference site operated by the{" "}
        <a href="https://datapeekfacts.com" rel="noopener">
          DataPeek Research Network
        </a>
        . We surface Medicare and Medicaid cost data &mdash; CMS-published
        procedure reimbursement, Part B and Part D premium schedules,
        KFF-compiled state-level Medigap rates, the federal §1395ss Medigap
        floor and state DOI overlays, and the CMS-SSA-IRS IRMAA schedule
        under 42 USC §1395r(i) &mdash; so beneficiaries and caregivers can
        read what Medicare pays for a service, what Medicaid covers in
        their state, what the typical state-level Medicare premium stack
        looks like, and what the IRMAA surcharge schedule attaches to
        high-MAGI households. We are a data-curation team &mdash; not
        clinicians, Medicare brokers, Medicaid eligibility workers, or
        SSA IRMAA case handlers. For personalized Medicare, Medicaid,
        Medigap, Part D, or IRMAA decisions, work with a CMS State Health
        Insurance Assistance Program (SHIP) counselor; we show you what
        CMS, KFF, the Census Bureau ACS, NAIC, and the CMS-SSA-IRS
        IRMAA schedule already publish.
      </p>

      <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">What this site contains</h2>
      <ul>
        <li>Medicare allowed and paid amounts for 160 common procedures and services, mapped to MS-DRG, HCPCS, or CPT codes &mdash; drawn from four CMS payment systems (Inpatient Hospitals by Geography, the Physician Fee Schedule, the Hospital Outpatient Prospective Payment System (HOPPS APC), and the Clinical Laboratory Fee Schedule).</li>
        <li>State-by-state cost variation for those procedures, where CMS publishes the data (CMS small-cell suppression rules apply &mdash; fewer than 11 services or discharges in a state are not published).</li>
        <li>State-level Medicare and Medicaid context: enrollment counts from CMS Medicare Monthly Enrollment and KFF analysis of CMS Medicaid Performance Indicator data, per-capita Medicare spending from CMS Medicare Geographic Variation, average Part B premium (CMS federal flat rate under 42 USC §1395r), KFF-compiled weighted-average Part D premium, KFF/NAIC-compiled Plan G Medigap age-65 baseline, Medicaid expansion status from the KFF tracker, and uninsured rate from the Census ACS 1-Year.</li>
        <li>The MedCheckWize-original <strong>Medicare Stack Index</strong> &mdash; a 1-to-50 national rank of the combined Part B + Part D + Plan G Medigap monthly premium stack, computed identically for every state.</li>
        <li>Two new state-level classifiers introduced in May 2026: the <strong>Medigap Access Tier</strong> (A&ndash;E, anchored to 42 USC §1395ss, 42 CFR §403.205, and NAIC Model Regulation §6) and the <strong>IRMAA Tier</strong> (0&ndash;5, applying the CMS-published 2026 IRMAA schedule under 42 USC §1395r(i) to the Census ACS B19013 statewide median household income).</li>
        <li>A composite verdict per state that synthesises the Stack Index, the Medigap Access Tier, the IRMAA Tier, and the Medicaid expansion flag into a single dominant signal and a 4-paragraph cross-synthesis.</li>
        <li>Plain-language guides explaining each lever: Medigap Access Tier methodology, IRMAA Tier methodology, the Medicare Stack Index methodology, the composite verdict ladder, and how to read a MedCheckWize state page end-to-end.</li>
      </ul>

      <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Where the data comes from</h2>
      <p>Every figure on MedCheckWize traces back to one of these public sources:</p>
      <ul>
        <li>
          <strong>CMS Inpatient Hospitals by Geography &amp; Service</strong> &mdash; MS-DRG bundled
          payments for the 30 inpatient procedures we cover.
        </li>
        <li>
          <strong>CMS Medicare Physician Fee Schedule (PFS Geography)</strong> &mdash; per-HCPCS
          allowed and paid amounts for physician, office, and imaging services.
        </li>
        <li>
          <strong>CMS Hospital Outpatient Prospective Payment System (HOPPS / APC)</strong> &mdash;
          facility-fee component combined with PFS for outpatient surgical procedures.
        </li>
        <li>
          <strong>CMS Clinical Laboratory Fee Schedule (CLFS)</strong> &mdash; uniform national
          rates for the 30 lab tests we cover, with the statutory $0 Medicare patient cost-share.
        </li>
        <li>
          <strong>CMS Medicare Monthly Enrollment</strong> &mdash; state-level beneficiary counts
          (Original Medicare + Medicare Advantage), 2025 annual aggregation.
        </li>
        <li>
          <strong>CMS Medicare Geographic Variation</strong> &mdash; state-level per-capita
          Medicare spending, latest released year (2023).
        </li>
        <li>
          <strong>KFF analysis of CMS Medicaid Performance Indicator data</strong> &mdash; Medicaid
          and CHIP enrollment counts and Medicaid expansion status (KFF tracker).
        </li>
        <li>
          <strong>KFF analysis of CMS Part D plan landscape</strong> &mdash; state-level
          enrollment-weighted average Part D plan premium.
        </li>
        <li>
          <strong>KFF and NAIC compilation of state DOI Medigap rate filings</strong> &mdash; Plan
          G age-65 baseline monthly premium for each state.
        </li>
        <li>
          <strong>NAIC Model Regulation §6 compendium</strong> &mdash; the canonical reference for
          state DOI Medigap underwriting overlays atop the federal 42 USC §1395ss floor.
        </li>
        <li>
          <strong>US Census Bureau American Community Survey (ACS)</strong> &mdash; state
          uninsured rates (1-Year, under-65 civilian noninstitutionalized population) and B19013
          5-Year median household income (used as the IRMAA MAGI proxy).
        </li>
        <li>
          <strong>CMS-published 2026 IRMAA schedule</strong> &mdash; the Income-Related Monthly
          Adjustment Amount schedule for Part B (42 USC §1395r(i)) and Part D (42 USC
          §1395w-113(a)(7)). CMS Form CMS-10038 and the Federal Register Vol 90 notice anchor the
          per-tier surcharge amounts.
        </li>
        <li>
          <strong>SSA Form SSA-44</strong> &mdash; the Medicare Income-Related Monthly Adjustment
          Amount Life-Changing Event form, referenced in the IRMAA Tier guide for beneficiaries
          appealing a CMS IRMAA determination.
        </li>
        <li>
          <strong>Medicare.gov Care Compare &amp; Medicare Coverage Database</strong> &mdash; CMS
          consumer tools we link to for ZIP-specific Medicare and Medicaid verification.
        </li>
      </ul>
      <p>
        Release dates, processing steps, and known limitations of CMS,
        KFF, NAIC, Census ACS, and CMS-IRMAA inputs are documented on
        the{" "}
        <a href="/methodology/">methodology page</a>.
      </p>

      <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">What this site does not do</h2>
      <ul>
        <li>MedCheckWize is reference data for Medicare and Medicaid cost decisions, not clinical care. For personalized clinical decisions, work with a licensed clinician.</li>
        <li>We do not tell you what your Medicare or Medicaid plan will pay. Your actual out-of-pocket cost depends on whether you have Original Medicare or a Medicare Advantage plan, whether your provider accepts CMS Medicare assignment, your Medigap plan letter, your Part D plan formulary, your IRMAA tier, and whether you have met your Part A or Part B deductible. For your specific coverage, work with a CMS State Health Insurance Assistance Program (SHIP) counselor or call 1-800-MEDICARE.</li>
        <li>We do not sell Medicare, Medicaid, Medigap, Part D, or Medicare Advantage insurance, enroll beneficiaries, take referral fees from CMS-contracted plans, KFF analysts, NAIC carriers, or SHIP counselors. The Medicare Stack Index, Medigap Access Tier, IRMAA Tier, and composite verdict are computed identically for every state.</li>
      </ul>

      <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Corrections and contact</h2>
      <p>
        If a CMS, KFF, NAIC, Census ACS, or CMS-IRMAA figure here
        disagrees with the official federal source, email{" "}
        <a href="mailto:datapeekfacts@gmail.com">datapeekfacts@gmail.com</a> with the page URL and
        the CMS, KFF, NAIC, Census, SSA, or IRS row you are referencing. The MedCheckWize{" "}
        <a href="/corrections-policy/">corrections policy</a> describes how Medicare, Medicaid,
        Medigap, Part D, IRMAA, and Census ACS corrections are routed (MedCheckWize-side display
        fix, federal-source resync, or referral to CMS, KFF, NAIC, or SSA). The MedCheckWize{" "}
        <a href="/editorial-policy/">editorial policy</a> describes how the CMS, KFF, NAIC, Census
        ACS, and CMS-IRMAA reference data is reviewed. Our{" "}
        <a href="https://datapeekfacts.com/editorial-policy/" rel="noopener">
          network editorial policy
        </a>{" "}
        describes how corrections are reviewed and applied across all
        DataPeek Research Network sites.
      </p>

      <AuthorBox layer="about" />
    </article>
  );
}
