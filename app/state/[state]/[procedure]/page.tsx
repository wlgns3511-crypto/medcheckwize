import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStateProcedureDetail, getAllStateProcedurePairs } from '@/lib/db';
import { formatCurrency, getDataYear, categoryLabel } from '@/lib/format';
import { breadcrumbSchema, faqSchema, generateStateProcedureFAQs } from '@/lib/schema';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AdSlot } from '@/components/AdSlot';
import { FAQ } from '@/components/FAQ';
import { EditorNote } from '@/components/EditorNote';
import { DidYouKnow } from '@/components/DidYouKnow';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { CrossSiteLinks } from '@/components/CrossSiteLinks';

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  // Pre-render a subset for ISR
  return getAllStateProcedurePairs().slice(0, 50).map(sp => ({
    state: sp.state_slug,
    procedure: sp.procedure_slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string; procedure: string }> }): Promise<Metadata> {
  const { state: stateSlug, procedure: procSlug } = await params;
  const data = getStateProcedureDetail(stateSlug, procSlug);
  if (!data) return {};
  const { state, procedure, stateProcedure } = data;
  return {
    title: `${procedure.name} Cost in ${state.state} - Medicare Coverage ${getDataYear()}`,
    description: `${procedure.name} costs ${formatCurrency(stateProcedure.avg_cost)} in ${state.state}. Medicare pays ${formatCurrency(stateProcedure.medicare_pays)}, you pay ${formatCurrency(stateProcedure.patient_pays)}.`,
    alternates: { canonical: `/state/${stateSlug}/${procSlug}/` },
  };
}

export default async function StateProcedurePage({ params }: { params: Promise<{ state: string; procedure: string }> }) {
  const { state: stateSlug, procedure: procSlug } = await params;
  const data = getStateProcedureDetail(stateSlug, procSlug);
  if (!data) notFound();

  const { state, procedure, stateProcedure, allStates } = data;
  const year = getDataYear();
  const faqs = generateStateProcedureFAQs(state, procedure, stateProcedure);

  // Find rank
  const rank = allStates.findIndex(s => s.state === state.abbr) + 1;
  const diff = stateProcedure.avg_cost - procedure.national_avg_cost;
  const diffPct = ((diff / procedure.national_avg_cost) * 100).toFixed(1);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        ...breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: state.state, url: `/state/${state.slug}/` },
          { name: procedure.name, url: `/state/${stateSlug}/${procSlug}/` },
        ]),
        dateModified: "2026-03-31",
        author: { "@type": "Organization", name: "DataPeek" },
      }) }} />
      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        ...faqSchema(faqs),
        dateModified: "2026-03-31",
        author: { "@type": "Organization", name: "DataPeek" },
      }) }} />}

      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: state.state, href: `/state/${state.slug}/` },
        { label: procedure.name },
      ]} />

      <h1 className="text-3xl font-bold mb-2">{procedure.name} Cost in {state.state} ({year})</h1>
      <p className="text-slate-600 mb-6">{procedure.description}</p>

      <EditorNote note={`In ${state.state}, ${procedure.name} costs ${diff > 0 ? `${diffPct}% above` : `${Math.abs(Number(diffPct))}% below`} the national average. Medicare covers ${formatCurrency(stateProcedure.medicare_pays)}, leaving patients responsible for ${formatCurrency(stateProcedure.patient_pays)} out-of-pocket.`} />

      {/* Cost Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-teal-700">{formatCurrency(stateProcedure.avg_cost)}</div>
          <div className="text-xs text-slate-500">Cost in {state.abbr}</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-green-600">{formatCurrency(stateProcedure.medicare_pays)}</div>
          <div className="text-xs text-slate-500">Medicare Pays</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-amber-600">{formatCurrency(stateProcedure.patient_pays)}</div>
          <div className="text-xs text-slate-500">You Pay</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-sm font-medium">#{rank} of 50</div>
          <div className="text-xs text-slate-500">Most Expensive</div>
        </div>
      </div>

      {/* vs National Average */}
      <div className={`p-4 rounded-lg mb-6 ${diff > 0 ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}`}>
        <div className="text-sm">
          <span className="font-medium">{procedure.name}</span> in {state.state} costs{' '}
          <span className={`font-bold ${diff > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(Math.abs(diff))} {diff > 0 ? 'more' : 'less'}
          </span>{' '}
          than the national average ({diffPct}%). National avg: {formatCurrency(procedure.national_avg_cost)}.
        </div>
      </div>

      <AdSlot id="sp-mid" />

      {/* All States Comparison */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">{procedure.name} Cost in All States</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-teal-50">
                <th className="text-left px-3 py-2 font-medium">#</th>
                <th className="text-left px-3 py-2 font-medium">State</th>
                <th className="text-right px-3 py-2 font-medium">Cost</th>
                <th className="text-right px-3 py-2 font-medium">Medicare Pays</th>
                <th className="text-right px-3 py-2 font-medium">You Pay</th>
              </tr>
            </thead>
            <tbody>
              {allStates.map((sp, i) => (
                <tr key={sp.state} className={`${sp.state === state.abbr ? 'bg-teal-50 font-medium' : i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                  <td className="px-3 py-2">
                    <a href={`/state/${sp.state_slug}/${procSlug}/`} className="text-teal-600 hover:underline">
                      {sp.state_name} {sp.state === state.abbr && '(current)'}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-right">{formatCurrency(sp.avg_cost)}</td>
                  <td className="px-3 py-2 text-right">{formatCurrency(sp.medicare_pays)}</td>
                  <td className="px-3 py-2 text-right">{formatCurrency(sp.patient_pays)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <DidYouKnow fact={`The average American spends over $12,500 per year on healthcare. In ${state.state}, ${procedure.name} ranks #${rank} out of 50 states by cost, with patients paying ${formatCurrency(stateProcedure.patient_pays)} after Medicare coverage.`} />

      {/* Links */}
      <div className="flex gap-4 mt-6">
        <a href={`/state/${state.slug}/`} className="flex-1 text-center py-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-700 font-medium hover:bg-teal-100">
          All {state.state} Procedures
        </a>
        <a href={`/procedure/${procSlug}/`} className="flex-1 text-center py-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-700 font-medium hover:bg-teal-100">
          {procedure.name} in All States
        </a>
      </div>

      <FAQ items={faqs} />

      <DataSourceBadge sources={[
        { name: "CMS", url: "https://www.cms.gov" },
        { name: "Healthcare.gov", url: "https://www.healthcare.gov" },
      ]} />

      <CrossSiteLinks current="MedCheckWize" />
    </>
  );
}
