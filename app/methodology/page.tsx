import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Methodology — How MedCheckWize Builds Its Medicare Cost Data",
  description:
    "How MedCheckWize sources Medicare procedure cost data — anchored in CMS Medicare Physician Fee Schedule, Medicare.gov Care Compare, CMS Hospital Outpatient PPS, AMA CPT codes, and Medicare Coverage Database.",
  alternates: { canonical: "/methodology/" },
  openGraph: { url: "/methodology/" },
};

export default function MethodologyPage() {
  return (
    <article className="prose prose-slate max-w-3xl mx-auto">
      <h1>Our Methodology</h1>
      <p className="lead text-lg text-slate-600">
        Medicare cost decisions affect 65 million Americans. You
        deserve to know exactly where our procedure cost figures come
        from, what they cover, and what only your specific Medicare
        plan can tell you about your real out-of-pocket cost.
      </p>

      <div className="not-prose border-l-4 border-amber-400 bg-amber-50 p-4 my-4 rounded-r">
        <p className="text-sm text-amber-900">
          <strong>Important disclosure.</strong> MedCheckWize publishes
          <em> indicative cost estimates</em> based on the published
          Medicare Physician Fee Schedule. Your actual out-of-pocket
          cost depends on which Medicare program you have (Original
          Medicare vs Medicare Advantage), whether your provider
          accepts assignment, your supplemental insurance, and
          whether you&apos;ve met your deductible. For your specific
          coverage, call 1-800-MEDICARE or your plan directly.
        </p>
      </div>

      <h2>Primary source: CMS Medicare Physician Fee Schedule</h2>
      <p>
        Every cost figure on MedCheckWize is anchored in the{" "}
        <a
          href="https://www.cms.gov/medicare/payment/fee-schedules/physician"
          target="_blank"
          rel="noopener noreferrer"
        >
          Centers for Medicare &amp; Medicaid Services (CMS) Medicare
          Physician Fee Schedule (PFS)
        </a>
        . The PFS is the federal database that determines what
        Medicare pays for every covered service. It is updated
        annually and is the legal authority for Medicare physician
        reimbursement in the United States.
      </p>

      <h2>Other primary sources</h2>
      <ul>
        <li>
          <a
            href="https://www.medicare.gov/care-compare/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Medicare.gov Care Compare
          </a>{" "}
          &mdash; the official CMS consumer-facing tool for looking
          up procedure costs and finding providers.
        </li>
        <li>
          <a
            href="https://www.cms.gov/medicare/payment/prospective-payment-systems/hospital-outpatient"
            target="_blank"
            rel="noopener noreferrer"
          >
            CMS Hospital Outpatient PPS
          </a>{" "}
          &mdash; the federal payment system for hospital outpatient
          procedures.
        </li>
        <li>
          <a
            href="https://www.ama-assn.org/practice-management/cpt"
            target="_blank"
            rel="noopener noreferrer"
          >
            AMA CPT Codes
          </a>{" "}
          &mdash; Current Procedural Terminology codes maintained by
          the American Medical Association.
        </li>
        <li>
          <a
            href="https://www.cms.gov/medicare-coverage-database/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Medicare Coverage Database
          </a>{" "}
          &mdash; the official source for National Coverage
          Determinations (NCDs) and Local Coverage Determinations
          (LCDs).
        </li>
      </ul>

      <h2>What we publish per procedure</h2>
      <ul>
        <li>
          <strong>Procedure name and CPT code</strong>
        </li>
        <li>
          <strong>National average cost</strong> &mdash; Medicare
          allowed amount averaged across regions.
        </li>
        <li>
          <strong>Medicare pays</strong> &mdash; the typical amount
          Medicare reimburses (80% under Original Medicare Part B
          after deductible).
        </li>
        <li>
          <strong>Patient pays</strong> &mdash; the typical
          coinsurance owed by the beneficiary (20% under Original
          Medicare).
        </li>
        <li>
          <strong>State-by-state cost variation</strong>
        </li>
      </ul>

      <h2>Cross-reference and verification</h2>
      <ul>
        <li>
          <a
            href="https://www.medicare.gov/care-compare/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Medicare.gov Care Compare
          </a>{" "}
          &mdash; verify ZIP-specific costs.
        </li>
        <li>
          <a
            href="https://www.cms.gov/medicare/physician-fee-schedule/search"
            target="_blank"
            rel="noopener noreferrer"
          >
            CMS PFS Search
          </a>{" "}
          &mdash; the official lookup by HCPCS code and locality.
        </li>
        <li>
          1-800-MEDICARE &mdash; the official Medicare phone line.
        </li>
        <li>
          Your Medicare plan&apos;s member services line &mdash; the
          authoritative source for your specific coverage.
        </li>
      </ul>

      <h2>Update frequency</h2>
      <p>
        CMS publishes the Medicare Physician Fee Schedule annually
        (final rule in November, effective January 1). We refresh
        our dataset within days of each annual release.
      </p>

      <h2>Limitations you should know about</h2>
      <ul>
        <li>
          <strong>Original Medicare vs Medicare Advantage.</strong>
          Our figures are based on Original Medicare allowed amounts.
          Medicare Advantage plans use their own provider contracts.
        </li>
        <li>
          <strong>No supplemental insurance modeling.</strong>
          Medigap covers most of the 20% Part B coinsurance. Our
          &ldquo;patient pays&rdquo; is pre-Medigap.
        </li>
        <li>
          <strong>Geographic variation.</strong> Medicare allowed
          amounts vary by locality (CMS uses Geographic Practice
          Cost Indices).
        </li>
        <li>
          <strong>Coverage exclusions.</strong> Some procedures
          require prior authorization or specific medical necessity
          documentation.
        </li>
        <li>
          <strong>Provider acceptance.</strong> Non-participating
          providers can charge up to 15% more than the Medicare
          approved amount.
        </li>
        <li>
          <strong>Not medical, financial, or insurance advice.</strong>
          For your specific coverage, contact Medicare directly.
        </li>
      </ul>

      <h2>Corrections and feedback</h2>
      <p>
        If a published CMS figure disagrees with what you see here,
        please <a href="/contact">contact us</a> with the procedure
        and CPT code.
      </p>

      <p className="text-sm text-slate-500 border-t pt-4 mt-8">
        This methodology page was last reviewed in March 2026. Material
        changes to how we source or compute the data will be reflected
        here before they reach production pages.
      </p>
    </article>
  );
}
