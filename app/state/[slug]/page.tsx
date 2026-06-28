import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
// HCU Phase C 2026-04-25: getComparisonLinksForState/getStateByAbbr no longer
// used after /compare/{state-vs-state}/ was killed (410). Kept import surface
// stable — lib/db.ts still exports these for build-sitemap.ts compatibility.
import { getAllStateSlugs, getStateBySlug, getStateProcedures, getNationalStats, getAffordabilityRank, getSimilarSpendingStates, getTopProceduresByCategory } from '@/lib/db';
import { formatCurrency, formatNumber, formatPercent, getDataYear, categoryLabel } from '@/lib/format';
import { breadcrumbSchema, faqSchema, generateStateFAQs, datasetSchema } from '@/lib/schema';
import { STATE_VINTAGE } from '@/lib/authorship';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AdSlot } from '@/components/AdSlot';
import { FAQ } from '@/components/FAQ';
import { CiteButton } from '@/components/CiteButton';
import { MedicareCostCalculator } from '@/components/MedicareCostCalculator';
import { FeedbackButton } from '@/components/FeedbackButton';
import { InsightBlock } from '@/components/upgrades/InsightBlock';
import { TrustBlock } from '@/components/upgrades/TrustBlock';
import { TableOfContents } from '@/components/upgrades/TableOfContents';
import { RelatedEntities } from '@/components/upgrades/RelatedEntities';
import { getStateInsights } from '@/lib/insights';
import { StateRich } from '@/components/state/StateRich';
import { getStateFactsByAbbr } from '@/lib/state-facts';
import { getStateCommentary } from '@/lib/state-commentary';
import { AuthorBox } from '@/components/AuthorBox';
import { MedicareStackIndexCard } from '@/components/MedicareStackIndex';
import { getMedicareStackIndex } from '@/lib/medicare-stack';
import { MedigapAccessTierCard } from '@/components/MedigapAccessTier';
import { classifyMedigapAccess } from '@/lib/medigap-access-tier';
import { IrmaaTierCard } from '@/components/IrmaaTier';
import { classifyIrmaaForState, ACS_B19013_2024_5YEAR } from '@/lib/irmaa-tier';
import { MedcheckwizeInterpretationCard } from '@/components/MedcheckwizeInterpretation';
import { interpretMedcheckwizeState } from '@/lib/medcheckwize-interpretation';
import {
  composeStateMedicareTitle,
  monthlyStackTier,
  MEDICARE_STACK_CROSSWALK_SOURCES,
} from '@/lib/crosswalk-medicare-stack';
import { MedicareCrossWalkBridge } from '@/components/MedicareCrossWalkBridge';
import { StateHeroImage } from '@/components/StateHeroImage';
import { getStateImageByName } from '@/lib/state-images';
import { calculateProprietaryMetrics } from '@/lib/proprietary-metrics';
import { ProprietaryMetricsBlock } from '@/components/upgrades/ProprietaryMetricsBlock';

export const dynamicParams = false;
export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllStateSlugs().map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) return {};
  // Phase 7 P1 — verdict-in-title surface. composeStateMedicareTitle yields
  // "{State}: ${stack}/mo Medicare ({Tier} #{rank}/{total})" (≤45 chars body
  // with the current 50-state cohort); the layout template appends
  // " | MedCheckWize" (15 chars) for a full title ≤60 chars (Massachusetts
  // worst case). 0/50 states exceed 70 chars per scripts/audit-phase7.ts.
  const stack = getMedicareStackIndex(state.abbr);
  const title = stack
    ? composeStateMedicareTitle(state.state, stack)
    : `Medicare & Medicaid Costs in ${state.state} (${state.abbr}) - ${getDataYear()}`;

  let description = `${state.state} Medicare spending: ${formatCurrency(state.avg_medicare_spending_per_capita)}/capita. Compare procedure costs, premiums, and coverage for ${formatNumber(state.medicare_enrollees)} beneficiaries.`;
  
  if (stack) {
    const medigap = classifyMedigapAccess(state.abbr);
    const acsMedian = ACS_B19013_2024_5YEAR[state.abbr] ?? 0;
    const irmaa = classifyIrmaaForState(acsMedian);
    const interpretation = interpretMedcheckwizeState({
      state,
      stack,
      medigap,
      irmaa,
    });
    const metrics = calculateProprietaryMetrics(
      state,
      stack,
      medigap,
      irmaa,
      interpretation.dominantSignal,
      slug
    );
    description = `[Medicare Affordability: ${metrics.stackAffordabilityScore}/100, Grade: ${metrics.overallGrade}] ` +
      `${state.state} Medicare stack: ${formatCurrency(stack.monthlyStackUsd)}/mo (Part B ${formatCurrency(stack.partBPremiumUsd)} + Part D ${formatCurrency(stack.partDPremiumUsd)} + Medigap ${formatCurrency(stack.medigapPremiumUsd)}). National rank ${stack.nationalRank} of ${stack.totalRanked}. CMS / KFF / NAIC / SSA cross-walk.`;
  }

  return {
    title,
    description,
    alternates: { canonical: `/state/${slug}/` },
    openGraph: { url: `/state/${slug}/` },
  };
}

