import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllProcedureComparisonSlugs, getProcedureComparisonBySlug } from '@/lib/db';
import { formatCurrency } from '@/lib/format';
import { AdSlot } from '@/components/AdSlot';
import { Breadcrumb } from '@/components/Breadcrumb';

export const dynamicParams = true;
export const revalidate = false;

export async function generateStaticParams() {
  return getAllProcedureComparisonSlugs(20).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = getProcedureComparisonBySlug(slug);
  if (!data) return {};
  const { a, b } = data;
  return {
    title: `${a.name} vs ${b.name} - Medicare Cost Comparison`,
    description: `Compare Medicare costs: ${a.name} costs ${formatCurrency(a.national_avg_cost)} (Medicare pays ${formatCurrency(a.medicare_pays)}) vs ${b.name} costs ${formatCurrency(b.national_avg_cost)} (Medicare pays ${formatCurrency(b.medicare_pays)}).`,
    alternates: { canonical: `/procedure-compare/${slug}/` },
    openGraph: { url: `/procedure-compare/${slug}/` },
  };
}

export default async function ProcedureComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getProcedureComparisonBySlug(slug);
  if (!data) notFound();
  const { a, b } = data;

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Procedure Compare', href: '/procedure-compare/' },
    { label: `${a.name} vs ${b.name}`, href: `/procedure-compare/${slug}/` },
  ];

  const rows = [
    { label: 'Total Average Cost', aVal: formatCurrency(a.national_avg_cost), bVal: formatCurrency(b.national_avg_cost) },
    { label: 'Medicare Pays', aVal: formatCurrency(a.medicare_pays), bVal: formatCurrency(b.medicare_pays) },
    { label: 'Patient Pays', aVal: formatCurrency(a.patient_pays), bVal: formatCurrency(b.patient_pays) },
    { label: 'Category', aVal: a.category, bVal: b.category },
  ];

  const moreExpensive = a.national_avg_cost >= b.national_avg_cost ? a : b;
  const cheaper = a.national_avg_cost < b.national_avg_cost ? a : b;
  const diff = Math.abs(a.national_avg_cost - b.national_avg_cost);

  const faqs = [
    {
      q: `What is the cost difference between ${a.name} and ${b.name}?`,
      a: `${moreExpensive.name} costs ${formatCurrency(moreExpensive.national_avg_cost)} on average, while ${cheaper.name} costs ${formatCurrency(cheaper.national_avg_cost)} — a difference of ${formatCurrency(diff)}.`,
    },
    {
      q: `How much does Medicare pay for ${a.name} vs ${b.name}?`,
      a: `Medicare typically pays ${formatCurrency(a.medicare_pays)} for ${a.name} (patient owes ${formatCurrency(a.patient_pays)}). For ${b.name}, Medicare pays ${formatCurrency(b.medicare_pays)} (patient owes ${formatCurrency(b.patient_pays)}).`,
    },
    {
      q: `What is ${a.name}?`,
      a: a.description || `${a.name} is a medical procedure in the ${a.category} category with an average cost of ${formatCurrency(a.national_avg_cost)}.`,
    },
    {
      q: `What is ${b.name}?`,
      a: b.description || `${b.name} is a medical procedure in the ${b.category} category with an average cost of ${formatCurrency(b.national_avg_cost)}.`,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb items={breadcrumbs} />
      <h1 className="text-3xl font-bold mb-2 mt-4">{a.name} vs {b.name}</h1>
      <p className="text-slate-600 mb-8">Medicare Cost Comparison 2025</p>

      <AdSlot id="procedure-compare-top" />

      <div className="bg-teal-50 rounded-xl p-6 mb-8">
        <h2 className="font-semibold mb-2">Quick Answer</h2>
        <p className="text-slate-700">
          <strong>{a.name}</strong>: {formatCurrency(a.national_avg_cost)} total · Medicare pays {formatCurrency(a.medicare_pays)} · Patient pays {formatCurrency(a.patient_pays)}
        </p>
        <p className="text-slate-700 mt-2">
          <strong>{b.name}</strong>: {formatCurrency(b.national_avg_cost)} total · Medicare pays {formatCurrency(b.medicare_pays)} · Patient pays {formatCurrency(b.patient_pays)}
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Cost Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-3 text-left border border-slate-200">Metric</th>
                <th className="p-3 text-left border border-slate-200 text-teal-600">{a.name}</th>
                <th className="p-3 text-left border border-slate-200 text-teal-600">{b.name}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-3 border border-slate-200 font-medium">{row.label}</td>
                  <td className="p-3 border border-slate-200">{row.aVal}</td>
                  <td className="p-3 border border-slate-200">{row.bVal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot id="procedure-compare-mid" />

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">FAQ</h2>
        {faqs.map((faq, i) => (
          <details key={i} className="border border-slate-200 rounded-lg mb-2" open={i === 0}>
            <summary className="p-4 cursor-pointer font-medium">{faq.q}</summary>
            <div className="px-4 pb-4 text-slate-600 text-sm">{faq.a}</div>
          </details>
        ))}
      </section>

      <div className="flex gap-4 text-sm">
        <a href={`/procedure/${a.slug}/`} className="text-teal-600 hover:underline">View {a.name} →</a>
        <a href={`/procedure/${b.slug}/`} className="text-teal-600 hover:underline">View {b.name} →</a>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
      }) }} />
    </div>
  );
}
