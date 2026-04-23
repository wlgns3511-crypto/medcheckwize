import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllProcedureSlugs, getProcedureBySlug, getProcedureByState, getRelatedProcedures } from '@/lib/db';
import { formatCurrency, getDataYear, categoryLabel } from '@/lib/format';
import { breadcrumbSchema, faqSchema, generateProcedureFAQs } from '@/lib/schema';
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

export const dynamicParams = true;
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

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Procedures' }, { label: proc.name }]} />

      <AnswerHero
        title={`${proc.name} cost with Medicare`}
        subtitle={`${categoryLabel(proc.category)} · ${year}`}
        tagline={`${proc.description} National average cost: ${formatCurrency(proc.national_avg_cost)}. Medicare typically pays ${formatCurrency(proc.medicare_pays)}; Medicare beneficiaries are responsible for approximately ${formatCurrency(proc.patient_pays)} after Part B deductible and coinsurance, unless covered by Medicare Advantage or supplemental insurance.`}
        badges={[
          { label: categoryLabel(proc.category), tone: "indigo" as const },
          { label: `Medicare data ${year}`, tone: "slate" as const },
        ]}
        alternatives={[]}
      />

      <TrustBlock
        sources={[
          { name: "CMS Medicare Physician Fee Schedule", url: "https://www.cms.gov/medicare/payment/fee-schedules/physician" },
          { name: "Medicare.gov Procedure Cost", url: "https://www.medicare.gov/care-compare/" },
          { name: "CMS Hospital Outpatient Pricing", url: "https://www.cms.gov/medicare/payment/prospective-payment-systems/hospital-outpatient" },
          { name: "AMA CPT Code Lookup", url: "https://www.ama-assn.org/practice-management/cpt" },
          { name: "Medicare Coverage Database (NCD/LCD)", url: "https://www.cms.gov/medicare-coverage-database/" },
        ]}
        updated={`CMS ${year} fee schedules, refreshed annually`}
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
      {cheapest && mostExpensive && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="border border-red-100 bg-red-50 rounded-lg p-4">
            <div className="text-sm text-slate-500 mb-1">Most Expensive State</div>
            <div className="text-lg font-bold text-red-700">
              <a href={`/state/${mostExpensive.state_slug}/${slug}/`} className="hover:underline">{mostExpensive.state_name}</a>
            </div>
            <div className="text-sm">{formatCurrency(mostExpensive.avg_cost)}</div>
          </div>
          <div className="border border-green-100 bg-green-50 rounded-lg p-4">
            <div className="text-sm text-slate-500 mb-1">Least Expensive State</div>
            <div className="text-lg font-bold text-green-700">
              <a href={`/state/${cheapest.state_slug}/${slug}/`} className="hover:underline">{cheapest.state_name}</a>
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
              {stateData.map((sp, i) => (
                <tr key={sp.state} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                  <td className="px-3 py-2">
                    <a href={`/state/${sp.state_slug}/${slug}/`} className="text-teal-600 hover:underline font-medium">{sp.state_name}</a>
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
          <p>
            Medicare covers about 65 million Americans (mostly people
            65+ and people with certain disabilities). For Medicare
            beneficiaries, the question with any procedure isn&apos;t
            &ldquo;what does it cost?&rdquo; in the abstract &mdash;
            it&apos;s &ldquo;how much will <em>I</em> pay after
            Medicare?&rdquo; That depends on which Medicare program
            (Original Medicare vs Medicare Advantage), whether the
            provider accepts assignment, and whether the patient has
            Medigap supplemental insurance.
          </p>
          <p>
            Under Original Medicare Part B, after meeting the annual
            deductible (${257} for 2025), Medicare typically pays 80%
            of the approved amount and the patient pays 20%
            coinsurance. There&apos;s no annual out-of-pocket maximum
            on Original Medicare, which is why most beneficiaries buy
            Medigap (Medicare Supplement) insurance to cap their
            exposure.
          </p>
          <p>
            Medicare Advantage (Part C) plans have different cost
            structures &mdash; usually copays instead of coinsurance,
            with annual out-of-pocket maximums. The trade-off is
            network restrictions: Medicare Advantage uses HMO/PPO
            networks while Original Medicare lets you see any
            provider that accepts Medicare assignment.
          </p>
          <p>
            For an actual procedure decision: (1) confirm your
            provider accepts Medicare assignment, (2) check the{" "}
            <a
              href="https://www.medicare.gov/care-compare/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Medicare.gov procedure cost lookup
            </a>{" "}
            for your specific zip code, and (3) ask the
            provider&apos;s billing office for an itemized estimate
            in writing before the procedure.
          </p>
          <p className="text-sm text-slate-500">
            Sources: CMS Medicare Physician Fee Schedule, CMS
            Hospital Outpatient Prospective Payment System,
            Medicare.gov procedure cost lookup, AMA CPT codes. Not
            affiliated with CMS or Medicare. For your specific
            coverage, contact 1-800-MEDICARE or your plan directly.
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

      <AuthorBox />

      <FAQ items={faqs} />
    </>
  );
}
