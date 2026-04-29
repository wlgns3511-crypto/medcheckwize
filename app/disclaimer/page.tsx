import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer and limitations of liability for MedCheckWize.",
  alternates: { canonical: "/disclaimer/" },
  openGraph: { url: "/disclaimer/" },
};

export default function DisclaimerPage() {
  return (
    <article className="prose prose-slate max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-700 mb-6">Disclaimer</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: April 29, 2026</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">General Information</h2>
      <p>
        The information provided on MedCheckWize is for general informational and educational purposes only. While we
        strive to keep the information accurate and up to date, we make no representations or warranties of any
        kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Not Professional Advice</h2>
      <p>
        The content on this website does not constitute professional advice of any kind, including but not limited
        to financial, legal, medical, or career advice. Any reliance you place on the information is strictly at
        your own risk. Always consult with a qualified professional before making decisions based on the information
        found on this website.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Data Accuracy</h2>
      <p>
        Data displayed on MedCheckWize is sourced from publicly available databases &mdash; primarily
        the CMS Inpatient by Geography, Physician Fee Schedule, Hospital Outpatient PPS, and Clinical
        Laboratory Fee Schedule datasets, plus CMS Medicare Monthly Enrollment, CMS Medicare Geographic
        Variation, KFF Medicaid and Medigap analyses, and the U.S. Census Bureau American Community Survey.
        Source attribution and vintage for every figure is documented on the{" "}
        <a href="/methodology/" className="text-slate-700 hover:underline">methodology page</a>.
      </p>
      <p>
        We make reasonable efforts to ensure accuracy, but data may contain errors, be outdated, or have
        limitations. Specific limitations users should know:
      </p>
      <ul className="list-disc pl-6 my-3 space-y-1 text-slate-700">
        <li>
          Cost figures are <strong>indicative averages</strong> from CMS administrative data, not
          a quote for any individual beneficiary. Your actual cost depends on your plan, deductible
          status, supplemental coverage, and provider participation.
        </li>
        <li>
          Where CMS suppresses small-cell data (fewer than 11 services or discharges in a state),
          the corresponding state-level row is omitted rather than back-filled with synthetic
          numbers.
        </li>
        <li>
          Hospital figures reflect <strong>MS-DRG bundled payments</strong> &mdash; what Medicare paid
          the hospital, not what one beneficiary was billed. Real beneficiary cost depends on Part A
          deductible and length of stay.
        </li>
        <li>
          Outpatient surgical totals combine the PFS surgeon fee with the HOPPS facility fee.
          Reporting either alone would understate the true Medicare cost.
        </li>
        <li>
          Vintage of each dataset (e.g. 2023 Geographic Variation, 2025 Monthly Enrollment) is
          listed on the methodology page; CMS revises historical files when payment errors are
          identified.
        </li>
        <li>
          Medicare Advantage payment rates are negotiated between plans and providers; our
          figures are based on Original Medicare published rates and may not reflect what an MA
          plan pays.
        </li>
      </ul>
      <p>
        Users should independently verify critical figures via{" "}
        <a href="https://www.medicare.gov/care-compare/" target="_blank" rel="noopener noreferrer"
           className="text-slate-700 hover:underline">Medicare.gov Care Compare</a>,{" "}
        the official{" "}
        <a href="https://www.cms.gov/medicare/physician-fee-schedule/search" target="_blank"
           rel="noopener noreferrer" className="text-slate-700 hover:underline">CMS PFS Search</a>,
        or by calling 1-800-MEDICARE before making coverage or financial decisions.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">External Links</h2>
      <p>
        This website may contain links to external websites that are not under our control. We have no responsibility
        for the content, privacy policies, or practices of any third-party websites.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Advertising</h2>
      <p>
        MedCheckWize displays third-party advertisements through Google AdSense and other ad networks. These advertisements
        are provided by third parties and do not imply endorsement by MedCheckWize. We are not responsible for the content
        or accuracy of any advertisements displayed on this website.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Limitation of Liability</h2>
      <p>
        In no event shall MedCheckWize, its owners, operators, or contributors be liable for any direct, indirect,
        incidental, consequential, or punitive damages arising from the use of this website or the information
        contained herein.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Contact</h2>
      <p>
        If you have concerns about any content on this website, please visit our{" "}
        <a href="/contact" className="text-slate-700 hover:underline">Contact page</a>.
      </p>
    </article>
  );
}
