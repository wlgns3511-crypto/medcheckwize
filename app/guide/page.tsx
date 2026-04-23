import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllGuides } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Preventive Care Guides — USPSTF, ACA Coverage, Cancer Screening, Wellness Tests',
  description: 'In-depth guides on US preventive care: USPSTF recommendations by age, what ACA covers free, cancer screening cost-benefit, executive physicals, and the wellness industry trap.',
  alternates: { canonical: '/guide/' },
  openGraph: { title: 'Preventive Care Guides', description: 'Authoritative guides on US preventive care and screening evidence.', url: '/guide/' },
};

export default function GuidesIndex() {
  const guides = getAllGuides();

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'MedCheckWize Guides',
            url: 'https://medcheckwize.com/guide/',
            numberOfItems: guides.length,
            itemListElement: guides.map((g, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: g.title,
              url: `https://medcheckwize.com/guide/${g.slug}/`,
            })),
          }),
        }}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Preventive Care Guides</h1>
        <p className="text-slate-600 max-w-3xl">
          Long-form, evidence-based guides on US preventive care. USPSTF recommendations by age,
          what's covered free under ACA, cancer screening cost-benefit (which tests save lives
          versus cause harm), executive physicals, and how to avoid the wellness industry's
          biomarker testing trap.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guide/${g.slug}/`}
            className="block rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50 p-5 transition-colors"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-1">{g.category}</div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">{g.title}</h2>
            <p className="text-sm text-slate-600">{g.description}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12 p-6 rounded-xl bg-slate-50 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Look up real costs</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/state/california/" className="text-teal-700 hover:underline font-medium">By state →</Link>
            <span className="text-slate-500"> screening costs by state</span>
          </li>
          <li>
            <Link href="/procedure/colonoscopy/" className="text-teal-700 hover:underline font-medium">By procedure →</Link>
            <span className="text-slate-500"> common screening procedures</span>
          </li>
          <li>
            <Link href="/calculator/" className="text-teal-700 hover:underline font-medium">Cost calculator →</Link>
            <span className="text-slate-500"> estimate for your situation</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
