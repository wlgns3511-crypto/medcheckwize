import type { Metadata } from 'next';
import { searchProcedures, getAllProcedures, getProcedureCategories } from '@/lib/db';
import { formatCurrency, categoryLabel } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Search Medicare Procedure Costs - Find What Medicare Pays',
  description: 'Search Medicare procedure costs by name or category. Find out what Medicare pays and your out-of-pocket costs for 100+ medical procedures across all 50 states.',
  alternates: { canonical: '/search/' },
  openGraph: { url: "/search/" },
};

const POPULAR_SEARCHES = [
  'hip replacement', 'knee replacement', 'cataract', 'colonoscopy',
  'MRI', 'cardiac', 'diabetes', 'cancer', 'physical therapy',
];

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '' } = await searchParams;
  const query = q.trim();

  const results = query.length >= 2 ? searchProcedures(query, 30) : [];
  const categories = getProcedureCategories();
  const featuredProcedures = !query ? getAllProcedures().slice(0, 12) : [];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Search Medicare Procedure Costs</h1>
      <p className="text-slate-600 mb-6">Find what Medicare pays and your estimated out-of-pocket costs for medical procedures.</p>

      {/* Search form */}
      <form method="GET" action="/search/" className="mb-8">
        <div className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by procedure name or category..."
            className="flex-1 border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            autoFocus={!query}
          />
          <button
            type="submit"
            className="bg-teal-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Category quick links */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-slate-500 mb-3">Browse by Category</p>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <a
              key={cat.category}
              href={`/search/?q=${encodeURIComponent(cat.category)}`}
              className="text-sm px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full hover:bg-teal-100 transition-colors"
            >
              {categoryLabel(cat.category)} ({cat.count})
            </a>
          ))}
        </div>
      </div>

      {/* Popular searches */}
      {!query && (
        <div className="mb-8">
          <p className="text-sm font-semibold text-slate-500 mb-3">Popular Searches</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map(term => (
              <a
                key={term}
                href={`/search/?q=${encodeURIComponent(term)}`}
                className="text-sm px-3 py-1.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-full hover:bg-slate-200 transition-colors"
              >
                {term}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {query.length >= 2 && (
        <div>
          <p className="text-sm text-slate-500 mb-4">
            {results.length > 0
              ? `Found ${results.length} procedure${results.length !== 1 ? 's' : ''} for "${query}"`
              : `No procedures found for "${query}"`}
          </p>

          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map(proc => (
                <a
                  key={proc.slug}
                  href={`/procedure/${proc.slug}/`}
                  className="block border border-slate-200 rounded-xl p-4 hover:border-teal-300 hover:bg-teal-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-slate-900">{proc.name}</div>
                    <span className="text-xs px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full ml-2 shrink-0">
                      {categoryLabel(proc.category)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                    <span>Avg Cost: <strong>{formatCurrency(proc.national_avg_cost)}</strong></span>
                    <span>Medicare Pays: <strong className="text-green-600">{formatCurrency(proc.medicare_pays)}</strong></span>
                    <span>Patient Pays: <strong className="text-amber-600">{formatCurrency(proc.patient_pays)}</strong></span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg mb-2">No procedures found</p>
              <p className="text-sm">Try a different procedure name or browse by category above</p>
            </div>
          )}
        </div>
      )}

      {query.length === 1 && (
        <p className="text-sm text-slate-500">Please enter at least 2 characters to search.</p>
      )}

      {/* Featured procedures when no query */}
      {!query && featuredProcedures.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Common Medicare Procedures</h2>
          <div className="space-y-3">
            {featuredProcedures.map(proc => (
              <a
                key={proc.slug}
                href={`/procedure/${proc.slug}/`}
                className="block border border-slate-200 rounded-xl p-4 hover:border-teal-300 hover:bg-teal-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-slate-900">{proc.name}</div>
                  <span className="text-xs px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full ml-2 shrink-0">
                    {categoryLabel(proc.category)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                  <span>Avg Cost: <strong>{formatCurrency(proc.national_avg_cost)}</strong></span>
                  <span>Medicare Pays: <strong className="text-green-600">{formatCurrency(proc.medicare_pays)}</strong></span>
                  <span>Patient Pays: <strong className="text-amber-600">{formatCurrency(proc.patient_pays)}</strong></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
