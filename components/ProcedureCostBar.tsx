/** Pure CSS bar chart — no client JS, no recharts */
import { formatCurrency } from "@/lib/format";

export function ProcedureCostBar({
  procedureName,
  nationalAvg,
  stateData,
}: {
  procedureName: string;
  nationalAvg: number;
  stateData: { state_name: string; avg_cost: number; state_slug: string }[];
}) {
  // stateData is sorted most expensive first
  const top5Expensive = stateData.slice(0, 5);
  const top5Cheapest = [...stateData].slice(-5).reverse();

  const allShown = [...top5Expensive, ...top5Cheapest];
  const max = Math.max(...allShown.map((s) => s.avg_cost), nationalAvg) || 1;
  const natPct = Math.round((nationalAvg / max) * 100);

  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold mb-4">{procedureName} — Costliest vs. Cheapest States</h2>
      <div className="bg-white rounded-xl shadow p-6">
        {/* Most Expensive */}
        <h3 className="text-sm font-semibold text-red-600 mb-3 uppercase tracking-wide">Most Expensive</h3>
        <div className="space-y-3 mb-6">
          {top5Expensive.map((s) => {
            const pct = Math.round((s.avg_cost / max) * 100);
            return (
              <div key={s.state_slug}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{s.state_name}</span>
                  <span className="font-semibold">{formatCurrency(s.avg_cost)}</span>
                </div>
                <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: "#ef4444" }}
                  />
                  <div
                    className="absolute top-0 h-full border-r-2 border-dashed border-slate-500"
                    style={{ left: `${natPct}%` }}
                    title={`National avg: ${formatCurrency(nationalAvg)}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Least Expensive */}
        <h3 className="text-sm font-semibold text-green-600 mb-3 uppercase tracking-wide">Least Expensive</h3>
        <div className="space-y-3 mb-4">
          {top5Cheapest.map((s) => {
            const pct = Math.round((s.avg_cost / max) * 100);
            return (
              <div key={s.state_slug}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{s.state_name}</span>
                  <span className="font-semibold">{formatCurrency(s.avg_cost)}</span>
                </div>
                <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: "#22c55e" }}
                  />
                  <div
                    className="absolute top-0 h-full border-r-2 border-dashed border-slate-500"
                    style={{ left: `${natPct}%` }}
                    title={`National avg: ${formatCurrency(nationalAvg)}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <span className="inline-block w-4 border-t-2 border-dashed border-slate-500" /> National Avg ({formatCurrency(nationalAvg)})
          </span>
        </div>
      </div>
    </section>
  );
}
