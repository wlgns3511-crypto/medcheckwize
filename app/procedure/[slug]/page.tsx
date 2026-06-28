import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllProcedureSlugs, getProcedureBySlug, getProcedureByState, getRelatedProcedures } from '@/lib/db';
import { formatCurrency, getDataYear, categoryLabel } from '@/lib/format';
import { breadcrumbSchema, faqSchema, generateProcedureFAQs, datasetSchema } from '@/lib/schema';
import { ENTITY_VINTAGE } from '@/lib/authorship';
import { generateAutoFaqs } from '@/lib/auto-faqs';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AdSlot } from '@/components/AdSlot';
import { FAQ } from '@/components/FAQ';
import { AuthorBox } from '@/components/AuthorBox';
import { ProcedureCostBar } from '@/components/ProcedureCostBar';
import { MedicareCostCalculator } from '@/components/MedicareCostCalculator';
import { OutOfPocketEstimator } from '@/components/tools/OutOfPocketEstimator';
import { AnswerHero } from '@/components/upgrades/AnswerHero';
import { TrustBlock } from '@/components/upgrades/TrustBlock';
import { InsightBlock } from '@/components/upgrades/InsightBlock';
import { DecisionNext } from '@/components/upgrades/DecisionNext';
import { RelatedEntities } from '@/components/upgrades/RelatedEntities';
import { TableOfContents } from '@/components/upgrades/TableOfContents';
import { generateInsights } from '@/lib/insights';

const TRUST_SOURCE_INPATIENT = { name: "CMS Medicare Inpatient Hospitals by Geography & Service", url: "https://data.cms.gov/provider-summary-by-type-of-service/medicare-inpatient-hospitals/medicare-inpatient-hospitals-by-geography-and-service" };
const TRUST_SOURCE_PFS = { name: "CMS Medicare Physician & Other Practitioners by Geography & Service", url: "https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners/medicare-physician-other-practitioners-by-geography-and-service" };
const TRUST_SOURCE_HOPPS = { name: "CMS Medicare Outpatient Hospitals by Geography & Service", url: "https://data.cms.gov/provider-summary-by-type-of-service/medicare-outpatient-hospitals/medicare-outpatient-hospitals-by-geography-and-service" };
const TRUST_SOURCE_CLFS = { name: "CMS Clinical Laboratory Fee Schedule", url: "https://www.cms.gov/medicare/payment/fee-schedules/clinical-laboratory-fee-schedule-clfs-files" };
const TRUST_SOURCE_DRG_MANUAL = { name: "CMS FY 2024 MS-DRG Definition Manual", url: "https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps" };
const TRUST_SOURCE_CARE_COMPARE = { name: "Medicare.gov Care Compare", url: "https://www.medicare.gov/care-compare/" };
const TRUST_SOURCE_COVERAGE_DB = { name: "Medicare Coverage Database (NCD/LCD)", url: "https://www.cms.gov/medicare-coverage-database/" };

function trustBlockSources(category: string) {
  if (category === "hospital") {
    return [TRUST_SOURCE_INPATIENT, TRUST_SOURCE_DRG_MANUAL, TRUST_SOURCE_CARE_COMPARE, TRUST_SOURCE_COVERAGE_DB];
  }
  if (category === "lab") {
    return [TRUST_SOURCE_CLFS, TRUST_SOURCE_PFS, TRUST_SOURCE_CARE_COMPARE, TRUST_SOURCE_COVERAGE_DB];
  }
  if (category === "outpatient") {
    return [TRUST_SOURCE_PFS, TRUST_SOURCE_HOPPS, TRUST_SOURCE_CARE_COMPARE, TRUST_SOURCE_COVERAGE_DB];
  }
  // imaging / physician
  return [TRUST_SOURCE_PFS, TRUST_SOURCE_HOPPS, TRUST_SOURCE_CARE_COMPARE, TRUST_SOURCE_COVERAGE_DB];
}

function trustBlockVintage(category: string, year: number) {
  if (category === "hospital") return `CMS Inpatient ${year - 1} Geography & Service data, refreshed annually`;
  if (category === "lab") return `CMS Clinical Laboratory Fee Schedule ${year}, uniform national rates`;
  return `CMS PFS / HOPPS ${year} fee schedules, refreshed annually`;
}

