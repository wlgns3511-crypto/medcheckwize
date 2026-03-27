import type { Metadata } from 'next';
import { MedicareCostCalculator } from '@/components/MedicareCostCalculator';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AdSlot } from '@/components/AdSlot';

export const metadata: Metadata = {
  title: 'Medicare Cost Calculator - Estimate Your Annual Healthcare Costs',
  description: 'Calculate your estimated Medicare costs including Part B premiums, Part D coverage, Medigap plans, and expected procedure expenses. Free Medicare cost estimator.',
  alternates: { canonical: '/calculator/' },
};

export default function CalculatorPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Medicare Cost Calculator' }]} />

      <h1 className="text-3xl font-bold mb-2">Medicare Cost Calculator</h1>
      <p className="text-slate-600 mb-6">
        Estimate your annual Medicare costs based on your age, state, coverage options, and expected procedures.
        This calculator covers Part A, Part B, Part D, and Medigap supplement plans.
      </p>

      <MedicareCostCalculator />

      <AdSlot id="calc-bottom" />

      <section className="mt-10 prose prose-slate max-w-none">
        <h2>Understanding Medicare Costs</h2>
        <p>
          Medicare costs vary significantly based on your coverage choices, location, and healthcare needs.
          Most beneficiaries pay a standard Part B premium of $185/month in 2026, plus additional costs
          for Part D prescription drug coverage and optional Medigap supplement plans.
        </p>
        <h3>What This Calculator Includes</h3>
        <ul>
          <li><strong>Part A (Hospital Insurance):</strong> Premium-free for most beneficiaries who paid Medicare taxes for 10+ years.</li>
          <li><strong>Part B (Medical Insurance):</strong> Standard monthly premium covering doctor visits, outpatient care, and preventive services.</li>
          <li><strong>Part D (Prescription Drugs):</strong> Average monthly premium for prescription drug coverage.</li>
          <li><strong>Medigap Plans:</strong> Optional supplement insurance that covers out-of-pocket costs like copays and deductibles.</li>
        </ul>
        <h3>Tips for Reducing Medicare Costs</h3>
        <ul>
          <li>Compare Medicare Advantage plans which may offer lower out-of-pocket costs.</li>
          <li>Review your Part D plan annually during Open Enrollment to ensure it covers your medications.</li>
          <li>Consider a Medigap plan if you have frequent medical visits or planned procedures.</li>
          <li>Check if you qualify for Medicare Savings Programs or Extra Help for prescription costs.</li>
        </ul>
      </section>
    </>
  );
}
