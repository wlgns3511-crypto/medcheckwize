import type { Metadata } from 'next';
import Link from 'next/link';
import { LEGAL_VINTAGES } from '@/lib/authorship';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of service for MedCheckWize — covering the use of CMS Medicare administrative data, KFF Medicaid and Medigap analyses, Census ACS B19013 median household income, NAIC Medigap regulation, and the CMS-SSA-IRS IRMAA schedule under 42 USC §1395r(i) as reference data on this site.',
  alternates: { canonical: "/terms/" },
  openGraph: { url: "/terms/" },
};

function formatLegal(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function TermsPage() {
  const vintage = LEGAL_VINTAGES.terms;
  return (
    <article className="prose prose-slate max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-700 mb-6">Terms of Service</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: <time dateTime={vintage}>{formatLegal(vintage)}</time></p>

      <p>
        Welcome to MedCheckWize. By accessing or using medcheckwize.com,
        you agree to be bound by these Terms of Service. MedCheckWize
        publishes Medicare, Medicaid, Medigap, Part D, IRMAA, and Census
        ACS reference data anchored to public federal sources &mdash;
        the Centers for Medicare and Medicaid Services (CMS) administrative
        datasets, the Kaiser Family Foundation (KFF) analyses of CMS
        Medicaid Performance Indicator and Part D plan landscape, KFF and
        NAIC compilations of state DOI Medigap rate filings, the U.S.
        Census Bureau American Community Survey (ACS), and the CMS-SSA-IRS
        IRMAA schedule under 42 USC §1395r(i). These terms govern how you
        may use that reference data on this site.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Use of the website</h2>
      <p>
        MedCheckWize publishes federally sourced Medicare, Medicaid,
        Medigap, Part D, IRMAA, and Census ACS data for informational and
        educational purposes. You may use the website for personal,
        non-commercial purposes including planning your own Medicare or
        Medicaid coverage, comparing state-level CMS, KFF, NAIC, ACS, and
        CMS-IRMAA reference figures, and reading the MedCheckWize-original
        Medicare Stack Index, Medigap Access Tier (42 USC §1395ss,
        42 CFR §403.205), IRMAA Tier (42 USC §1395r(i)), and composite
        verdict. For personalized Medicare and Medicaid decisions, work
        with a CMS State Health Insurance Assistance Program (SHIP)
        counselor, request a Medigap carrier quote, run the Part D plan
        finder on Medicare.gov, file an SSA IRMAA Life-Changing Event
        appeal on Form SSA-44, and follow the CMS Annual Election Period
        decision pathway through the official Medicare.gov tooling.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Reference data only</h2>
      <p>
        The CMS-published cost averages, KFF-published Part D and Medigap
        premium figures, NAIC-anchored state DOI Medigap tier
        classifications, Census ACS B19013-derived IRMAA Tier
        applications, and Medicare Stack Index ranks on this website are
        reference data points. They are not Medicare coverage
        determinations, Medicaid eligibility decisions, Medigap
        underwriting quotes, Part D plan recommendations, IRMAA
        determinations, or Medicare Advantage benefit summaries. Actual
        costs and coverage may vary significantly based on Medicare
        assignment status, Medigap plan letter, Part D plan formulary,
        Medicare Advantage plan network, state DOI Medigap rules, and
        the beneficiary&apos;s 2-year-prior MAGI as reported by the IRS
        to SSA for IRMAA purposes.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Accuracy of CMS, KFF, NAIC, Census ACS, and CMS-IRMAA information</h2>
      <p>
        While we make reasonable efforts to refresh CMS Medicare
        Geographic Variation, CMS Medicare Monthly Enrollment, CMS Inpatient
        by Geography, CMS Physician &amp; Other Practitioners by Geography,
        CMS Outpatient HOPPS APC, CMS Clinical Laboratory Fee Schedule,
        KFF Medicaid Performance Indicator analyses, KFF Part D plan
        landscape analyses, KFF and NAIC Medigap rate compilations, the
        Census ACS B19013 5-Year median household income, and the
        CMS-SSA-IRS IRMAA schedule within days of each release, we make
        no warranties or representations regarding the completeness,
        accuracy, or reliability of any specific Medicare, Medicaid,
        Medigap, Part D, IRMAA, or Census ACS figure on this website.
        CMS revises its administrative payment files when reconciliation
        errors are identified; KFF revises its Medicaid and Medigap
        analyses when new state-DOI rate filings publish; Census ACS
        revises 5-Year estimates each December.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Intellectual property</h2>
      <p>
        The CMS, KFF, NAIC, Census ACS, and CMS-IRMAA source data on
        MedCheckWize is in the public domain or is published by federal
        agencies and federally-aligned non-profits with clear license
        terms (see the methodology page for source attribution and
        licensing). The MedCheckWize Medicare Stack Index, Medigap
        Access Tier classifier, IRMAA Tier application, composite
        verdict logic, page layouts, and editorial text are the
        property of MedCheckWize and the DataPeek Research Network and
        are protected by copyright. You may not reproduce the editorial
        text or the classifier logic without prior written consent.
        Citing the CMS, KFF, NAIC, Census ACS, or CMS-IRMAA figures
        themselves with appropriate attribution is fine.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Third-party links and advertising</h2>
      <p>
        Our website contains links to CMS.gov, Medicare.gov, KFF.org,
        Census.gov, NAIC.org, SSA.gov, IRS.gov, and other federal and
        federally-aligned third-party websites so readers can verify the
        Medicare, Medicaid, Medigap, Part D, IRMAA, and Census ACS data
        directly at its source. MedCheckWize displays advertisements
        served by Google AdSense and other ad networks. No CMS provider,
        KFF analyst, Medigap carrier, Part D plan sponsor, MA plan
        sponsor, or Medicaid managed-care organization pays to appear on
        MedCheckWize, to be re-ordered in the Medicare Stack Index, or
        to have flattering language inserted into a state, procedure, or
        guide page.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, MedCheckWize shall not
        be liable for any indirect, incidental, special, consequential,
        or punitive damages arising out of or related to your use of
        the CMS, KFF, NAIC, Census ACS, or CMS-IRMAA reference data on
        this website. Medicare, Medicaid, Medigap, Part D, IRMAA, and
        Medicare Advantage decisions should be verified directly with
        a CMS SHIP counselor, the SSA Medicare hotline (1-800-MEDICARE),
        and against the CMS, KFF, NAIC, Census ACS, and CMS-IRMAA
        source rows before being acted on.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Changes to these terms</h2>
      <p>
        We reserve the right to modify these Terms of Service at any
        time. Changes will be effective immediately upon posting on this
        page. The reviewed date at the top of this page reflects when
        the editorial team last reviewed the terms against the current
        CMS, KFF, NAIC, Census ACS, and CMS-IRMAA data scope of
        MedCheckWize.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Contact</h2>
      <p>
        Questions about these Terms of Service: visit our{' '}
        <Link href="/contact/" className="text-slate-700 hover:underline">contact page</Link>.
        Editorial concerns: see the{' '}
        <Link href="/editorial-policy/" className="text-slate-700 hover:underline">editorial policy</Link>.
        Factual data corrections against a specific CMS, KFF, Census
        ACS, NAIC, or CMS-IRMAA source row: see the{' '}
        <Link href="/corrections-policy/" className="text-slate-700 hover:underline">corrections policy</Link>.
      </p>
    </article>
  );
}
