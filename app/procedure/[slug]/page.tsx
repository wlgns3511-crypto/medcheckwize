import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllProcedureSlugs, getProcedureBySlug, getProcedureByState, getRelatedProcedures } from '@/lib/db';
import { formatCurrency, getDataYear, categoryLabel } from '@/lib/format';
import { breadcrumbSchema, faqSchema, generateProcedureFAQs } from '@/lib/schema';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AdSlot } from '@/components/AdSlot';
import { FAQ } from '@/components/FAQ';
import { AuthorBox } from '@/components/AuthorBox';

export const dynamicParams = true;
export const revalidate = false;

export async function generateStaticParams() {
  return getAllProcedureSlugs().slice(0, 20).map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const proc = getProcedureBySlug(slug);
  if (!proc) return {};
  return {
    title: `${proc.name} Cost with Medicare - ${getDataYear()} Average Prices`,
    description: `${proc.name} costs ${formatCurrency(proc.national_avg_cost)} on average. Medicare pays ${formatCurrency(proc.medicare_pays)}, patient pays ${formatCurrency(proc.patient_pays)}. Compare costs across all 50 states.`,
    alternates: { canonical: `/procedure/${slug}/` },
  };
}

export default async function ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proc = getProcedureBySlug(slug);
  if (!proc) notFound();

  const year = getDataYear();
  const stateData = getProcedureByState(slug);
  const faqs = generateProcedureFAQs(proc);

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

      <h1 className="text-3xl font-bold mb-2">{proc.name} Cost with Medicare ({year})</h1>
      <p className="text-slate-600 mb-6">{proc.description}</p>

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

      {(() => {
        const related = getRelatedProcedures(proc.category, slug, 6);
        if (!related.length) return null;
        return (
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-3">Related {categoryLabel(proc.category)} Procedures</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {related.map(r => (
                <a key={r.slug} href={`/procedure/${r.slug}/`} className="block p-3 border rounded-lg hover:bg-teal-50 text-sm">
                  <span className="font-medium text-teal-700">{r.name}</span>
                  <span className="block text-slate-500 mt-1">{formatCurrency(r.national_avg_cost)} avg</span>
                </a>
              ))}
            </div>
          </section>
        );
      })()}

      <AuthorBox />

      <FAQ items={faqs} />
    </>
  );
}
