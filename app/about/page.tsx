import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'About', description: 'About MedCheckWize - free Medicare and Medicaid cost data.' };

export default function AboutPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">About MedCheckWize</h1>
      <div className="prose prose-slate max-w-none">
        <p>MedCheckWize provides free, easy-to-understand Medicare and Medicaid cost data for every state in the US.</p>
        <h2>Our Data</h2>
        <p>Data is sourced from the Centers for Medicare &amp; Medicaid Services (CMS), Medicare.gov, and publicly available healthcare cost databases. Figures represent 2026 estimates based on the latest available data.</p>
        <h2>What You Can Find</h2>
        <ul>
          <li>Medicare spending per capita by state</li>
          <li>Average costs for 200+ common medical procedures</li>
          <li>Medicare Part B, Part D, and Medigap premium estimates</li>
          <li>Medicaid expansion status and uninsured rates</li>
          <li>Side-by-side state healthcare cost comparisons</li>
          <li>Interactive Medicare cost calculator</li>
        </ul>
        <h2>Related Resources</h2>
        <p>For senior care cost data, visit <a href="https://eldercarepeek.com">ElderCarePeek</a>. For general cost of living data, check <a href="https://costbycity.com">CostByCity</a>.</p>
        <h2>Disclaimer</h2>
        <p>MedCheckWize is an independent informational resource. We are not affiliated with CMS, Medicare, or any government agency. Costs shown are estimates and may not reflect actual charges. Always consult with healthcare providers and insurance representatives for personalized cost information.</p>
      </div>
    </>
  );
}
