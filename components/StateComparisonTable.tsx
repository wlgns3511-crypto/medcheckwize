import type { State } from '@/lib/db';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format';

export function StateComparisonTable({ a, b }: { a: State; b: State }) {
  const rows: { label: string; valA: string; valB: string; highlight?: 'lower' | 'higher' }[] = [
    { label: 'Medicare Spending/Capita', valA: formatCurrency(a.avg_medicare_spending_per_capita), valB: formatCurrency(b.avg_medicare_spending_per_capita) },
    { label: 'Medicare Enrollees', valA: formatNumber(a.medicare_enrollees), valB: formatNumber(b.medicare_enrollees) },
    { label: 'Medicaid Enrollees', valA: formatNumber(a.medicaid_enrollees), valB: formatNumber(b.medicaid_enrollees) },
    { label: 'Part B Premium', valA: formatCurrency(a.part_b_premium) + '/mo', valB: formatCurrency(b.part_b_premium) + '/mo' },
    { label: 'Part D Premium (Avg)', valA: formatCurrency(a.part_d_premium_avg) + '/mo', valB: formatCurrency(b.part_d_premium_avg) + '/mo' },
    { label: 'Medigap Premium (Avg)', valA: formatCurrency(a.medigap_avg_premium) + '/mo', valB: formatCurrency(b.medigap_avg_premium) + '/mo' },
    { label: 'Medicaid Expansion', valA: a.medicaid_expansion === 'yes' ? 'Yes' : 'No', valB: b.medicaid_expansion === 'yes' ? 'Yes' : 'No' },
    { label: 'Uninsured Rate', valA: formatPercent(a.uninsured_rate), valB: formatPercent(b.uninsured_rate) },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-teal-50">
            <th className="text-left px-4 py-3 font-medium text-slate-600">Metric</th>
            <th className="text-right px-4 py-3 font-medium text-teal-700">{a.state} ({a.abbr})</th>
            <th className="text-right px-4 py-3 font-medium text-teal-700">{b.state} ({b.abbr})</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="px-4 py-2.5 font-medium">{row.label}</td>
              <td className="px-4 py-2.5 text-right">{row.valA}</td>
              <td className="px-4 py-2.5 text-right">{row.valB}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
