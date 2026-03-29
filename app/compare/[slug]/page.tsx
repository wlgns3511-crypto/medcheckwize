import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllComparisonSlugs, getComparisonBySlug, getStateProcedures } from '@/lib/db';
import { formatCurrency, getDataYear } from '@/lib/format';
import { breadcrumbSchema, faqSchema, generateComparisonFAQs } from '@/lib/schema';
import { Breadcrumb } from '@/components/Breadcrumb';
import { StateComparisonTable } from '@/components/StateComparisonTable';
import { AdSlot } from '@/components/AdSlot';
import { FAQ } from '@/components/FAQ';
import { ComparisonBar } from '@/components/ComparisonBar';

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllComparisonSlugs().slice(0, 200).map(r => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pair = getComparisonBySlug(slug);
  if (!pair) return {};
  return {
    title: `${pair.a.state} vs ${pair.b.state} - Medicare & Healthcare Cost Comparison`,
    description: `Compare Medicare costs between ${pair.a.state} and ${pair.b.state}: spending per capita, premiums, procedure costs, and Medicaid coverage.`,
    alternates: { canonical: `/compare/${slug}/` },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pair = getComparisonBySlug(slug);
  if (!pair) notFound();

  const { a, b } = pair;
  const year = getDataYear();
  const faqs = generateComparisonFAQs(a, b);

  // Get top procedure comparisons
  const procsA = getStateProcedures(a.abbr).slice(0, 10);
  const procsB = getStateProcedures(b.abbr).slice(0, 10);

  // Build procedure comparison
  const procComparison: { name: string; slug: string; costA: number; costB: number }[] = [];
  for (const pa of procsA) {
    const pb = procsB.find(p => p.procedure_slug === pa.procedure_slug);
    if (pb) {
      procComparison.push({
        name: pa.name,
        slug: pa.procedure_slug,
        costA: pa.avg_cost,
        costB: pb.avg_cost,
      });
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Compare', url: '/' },
        { name: `${a.state} vs ${b.state}`, url: `/compare/${slug}/` },
      ])) }} />
      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />}

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Compare' }, { label: `${a.state} vs ${b.state}` }]} />

      <h1 className="text-3xl font-bold mb-2">{a.state} vs {b.state}: Medicare Costs ({year})</h1>
      <p className="text-slate-600 mb-6">Side-by-side comparison of Medicare spending, premiums, and healthcare coverage.</p>

      <StateComparisonTable a={a} b={b} />

      <AdSlot id="compare-mid" />

      {/* Visual Comparison Bars */}
      <section className="mt-8 mb-8">
        <h2 className="text-xl font-bold mb-3">Visual Cost Comparison</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", margin: "24px 0" }}>
          {a.avg_medicare_spending_per_capita != null && b.avg_medicare_spending_per_capita != null && (
            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Medicare Spending per Capita</h3>
              <ComparisonBar
                bars={[{ label: a.state, value: a.avg_medicare_spending_per_capita }, { label: b.state, value: b.avg_medicare_spending_per_capita }]}
                format={(v) => "$" + v.toLocaleString()}
              />
            </div>
          )}
          {a.part_b_premium != null && b.part_b_premium != null && (
            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Part B Monthly Premium</h3>
              <ComparisonBar
                bars={[{ label: a.state, value: a.part_b_premium }, { label: b.state, value: b.part_b_premium }]}
                format={(v) => "$" + v.toLocaleString()}
              />
            </div>
          )}
          {a.medigap_avg_premium != null && b.medigap_avg_premium != null && (
            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Average Medigap Premium</h3>
              <ComparisonBar
                bars={[{ label: a.state, value: a.medigap_avg_premium }, { label: b.state, value: b.medigap_avg_premium }]}
                format={(v) => "$" + v.toLocaleString()}
              />
            </div>
          )}
        </div>
      </section>

      {/* Procedure Cost Comparison */}
      {procComparison.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-3">Top Procedure Costs</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-teal-50">
                  <th className="text-left px-3 py-2 font-medium">Procedure</th>
                  <th className="text-right px-3 py-2 font-medium">{a.state}</th>
                  <th className="text-right px-3 py-2 font-medium">{b.state}</th>
                  <th className="text-right px-3 py-2 font-medium">Difference</th>
                </tr>
              </thead>
              <tbody>
                {procComparison.map((p, i) => {
                  const diff = p.costA - p.costB;
                  return (
                    <tr key={p.slug} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-3 py-2">
                        <a href={`/procedure/${p.slug}/`} className="text-teal-600 hover:underline">{p.name}</a>
                      </td>
                      <td className="px-3 py-2 text-right">{formatCurrency(p.costA)}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(p.costB)}</td>
                      <td className={`px-3 py-2 text-right font-medium ${diff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {diff > 0 ? '+' : ''}{formatCurrency(diff)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="flex gap-4 mt-6">
        <a href={`/state/${a.slug}/`} className="flex-1 text-center py-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-700 font-medium hover:bg-teal-100">
          View {a.state}
        </a>
        <a href={`/state/${b.slug}/`} className="flex-1 text-center py-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-700 font-medium hover:bg-teal-100">
          View {b.state}
        </a>
      </div>

      <FAQ items={faqs} />
    </>
  );
}
