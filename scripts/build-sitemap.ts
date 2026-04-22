#!/usr/bin/env tsx
/**
 * build-sitemap.ts — medcheckwize static sitemap generator.
 *
 * PRUNING HISTORY (post-HCU March 2026):
 *   Pre-prune: ~16,870 URLs. /es/* tree × 8,210 thin Spanish translation
 *              over identical medical cost data.
 *   2026-04-22: Option B+ prune. DROP /es/* entirely. KEEP the full
 *              /state/[slug]/[procedure]/ matrix (8,000 URLs) — that IS
 *              the product (cost of procedure X in state Y).
 *              Route stays live via dynamicParams — existing URLs remain 200.
 *
 * USAGE:
 *   npx tsx scripts/build-sitemap.ts
 */
import * as fs from 'fs';
import * as path from 'path';

const SITE_URL = 'https://medcheckwize.com';
const NOW = new Date().toISOString().split('T')[0];
const SHARD_SIZE = 40000;
const OUT_DIR = path.resolve(__dirname, '..', 'public');

interface Entry { url: string; lastmod?: string; priority?: string; changefreq?: string; }

function urlTag(e: Entry): string {
  return `  <url><loc>${e.url}</loc><lastmod>${e.lastmod ?? NOW}</lastmod><changefreq>${e.changefreq ?? 'monthly'}</changefreq><priority>${e.priority ?? '0.6'}</priority></url>`;
}

function writeShard(id: number, entries: Entry[]) {
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + entries.map(urlTag).join('\n') + '\n</urlset>\n';
  fs.writeFileSync(path.join(OUT_DIR, `sitemap-${id}.xml`), xml);
}

const seen = new Set<string>();
const entries: Entry[] = [];
function add(e: Entry) { if (!seen.has(e.url)) { seen.add(e.url); entries.push(e); } }

// ── Load DB ──────────────────────────────────────────────────────────────────
import Database from 'better-sqlite3';
const db = new Database(path.resolve(__dirname, '..', 'data', 'medicare.db'), { readonly: true });

const states = (db.prepare('SELECT slug FROM states').all() as { slug: string }[]).map(r => r.slug);
const procedures = (db.prepare('SELECT slug FROM procedures').all() as { slug: string }[]).map(r => r.slug);
// state×procedure pairs — state_procedures uses state=abbr FK and procedure_slug
const stateProcedures = db.prepare(
  'SELECT s.slug as state_slug, sp.procedure_slug FROM state_procedures sp JOIN states s ON s.abbr = sp.state'
).all() as { state_slug: string; procedure_slug: string }[];
// CAPPED at 100 to match page.tsx getAllComparisonSlugs().slice(0, 100) (2026-04-22 HCU-defense)
// Was: 1,225 state pairs × 2 locales = 2,450 URLs; page.tsx dynamicParams=false → ~2,250 URLs 404.
const comparisons = (db.prepare('SELECT slug FROM comparisons LIMIT 100').all() as { slug: string }[]).map(r => r.slug);
// procedure-compare: CAPPED at 100 to match page.tsx getAllProcedureComparisonSlugs().slice(0, 100)
// HCU-defense 2026-04-22: was 12,720 URLs per locale (EN+ES=25,440 total) → soft-404 risk under dynamicParams=false.
const procCompEN = (db.prepare('SELECT slug FROM procedure_comparisons ORDER BY id LIMIT 100').all() as { slug: string }[]).map(r => r.slug);
const procCompES = procCompEN;

db.close();

// ── Guides (matches lib/guides.ts — 5 items) ─────────────────────────────────
const guideSlugs = [
  'uspstf-screenings-by-age',
  'aca-preventive-care-coverage',
  'cancer-screening-cost-benefit',
  'executive-physical-vs-standard',
  'biomarker-tests-wellness-trap',
];

// ── Blog (matches lib/blog.ts — 33 posts) ────────────────────────────────────
const blogSlugs = [
  'medicare-vs-medicaid-differences',
  'medicare-advantage-vs-original',
  'how-much-medicare-costs-2024',
  'medicare-enrollment-deadlines',
  'medicare-coverage-gaps-what-to-know',
  'medicare-advantage-vs-original-medicare-2026',
  'medicare-part-d-prescription-drug-plans-guide',
  'medigap-supplemental-insurance-comparison',
  'medicare-open-enrollment-mistakes-to-avoid',
  'medicaid-eligibility-requirements-by-state',
  'medicare-costs-premiums-deductibles-2026',
  'how-to-appeal-medicare-claim-denial',
  'dual-eligible-medicare-medicaid-benefits',
  'medicare-preventive-services-free-screenings',
  'social-security-disability-medicare-guide',
  'medicare-home-health-care-coverage',
  'affordable-care-act-marketplace-vs-medicare',
  'medicare-telehealth-coverage-guide',
  'skilled-nursing-facility-medicare-coverage',
  'medicare-annual-wellness-visit-guide',
  'prescription-drug-savings-tips-seniors',
  'medicare-fraud-scams-how-to-protect-yourself',
  'long-term-care-planning-guide',
  'medicare-supplement-plan-g-vs-plan-n',
  'health-savings-account-hsa-with-medicare',
  'how-to-compare-hospital-prices',
  'medical-billing-errors-to-watch-for',
  'preventive-care-costs-breakdown',
  'emergency-room-vs-urgent-care-costs',
  'how-health-insurance-deductibles-work',
  'medical-procedure-price-transparency',
  'cheapest-states-for-healthcare',
  'medicare-vs-medicaid-eligibility-differences',
];

