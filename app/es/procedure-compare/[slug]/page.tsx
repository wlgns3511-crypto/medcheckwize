import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllProcedureComparisonSlugs, getProcedureComparisonBySlug } from '@/lib/db';
import { formatCurrency } from '@/lib/format';

export const dynamicParams = true;
export const revalidate = false;

export async function generateStaticParams() {
  return getAllProcedureComparisonSlugs(10).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = getProcedureComparisonBySlug(slug);
  if (!data) return {};
  const { a, b } = data;
  return {
    title: `${a.name} vs ${b.name} - Costos de Medicare`,
    description: `Compare costos de Medicare: ${a.name} cuesta ${formatCurrency(a.national_avg_cost)} vs ${b.name} cuesta ${formatCurrency(b.national_avg_cost)}.`,
    alternates: {
      canonical: `/es/procedure-compare/${slug}/`,
      languages: { en: `/procedure-compare/${slug}/`, es: `/es/procedure-compare/${slug}/`, 'x-default': `/procedure-compare/${slug}/` },
    },
  };
}

export default async function ProcedureComparePageEs({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getProcedureComparisonBySlug(slug);
  if (!data) notFound();
  const { a, b } = data;

  const moreExpensive = a.national_avg_cost >= b.national_avg_cost ? a : b;
  const cheaper = a.national_avg_cost < b.national_avg_cost ? a : b;
  const diff = Math.abs(a.national_avg_cost - b.national_avg_cost);

  const rows = [
    { label: 'Costo Total Promedio', aVal: formatCurrency(a.national_avg_cost), bVal: formatCurrency(b.national_avg_cost) },
    { label: 'Medicare Paga', aVal: formatCurrency(a.medicare_pays), bVal: formatCurrency(b.medicare_pays) },
    { label: 'Paciente Paga', aVal: formatCurrency(a.patient_pays), bVal: formatCurrency(b.patient_pays) },
    { label: 'Categor\u00eda', aVal: a.category, bVal: b.category },
  ];

  return (
    <>
      <nav className="text-sm text-slate-500 mb-4">
        <a href="/es/" className="hover:text-teal-600">Inicio</a>
        {' > '}
        <span>{a.name} vs {b.name}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">{a.name} vs {b.name}</h1>
      <p className="text-slate-600 mb-2">Comparaci&oacute;n de costos de Medicare</p>
      <p className="text-xs text-slate-400 mb-6">
        <a href={`/procedure-compare/${slug}/`} className="text-blue-500 hover:underline">English version</a>
      </p>

      {/* Resumen */}
      <div className="bg-teal-50 rounded-xl p-6 mb-8">
        <h2 className="font-semibold mb-2">Resumen</h2>
        <p className="text-slate-700">
          <strong>{a.name}</strong>: {formatCurrency(a.national_avg_cost)} total &middot; Medicare paga {formatCurrency(a.medicare_pays)} &middot; Paciente paga {formatCurrency(a.patient_pays)}
        </p>
        <p className="text-slate-700 mt-2">
          <strong>{b.name}</strong>: {formatCurrency(b.national_avg_cost)} total &middot; Medicare paga {formatCurrency(b.medicare_pays)} &middot; Paciente paga {formatCurrency(b.patient_pays)}
        </p>
      </div>

      {/* Tabla */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Comparaci&oacute;n de Costos</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-3 text-left border border-slate-200">M&eacute;trica</th>
                <th className="p-3 text-left border border-slate-200 text-teal-600">{a.name}</th>
                <th className="p-3 text-left border border-slate-200 text-teal-600">{b.name}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-3 border border-slate-200 font-medium">{row.label}</td>
                  <td className="p-3 border border-slate-200">{row.aVal}</td>
                  <td className="p-3 border border-slate-200">{row.bVal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Preguntas Frecuentes</h2>
        <details className="border border-slate-200 rounded-lg mb-2" open>
          <summary className="p-4 cursor-pointer font-medium">&iquest;Cu&aacute;l es la diferencia de costo?</summary>
          <div className="px-4 pb-4 text-slate-600 text-sm">
            {moreExpensive.name} cuesta {formatCurrency(moreExpensive.national_avg_cost)} en promedio, mientras que {cheaper.name} cuesta {formatCurrency(cheaper.national_avg_cost)} &mdash; una diferencia de {formatCurrency(diff)}.
          </div>
        </details>
        <details className="border border-slate-200 rounded-lg mb-2">
          <summary className="p-4 cursor-pointer font-medium">&iquest;Cu&aacute;nto paga Medicare por cada procedimiento?</summary>
          <div className="px-4 pb-4 text-slate-600 text-sm">
            Medicare paga {formatCurrency(a.medicare_pays)} por {a.name} (paciente paga {formatCurrency(a.patient_pays)}). Por {b.name}, Medicare paga {formatCurrency(b.medicare_pays)} (paciente paga {formatCurrency(b.patient_pays)}).
          </div>
        </details>
      </section>

      <div className="flex gap-4 text-sm">
        <a href={`/es/procedure/${a.slug}/`} className="text-teal-600 hover:underline">Ver {a.name} →</a>
        <a href={`/es/procedure/${b.slug}/`} className="text-teal-600 hover:underline">Ver {b.name} →</a>
      </div>
    </>
  );
}