export default async function StatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) notFound();

  const year = getDataYear();
  const procedures = getStateProcedures(state.abbr);
  const faqs = generateStateFAQs(state);
  const national = getNationalStats();
  const affordRank = getAffordabilityRank(state.abbr);
  const stateFacts = getStateFactsByAbbr(state.abbr);
  const commentary = stateFacts ? getStateCommentary(stateFacts) : null;
  const stackIndex = getMedicareStackIndex(state.abbr);
  const medigapAccess = classifyMedigapAccess(state.abbr);
  const acsMedian = ACS_B19013_2024_5YEAR[state.abbr] ?? 0;
  const irmaaApplication = classifyIrmaaForState(acsMedian);
  const interpretation = interpretMedcheckwizeState({
    state,
    stack: stackIndex,
    medigap: medigapAccess,
    irmaa: irmaaApplication,
  });

  const metrics = calculateProprietaryMetrics(
    state,
    stackIndex,
    medigapAccess,
    irmaaApplication,
    interpretation.dominantSignal,
    slug
  );

  // Group procedures by category
  const grouped: Record<string, typeof procedures> = {};
  for (const p of procedures) {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(datasetSchema({
            name: `Medicare & Medicaid Costs in ${state.state} (${year})`,
            description: `Medicare spending, procedure costs, premiums, and coverage data for ${state.state}. Per-capita spending: ${formatCurrency(state.avg_medicare_spending_per_capita)}.`,
            url: `https://medcheckwize.com/state/${slug}/`,
            vintage: STATE_VINTAGE,
            temporalCoverage: String(year),
            variableMeasured: [
              'Average Medicare spending per beneficiary',
              'Medicare beneficiary enrollment',
              'Medicaid & CHIP enrollment',
              'Medicaid expansion status',
              'Part B premium',
              'Part D average premium',
              'Medigap average premium',
              'Uninsured rate',
              'Per-procedure CMS allowed amount',
              'Per-procedure Medicare paid amount',
            ],
          })),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: state.state, url: `/state/${slug}/` },
      ])) }} />
      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />}
      {/* Phase 7 consolidated Dataset JSON-LD — emits the MedicareStackIndex
          cross-walk with FOUR distinct creator orgs as an array (CMS / KFF /
          NAIC / SSA) and variableMeasured PropertyValues that surface the
          verdict elements (TertileTier / NationalRank / MonthlyStackUsd) as
          schema-explicit values. The three lever-scoped Dataset blocks below
          keep their narrower scoped attribution. Trap #110/#117/#118. */}
      {stackIndex && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Dataset',
              name: `Medicare Stack Index Cross-Walk — ${state.state}`,
              description: `Composed Medicare premium stack for ${state.state}: CMS 2025 Part B federal premium + KFF Part D plan-landscape weighted-average + KFF Medigap rate-filings (Plan G age-65 baseline). Ranked nationally 1-${stackIndex.totalRanked} (1 = cheapest combined stack). Tertile-banded tier surfaces in page title.`,
              url: `https://medcheckwize.com/state/${slug}/#stack-cross-walk`,
              license: 'https://creativecommons.org/publicdomain/zero/1.0/',
              creator: MEDICARE_STACK_CROSSWALK_SOURCES.map((s) => ({
                '@type': 'Organization',
                name: s.name,
                url: s.url,
              })),
              publisher: {
                '@type': 'Organization',
                name: 'DataPeek Research Network',
                url: 'https://datapeekfacts.com',
              },
              temporalCoverage: String(year),
              dateModified: STATE_VINTAGE,
              isBasedOn: MEDICARE_STACK_CROSSWALK_SOURCES.map((s) => s.url),
              variableMeasured: [
                {
                  '@type': 'PropertyValue',
                  name: 'MonthlyStackUsd',
                  description: 'Composed monthly Medicare premium stack (Part B + Part D + Medigap)',
                  unitText: 'USD',
                  value: stackIndex.monthlyStackUsd,
                },
                {
                  '@type': 'PropertyValue',
                  name: 'NationalRank',
                  description: 'National rank of the composed stack (1 = cheapest; ranked across the 50 USPS states present in data/medicare.db)',
                  value: stackIndex.nationalRank,
                  maxValue: stackIndex.totalRanked,
                },
                {
                  '@type': 'PropertyValue',
                  name: 'AffordabilityScore',
                  description: 'Normalized affordability score (0-100, higher = more affordable)',
                  value: stackIndex.affordabilityScore,
                },
                {
                  '@type': 'PropertyValue',
                  name: 'TertileTier',
                  description: 'Tertile band of national rank (Low / Mid / High — ~17 states per band across the 50-state cohort; audit 2026-05-19: 17/17/16)',
                  value: monthlyStackTier(stackIndex.nationalRank, stackIndex.totalRanked),
                },
                {
                  '@type': 'PropertyValue',
                  name: 'PartBPremiumUsd',
                  description: 'Federal Part B premium (CMS 2025)',
                  unitText: 'USD',
                  value: stackIndex.partBPremiumUsd,
                },
                {
                  '@type': 'PropertyValue',
                  name: 'PartDPremiumUsd',
                  description: 'State-level Part D plan-landscape weighted-average premium (KFF 2025)',
                  unitText: 'USD',
                  value: stackIndex.partDPremiumUsd,
                },
                {
                  '@type': 'PropertyValue',
                  name: 'MedigapPremiumUsd',
                  description: 'State-level Medigap Plan G age-65 baseline premium (KFF rate-filings analysis)',
                  unitText: 'USD',
                  value: stackIndex.medigapPremiumUsd,
                },
                {
                  '@type': 'PropertyValue',
                  name: 'PctVsNationalMedian',
                  description: 'Signed percentage deviation from the national median monthly stack',
                  unitText: 'PCT',
                  value: stackIndex.pctVsNationalMedian,
                },
              ],
              distribution: {
                '@type': 'DataDownload',
                encodingFormat: 'text/html',
                contentUrl: `https://medcheckwize.com/state/${slug}/`,
              },
            }),
          }}
        />
      )}
      {/* Lever-card Dataset surfaces — each with creator override anchored to
          the primary data origin for that lever (Trap #105 honest attribution). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(datasetSchema({
            name: `Medicare Premium Stack Index — ${state.state}`,
            description: `Combined Part B + Part D + Plan G Medigap monthly premium stack for ${state.state} with national rank and affordability score. Sources: CMS (federal Part B) and KFF (state Part D + state Medigap).`,
            url: `https://medcheckwize.com/state/${slug}/#stack-index`,
            vintage: STATE_VINTAGE,
            temporalCoverage: String(year),
            variableMeasured: [
              'Part B federal premium',
              'Part D state weighted-average premium',
              'Medigap Plan G state age-65 baseline premium',
              'Monthly combined premium stack',
              'Annual combined premium stack',
              'National rank (1=cheapest)',
              'Affordability score (0–100)',
            ],
            creatorOverride: [
              { name: 'Centers for Medicare & Medicaid Services', url: 'https://www.cms.gov/' },
              { name: 'KFF Health Policy', url: 'https://www.kff.org/medicare/' },
            ],
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(datasetSchema({
            name: `Medigap Access Tier — ${state.state}`,
            description: `Federal §1395ss floor + state DOI overlay Medigap underwriting regime classification for ${state.state}. Anchored to 42 USC §1395ss, 42 CFR §403.205, and NAIC Model Regulation §6.`,
            url: `https://medcheckwize.com/state/${slug}/#medigap-access-tier`,
            vintage: STATE_VINTAGE,
            temporalCoverage: String(year),
            variableMeasured: [
              'Medigap underwriting tier (A-E)',
              'Regime (guaranteed-issue / community-rated / issue-age / attained-age)',
              'Birthday rule flag',
              'Open-enrollment window descriptor',
              'Federal anchor citation',
            ],
            creatorOverride: [
              { name: 'National Association of Insurance Commissioners (NAIC)', url: 'https://content.naic.org/' },
              { name: 'Centers for Medicare & Medicaid Services', url: 'https://www.cms.gov/' },
            ],
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(datasetSchema({
            name: `IRMAA Tier — ${state.state}`,
            description: `CMS-published 2026 Income-Related Monthly Adjustment Amount schedule applied to the ${state.state} statewide Census ACS B19013 median household income. Anchored to 42 USC §1395r(i) and 42 USC §1395w-113(a)(7).`,
            url: `https://medcheckwize.com/state/${slug}/#irmaa-tier`,
            vintage: STATE_VINTAGE,
            temporalCoverage: '2026',
            variableMeasured: [
              'Statewide ACS B19013 median household income (MAGI proxy)',
              'IRMAA bracket tier (0-5)',
              'Part B income-related surcharge (monthly USD)',
              'Part D income-related surcharge (monthly USD)',
              'Total annual IRMAA surcharge',
              'Federal anchor citation',
            ],
            creatorOverride: [
              { name: 'Centers for Medicare & Medicaid Services', url: 'https://www.cms.gov/' },
              { name: 'Social Security Administration', url: 'https://www.ssa.gov/' },
              { name: 'Internal Revenue Service', url: 'https://www.irs.gov/' },
            ],
          })),
        }}
      />

      <article data-toc-root>
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: state.state }]} />


        {(() => { const stateImage = getStateImageByName(state.state); return stateImage ? <StateHeroImage img={stateImage} /> : null; })()}

        <h1 className="text-3xl font-bold mb-2">Medicare &amp; Medicaid in {state.state} ({state.abbr})</h1>
        <p className="text-slate-600 mb-6">{year} healthcare costs, coverage, and spending data for {state.state}.</p>

        <TrustBlock
          sources={[
            { name: 'Centers for Medicare & Medicaid Services (CMS)', url: 'https://www.cms.gov/' },
            { name: 'KFF Health Policy', url: 'https://www.kff.org/' },
            { name: 'National Association of Insurance Commissioners (NAIC)', url: 'https://content.naic.org/' },
            { name: 'Social Security Administration (SSA)', url: 'https://www.ssa.gov/' }
          ]}
          updated={STATE_VINTAGE}
        />

        <ProprietaryMetricsBlock
          stackAffordabilityScore={metrics.stackAffordabilityScore}
          medigapAccessScore={metrics.medigapAccessScore}
          irmaaRiskScore={metrics.irmaaRiskScore}
          overallGrade={metrics.overallGrade}
          commentary={metrics.commentary}
        />

        <TableOfContents />

      {/* State Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-teal-700">{formatCurrency(state.avg_medicare_spending_per_capita)}</div>
          <div className="text-xs text-slate-500">Spending/Capita</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xl font-bold">{formatNumber(state.medicare_enrollees)}</div>
          <div className="text-xs text-slate-500">Medicare Enrollees</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xl font-bold">{formatNumber(state.medicaid_enrollees)}</div>
          <div className="text-xs text-slate-500">Medicaid Enrollees</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xl font-bold">{formatPercent(state.uninsured_rate)}</div>
          <div className="text-xs text-slate-500">Uninsured Rate</div>
        </div>
      </div>

      {commentary && (
        <section className="mb-6 space-y-2 text-sm text-slate-700 leading-relaxed">
          <p>{commentary.spendingSummary}</p>
          <p>{commentary.maMixSummary}</p>
          <p>{commentary.medigapAffordability}</p>
          <p>{commentary.coverageGap}</p>
        </section>
      )}

      <InsightBlock
        entityName={state.state}
        insights={getStateInsights(state, national, affordRank)}
      />

      {/* Premium Details */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">Medicare Premiums in {state.state}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="text-sm text-slate-500">Part B Premium</div>
            <div className="text-2xl font-bold">{formatCurrency(state.part_b_premium)}<span className="text-sm text-slate-400">/mo</span></div>
          </div>
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="text-sm text-slate-500">Part D Premium (Avg)</div>
            <div className="text-2xl font-bold">{formatCurrency(state.part_d_premium_avg)}<span className="text-sm text-slate-400">/mo</span></div>
          </div>
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="text-sm text-slate-500">Medigap Premium (Avg)</div>
            <div className="text-2xl font-bold">{formatCurrency(state.medigap_avg_premium)}<span className="text-sm text-slate-400">/mo</span></div>
          </div>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-slate-50 text-sm">
          <span className="font-medium">Medicaid Expansion:</span>{' '}
          {state.medicaid_expansion === 'yes' ? (
            <span className="text-green-600 font-medium">Yes - {state.state} expanded Medicaid under the ACA</span>
          ) : (
            <span className="text-red-600 font-medium">No - {state.state} has not expanded Medicaid</span>
          )}
        </div>
      </section>

      {stackIndex && <MedicareStackIndexCard data={stackIndex} />}

      <MedigapAccessTierCard state={state.state} data={medigapAccess} />
      <IrmaaTierCard state={state.state} data={irmaaApplication} />
      <MedcheckwizeInterpretationCard state={state.state} data={interpretation} />

      <MedicareCrossWalkBridge
        stateSlug={slug}
        stateAbbr={state.abbr}
        stateName={state.state}
      />

      <AdSlot id="state-mid" />

      <MedicareCostCalculator />

      {/* Procedure Costs by Category */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">Procedure Costs in {state.state}</h2>
        {Object.entries(grouped).map(([category, procs]) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-teal-700">{categoryLabel(category)}</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-3 py-2 font-medium">Procedure</th>
                    <th className="text-right px-3 py-2 font-medium">Avg Cost</th>
                    <th className="text-right px-3 py-2 font-medium">Medicare Pays</th>
                    <th className="text-right px-3 py-2 font-medium">You Pay</th>
                  </tr>
                </thead>
                <tbody>
                  {procs.map((p, i) => (
                    <tr key={p.procedure_slug} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      {/* HCU Phase C 2026-04-25: state×procedure leaf killed — link to /procedure/ hub */}
                      <td className="px-3 py-2">
                        <a href={`/procedure/${p.procedure_slug}/`} className="text-teal-600 hover:underline">{p.name}</a>
                      </td>
                      <td className="px-3 py-2 text-right">{formatCurrency(p.avg_cost)}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(p.medicare_pays)}</td>
                      <td className="px-3 py-2 text-right font-medium">{formatCurrency(p.patient_pays)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      {/* Compare With Other States — section killed 2026-04-25 HCU Phase C
          (/compare/{state-vs-state}/ → 410). State-to-state similarity already
          covered by "States with Similar Medicare Spending" section below. */}

      {/* Related Procedures */}
      {(() => {
        const topProcs = getTopProceduresByCategory(state.abbr, 8);
        if (topProcs.length === 0) return null;
        return (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3">Related Procedures in {state.state}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {/* HCU Phase C 2026-04-25: state×procedure leaf killed — link to /procedure/ hub */}
              {topProcs.map(p => (
                <a key={p.procedure_slug} href={`/procedure/${p.procedure_slug}/`}
                  className="block p-3 border border-slate-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors text-sm">
                  <span className="font-medium text-teal-700">{p.name}</span>
                  <span className="block text-xs text-slate-400 mt-1">{categoryLabel(p.category)} &middot; {formatCurrency(p.avg_cost)}</span>
                </a>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Similar Cost States */}
      {(() => {
        const similar = getSimilarSpendingStates(state.avg_medicare_spending_per_capita, state.abbr, 6);
        if (similar.length === 0) return null;
        return (
          <RelatedEntities
            entityName={state.state}
            items={similar.map(s => ({
              name: `${s.state} (${s.abbr})`,
              href: `/state/${s.slug}/`,
              stat: `${formatCurrency(s.avg_medicare_spending_per_capita)}/capita`
            }))}
            heading="States with Similar Medicare Spending"
          />
        );
      })()}

      <div className="flex items-center gap-4 mt-4">
        <CiteButton title={`Medicare & Medicaid Costs in ${state.state}`} url={`https://medcheckwize.com/state/${slug}/`} source="MedCheckWize (CMS.gov)" />
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 my-6 text-sm">
        <p className="text-slate-600">
          <strong>Related:</strong> <a href="https://eldercarepeek.com" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Senior care costs</a> and <a href="https://medcostpeek.com" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">global healthcare prices</a> comparison.
        </p>
      </div>

      <FeedbackButton pageId={slug} />

      {/* Related Data Resources */}
      <section className="mt-8 p-4 bg-slate-50 rounded-lg">
        <h3 className="text-sm font-semibold text-slate-500 mb-2">Related Data Resources</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          <a href="https://eldercarepeek.com" className="text-teal-600 hover:underline">ElderCarePeek - Senior care costs &rarr;</a>
          <a href="https://costbycity.com" className="text-teal-600 hover:underline">CostByCity - Cost of living &rarr;</a>
        </div>
      </section>

      <FAQ items={faqs} />

      {stateFacts && (
        <section className="mt-8 p-4 border border-slate-200 rounded-lg bg-white text-xs text-slate-600">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Data sources &amp; vintage for {state.state}
          </h3>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              <strong>Medicare beneficiaries</strong> ({formatNumber(stateFacts.medicare_enrollees)}):
              CMS Medicare Monthly Enrollment, {stateFacts.medicare_enrollees_year} Year aggregation
              ({formatNumber(stateFacts.medicare_original_benes)} Original Medicare,{" "}
              {formatNumber(stateFacts.medicare_advantage_benes)} MA &amp; other).
            </li>
            <li>
              <strong>Per-capita Medicare spending</strong> ({formatCurrency(stateFacts.avg_medicare_spending_per_capita)}):
              CMS Medicare Geographic Variation by State, {stateFacts.avg_medicare_spending_year}
              {" "}(latest released).
            </li>
            <li>
              <strong>Part B premium</strong> (${stateFacts.part_b_premium.toFixed(2)}/mo): federal
              flat rate, {stateFacts.part_b_premium_year} CMS schedule.
            </li>
            <li>
              <strong>Medicaid &amp; CHIP enrollees</strong> ({formatNumber(stateFacts.medicaid_enrollees)}):
              KFF analysis of CMS Performance Indicator data, September {stateFacts.medicaid_enrollees_year}.
            </li>
            <li>
              <strong>Medicaid expansion status</strong>: KFF tracker (December 2024).
            </li>
            <li>
              <strong>Part D average premium</strong> ({formatCurrency(stateFacts.part_d_premium_avg)}/mo):
              KFF analysis of CMS Part D plan landscape, {stateFacts.part_d_premium_avg_year}
              {" "}weighted PDP.
            </li>
            <li>
              <strong>Medigap average premium</strong> ({formatCurrency(stateFacts.medigap_avg_premium)}/mo):
              KFF analysis of CMS Medigap rate filings, {stateFacts.medigap_avg_premium_year}{" "}
              (Plan G, age 65 baseline).
            </li>
            <li>
              <strong>Uninsured rate</strong> ({formatPercent(stateFacts.uninsured_rate)}):
              U.S. Census Bureau ACS 1-Year Estimates, {stateFacts.uninsured_rate_year}.
            </li>
          </ul>
          <p className="mt-3">
            See <a href="/methodology/" className="text-teal-700 hover:underline">methodology</a>{" "}
            for cost figure sources, payment system details, and known limitations.
          </p>
        </section>
      )}

      <StateRich slug={slug} state={state} />

      <AuthorBox layer="state" showDisclaimer />
    </article>
    </>
  );
}
