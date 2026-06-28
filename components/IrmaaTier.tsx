/**
 * IrmaaTier — surfaces the IRMAA Part B + Part D surcharge applied to a
 * state's statewide median MAGI proxy on /state/[slug]/ pages. See
 * lib/irmaa-tier.ts for methodology.
 */

import type { IrmaaStateApplication } from '@/lib/irmaa-tier';
import { IRMAA_TIER_META } from '@/lib/irmaa-tier';
import { formatCurrency } from '@/lib/format';

interface Props {
  state: string;
  data: IrmaaStateApplication;
}

const TIER_COLORS: Record<number, { border: string; bg: string; pill: string; text: string }> = {
  0: { border: 'border-emerald-300', bg: 'bg-emerald-50', pill: 'bg-emerald-100 text-emerald-800', text: 'text-emerald-700' },
  1: { border: 'border-sky-300', bg: 'bg-sky-50', pill: 'bg-sky-100 text-sky-800', text: 'text-sky-700' },
  2: { border: 'border-amber-300', bg: 'bg-amber-50', pill: 'bg-amber-100 text-amber-800', text: 'text-amber-700' },
  3: { border: 'border-orange-300', bg: 'bg-orange-50', pill: 'bg-orange-100 text-orange-800', text: 'text-orange-700' },
  4: { border: 'border-rose-300', bg: 'bg-rose-50', pill: 'bg-rose-100 text-rose-800', text: 'text-rose-700' },
  5: { border: 'border-rose-400', bg: 'bg-rose-50', pill: 'bg-rose-200 text-rose-900', text: 'text-rose-800' },
};

export function IrmaaTierCard({ state, data }: Props) {
  const { statewideMedianMagi, magiTier, bracket, beneficiariesAboveTier1Pct, honestGap } = data;
  const meta = IRMAA_TIER_META[magiTier];
  const c = TIER_COLORS[magiTier];

  return (
    <section className={`mt-10 border ${c.border} ${c.bg} rounded-lg p-5`}>
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-2">
        <h2 className="text-xl font-bold">
          {state} IRMAA · Tier {magiTier}
        </h2>
        <span className={`text-xs px-2 py-0.5 rounded-full ${c.pill}`}>
          {meta.label}
        </span>
      </div>

      <p className={`text-sm leading-relaxed mb-4 ${c.text}`}>
        {meta.readerHelp}
      </p>

      <div className="grid gap-3 md:grid-cols-4 mb-4">
        <div className="border border-white bg-white/60 rounded-md p-3">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Statewide median household income</div>
          <div className="text-sm font-semibold text-slate-800 mt-0.5">
            {formatCurrency(statewideMedianMagi)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Census ACS B19013</div>
        </div>
        <div className="border border-white bg-white/60 rounded-md p-3">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Part B surcharge</div>
          <div className="text-sm font-semibold text-slate-800 mt-0.5">
            {formatCurrency(bracket.partBSurchargeUsd)}<span className="text-xs text-slate-500">/mo</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">2026 CMS schedule</div>
        </div>
        <div className="border border-white bg-white/60 rounded-md p-3">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Part D surcharge</div>
          <div className="text-sm font-semibold text-slate-800 mt-0.5">
            {formatCurrency(bracket.partDSurchargeUsd)}<span className="text-xs text-slate-500">/mo</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">2026 CMS schedule</div>
        </div>
        <div className="border border-white bg-white/60 rounded-md p-3">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Total annual IRMAA</div>
          <div className="text-sm font-semibold text-slate-800 mt-0.5">
            {formatCurrency(bracket.totalAnnualUsd)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {beneficiariesAboveTier1Pct === null
              ? 'Per affected beneficiary'
              : `~${beneficiariesAboveTier1Pct.toFixed(0)}% above Tier 1`}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed">
        <strong>Federal anchor:</strong> 42 USC §1395r(i) (Part B income-related
        premium) + 42 USC §1395w-113(a)(7) (Part D income-related premium).
        2026 brackets per CMS-published IRMAA schedule (Federal Register Vol 90
        + CMS Form CMS-10038). <em>{honestGap}</em>
      </p>
    </section>
  );
}
