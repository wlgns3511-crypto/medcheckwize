import { getAllStates, getNationalStats, getTopSpendingStates, getAllProcedures, getProcedureCategories } from '@/lib/db';
import { formatCurrency, formatNumber, formatPercent, formatCompact, categoryLabel, getDataYear } from '@/lib/format';
import { AdSlot } from '@/components/AdSlot';

export default function Home() {
  const year = getDataYear();
  const stats = getNationalStats();
  const states = getAllStates();
  const topStates = getTopSpendingStates(10);
  const categories = getProcedureCategories();
  const procedures = getAllProcedures();

  return (
    <>
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold mb-3">Medicare &amp; Medicaid Costs by State ({year})</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Compare Medicare spending, procedure costs, and healthcare coverage across all 50 US states.
          Find out what Medicare pays and what you owe.
        </p>
      </section>

      {/* National Overview Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-teal-700">{formatCompact(stats.total_medicare)}</div>
          <div className="text-xs text-slate-500 mt-1">Medicare Enrollees</div>
        </div>
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-teal-700">{formatCurrency(Math.round(stats.avg_spending))}</div>
          <div className="text-xs text-slate-500 mt-1">Avg Spending/Capita</div>
        </div>
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-teal-700">{formatCurrency(Math.round(stats.avg_part_b))}/mo</div>
          <div className="text-xs text-slate-500 mt-1">Avg Part B Premium</div>
        </div>
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-teal-700">{formatPercent(stats.avg_uninsured)}</div>
          <div className="text-xs text-slate-500 mt-1">Avg Uninsured Rate</div>
        </div>
      </section>

      <AdSlot id="home-top" />

      {/* Top Medicare Spending States */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Highest Medicare Spending States</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-teal-50">
                <th className="text-left px-4 py-2.5 font-medium">#</th>
                <th className="text-left px-4 py-2.5 font-medium">State</th>
                <th className="text-right px-4 py-2.5 font-medium">Spending/Capita</th>
                <th className="text-right px-4 py-2.5 font-medium">Enrollees</th>
                <th className="text-right px-4 py-2.5 font-medium">Uninsured</th>
              </tr>
            </thead>
            <tbody>
              {topStates.map((s, i) => (
                <tr key={s.abbr} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">
                    <a href={`/state/${s.slug}/`} className="text-teal-600 hover:underline font-medium">{s.state}</a>
                  </td>
                  <td className="px-4 py-2 text-right">{formatCurrency(s.avg_medicare_spending_per_capita)}</td>
                  <td className="px-4 py-2 text-right">{formatCompact(s.medicare_enrollees)}</td>
                  <td className="px-4 py-2 text-right">{formatPercent(s.uninsured_rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Procedure Cost Search by Category */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Procedure Costs by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {categories.map(cat => (
            <div key={cat.category} className="border border-slate-200 rounded-lg p-4">
              <div className="font-medium text-teal-700">{categoryLabel(cat.category)}</div>
              <div className="text-xs text-slate-500 mt-1">{cat.count} procedures</div>
              <div className="mt-2 space-y-1">
                {procedures.filter(p => p.category === cat.category).slice(0, 3).map(p => (
                  <a key={p.slug} href={`/procedure/${p.slug}/`} className="block text-xs text-slate-600 hover:text-teal-600 truncate">
                    {p.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <AdSlot id="home-mid" />

      {/* Browse by State */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Medicare Costs by State</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {states.map(s => (
            <a key={s.slug} href={`/state/${s.slug}/`} className="border border-slate-200 rounded-lg px-3 py-2 text-sm hover:border-teal-300 hover:bg-teal-50 transition-colors">
              <span className="font-medium">{s.state}</span>
              <span className="text-slate-400 ml-1">({s.abbr})</span>
            </a>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Quick Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a href="/calculator/" className="border border-teal-200 bg-teal-50 rounded-lg p-4 text-center hover:bg-teal-100 transition-colors">
            <div className="font-medium text-teal-700">Medicare Cost Calculator</div>
            <div className="text-xs text-slate-500 mt-1">Estimate your annual Medicare costs</div>
          </a>
          <a href="/compare/california-vs-florida/" className="border border-teal-200 bg-teal-50 rounded-lg p-4 text-center hover:bg-teal-100 transition-colors">
            <div className="font-medium text-teal-700">Compare States</div>
            <div className="text-xs text-slate-500 mt-1">Side-by-side healthcare cost comparison</div>
          </a>
          <a href="/procedure/total-knee-replacement/" className="border border-teal-200 bg-teal-50 rounded-lg p-4 text-center hover:bg-teal-100 transition-colors">
            <div className="font-medium text-teal-700">Popular Procedures</div>
            <div className="text-xs text-slate-500 mt-1">Browse common procedure costs</div>
          </a>
        </div>
      </section>
    </>
  );
}