function answerTagline(proc: { name: string; description: string; category: string; national_avg_cost: number; medicare_pays: number; patient_pays: number }) {
  const cost = formatCurrency(proc.national_avg_cost);
  const paid = formatCurrency(proc.medicare_pays);
  const pat = formatCurrency(proc.patient_pays);
  if (proc.category === "hospital") {
    return `MS-DRG bundled payment averages ${cost} per discharge; Medicare pays ${paid}, with beneficiary cost driven by Part A deductible per benefit period.`;
  }
  if (proc.category === "lab") {
    return `Clinical Laboratory Fee Schedule rate is ${cost} (uniform nationally). Section 1833 exempts Part B labs — patient cost is $0.`;
  }
  if (proc.patient_pays === 0) {
    return `Medicare allows ${cost} and pays the full ${paid} when billed as a covered preventive service — patient cost is $0.`;
  }
  return `Medicare allowed amount averages ${cost}; Part B pays ${paid} after deductible, beneficiary share ≈ ${pat} (Medigap or MA caps exposure).`;
}

function whyItMattersCopy(category: string) {
  if (category === "hospital") {
    return {
      paragraphs: [
        "Inpatient hospital stays under Original Medicare are paid through Part A using the MS-DRG (Medicare Severity Diagnosis Related Group) bundled payment system. The hospital receives one bundled payment based on the patient's primary diagnosis and procedures performed — not separate fees per service. The averages on this page reflect that hospital-level payment, not the beneficiary's bill.",
        "Beneficiary cost-sharing under Part A is structured by benefit period rather than by procedure. The 2025 Part A inpatient deductible is $1,676 per benefit period, with daily coinsurance starting on day 61 ($419/day in 2025). Most short stays for a single MS-DRG fall within a single deductible.",
        "Medicare Advantage plans handle inpatient stays differently — typically with per-day copays for the first several days, capped by the plan's annual out-of-pocket maximum. Original Medicare has no annual out-of-pocket cap, which is why most Original Medicare beneficiaries pair it with a Medigap policy.",
      ],
    };
  }
  if (category === "lab") {
    return {
      paragraphs: [
        "Clinical laboratory tests covered under Medicare Part B are paid at the rates set by the Clinical Laboratory Fee Schedule (CLFS). These rates are nationally uniform — they do not vary by state — and are updated periodically using private-payer pricing data under PAMA.",
        "Medicare beneficiaries pay $0 out of pocket for covered Part B lab tests when ordered by a Medicare-enrolled provider and processed by a Medicare-participating lab. Section 1833 of the Social Security Act statutorily exempts clinical lab services from both the Part B deductible and the 20% coinsurance.",
        "What can still be charged: tests ordered for a non-covered indication (screening tests outside Medicare's preventive coverage rules), tests not on the CLFS, or labs that don't accept Medicare assignment. Always confirm coverage rules in the Medicare Coverage Database (NCD/LCD) for the specific test code.",
      ],
    };
  }
  if (category === "outpatient") {
    return {
      paragraphs: [
        "Hospital outpatient procedures (including most same-day surgeries done in a hospital outpatient department) are paid through two separate Medicare systems: the Hospital Outpatient Prospective Payment System (HOPPS) for the facility fee, and the Physician Fee Schedule (PFS) for the surgeon's professional fee. The numbers on this page combine both.",
        "Beneficiary cost-sharing under Original Medicare Part B is the annual deductible ($257 in 2025) plus 20% coinsurance on the Medicare-approved amount, with no annual out-of-pocket maximum. The same procedure performed in an Ambulatory Surgical Center (ASC) is paid under a different schedule and may carry lower cost-sharing.",
        "Medicare Advantage plans typically use fixed copays for outpatient surgery, with annual out-of-pocket maximums protecting beneficiaries from large coinsurance bills. Coverage rules and prior authorization requirements vary by plan.",
      ],
    };
  }
  // imaging / physician / preventive / pharmacy
  return {
    paragraphs: [
      "Most physician services and outpatient diagnostic imaging are paid under Medicare Part B using the Physician Fee Schedule (PFS). State-level variation in this page reflects the Geographic Practice Cost Index (GPCI), which adjusts payments for local costs of practice.",
      "Beneficiary cost-sharing is the annual Part B deductible ($257 in 2025) plus 20% coinsurance on the Medicare-approved amount. There is no annual out-of-pocket maximum on Original Medicare Part B; most beneficiaries pair it with Medigap to cap exposure.",
      "Medicare Advantage plans typically use copays instead of percentage coinsurance and impose an annual out-of-pocket maximum. The trade-off is network restrictions and prior authorization on certain imaging procedures.",
    ],
  };
}

