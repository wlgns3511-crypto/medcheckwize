import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Methodology — How MedCheckWize Builds Its Medicare Cost Data",
  description:
    "How MedCheckWize sources Medicare procedure cost data — anchored in CMS Inpatient by Geography (MS-DRG), Medicare Physician Fee Schedule, Hospital Outpatient PPS (APCs), Clinical Laboratory Fee Schedule, Monthly Enrollment, Geographic Variation, KFF Medicaid/Medigap data, and Census ACS uninsured rates.",
  alternates: { canonical: "/methodology/" },
  openGraph: { url: "/methodology/" },
};

export default function MethodologyPage() {
  return (
    <article className="prose prose-slate max-w-3xl mx-auto">
      <h1>Our Methodology</h1>
      <p className="lead text-lg text-slate-600">
        Medicare cost decisions affect 65 million Americans. You deserve to know
        exactly which CMS dataset every number on this site comes from, what it
        actually represents, and what only your specific Medicare plan can tell
        you about your real out-of-pocket cost.
      </p>

      <div className="not-prose border-l-4 border-amber-400 bg-amber-50 p-4 my-4 rounded-r">
        <p className="text-sm text-amber-900">
          <strong>Important disclosure.</strong> MedCheckWize publishes
          <em> indicative cost averages</em> built from the public CMS
          datasets cited below. Your actual out-of-pocket cost depends on
          which Medicare program you have (Original Medicare vs Medicare
          Advantage), whether your provider accepts assignment, your
          supplemental insurance, and whether you&apos;ve met your
          deductible. For your specific coverage, call 1-800-MEDICARE
          or your plan directly.
        </p>
      </div>

      <h2>Procedure cost data — four CMS payment systems</h2>
      <p>
        Medicare uses different payment systems for different settings.
        Anchoring every cost in a single source like the Physician Fee
        Schedule would understate what hospital and outpatient procedures
        actually pay. We pull each procedure category from the CMS dataset
        that actually governs it.
      </p>
      <table className="text-sm">
        <thead>
          <tr>
            <th>Category</th>
            <th>CMS payment system</th>
            <th>Dataset we use</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hospital (inpatient)</td>
            <td>MS-DRG (bundled)</td>
            <td>
              <a
                href="https://data.cms.gov/provider-summary-by-type-of-service/medicare-inpatient-hospitals/medicare-inpatient-hospitals-by-geography-and-service"
                target="_blank"
                rel="noopener noreferrer"
              >
                Medicare Inpatient Hospitals by Geography &amp; Service
              </a>
            </td>
          </tr>
          <tr>
            <td>Outpatient surgical &amp; imaging (facility)</td>
            <td>HOPPS (APC bundled)</td>
            <td>
              <a
                href="https://data.cms.gov/provider-summary-by-type-of-service/medicare-outpatient-hospitals/medicare-outpatient-hospitals-by-geography-and-service"
                target="_blank"
                rel="noopener noreferrer"
              >
                Medicare Outpatient Hospitals by Geography &amp; Service
              </a>
            </td>
          </tr>
          <tr>
            <td>Physician / office services / imaging (professional)</td>
            <td>Physician Fee Schedule</td>
            <td>
              <a
                href="https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners/medicare-physician-other-practitioners-by-geography-and-service"
                target="_blank"
                rel="noopener noreferrer"
              >
                Medicare Physician &amp; Other Practitioners by Geography &amp; Service
              </a>
            </td>
          </tr>
          <tr>
            <td>Lab tests</td>
            <td>Clinical Laboratory Fee Schedule</td>
            <td>
              CLFS rates reported through the same{" "}
              <a
                href="https://www.cms.gov/medicare/payment/fee-schedules/clinical-laboratory-fee-schedule-clfs-files"
                target="_blank"
                rel="noopener noreferrer"
              >
                CLFS national pricing
              </a>{" "}
              (uniform across states by statute)
            </td>
          </tr>
        </tbody>
      </table>

      <h2>How we combine systems for outpatient surgery</h2>
      <p>
        For outpatient surgical procedures (e.g. cataract surgery, arthroscopic
        knee surgery, breast biopsy), Medicare pays the surgeon under the PFS{" "}
        <em>and</em> the facility under HOPPS. Reporting the surgeon&apos;s
        professional fee alone would understate the true Medicare cost by 80–95%
        for procedures like cataract surgery (where the facility fee is the
        bulk of total payment). We sum the PFS allowed amount and the HOPPS
        APC allowed amount to give an honest total.
      </p>
      <p>
        HOPPS APC payments are administratively uniform nationally — they don&apos;t
        vary by state. State-level variation in our outpatient totals reflects
        only the geographically-adjusted PFS component (CMS Geographic Practice
        Cost Indices, GPCI).
      </p>

      <h2>Patient cost-share — by payment system, not assumed</h2>
      <p>
        We don&apos;t apply a flat 80/20 split. Medicare cost-sharing depends
        on the payment system and the service:
      </p>
      <ul>
        <li>
          <strong>Inpatient (Part A):</strong> The figures we publish are CMS&apos;s
          average total payment per discharge minus average Medicare payment.
          Real beneficiary cost is the Part A deductible per benefit period
          ($1,676 in 2025), with daily coinsurance after day 60. Our
          &ldquo;patient pays&rdquo; column reflects what is left after Medicare
          paid the hospital, not what one beneficiary will be billed.
        </li>
        <li>
          <strong>Part B coinsurance:</strong> Most physician and outpatient
          services apply 20% coinsurance after the annual Part B deductible
          ($240 in 2024, $257 in 2025). We compute &ldquo;patient pays&rdquo;
          as <code>allowed − Medicare paid</code> — the actual published
          difference for each HCPCS code, not an assumption.
        </li>
        <li>
          <strong>Preventive services:</strong> Many preventive HCPCS codes
          (annual wellness visit, screening mammogram, pneumonia / flu /
          COVID-19 vaccinations, depression and HIV screening) pay 100%.
          Our patient cost is $0 for those rows because that&apos;s what CMS
          actually publishes — Medicare paid = Medicare allowed.
        </li>
        <li>
          <strong>Clinical labs (Part B):</strong> Section 1833 of the Social
          Security Act exempts Medicare Part B clinical lab tests from
          coinsurance and deductible. Patient cost is statutorily $0 when the
          test is ordered by a Medicare-enrolled physician.
        </li>
      </ul>

      <h2>State demographic data</h2>
      <ul>
        <li>
          <strong>Medicare enrollees</strong> per state — from{" "}
          <a
            href="https://data.cms.gov/summary-statistics-on-beneficiary-enrollment/medicare-and-medicaid-reports/medicare-monthly-enrollment"
            target="_blank"
            rel="noopener noreferrer"
          >
            CMS Medicare Monthly Enrollment
          </a>
          , 2025 annual aggregation row (total beneficiaries including Original
          and Medicare Advantage).
        </li>
        <li>
          <strong>Medicare per-capita spending</strong> — from{" "}
          <a
            href="https://data.cms.gov/summary-statistics-on-use-and-payments/medicare-geographic-comparisons/medicare-geographic-variation-by-national-state-county"
            target="_blank"
            rel="noopener noreferrer"
          >
            CMS Medicare Geographic Variation by National, State &amp; County
          </a>
          , 2023 (latest released).
        </li>
        <li>
          <strong>Medicare Part B premium</strong> — federal flat rate
          ($185.00 standard for 2025;{" "}
          <a
            href="https://www.cms.gov/newsroom/fact-sheets/2025-medicare-parts-b-premiums-and-deductibles"
            target="_blank"
            rel="noopener noreferrer"
          >
            CMS official premium and deductible page
          </a>
          ).
        </li>
        <li>
          <strong>Medicaid enrollees</strong> — KFF analysis of CMS Performance
          Indicator data (September 2024 monthly snapshot).
        </li>
        <li>
          <strong>Medicaid expansion status</strong> — KFF{" "}
          <a
            href="https://www.kff.org/medicaid/issue-brief/status-of-state-medicaid-expansion-decisions/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Status of State Medicaid Expansion Decisions
          </a>{" "}
          (December 2024).
        </li>
        <li>
          <strong>Part D average premium</strong> — KFF analysis of CMS Part D
          plan landscape data, 2025 weighted-average standalone PDP.
        </li>
        <li>
          <strong>Medigap average premium</strong> — KFF analysis of CMS
          Medigap rate filings, 2024 (Plan G monthly, age 65 baseline).
        </li>
        <li>
          <strong>Uninsured rate</strong> — US Census Bureau American Community
          Survey 1-Year Estimates, 2023 (under-65 civilian noninstitutionalized).
        </li>
      </ul>

      <h2>What we don&apos;t do</h2>
      <ul>
        <li>
          We <strong>don&apos;t</strong> apply a synthetic 80/20 split where
          CMS publishes the actual paid-vs-allowed figures.
        </li>
        <li>
          We <strong>don&apos;t</strong> back-fill state-level data when CMS
          suppresses small cells (fewer than 11 discharges or services). Those
          state×procedure cells are simply missing from our database — the
          published source is silent on them.
        </li>
        <li>
          We <strong>don&apos;t</strong> include downstream costs that are
          billed separately: anesthesia, durable medical equipment, post-acute
          rehab, prescription drugs administered outside the bundle, or
          ambulance.
        </li>
      </ul>

      <h2>Procedure → CMS code mappings (transparency)</h2>
      <p>
        Each procedure on this site is mapped to a specific MS-DRG, HCPCS, or
        CPT code. The mapping confidence (high / medium / low) and a short
        mapping note are stored alongside every figure. For complex procedures
        where CMS bundles multiple services into one DRG (e.g. DRG 470 covers
        both knee and hip replacement; DRG 519 covers laminectomy and lumbar
        disc surgery), we flag this explicitly. CMS&apos;s FY 2024 MS-DRG
        Definition Manual is the authority for those bundles.
      </p>

      <h2>Update frequency &amp; vintage</h2>
      <ul>
        <li>
          <strong>Inpatient (DRG):</strong> CMS releases new Inpatient
          Geography data annually; we refresh within weeks of release.
        </li>
        <li>
          <strong>PFS:</strong> CMS publishes a final rule in November,
          effective January 1; we refresh within days.
        </li>
        <li>
          <strong>HOPPS:</strong> annual, with quarterly addenda; we refresh
          on the annual cycle.
        </li>
        <li>
          <strong>CLFS:</strong> annual, uniform nationally.
        </li>
        <li>
          <strong>Enrollment:</strong> CMS Monthly Enrollment is updated
          monthly; the &ldquo;Year&rdquo; aggregation row we use is finalized
          a few months after the calendar year ends.
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
          — verify ZIP-specific costs against the official consumer tool.
        </li>
        <li>
          <a
            href="https://www.cms.gov/medicare/physician-fee-schedule/search"
            target="_blank"
            rel="noopener noreferrer"
          >
            CMS PFS Search
          </a>{" "}
          — official lookup by HCPCS code and locality.
        </li>
        <li>
          <a
            href="https://www.cms.gov/medicare-coverage-database/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Medicare Coverage Database
          </a>{" "}
          — National Coverage Determinations (NCDs) and Local Coverage
          Determinations (LCDs).
        </li>
        <li>
          1-800-MEDICARE — the official Medicare phone line.
        </li>
        <li>
          Your Medicare plan&apos;s member services line — the authoritative
          source for your specific coverage.
        </li>
      </ul>

      <h2>Limitations you should know about</h2>
      <ul>
        <li>
          <strong>Original Medicare vs Medicare Advantage.</strong>
          Our figures are based on Original Medicare allowed amounts and
          published payments. Medicare Advantage plans negotiate their own
          provider contracts; your MA plan&apos;s actual rate may differ.
        </li>
        <li>
          <strong>No supplemental insurance modeling.</strong>
          Medigap covers most of the 20% Part B coinsurance. Our
          &ldquo;patient pays&rdquo; is pre-Medigap and pre-Medicaid.
        </li>
        <li>
          <strong>Geographic variation is GPCI-based, not network-based.</strong>
          Medicare&apos;s Geographic Practice Cost Indices adjust PFS
          payments by locality. They don&apos;t reflect commercial
          chargemaster differences across hospitals.
        </li>
        <li>
          <strong>Coverage exclusions.</strong> Some procedures require
          prior authorization or specific medical-necessity documentation;
          your plan may deny services even when our published figure exists.
        </li>
        <li>
          <strong>Provider acceptance.</strong> Non-participating providers
          can balance-bill up to 15% above the Medicare-approved amount.
        </li>
        <li>
          <strong>Not medical, financial, or insurance advice.</strong>
          For your specific coverage, contact Medicare or your plan directly.
        </li>
      </ul>

      <h2>Corrections and feedback</h2>
      <p>
        If a published CMS figure disagrees with what you see here, please{" "}
        <a href="/contact">contact us</a> with the procedure name, the CMS
        dataset you compared against, and the published value. We update
        within days of confirmation.
      </p>

      <p className="text-sm text-slate-500 border-t pt-4 mt-8">
        Methodology last reviewed April 2026. Material changes to how we
        source or compute the data will be reflected here before they reach
        production pages.
      </p>
    </article>
  );
}
