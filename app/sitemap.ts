import type { MetadataRoute } from 'next';
import { getAllStateSlugs, getAllProcedureSlugs, getAllComparisonSlugs, getAllStateProcedurePairs, getAllProcedureComparisonSlugs } from '@/lib/db';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://medcheckwize.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${SITE_URL}/calculator/`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/about/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/contact/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const states = getAllStateSlugs().map(s => ({
    url: `${SITE_URL}/state/${s.slug}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8,
  }));

  const procedures = getAllProcedureSlugs().map(p => ({
    url: `${SITE_URL}/procedure/${p.slug}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7,
  }));

  const stateProcedures = getAllStateProcedurePairs().map(sp => ({
    url: `${SITE_URL}/state/${sp.state_slug}/${sp.procedure_slug}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6,
  }));

  const comparisons = getAllComparisonSlugs().map(c => ({
    url: `${SITE_URL}/compare/${c.slug}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5,
  }));

  const procedureComparisons = getAllProcedureComparisonSlugs(12720).map((c) => ({
    url: `${SITE_URL}/procedure-compare/${c.slug}/`,
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...states, ...procedures, ...stateProcedures, ...comparisons, ...procedureComparisons];
}
