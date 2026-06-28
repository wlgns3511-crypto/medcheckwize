import type { Metadata } from 'next';
import { LEGAL_VINTAGES } from '@/lib/authorship';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'MedCheckWize privacy policy. MedCheckWize publishes CMS, KFF, NAIC, Census ACS, and CMS-IRMAA reference data — we do not collect, ingest, or store Medicare beneficiary records, Medicaid claims, Part B/Part D enrollment data, or Medigap underwriting health questionnaires.',
  alternates: { canonical: "/privacy/" },
  openGraph: { url: "/privacy/" },
};

function formatLegal(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function PrivacyPage() {
  const vintage = LEGAL_VINTAGES.privacy;
  return (
    <article className="prose prose-slate max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-700 mb-6">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: <time dateTime={vintage}>{formatLegal(vintage)}</time></p>

      <h2>What MedCheckWize is and is not</h2>
      <p>
        MedCheckWize publishes Medicare, Medicaid, Medigap, Part D, IRMAA,
        and Census ACS reference data anchored to public federal sources
        &mdash; the Centers for Medicare and Medicaid Services (CMS)
        administrative payment datasets, the Kaiser Family Foundation (KFF)
        analyses of CMS Medicaid Performance Indicator and Part D plan
        landscape, KFF and NAIC compilations of state DOI Medigap rate
        filings, the U.S. Census Bureau American Community Survey (ACS)
        1-Year and 5-Year B19013 median household income series, and the
        CMS-SSA-IRS IRMAA schedule under 42 USC §1395r(i) and
        §1395w-113(a)(7). We do not host any Medicare beneficiary record,
        Medicaid claims data, Part B enrollment file, Part D PDP
        enrollment file, Medigap underwriting questionnaire, or Medicare
        Advantage plan enrollment record.
      </p>

      <h2>Information we collect from visitors</h2>
      <p>
        MedCheckWize does not require account creation, login, or
        submission of any Medicare, Medicaid, IRMAA, or Medigap
        information to read the CMS, KFF, NAIC, or Census ACS reference
        data on this site. The Medicare Cost Calculator and other
        on-page tools run entirely in the browser; figures entered into
        a tool are not transmitted to MedCheckWize servers. No
        Medicare-eligible household&apos;s MAGI, IRMAA tier, Medigap plan
        letter, Part D plan name, or Medicaid eligibility status is
        collected or stored by MedCheckWize as a result of using a tool.
      </p>
      <p>
        We use cookies through Google Analytics and Google AdSense to
        measure aggregate site traffic and to serve advertisements. These
        cookies do not capture personally identifiable Medicare, Medicaid,
        IRMAA, or Medigap data. The same Google AdSense advertising stack
        is used by every site in the DataPeek Research Network.
      </p>

      <h2>Third-party services and ad networks</h2>
      <p>
        MedCheckWize uses Google AdSense to display advertisements. Google
        may use cookies to serve ads based on a visitor&apos;s prior visits
        to MedCheckWize or other sites. Visitors can opt out via{' '}
        <a href="https://www.google.com/settings/ads" className="text-slate-700 hover:underline" target="_blank" rel="noopener noreferrer">
          Google Ads Settings
        </a>{' '}
        or by visiting{' '}
        <a href="https://www.aboutads.info/choices/" className="text-slate-700 hover:underline" target="_blank" rel="noopener noreferrer">
          www.aboutads.info
        </a>. Advertising preferences are managed by the third-party ad
        networks, not by MedCheckWize, CMS, KFF, NAIC, the Census Bureau,
        the Social Security Administration, the IRS, or any Medicare or
        Medicaid plan sponsor.
      </p>

      <h2>What we do not do</h2>
      <ul>
        <li>
          <strong>No Medicare beneficiary tracking.</strong> MedCheckWize
          does not match site visitors to CMS Medicare enrollment files,
          KFF Medicaid Performance Indicator rosters, or any Part D, Part
          B, Medigap, or Medicare Advantage enrollment record.
        </li>
        <li>
          <strong>No IRMAA MAGI capture.</strong> The IRMAA Tier card on
          state pages uses the Census ACS B19013 statewide median household
          income as a proxy. Visitors do not submit MAGI, and MedCheckWize
          does not request, capture, or store individual MAGI under
          42 USC §1395r(i).
        </li>
        <li>
          <strong>No Medigap underwriting questionnaire.</strong> The
          Medigap Access Tier classifier reports the state DOI regime
          (42 USC §1395ss, 42 CFR §403.205, NAIC Model Regulation §6).
          Visitors do not submit any health information.
        </li>
        <li>
          <strong>No paid-promotion of CMS / KFF / NAIC / SSA / IRS data.</strong>{' '}
          No CMS provider, KFF analyst, Medigap carrier, Part D plan
          sponsor, MA plan sponsor, or Medicaid managed-care organization
          pays to appear on MedCheckWize. The Medicare Stack Index rank,
          the Medigap Access Tier, the IRMAA Tier, and the composite
          verdict are computed identically for every state.
        </li>
      </ul>

      <h2>Contact</h2>
      <p>
        Questions about this privacy policy or about CMS, KFF, NAIC,
        Census ACS, SSA, or CMS-IRMAA data handling on MedCheckWize:
        visit our <a href="/contact/" className="text-slate-700 hover:underline">contact page</a>.
        Factual data corrections against a specific CMS, KFF, Census ACS,
        NAIC, or CMS-IRMAA row: see the{' '}
        <a href="/corrections-policy/" className="text-slate-700 hover:underline">corrections policy</a>.
        Editorial concerns: see the{' '}
        <a href="/editorial-policy/" className="text-slate-700 hover:underline">editorial policy</a>.
      </p>

      <div className="mt-8 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-semibold mb-3">Part of the DataPeek Research Network</h2>
        <p>
          MedCheckWize is part of the{' '}
          <a href="https://datapeekfacts.com" className="text-slate-700 hover:underline" target="_blank" rel="noopener noreferrer">
            DataPeek Research Network
          </a>{' '}
          &mdash; a public-data network aggregating CMS, KFF, Census ACS,
          NAIC, SSA, IRS, and other government and federally-aligned
          datasets across U.S. healthcare, housing, tax, and civic
          domains. For general inquiries about the network, privacy
          practices, or partnership opportunities, contact the DataPeek
          team at{' '}
          <a href="mailto:datapeekfacts@gmail.com" className="text-slate-700 hover:underline">
            datapeekfacts@gmail.com
          </a>. The{' '}
          <a href="https://datapeekfacts.com/privacy/" className="text-slate-700 hover:underline" target="_blank" rel="noopener noreferrer">
            DataPeek Facts Privacy Policy
          </a>{' '}
          documents the network-wide handling of CMS, KFF, NAIC, Census
          ACS, SSA, and IRS reference data.
        </p>
      </div>
    </article>
  );
}
