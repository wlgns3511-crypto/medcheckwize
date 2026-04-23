import {
  getAffordabilityRank,
  getNationalStats,
  getSimilarSpendingStates,
  getStateBySlug,
  getTopProceduresByCategory,
  type State,
} from '@/lib/db';
import { categoryLabel, formatCurrency, formatNumber, formatPercent } from '@/lib/format';

interface Props {
  slug: string;
  state?: State;
}

export function StateRich({ slug, state: initialState }: Props) {
  const state = initialState ?? getStateBySlug(slug);
  if (!state) return null;

  const national = getNationalStats();
  const affordabilityRank = getAffordabilityRank(state.abbr);
  const similarStates = getSimilarSpendingStates(state.avg_medicare_spending_per_capita, state.abbr, 4);
  const topProcedures = getTopProceduresByCategory(state.abbr, 4);

  if (similarStates.length === 0 && topProcedures.length === 0) return null;

  return (
    <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-bold text-slate-900">State Cost Context</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
        {state.state} spends {formatCurrency(state.avg_medicare_spending_per_capita)} per Medicare enrollee versus a
        national average of {formatCurrency(national.avg_spending)}. That places it roughly #{formatNumber(affordabilityRank)}
        on this site&apos;s affordability scale and helps frame whether procedure-level prices are unusually heavy or mostly
        in line with peers.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Category Cost Pressure</h3>
          <div className="mt-4 space-y-3">
            {topProcedures.map((procedure) => (
              <div key={procedure.procedure_slug} className="rounded-lg bg-slate-50 p-3">
                <div className="font-medium text-slate-900">{procedure.name}</div>
                <div className="text-xs text-slate-500">
                  {categoryLabel(procedure.category)} • avg cost {formatCurrency(procedure.avg_cost)}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Medicare pays {formatCurrency(procedure.medicare_pays)} • patient pays {formatCurrency(procedure.patient_pays)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Similar Spending States</h3>
          <div className="mt-4 space-y-3">
            {similarStates.map((peer) => (
              <div key={peer.slug} className="rounded-lg bg-slate-50 p-3">
                <div className="font-medium text-slate-900">{peer.state}</div>
                <div className="text-xs text-slate-500">
                  {formatCurrency(peer.avg_medicare_spending_per_capita)} per enrollee • {formatNumber(peer.medicare_enrollees)} Medicare enrollees
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  uninsured {formatPercent(peer.uninsured_rate)} • Part B {formatCurrency(peer.part_b_premium)}/mo
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900">How To Read This State</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          If the same procedure categories stay expensive while peer states remain cheaper, that is a stronger signal
          than statewide averages alone. Use the state page to frame the macro picture, then drill into procedure pages
          to see whether patient out-of-pocket pressure is broad or concentrated in a few categories.
        </p>
      </div>
    </section>
  );
}
