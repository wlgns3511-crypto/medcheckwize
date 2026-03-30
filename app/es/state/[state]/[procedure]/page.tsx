import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStateProcedureDetail, getAllStateProcedurePairs } from '@/lib/db';
import { formatCurrency, getDataYear } from '@/lib/format';

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllStateProcedurePairs().slice(0, 20).map(sp => ({
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
    title: `Costo de ${procedure.name} en ${state.state} - Medicare ${getDataYear()}`,
    description: `${procedure.name} cuesta ${formatCurrency(stateProcedure.avg_cost)} en ${state.state}. Medicare paga ${formatCurrency(stateProcedure.medicare_pays)}, usted paga ${formatCurrency(stateProcedure.patient_pays)}.`,
    alternates: {
      canonical: `/es/state/${stateSlug}/${procSlug}/`,
      languages: { en: `/state/${stateSlug}/${procSlug}/`, es: `/es/state/${stateSlug}/${procSlug}/`, 'x-default': `/state/${stateSlug}/${procSlug}/` },
    },
  };
}

export default async function StateProcedurePageEs({ params }: { params: Promise<{ state: string; procedure: string }> }) {
  const { state: stateSlug, procedure: procSlug } = await params;
  const data = getStateProcedureDetail(stateSlug, procSlug);
  if (!data) notFound();

  const { state, procedure, stateProcedure, allStates } = data;
  const year = getDataYear();

  const rank = allStates.findIndex(s => s.state === state.abbr) + 1;
  const diff = stateProcedure.avg_cost - procedure.national_avg_cost;
  const diffPct = ((diff / procedure.national_avg_cost) * 100).toFixed(1);

  return (
    <>
      <nav className="text-sm text-slate-500 mb-4">
        <a href="/es/" className="hover:text-teal-600">Inicio</a>
        {' > '}
        <a href={`/es/state/${state.slug}/`} className="hover:text-teal-600">{state.state}</a>
        {' > '}
        <span>{procedure.name}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Costo de {procedure.name} en {state.state} ({year})</h1>
      <p className="text-slate-600 mb-2">{procedure.description}</p>
      <p className="text-xs text-slate-400 mb-6">
        <a href={`/state/${stateSlug}/${procSlug}/`} className="text-blue-500 hover:underline">English version</a>
      </p>

      {/* Desglose */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-teal-700">{formatCurrency(stateProcedure.avg_cost)}</div>
          <div className="text-xs text-slate-500">Costo en {state.abbr}</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-green-600">{formatCurrency(stateProcedure.medicare_pays)}</div>
          <div className="text-xs text-slate-500">Medicare Paga</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-amber-600">{formatCurrency(stateProcedure.patient_pays)}</div>
          <div className="text-xs text-slate-500">Usted Paga</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-sm font-medium">#{rank} de 50</div>
          <div className="text-xs text-slate-500">M&aacute;s Caro</div>
        </div>
      </div>

      {/* vs Promedio Nacional */}
      <div className={`p-4 rounded-lg mb-6 ${diff > 0 ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}`}>
        <div className="text-sm">
          <span className="font-medium">{procedure.name}</span> en {state.state} cuesta{' '}
          <span className={`font-bold ${diff > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(Math.abs(diff))} {diff > 0 ? 'm\u00e1s' : 'menos'}
          </span>{' '}
          que el promedio nacional ({diffPct}%). Promedio nacional: {formatCurrency(procedure.national_avg_cost)}.
        </div>
      </div>

      {/* Tabla todos los estados */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">Costo de {procedure.name} en Todos los Estados</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-teal-50">
                <th className="text-left px-3 py-2 font-medium">#</th>
                <th className="text-left px-3 py-2 font-medium">Estado</th>
                <th className="text-right px-3 py-2 font-medium">Costo</th>
                <th className="text-right px-3 py-2 font-medium">Medicare Paga</th>
                <th className="text-right px-3 py-2 font-medium">Usted Paga</th>
              </tr>
            </thead>
            <tbody>
              {allStates.map((sp, i) => (
                <tr key={sp.state} className={`${sp.state === state.abbr ? 'bg-teal-50 font-medium' : i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                  <td className="px-3 py-2">
                    <a href={`/es/state/${sp.state_slug}/${procSlug}/`} className="text-teal-600 hover:underline">
                      {sp.state_name} {sp.state === state.abbr && '(actual)'}
                    </a>
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

      <div className="flex gap-4 mt-6">
        <a href={`/es/state/${state.slug}/`} className="flex-1 text-center py-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-700 font-medium hover:bg-teal-100">
          Procedimientos en {state.state}
        </a>
        <a href={`/es/procedure/${procSlug}/`} className="flex-1 text-center py-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-700 font-medium hover:bg-teal-100">
          {procedure.name} en Todos los Estados
        </a>
      </div>
    </>
  );
}
