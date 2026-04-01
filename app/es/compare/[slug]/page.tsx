import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllComparisonSlugs, getComparisonBySlug, getStateProcedures } from '@/lib/db';
import { formatCurrency, getDataYear } from '@/lib/format';

export const dynamicParams = true;
export const revalidate = false;

export async function generateStaticParams() {
  return getAllComparisonSlugs().slice(0, 10).map(r => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pair = getComparisonBySlug(slug);
  if (!pair) return {};
  return {
    title: `${pair.a.state} vs ${pair.b.state} - Costos de Medicare`,
    description: `Compare costos de Medicare entre ${pair.a.state} y ${pair.b.state}: gasto por persona, primas, procedimientos y Medicaid.`,
    alternates: {
      canonical: `/es/compare/${slug}/`,
      languages: { en: `/compare/${slug}/`, es: `/es/compare/${slug}/`, 'x-default': `/compare/${slug}/` },
    },
    openGraph: { url: `/es/compare/${slug}/` },
  };
}

export default async function ComparePageEs({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pair = getComparisonBySlug(slug);
  if (!pair) notFound();

  const { a, b } = pair;
  const year = getDataYear();

  const procsA = getStateProcedures(a.abbr).slice(0, 10);
  const procsB = getStateProcedures(b.abbr).slice(0, 10);

  const procComparison: { name: string; slug: string; costA: number; costB: number }[] = [];
  for (const pa of procsA) {
    const pb = procsB.find(p => p.procedure_slug === pa.procedure_slug);
    if (pb) {
      procComparison.push({ name: pa.name, slug: pa.procedure_slug, costA: pa.avg_cost, costB: pb.avg_cost });
    }
  }

  return (
    <>
      <nav className="text-sm text-slate-500 mb-4">
        <a href="/es/" className="hover:text-teal-600">Inicio</a>
        {' > '}
        <span>{a.state} vs {b.state}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">{a.state} vs {b.state}: Costos de Medicare ({year})</h1>
      <p className="text-slate-600 mb-2">Comparaci&oacute;n de gastos, primas y cobertura de Medicare.</p>
      <p className="text-xs text-slate-400 mb-6">
        <a href={`/compare/${slug}/`} className="text-blue-500 hover:underline">English version</a>
      </p>

      {/* Tabla comparativa */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-teal-50">
              <th className="text-left px-3 py-2 font-medium">M&eacute;trica</th>
              <th className="text-right px-3 py-2 font-medium">{a.state}</th>
              <th className="text-right px-3 py-2 font-medium">{b.state}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="px-3 py-2">Gasto Medicare por Persona</td>
              <td className="px-3 py-2 text-right font-medium">{formatCurrency(a.avg_medicare_spending_per_capita)}</td>
              <td className="px-3 py-2 text-right font-medium">{formatCurrency(b.avg_medicare_spending_per_capita)}</td>
            </tr>
            <tr className="bg-slate-50">
              <td className="px-3 py-2">Prima Parte B</td>
              <td className="px-3 py-2 text-right">{formatCurrency(a.part_b_premium)}/mes</td>
              <td className="px-3 py-2 text-right">{formatCurrency(b.part_b_premium)}/mes</td>
            </tr>
            <tr className="bg-white">
              <td className="px-3 py-2">Prima Medigap (Prom.)</td>
              <td className="px-3 py-2 text-right">{formatCurrency(a.medigap_avg_premium)}/mes</td>
              <td className="px-3 py-2 text-right">{formatCurrency(b.medigap_avg_premium)}/mes</td>
            </tr>
            <tr className="bg-slate-50">
              <td className="px-3 py-2">Tasa de No Asegurados</td>
              <td className="px-3 py-2 text-right">{(a.uninsured_rate * 100).toFixed(1)}%</td>
              <td className="px-3 py-2 text-right">{(b.uninsured_rate * 100).toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Procedimientos */}
      {procComparison.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-3">Costos de Procedimientos</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-teal-50">
                  <th className="text-left px-3 py-2 font-medium">Procedimiento</th>
                  <th className="text-right px-3 py-2 font-medium">{a.state}</th>
                  <th className="text-right px-3 py-2 font-medium">{b.state}</th>
                  <th className="text-right px-3 py-2 font-medium">Diferencia</th>
                </tr>
              </thead>
              <tbody>
                {procComparison.map((p, i) => {
                  const diff = p.costA - p.costB;
                  return (
                    <tr key={p.slug} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-3 py-2">{p.name}</td>
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
        <a href={`/es/state/${a.slug}/`} className="flex-1 text-center py-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-700 font-medium hover:bg-teal-100">
          Ver {a.state}
        </a>
        <a href={`/es/state/${b.slug}/`} className="flex-1 text-center py-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-700 font-medium hover:bg-teal-100">
          Ver {b.state}
        </a>
      </div>
    </>
  );
}
