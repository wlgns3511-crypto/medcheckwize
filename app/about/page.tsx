import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About MedCheckWize",
  description:
    "What MedCheckWize covers, which Medicare datasets power the pages, and what the site does not do.",
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
        . We surface Medicare procedure reimbursement figures so beneficiaries and caregivers can
        see what Medicare pays for a service and what the patient portion typically looks like.
        We are a data-curation team &mdash; not clinicians, Medicare agents, or benefits
        counselors. We do not give medical or coverage advice; we show you what CMS already
        publishes.
      </p>

      <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">What this site contains</h2>
      <ul>
        <li>Medicare allowed and paid amounts for 160 common procedures and services, mapped to MS-DRG, HCPCS, or CPT codes — drawn from four CMS payment systems (Inpatient by Geography, Physician Fee Schedule, Hospital Outpatient PPS, and Clinical Laboratory Fee Schedule).</li>
        <li>State-by-state cost variation for those procedures, where CMS publishes the data (small-cell suppression rules apply — fewer than 11 services or discharges are not published).</li>
        <li>State-level Medicare and Medicaid context: enrollment counts, per-capita Medicare spending, average Part D and Medigap premiums, Medicaid expansion status, and uninsured rates — sourced from CMS, KFF, and the Census Bureau ACS.</li>
        <li>Plain-language context on Original Medicare vs. Medicare Advantage and how assignment affects the patient&apos;s share.</li>
      </ul>

      <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Where the data comes from</h2>
      <p>Every figure on MedCheckWize traces back to one of these public sources:</p>
      <ul>
        <li>
          <strong>CMS Inpatient Hospitals by Geography &amp; Service</strong> &mdash; MS-DRG-bundled
          payments for the 30 inpatient procedures we cover.
        </li>
        <li>
          <strong>CMS Medicare Physician Fee Schedule (PFS Geography)</strong> &mdash; the
          per-HCPCS allowed and paid amounts for physician, office, and imaging services.
        </li>
        <li>
          <strong>CMS Hospital Outpatient Prospective Payment System (HOPPS / APC)</strong> &mdash;
          facility-fee component combined with PFS for outpatient surgical procedures.
        </li>
        <li>
          <strong>CMS Clinical Laboratory Fee Schedule (CLFS)</strong> &mdash; uniform national
          rates for the 30 lab tests we cover, with the statutory $0 patient cost-share.
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
          <strong>KFF</strong> &mdash; Medicaid &amp; CHIP enrollment, Medicaid expansion status,
          Part D average premium, and Medigap average premium.
        </li>
        <li>
          <strong>US Census Bureau American Community Survey (ACS)</strong> &mdash; state
          uninsured rates (under-65 civilian noninstitutionalized population).
        </li>
        <li>
          <strong>Medicare.gov Care Compare &amp; Medicare Coverage Database</strong> &mdash; CMS
          consumer tools we link to for ZIP-specific verification.
        </li>
      </ul>
      <p>
        Release dates, processing steps, and known limitations are documented on the{" "}
        <a href="/methodology/">methodology page</a>.
      </p>

      <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">What this site does not do</h2>
      <ul>
        <li>We do not provide medical advice. Nothing here is a substitute for a clinician.</li>
        <li>We do not tell you what your plan will pay. Your actual out-of-pocket cost depends on whether you have Original Medicare or a Medicare Advantage plan, whether your provider accepts assignment, your supplemental insurance, and whether you have met your deductible. For your specific coverage, call 1-800-MEDICARE or your plan directly.</li>
        <li>We do not sell insurance, enroll beneficiaries, or take referral fees from plans, agents, or providers.</li>
      </ul>

      <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Corrections and contact</h2>
      <p>
        If a number here disagrees with an official CMS source, email{" "}
        <a href="mailto:datapeekfacts@gmail.com">datapeekfacts@gmail.com</a> with the page URL and
        the source you are referencing. Our{" "}
        <a href="https://datapeekfacts.com/editorial-policy/" rel="noopener">
          network editorial policy
        </a>{" "}
        describes how corrections are reviewed and applied across all DataPeek Research Network
        sites.
      </p>
    </article>
  );
}
