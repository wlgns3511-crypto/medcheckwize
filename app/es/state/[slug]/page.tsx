import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllStateSlugs, getStateBySlug, getStateProcedures } from "@/lib/db";
import { formatCurrency, formatNumber, formatPercent, getDataYear, categoryLabel } from "@/lib/format";

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return getAllStateSlugs().slice(0, 300).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) return {};
  return {
    title: `Costos de Medicare y Medicaid en ${state.state} (${state.abbr})`,
    description: `Gasto de Medicare en ${state.state}: ${formatCurrency(state.avg_medicare_spending_per_capita)}/persona. Costos de procedimientos, primas y cobertura.`,
    alternates: {
      canonical: `/es/state/${slug}/`,
      languages: { en: `/state/${slug}/`, es: `/es/state/${slug}/`, "x-default": `/state/${slug}/` },
    },
  };
}

export default async function StatePageEs({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) notFound();

  const year = getDataYear();
  const procedures = getStateProcedures(state.abbr);

  const grouped: Record<string, typeof procedures> = {};
  for (const p of procedures) {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  }

  return (
    <>
      <nav className="text-sm text-slate-500 mb-4">
        <a href="/es/" className="hover:text-teal-600">Inicio</a>
        {" > "}
        <span>{state.state}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Medicare y Medicaid en {state.state} ({state.abbr})</h1>
      <p className="text-slate-600 mb-2">
        Costos m&eacute;dicos, cobertura y gasto de {year} para {state.state}.
      </p>
      <p className="text-xs text-slate-400 mb-6">
        <a href={`/state/${slug}/`} className="text-blue-500 hover:underline">English version</a>
      </p>

      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-teal-700">{formatCurrency(state.avg_medicare_spending_per_capita)}</div>
          <div className="text-xs text-slate-500">Gasto por Persona</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xl font-bold">{formatNumber(state.medicare_enrollees)}</div>
          <div className="text-xs text-slate-500">Beneficiarios Medicare</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xl font-bold">{formatNumber(state.medicaid_enrollees)}</div>
          <div className="text-xs text-slate-500">Beneficiarios Medicaid</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xl font-bold">{formatPercent(state.uninsured_rate)}</div>
          <div className="text-xs text-slate-500">Tasa de No Asegurados</div>
        </div>
      </div>

      {/* Primas */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">Primas de Medicare en {state.state}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="text-sm text-slate-500">Prima Parte B</div>
            <div className="text-2xl font-bold">{formatCurrency(state.part_b_premium)}<span className="text-sm text-slate-400">/mes</span></div>
          </div>
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="text-sm text-slate-500">Prima Parte D (Prom.)</div>
            <div className="text-2xl font-bold">{formatCurrency(state.part_d_premium_avg)}<span className="text-sm text-slate-400">/mes</span></div>
          </div>
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="text-sm text-slate-500">Prima Medigap (Prom.)</div>
            <div className="text-2xl font-bold">{formatCurrency(state.medigap_avg_premium)}<span className="text-sm text-slate-400">/mes</span></div>
          </div>
        </div>
      </section>

      {/* Costos de procedimientos */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3">Costos de Procedimientos en {state.state}</h2>
        {Object.entries(grouped).slice(0, 3).map(([category, procs]) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-teal-700">{categoryLabel(category)}</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-3 py-2 font-medium">Procedimiento</th>
                    <th className="text-right px-3 py-2 font-medium">Costo Prom.</th>
                    <th className="text-right px-3 py-2 font-medium">Medicare Paga</th>
                    <th className="text-right px-3 py-2 font-medium">Usted Paga</th>
                  </tr>
                </thead>
                <tbody>
                  {procs.slice(0, 10).map((p, i) => (
                    <tr key={p.procedure_slug} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="px-3 py-2">{p.name}</td>
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

      <section className="mt-8 p-4 bg-slate-50 rounded-lg">
        <h3 className="text-sm font-semibold text-slate-500 mb-2">Recursos Relacionados</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          <a href="https://eldercarepeek.com" className="text-teal-600 hover:underline">Costos de Cuidado de Ancianos</a>
          <a href="https://costbycity.com" className="text-teal-600 hover:underline">Costo de Vida</a>
        </div>
      </section>
    </>
  );
}
