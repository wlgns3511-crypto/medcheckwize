#!/usr/bin/env tsx
/**
 * build-sitemap.ts — medcheckwize sitemap (HCU Phase C, 2026-04-25).
 *
 * PRUNING HISTORY:
 *   2026-04-22 Option B+: Dropped /es/* (8,210) from sitemap. Routes stayed live
 *     → 0 ES queries in GSC, but sitemap dropped from 16,870 → 8,456 URLs.
 *
 *   2026-04-25 Phase C (this rewrite):
 *     GSC after 3 months on medcheckwize.com (878 queries / 2 clicks):
 *       - 100% of clicks landed on /procedure/{slug}/ (heart-valve, hip,
 *         spinal-fusion, lumbar-disc, discectomy, nasal-polyps, lipid-panel)
 *       - State×procedure leaf pages (8,000 of them) generated 0 clicks but
 *         sat in "발견됨-색인X" pile alongside /compare/{state-vs-state}/
 *         and /procedure-compare/{a-vs-b}/
 *       - /es/* legacy 404s still accumulating despite 4/22 sitemap drop
 *
 *     Killed (410 via middleware): /state/{slug}/{procedure}/ leaf matrix
 *       (8,000 doorways), /compare/, /procedure-compare/, /embed/, /es/.
 *       Removed app/ dirs: compare, procedure-compare, embed, es,
 *       state/[slug]/[procedure].
 *
 *     Kept: / + /calculator/, /state/{slug}/ × 50 (hubs only),
 *       /procedure/{slug}/ × 160 (real signal — top GSC = procedure name +
 *       "cost" pattern), /blog/ + 33 posts, /guide/ + 5 guides, static.
 *
 *     Sitemap: 8,456 → ~258 URLs (-97%, matches wagepeek/salarybycity scale).
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
add({ url: `${SITE_URL}/methodology/`, priority: '0.4', changefreq: 'yearly' });
add({ url: `${SITE_URL}/disclaimer/`, priority: '0.3', changefreq: 'yearly' });

// ── Guide pages ──────────────────────────────────────────────────────────────
for (const g of guideSlugs) add({ url: `${SITE_URL}/guide/${g}/`, priority: '0.7', changefreq: 'monthly' });

// ── Blog pages ───────────────────────────────────────────────────────────────
for (const s of blogSlugs) add({ url: `${SITE_URL}/blog/${s}/`, priority: '0.7', changefreq: 'monthly' });

// ── State hubs × 50 ──────────────────────────────────────────────────────────
for (const s of states) add({ url: `${SITE_URL}/state/${s}/`, priority: '0.85', changefreq: 'monthly' });

// ── Procedure pages × 160 (real GSC signal) ──────────────────────────────────
for (const p of procedures) add({ url: `${SITE_URL}/procedure/${p}/`, priority: '0.8', changefreq: 'monthly' });

// ─── KILLED 2026-04-25 HCU Phase C ──────────────────────────────────────────
//   /state/{slug}/{procedure}/ × 8,000 — leaf matrix doorway, 0 GSC clicks
//   /compare/{state-vs-state}/ × 100 — 0 GSC clicks
//   /procedure-compare/{a-vs-b}/ × 100 — 0 GSC clicks
//   /embed/medicare-calc/ — embed widget, never indexed
//   /es/* — Spanish mirror, 0 ES queries in GSC
// All return 410 via middleware.ts. App dirs deleted.

// ─── Cardinality guard ───────────────────────────────────────────────────────
// Phase C target ~258. Tripwire at 500 (procedure DB could grow naturally).
if (entries.length > 500 && !process.env.SITEMAP_LARGE_OK) {
  throw new Error(
    `medcheckwize sitemap has ${entries.length.toLocaleString()} URLs — Phase C budget is ~258.\n` +
      `Did /state/{slug}/{procedure}/ leaf matrix get re-added? That's the doorway HCU Phase C explicitly killed.\n` +
      `Or did /compare/, /procedure-compare/, /es/, /embed/ creep back in?\n` +
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
console.log(`✓ medcheckwize sitemap: ${entries.length} unique URLs, ${shardCount || 1} shard(s)`);
