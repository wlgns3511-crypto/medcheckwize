/**
 * MedcheckwizeInterpretation — composite verdict surface on /state/[slug]/.
 * Synthesises MedicareStackIndex × MedigapAccessTier × IrmaaTier × Medicaid
 * expansion into a single dominant signal and a 4-paragraph reading.
 * See lib/medcheckwize-interpretation.ts for the priority ladder.
 */

import type { MedcheckwizeInterpretation } from '@/lib/medcheckwize-interpretation';
import { DOMINANT_SIGNAL_META } from '@/lib/medcheckwize-interpretation';

interface Props {
  state: string;
  data: MedcheckwizeInterpretation;
}

const COLOR_CLASSES: Record<string, { border: string; bg: string; pill: string; heading: string }> = {
  emerald: { border: 'border-emerald-300', bg: 'bg-emerald-50', pill: 'bg-emerald-100 text-emerald-800', heading: 'text-emerald-900' },
  sky: { border: 'border-sky-300', bg: 'bg-sky-50', pill: 'bg-sky-100 text-sky-800', heading: 'text-sky-900' },
  amber: { border: 'border-amber-300', bg: 'bg-amber-50', pill: 'bg-amber-100 text-amber-800', heading: 'text-amber-900' },
  rose: { border: 'border-rose-300', bg: 'bg-rose-50', pill: 'bg-rose-100 text-rose-800', heading: 'text-rose-900' },
  slate: { border: 'border-slate-300', bg: 'bg-slate-50', pill: 'bg-slate-100 text-slate-800', heading: 'text-slate-900' },
};

export function MedcheckwizeInterpretationCard({ state, data }: Props) {
  const { dominantSignal, verdict, paragraphs } = data;
  const meta = DOMINANT_SIGNAL_META[dominantSignal];
  const c = COLOR_CLASSES[meta.color] ?? COLOR_CLASSES.slate;

  return (
    <section className={`mt-10 border-2 ${c.border} ${c.bg} rounded-lg p-6`}>
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
        <h2 className={`text-2xl font-bold ${c.heading}`}>
          Composite reading for {state} · {meta.label}
        </h2>
        <span className={`text-xs px-2 py-0.5 rounded-full ${c.pill}`}>
          {dominantSignal}
        </span>
      </div>
      <p className={`text-base font-semibold leading-relaxed mb-4 ${c.heading}`}>
        {verdict}
      </p>
      <div className="space-y-3 text-sm leading-relaxed text-slate-700">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
        This composite is deterministic — it follows a priority ladder over the
        Medicare Stack Index, Medigap Access Tier (42 CFR §403.205), IRMAA
        Tier (42 USC §1395r(i) 2026 schedule), and the state's Medicaid
        expansion status. Read{' '}
        how the composite is built{' '}
        for the full methodology.
      </p>
    </section>
  );
}
