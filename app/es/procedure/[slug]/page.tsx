import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllProcedureSlugs, getProcedureBySlug, getProcedureByState } from '@/lib/db';
import { formatCurrency, getDataYear, categoryLabel } from '@/lib/format';

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllProcedureSlugs().slice(0, 10).map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const proc = getProcedureBySlug(slug);
  if (!proc) return {};
  return {
    title: `${proc.name} - Costo con Medicare ${getDataYear()}`,
    description: `${proc.name} cuesta ${formatCurrency(proc.national_avg_cost)} en promedio. Medicare paga ${formatCurrency(proc.medicare_pays)}, el paciente paga ${formatCurrency(proc.patient_pays)}.`,
    alternates: {
      canonical: `/es/procedure/${slug}/`,
      languages: { en: `/procedure/${slug}/`, es: `/es/procedure/${slug}/`, 'x-default': `/procedure/${slug}/` },
    },
  };
}

export default async function ProcedurePageEs({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proc = getProcedureBySlug(slug);
  if (!proc) notFound();

  const year = getDataYear();
  const stateData = getProcedureByState(slug);

  const cheapest = stateData[stateData.length - 1];
  const mostExpensive = stateData[0];

  return (
    <>
      <nav className="text-sm text-slate-500 mb-4">
        <a href="/es/" className="hover:text-teal-600">Inicio</a>
        {' > '}
        <span>{proc.name}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Costo de {proc.name} con Medicare ({year})</h1>
      <p className="text-slate-600 mb-2">{proc.description}</p>
      <p className="text-xs text-slate-400 mb-6">
        <a href={`/procedure/${slug}/`} className="text-blue-500 hover:underline">English version</a>
      </p>

      {/* Resumen Nacional */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-teal-700">{formatCurrency(proc.national_avg_cost)}</div>
          <div className="text-xs text-slate-500">Costo Promedio</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-green-600">{formatCurrency(proc.medicare_pays)}</div>
          <div className="text-xs text-slate-500">Medicare Paga</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-amber-600">{formatCurrency(proc.patient_pays)}</div>
          <div className="text-xs text-slate-500">Usted Paga</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-sm font-medium">{categoryLabel(proc.category)}</div>
          <div className="text-xs text-slate-500">Categor&iacute;a</div>
        </div>
      </div>

      {/* Extremos */}
      {cheapest && mostExpensive && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="border border-red-100 bg-red-50 rounded-lg p-4">
            <div className="text-sm text-slate-500 mb-1">Estado M&aacute;s Caro</div>
            <div className="text-lg font-bold text-red-700">{mostExpensive.state_name}</div>
            <div className="text-sm">{formatCurrency(mostExpensive.avg_cost)}</div>
          </div>
          <div className="border border-green-100 bg-green-50 rounded-lg p-4">
            <div className="text-sm text-slate-500 mb-1">Estado M&aacute;s Barato</div>
            <div className="text-lg font-bold text-green-700">{cheapest.state_name}</div>
            <div className="text-sm">{formatCurrency(cheapest.avg_cost)}</div>
          </div>
        </div>
      )}

      {/* Tabla por Estado */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">Costo de {proc.name} por Estado</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-teal-50">
                <th className="text-left px-3 py-2 font-medium">#</th>
                <th className="text-left px-3 py-2 font-medium">Estado</th>
                <th className="text-right px-3 py-2 font-medium">Costo Prom.</th>
                <th className="text-right px-3 py-2 font-medium">Medicare Paga</th>
                <th className="text-right px-3 py-2 font-medium">Usted Paga</th>
              </tr>
            </thead>
            <tbody>
              {stateData.map((sp, i) => (
                <tr key={sp.state} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                  <td className="px-3 py-2">
                    <a href={`/es/state/${sp.state_slug}/`} className="text-teal-600 hover:underline font-medium">{sp.state_name}</a>
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
    </>
  );
}