export const dynamicParams = false;
export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllProcedureSlugs().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const proc = getProcedureBySlug(slug);
  if (!proc) return {};
  return {
    title: `${proc.name} Cost with Medicare - ${getDataYear()} Average Prices`,
    description: `${proc.name} costs ${formatCurrency(proc.national_avg_cost)} on average. Medicare pays ${formatCurrency(proc.medicare_pays)}, patient pays ${formatCurrency(proc.patient_pays)}. Compare costs across all 50 states.`,
    alternates: { canonical: `/procedure/${slug}/` },
    openGraph: { url: `/procedure/${slug}/` },
  };
}

export default async function ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proc = getProcedureBySlug(slug);
  if (!proc) notFound();

  const year = getDataYear();
  const stateData = getProcedureByState(slug);
  const baseFaqs = generateProcedureFAQs(proc);
  const autoFaqs = generateAutoFaqs(proc, stateData);
  const faqs = [...baseFaqs, ...autoFaqs];

  const cheapest = stateData[stateData.length - 1];
  const mostExpensive = stateData[0];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Procedures', url: '/' },
        { name: proc.name, url: `/procedure/${slug}/` },
      ])) }} />
      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(datasetSchema({
            name: `${proc.name} cost with Medicare (${year})`,
            description: `CMS allowed and paid amounts for ${proc.name} (${categoryLabel(proc.category)}). National average ${formatCurrency(proc.national_avg_cost)}; Medicare pays ${formatCurrency(proc.medicare_pays)}; patient share ${formatCurrency(proc.patient_pays)}.`,
            url: `https://medcheckwize.com/procedure/${slug}/`,
            vintage: ENTITY_VINTAGE,
            temporalCoverage: String(year),
            variableMeasured: [
              'CMS allowed amount',
              'Medicare paid amount',
              'Beneficiary cost-share',
              'State-level cost variation',
              'CMS payment system mapping',
              'MS-DRG / HCPCS / CPT code mapping',
            ],
          })),
        }}
      />

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Procedures' }, { label: proc.name }]} />

      <AnswerHero
        title={`${proc.name} cost with Medicare`}
        subtitle={`${categoryLabel(proc.category)} · ${year}`}
        tagline={answerTagline(proc)}
        badges={[
          { label: categoryLabel(proc.category), tone: "indigo" as const },
          { label: `Medicare data ${year}`, tone: "slate" as const },
        ]}
        alternatives={[]}
      />

      <TrustBlock
        sources={trustBlockSources(proc.category)}
        updated={trustBlockVintage(proc.category, year)}
      />

      <InsightBlock entityName={proc.name} insights={generateInsights(proc, stateData)} />

      <TableOfContents />

      <p className="sr-only">{proc.name} Cost with Medicare ({year}) — {proc.description}</p>

      {/* National Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-teal-700">{formatCurrency(proc.national_avg_cost)}</div>
          <div className="text-xs text-slate-500">National Avg Cost</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-green-600">{formatCurrency(proc.medicare_pays)}</div>
          <div className="text-xs text-slate-500">Medicare Pays</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-amber-600">{formatCurrency(proc.patient_pays)}</div>
          <div className="text-xs text-slate-500">Patient Pays</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-sm font-medium">{categoryLabel(proc.category)}</div>
          <div className="text-xs text-slate-500">Category</div>
        </div>
      </div>

      {/* Cost Highlights */}
      {/* HCU Phase C 2026-04-25: state×procedure leaf killed — link to /state/ hub */}
      {cheapest && mostExpensive && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="border border-red-100 bg-red-50 rounded-lg p-4">
            <div className="text-sm text-slate-500 mb-1">Most Expensive State</div>
            <div className="text-lg font-bold text-red-700">
              <a href={`/state/${mostExpensive.state_slug}/`} className="hover:underline">{mostExpensive.state_name}</a>
            </div>
            <div className="text-sm">{formatCurrency(mostExpensive.avg_cost)}</div>
          </div>
          <div className="border border-green-100 bg-green-50 rounded-lg p-4">
            <div className="text-sm text-slate-500 mb-1">Least Expensive State</div>
            <div className="text-lg font-bold text-green-700">
              <a href={`/state/${cheapest.state_slug}/`} className="hover:underline">{cheapest.state_name}</a>
            </div>
            <div className="text-sm">{formatCurrency(cheapest.avg_cost)}</div>
          </div>
        </div>
      )}

      <AdSlot id="procedure-mid" />

      <OutOfPocketEstimator
        procedureName={proc.name}
        nationalAvgCost={proc.national_avg_cost}
      />

      <MedicareCostCalculator />

      <ProcedureCostBar
        procedureName={proc.name}
        nationalAvg={proc.national_avg_cost}
        stateData={stateData}
      />

      {/* State-by-State Comparison Table */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">{proc.name} Cost by State</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-teal-50">
                <th className="text-left px-3 py-2 font-medium">#</th>
                <th className="text-left px-3 py-2 font-medium">State</th>
                <th className="text-right px-3 py-2 font-medium">Average Cost</th>
                <th className="text-right px-3 py-2 font-medium">Medicare Pays</th>
                <th className="text-right px-3 py-2 font-medium">Patient Pays</th>
              </tr>
            </thead>
            <tbody>
              {/* HCU Phase C 2026-04-25: state×procedure leaf killed — link to /state/ hub */}
              {stateData.map((sp, i) => (
                <tr key={sp.state} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                  <td className="px-3 py-2">
                    <a href={`/state/${sp.state_slug}/`} className="text-teal-600 hover:underline font-medium">{sp.state_name}</a>
                  </td>
                  <td className="px-3 py-2 text-right">{formatCurrency(sp.avg_cost)}</td>
                  <td className="px-3 py-2 text-right">{formatCurrency(sp.medicare_pays)}</td>
                  <td className="px-3 py-2 text-right font-medium">{formatCurrency(sp.patient_pays)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <RelatedEntities
        entityName={proc.name}
        items={getRelatedProcedures(proc.category, slug, 8).map(r => ({
          name: r.name,
          href: `/procedure/${r.slug}/`,
          stat: formatCurrency(r.national_avg_cost),
        }))}
        heading={`Related ${categoryLabel(proc.category)} Procedures`}
        statLabel="Avg Cost"
      />

      {/* Why this matters — US Medicare beneficiary context */}
      <section className="mb-8 mt-6" data-upgrade="why-it-matters">
        <h2 className="text-xl font-bold mb-3">
          Why {proc.name} Medicare cost matters
        </h2>
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-slate-700 leading-relaxed space-y-3">
          {whyItMattersCopy(proc.category).paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p>
            For an actual procedure decision: (1) confirm your provider accepts Medicare assignment, (2) check the{" "}
            <a
              href="https://www.medicare.gov/care-compare/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Medicare.gov procedure cost lookup
            </a>{" "}
            for your specific zip code, and (3) ask the provider&apos;s billing office for an itemized estimate in writing before the procedure. Coverage rules for any specific test or procedure are authoritative in the{" "}
            <a
              href="https://www.cms.gov/medicare-coverage-database/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Medicare Coverage Database (NCD/LCD)
            </a>
            .
          </p>
          <p className="text-sm text-slate-500">
            Sources: see <a href="/methodology/" className="underline">methodology</a> for the full list of CMS payment systems used on this page. Not affiliated with CMS or Medicare. For your specific coverage, contact 1-800-MEDICARE or your plan directly.
          </p>
        </div>
      </section>

      <DecisionNext
        cards={[
          {
            title: `Medicare.gov Care Compare`,
            blurb: `Look up your specific procedure cost for your ZIP code on the official Medicare.gov tool.`,
            href: `https://www.medicare.gov/care-compare/`,
            cta: `Open Medicare.gov`,
            tone: "indigo" as const,
          },
          {
            title: `Healthcare costs by city`,
            blurb: `Hospital prices vary dramatically by city for non-Medicare patients.`,
            href: `https://medcostpeek.com`,
            cta: `Open MedCostPeek`,
            tone: "emerald" as const,
          },
          {
            title: `Medicare physician fee schedule`,
            blurb: `The official CMS database of approved amounts for every covered procedure.`,
            href: `https://www.cms.gov/medicare/payment/fee-schedules/physician`,
            cta: `Open CMS PFS`,
            tone: "amber" as const,
          },
        ]}
      />

      <AuthorBox layer="entity" showDisclaimer />

      <FAQ items={faqs} />
    </>
  );
}
