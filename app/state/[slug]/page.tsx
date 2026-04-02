import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllStateSlugs, getStateBySlug, getStateProcedures, getComparisonLinksForState, getStateByAbbr, getNationalStats, getAffordabilityRank, getSimilarSpendingStates, getTopProceduresByCategory } from '@/lib/db';
import { formatCurrency, formatNumber, formatPercent, getDataYear, categoryLabel } from '@/lib/format';
import { breadcrumbSchema, faqSchema, generateStateFAQs } from '@/lib/schema';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AdSlot } from '@/components/AdSlot';
import { FAQ } from '@/components/FAQ';
import { CiteButton } from '@/components/CiteButton';
import { MedicareCostCalculator } from '@/components/MedicareCostCalculator';

export const dynamicParams = false;
export const revalidate = false;

export async function generateStaticParams() {
  return getAllStateSlugs().map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) return {};
  return {
    title: `Medicare & Medicaid Costs in ${state.state} (${state.abbr}) - ${getDataYear()}`,
    description: `${state.state} Medicare spending: ${formatCurrency(state.avg_medicare_spending_per_capita)}/capita. Compare procedure costs, premiums, and coverage for ${formatNumber(state.medicare_enrollees)} beneficiaries.`,
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
  const compLinks = getComparisonLinksForState(state.abbr, 8);
  const national = getNationalStats();
  const affordRank = getAffordabilityRank(state.abbr);
  const spendingDiff = ((state.avg_medicare_spending_per_capita - national.avg_spending) / national.avg_spending * 100);
  const premiumTotal = state.part_b_premium + state.part_d_premium_avg + state.medigap_avg_premium;
  const avgPremiumTotal = national.avg_part_b + national.avg_part_d + national.avg_medigap;

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
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": `Medicare & Medicaid Costs in ${state.state} (${year})`,
            "description": `Medicare spending, procedure costs, premiums, and coverage data for ${state.state}. Per-capita spending: ${formatCurrency(state.avg_medicare_spending_per_capita)}.`,
            "url": `https://medcheckwize.com/state/${slug}/`,
            "license": "https://creativecommons.org/publicdomain/zero/1.0/",
            "creator": { "@type": "Organization", "name": "DataPeek Facts", "url": "https://datapeekfacts.com" },
            "temporalCoverage": "2024/2026",
            "distribution": { "@type": "DataDownload", "encodingFormat": "text/html" }
          })
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: state.state, url: `/state/${slug}/` },
      ])) }} />
      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />}

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: state.state }]} />

      <h1 className="text-3xl font-bold mb-2">Medicare &amp; Medicaid in {state.state} ({state.abbr})</h1>
      <p className="text-slate-600 mb-6">{year} healthcare costs, coverage, and spending data for {state.state}.</p>

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

      {/* Data Insights */}
      <section className="mb-6 bg-teal-50 border border-teal-200 rounded-xl p-5">
        <h2 className="text-lg font-bold text-teal-900 mb-3">Key Insights</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-teal-600 mt-0.5">{spendingDiff > 0 ? '▲' : '▼'}</span>
            <p className="text-slate-700">
              Medicare spending in {state.state} is <strong className={spendingDiff > 0 ? 'text-red-700' : 'text-green-700'}>{Math.abs(spendingDiff).toFixed(1)}% {spendingDiff > 0 ? 'above' : 'below'}</strong> the national average of {formatCurrency(Math.round(national.avg_spending))}/capita.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-teal-600 mt-0.5">#</span>
            <p className="text-slate-700">
              {state.state} ranks <strong className="text-teal-700">#{affordRank} out of 50</strong> for Medicare affordability (lower spending = better rank).
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-teal-600 mt-0.5">$</span>
            <p className="text-slate-700">
              Total monthly premiums (B + D + Medigap) average <strong>{formatCurrency(Math.round(premiumTotal))}/mo</strong>, which is {premiumTotal < avgPremiumTotal ? <span className="text-green-700 font-medium">{formatCurrency(Math.round(avgPremiumTotal - premiumTotal))} less</span> : <span className="text-red-700 font-medium">{formatCurrency(Math.round(premiumTotal - avgPremiumTotal))} more</span>} than the national average.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-teal-600 mt-0.5">%</span>
            <p className="text-slate-700">
              Uninsured rate of <strong>{formatPercent(state.uninsured_rate)}</strong> is {state.uninsured_rate < national.avg_uninsured ? <span className="text-green-700 font-medium">{(national.avg_uninsured - state.uninsured_rate).toFixed(1)}pp below</span> : <span className="text-red-700 font-medium">{(state.uninsured_rate - national.avg_uninsured).toFixed(1)}pp above</span>} the national average of {formatPercent(national.avg_uninsured)}.
            </p>
          </div>
        </div>
      </section>

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
                  {procs.slice(0, 15).map((p, i) => (
                    <tr key={p.procedure_slug} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-3 py-2">
                        <a href={`/state/${slug}/${p.procedure_slug}/`} className="text-teal-600 hover:underline">{p.name}</a>
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

      {/* Compare with Other States */}
      {compLinks.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3">Compare {state.state} With Other States</h2>
          <div className="flex flex-wrap gap-2">
            {compLinks.map(link => {
              const other = getStateByAbbr(link.other);
              return other ? (
                <a key={link.slug} href={`/compare/${link.slug}/`} className="border border-slate-200 rounded-lg px-3 py-2 text-sm hover:border-teal-300 hover:bg-teal-50">
                  {state.state} vs {other.state}
                </a>
              ) : null;
            })}
          </div>
        </section>
      )}

      {/* Related Procedures */}
      {(() => {
        const topProcs = getTopProceduresByCategory(state.abbr, 8);
        if (topProcs.length === 0) return null;
        return (
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3">Related Procedures in {state.state}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {topProcs.map(p => (
                <a key={p.procedure_slug} href={`/state/${slug}/${p.procedure_slug}/`}
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
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-3">States with Similar Medicare Spending</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {similar.map(s => (
                <a key={s.slug} href={`/state/${s.slug}/`}
                  className="block p-3 border border-slate-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors text-sm">
                  <span className="font-medium text-teal-700">{s.state} ({s.abbr})</span>
                  <span className="block text-xs text-slate-400 mt-1">{formatCurrency(s.avg_medicare_spending_per_capita)}/capita</span>
                </a>
              ))}
            </div>
          </section>
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

      {/* Related Data Resources */}
      <section className="mt-8 p-4 bg-slate-50 rounded-lg">
        <h3 className="text-sm font-semibold text-slate-500 mb-2">Related Data Resources</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          <a href="https://eldercarepeek.com" className="text-teal-600 hover:underline">ElderCarePeek - Senior care costs &rarr;</a>
          <a href="https://costbycity.com" className="text-teal-600 hover:underline">CostByCity - Cost of living &rarr;</a>
        </div>
      </section>

      <FAQ items={faqs} />
    </>
  );
}