// ── Static pages ─────────────────────────────────────────────────────────────
add({ url: `${SITE_URL}/`, priority: '1.0', changefreq: 'monthly' });
add({ url: `${SITE_URL}/calculator/`, priority: '0.9', changefreq: 'monthly' });
add({ url: `${SITE_URL}/guide/`, priority: '0.8', changefreq: 'weekly' });
add({ url: `${SITE_URL}/blog/`, priority: '0.8', changefreq: 'weekly' });
add({ url: `${SITE_URL}/about/`, priority: '0.3', changefreq: 'yearly' });
add({ url: `${SITE_URL}/privacy/`, priority: '0.3', changefreq: 'yearly' });
add({ url: `${SITE_URL}/terms/`, priority: '0.3', changefreq: 'yearly' });
add({ url: `${SITE_URL}/contact/`, priority: '0.3', changefreq: 'yearly' });

// ── Guide pages ───────────────────────────────────────────────────────────────
for (const g of guideSlugs) add({ url: `${SITE_URL}/guide/${g}/`, priority: '0.7', changefreq: 'monthly' });

// ── Blog pages ────────────────────────────────────────────────────────────────
for (const s of blogSlugs) add({ url: `${SITE_URL}/blog/${s}/`, priority: '0.7', changefreq: 'monthly' });

// ── State pages ──────────────────────────────────────────────────────────────
for (const s of states) add({ url: `${SITE_URL}/state/${s}/`, priority: '0.8', changefreq: 'monthly' });

// ── Procedure pages ───────────────────────────────────────────────────────────
for (const p of procedures) add({ url: `${SITE_URL}/procedure/${p}/`, priority: '0.7', changefreq: 'monthly' });

// ── State×Procedure pages ─────────────────────────────────────────────────────
for (const sp of stateProcedures) add({ url: `${SITE_URL}/state/${sp.state_slug}/${sp.procedure_slug}/`, priority: '0.6', changefreq: 'monthly' });

// ── Compare pages (state pairs) ───────────────────────────────────────────────
for (const c of comparisons) add({ url: `${SITE_URL}/compare/${c}/`, priority: '0.5', changefreq: 'monthly' });

// ── Procedure compare (EN: top 20) ───────────────────────────────────────────
for (const c of procCompEN) add({ url: `${SITE_URL}/procedure-compare/${c}/`, priority: '0.5', changefreq: 'yearly' });

// ─── /es/* × 8,210 DROPPED 2026-04-22 (HCU defense) ─────────────────────
// Thin Spanish translation over identical medical cost data. Routes stay
// live via dynamicParams — existing /es/* URLs remain 200. EN matrix
// (state × procedure) preserved intact — that IS the product.

// ─── Cardinality guard ────────────────────────────────────────────────────
if (entries.length > 10000 && !process.env.SITEMAP_LARGE_OK) {
  throw new Error(
    `medcheckwize sitemap has ${entries.length.toLocaleString()} URLs — Option B+ budget is ~8.7K.\n` +
      `Did /es/* (8,210) get re-added?\n` +
      `That's exactly the loop that caused the original cardinality collapse.\n` +
      `Run with SITEMAP_LARGE_OK=1 if you genuinely meant to expand the tier.`,
  );
}

// ── Cleanup old sitemap files ────────────────────────────────────────────────
for (const f of fs.readdirSync(OUT_DIR)) {
  if (/^sitemap(-\d+)?\.xml$/.test(f)) fs.unlinkSync(path.join(OUT_DIR, f));
}
const oldDir = path.join(OUT_DIR, 'sitemap');
if (fs.existsSync(oldDir)) fs.rmSync(oldDir, { recursive: true, force: true });

// ── Write shards ─────────────────────────────────────────────────────────────
const shardCount = Math.ceil(entries.length / SHARD_SIZE);
if (shardCount <= 1) {
  writeShard(0, entries);
  fs.renameSync(path.join(OUT_DIR, 'sitemap-0.xml'), path.join(OUT_DIR, 'sitemap.xml'));
} else {
  for (let i = 0; i < shardCount; i++) writeShard(i, entries.slice(i * SHARD_SIZE, (i + 1) * SHARD_SIZE));
  const idx = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    Array.from({ length: shardCount }, (_, i) => `  <sitemap><loc>${SITE_URL}/sitemap-${i}.xml</loc><lastmod>${NOW}</lastmod></sitemap>`).join('\n') + '\n</sitemapindex>\n';
  fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), idx);
}
console.log(`medcheckwize: ${entries.length} URLs, ${shardCount || 1} shard(s)`);
