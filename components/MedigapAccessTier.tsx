/**
 * MedigapAccessTier — surfaces the state Medigap underwriting regime
 * (federal §1395ss floor + state DOI overlay) on /state/[slug]/ pages.
 * See lib/medigap-access-tier.ts for the methodology.
 */

import type { MedigapAccessClassification } from '@/lib/medigap-access-tier';
import { MEDIGAP_TIER_META } from '@/lib/medigap-access-tier';

interface Props {
  state: string;
  data: MedigapAccessClassification;
}

const TIER_COLORS: Record<MedigapAccessClassification['tier'], { border: string; bg: string; pill: string; text: string }> = {
  A: { border: 'border-emerald-300', bg: 'bg-emerald-50', pill: 'bg-emerald-100 text-emerald-800', text: 'text-emerald-700' },
  B: { border: 'border-sky-300', bg: 'bg-sky-50', pill: 'bg-sky-100 text-sky-800', text: 'text-sky-700' },
  C: { border: 'border-amber-300', bg: 'bg-amber-50', pill: 'bg-amber-100 text-amber-800', text: 'text-amber-700' },
  D: { border: 'border-slate-300', bg: 'bg-slate-50', pill: 'bg-slate-100 text-slate-800', text: 'text-slate-700' },
  E: { border: 'border-rose-300', bg: 'bg-rose-50', pill: 'bg-rose-100 text-rose-800', text: 'text-rose-700' },
};

export function MedigapAccessTierCard({ state, data }: Props) {
  const { tier, regime, birthdayRule, openEnrollmentWindow, anchor } = data;
  const meta = MEDIGAP_TIER_META[tier];
  const c = TIER_COLORS[tier];

  return (
    <section className={`mt-10 border ${c.border} ${c.bg} rounded-lg p-5`}>
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-2">
        <h2 className="text-xl font-bold">
          {state} Medigap Access · Tier {tier}
        </h2>
        <span className={`text-xs px-2 py-0.5 rounded-full ${c.pill}`}>
          {meta.label}
        </span>
      </div>

      <p className={`text-sm leading-relaxed mb-4 ${c.text}`}>
        {meta.readerHelp}
      </p>

      <div className="grid gap-3 md:grid-cols-3 mb-4">
        <div className="border border-white bg-white/60 rounded-md p-3">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Regime</div>
          <div className="text-sm font-semibold text-slate-800 mt-0.5">{regime}</div>
        </div>
        <div className="border border-white bg-white/60 rounded-md p-3">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Birthday rule</div>
          <div className="text-sm font-semibold text-slate-800 mt-0.5">
            {birthdayRule ? 'Yes — annual switching window' : 'No — federal OEP only'}
          </div>
        </div>
        <div className="border border-white bg-white/60 rounded-md p-3">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Switching window</div>
          <div className="text-sm font-semibold text-slate-800 mt-0.5">{openEnrollmentWindow}</div>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed">
        <strong>Federal anchor:</strong> {anchor}. Federal Medigap protections
        under 42 USC §1395ss guarantee a 6-month open enrollment period at
        Part B initial enrollment; ~12 states layer additional consumer
        protections via state insurance department rulemaking or statute.
      </p>
    </section>
  );
}
