import type { Metadata } from "next";
import { getAllStates, getNationalStats, getTopSpendingStates } from "@/lib/db";
import { formatCurrency, formatNumber, formatCompact, getDataYear } from "@/lib/format";

export const metadata: Metadata = {
  title: "MedCheckWize - Costos de Medicare y Medicaid por Estado",
  description: "Compare costos de Medicare y Medicaid, procedimientos m&eacute;dicos y cobertura en los 50 estados de EE.UU.",
  alternates: {
    canonical: "/es/",
    languages: { en: "/", es: "/es/", "x-default": "/" },
  openGraph: { url: "/es/" },
},
};

export default function HomeEs() {
  const year = getDataYear();
  const stats = getNationalStats();
  const states = getAllStates();
  const topStates = getTopSpendingStates(10);

  return (
    <>
      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        Costos de Medicare y Medicaid por Estado ({year})
      </h1>
      <p className="text-slate-600 mb-2">
        Compare el gasto de Medicare, costos de procedimientos y cobertura en los 50 estados.
      </p>
      <p className="text-xs text-slate-400 mb-8">
        <a href="/" className="text-blue-500 hover:underline">English version</a>
      </p>

      {/* Resumen nacional */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-teal-700">{formatCompact(stats.total_medicare)}</div>
          <div className="text-xs text-slate-500 mt-1">Beneficiarios Medicare</div>
        </div>
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-teal-700">{formatCurrency(Math.round(stats.avg_spending))}</div>
          <div className="text-xs text-slate-500 mt-1">Gasto Promedio/Persona</div>
        </div>
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-teal-700">{formatCompact(stats.total_medicaid)}</div>
          <div className="text-xs text-slate-500 mt-1">Beneficiarios Medicaid</div>
        </div>
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-teal-700">{formatCurrency(stats.avg_part_b)}</div>
          <div className="text-xs text-slate-500 mt-1">Prima Parte B</div>
        </div>
      </section>

      {/* Mayor gasto */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Estados con Mayor Gasto por Persona</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Estado</th>
                <th className="text-right px-3 py-2 font-medium">Gasto/Persona</th>
                <th className="text-right px-3 py-2 font-medium">Beneficiarios</th>
              </tr>
            </thead>
            <tbody>
              {topStates.map((s, i) => (
                <tr key={s.abbr} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-3 py-2">
                    <a href={`/es/state/${s.slug}/`} className="text-teal-600 hover:underline">{s.state}</a>
                  </td>
                  <td className="px-3 py-2 text-right font-medium">{formatCurrency(s.avg_medicare_spending_per_capita)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(s.medicare_enrollees)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Todos los estados */}
      <section>
        <h2 className="text-xl font-bold mb-4">Todos los Estados</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {states.map((s) => (
            <a
              key={s.slug}
              href={`/es/state/${s.slug}/`}
              className="p-3 border border-slate-200 rounded-lg hover:border-teal-300 hover:shadow-sm transition-all text-center"
            >
              <div className="font-medium text-sm">{s.state}</div>
              <div className="text-xs text-slate-500 mt-1">{formatCurrency(s.avg_medicare_spending_per_capita)}/persona</div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
