/**
 * MedicareStackIndex — surfaces the medcheckwize-unique "True Monthly
 * Medicare Cost" stack for a given state. See lib/medicare-stack.ts header
 * for the methodology. Rendered on /state/[slug]/ pages.
 */

import type { MedicareStackIndex as StackRow } from '@/lib/medicare-stack';
import { MEDICARE_STACK_META } from '@/lib/medicare-stack';
import { formatCurrency } from '@/lib/format';

interface Props {
  data: StackRow;
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function MedicareStackIndexCard({ data }: Props) {
  const {
    state,
    partBPremiumUsd,
    partDPremiumUsd,
    medigapPremiumUsd,
    monthlyStackUsd,
    annualStackUsd,
    nationalRank,
    totalRanked,
    affordabilityScore,
    pctVsNationalMedian,
    nationalMedianStackUsd,
  } = data;

  const directionLabel = pctVsNationalMedian >= 0 ? 'above' : 'below';
  const absPct = Math.abs(pctVsNationalMedian).toFixed(1);

  return (
    <section className="mt-12 border-t border-slate-200 pt-8">
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-2">
        <h2 className="text-xl font-bold">{state} Medicare Premium Stack Index</h2>
        <span className="text-xs text-slate-500">
          MedCheckWize-original metric · Sources: CMS + KFF
        </span>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed mb-5">
        Most cost guides quote a single Medicare premium. The reality is a
        stack: Original Medicare beneficiaries pay the federal{' '}
        <strong>Part B premium</strong>, plus a state-level average{' '}
        <strong>Part D</strong> drug-plan premium, plus a state-level average{' '}
        <strong>Medigap</strong> supplemental premium. This index sums those
        three components and ranks {state} against the rest of the country.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="border border-slate-200 rounded-lg p-4 bg-white">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Part B (federal)</div>
          <div className="text-2xl font-bold text-slate-900">
            {formatCurrency(partBPremiumUsd)}
            <span className="text-sm font-normal text-slate-500">/mo</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Standard premium 2025</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-4 bg-white">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Part D (state avg)</div>
          <div className="text-2xl font-bold text-slate-900">
            {formatCurrency(partDPremiumUsd)}
            <span className="text-sm font-normal text-slate-500">/mo</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Standalone PDP weighted average</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-4 bg-white">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Medigap (state avg)</div>
          <div className="text-2xl font-bold text-slate-900">
            {formatCurrency(medigapPremiumUsd)}
            <span className="text-sm font-normal text-slate-500">/mo</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Plan G monthly, age-65 baseline</div>
        </div>
        <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
          <div className="text-xs text-emerald-700 uppercase tracking-wide mb-1">Total monthly stack</div>
          <div className="text-2xl font-bold text-emerald-700">
            {formatCurrency(monthlyStackUsd)}
            <span className="text-sm font-normal text-emerald-600">/mo</span>
          </div>
          <div className="text-xs text-emerald-700 mt-1">{formatCurrency(annualStackUsd)}/year combined</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="border border-slate-200 rounded-lg p-4 bg-white">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">National rank</div>
          <div className="text-2xl font-bold text-slate-900">
            {ordinal(nationalRank)}
            <span className="text-sm font-normal text-slate-500"> of {totalRanked}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">1 = cheapest combined premium stack</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-4 bg-white">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Affordability score</div>
          <div className="text-2xl font-bold text-slate-900">
            {affordabilityScore}
            <span className="text-sm font-normal text-slate-500">/100</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Higher = cheaper relative to the country</div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700 leading-relaxed">
        <strong>What the stack means in {state}:</strong> a single Original Medicare
        beneficiary with a Part D plan and Plan G Medigap pays roughly{' '}
        <strong>{formatCurrency(monthlyStackUsd)}/month</strong>{' '}
        ({formatCurrency(annualStackUsd)}/year) before any covered service is
        used — that&apos;s {absPct}% {directionLabel} the national median of{' '}
        {formatCurrency(nationalMedianStackUsd)}/month. This is the income
        side of Medicare cost; service-level patient cost-share for individual
        procedures is shown separately in each procedure page.
      </div>

      <details className="mt-4 text-xs text-slate-500">
        <summary className="cursor-pointer hover:text-slate-700">
          How the stack is calculated
        </summary>
        <div className="mt-2 leading-relaxed space-y-1.5 pl-4">
          <div>
            <strong>Part B premium</strong> ({MEDICARE_STACK_META.partBVintage}) — federal
            standard rate {formatCurrency(partBPremiumUsd)}/mo (
            <a
              className="underline"
              href={MEDICARE_STACK_META.partBSourceUrl}
              rel="noopener"
              target="_blank"
            >
              CMS
            </a>
            ). Higher-income IRMAA brackets are not modelled.
          </div>
          <div>
            <strong>Part D premium</strong> ({MEDICARE_STACK_META.partDVintage}) —{' '}
            {state} weighted-average standalone PDP {formatCurrency(partDPremiumUsd)}/mo (
            <a
              className="underline"
              href={MEDICARE_STACK_META.partDSourceUrl}
              rel="noopener"
              target="_blank"
            >
              KFF
            </a>
            ).
          </div>
          <div>
            <strong>Medigap premium</strong> ({MEDICARE_STACK_META.medigapVintage}) —{' '}
            {state} Plan G monthly average, age-65 baseline {formatCurrency(medigapPremiumUsd)}/mo (
            <a
              className="underline"
              href={MEDICARE_STACK_META.medigapSourceUrl}
              rel="noopener"
              target="_blank"
            >
              KFF
            </a>
            ).
          </div>
          <div className="text-slate-400 pt-1">
            The stack assumes Original Medicare with Part D + Plan G Medigap.
            Medicare Advantage plans bundle Part D and often have lower or $0
            premiums but constrain provider networks; they aren&apos;t included
            in this stack. Affordability score normalises monthly stack to the
            national min/max range (cheapest state = 100, most expensive = 0).
          </div>
        </div>
      </details>
    </section>
  );
}
