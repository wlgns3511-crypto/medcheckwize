import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'medicare.db');
let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) _db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  return _db;
}

// ── Interfaces ───────────────────────────────────────────────────────────────

export interface State {
  state: string;
  abbr: string;
  slug: string;
  medicare_enrollees: number;
  medicaid_enrollees: number;
  avg_medicare_spending_per_capita: number;
  part_b_premium: number;
  part_d_premium_avg: number;
  medigap_avg_premium: number;
  medicaid_expansion: string;
  uninsured_rate: number;
}

export interface Procedure {
  name: string;
  slug: string;
  category: string;
  national_avg_cost: number;
  medicare_pays: number;
  patient_pays: number;
  description: string;
}

export interface StateProcedure {
  state: string;
  procedure_slug: string;
  avg_cost: number;
  medicare_pays: number;
  patient_pays: number;
}

export interface Comparison {
  slug: string;
  state_a: string;
  state_b: string;
}

// ── State queries ────────────────────────────────────────────────────────────

export function getAllStates(): State[] {
  return getDb().prepare('SELECT * FROM states ORDER BY state').all() as State[];
}

export function getStateBySlug(slug: string): State | undefined {
  return getDb().prepare('SELECT * FROM states WHERE slug = ?').get(slug) as State | undefined;
}

export function getStateByAbbr(abbr: string): State | undefined {
  return getDb().prepare('SELECT * FROM states WHERE abbr = ?').get(abbr) as State | undefined;
}

export function getAllStateSlugs(): { slug: string }[] {
  return getDb().prepare('SELECT slug FROM states ORDER BY state').all() as { slug: string }[];
}

export function getNationalStats() {
  return getDb().prepare(`
    SELECT
      AVG(avg_medicare_spending_per_capita) as avg_spending,
      SUM(medicare_enrollees) as total_medicare,
      SUM(medicaid_enrollees) as total_medicaid,
      AVG(uninsured_rate) as avg_uninsured,
      AVG(part_b_premium) as avg_part_b,
      AVG(part_d_premium_avg) as avg_part_d,
      AVG(medigap_avg_premium) as avg_medigap
    FROM states
  `).get() as {
    avg_spending: number;
    total_medicare: number;
    total_medicaid: number;
    avg_uninsured: number;
    avg_part_b: number;
    avg_part_d: number;
    avg_medigap: number;
  };
}

export function getTopSpendingStates(limit = 10): State[] {
  return getDb().prepare('SELECT * FROM states ORDER BY avg_medicare_spending_per_capita DESC LIMIT ?').all(limit) as State[];
}

export function getLowestSpendingStates(limit = 10): State[] {
  return getDb().prepare('SELECT * FROM states ORDER BY avg_medicare_spending_per_capita ASC LIMIT ?').all(limit) as State[];
}

export function getAffordabilityRank(abbr: string): number {
  const rows = getDb().prepare('SELECT abbr FROM states ORDER BY avg_medicare_spending_per_capita ASC').all() as { abbr: string }[];
  return rows.findIndex(r => r.abbr === abbr) + 1;
}

// ── Procedure queries ────────────────────────────────────────────────────────

export function getAllProcedures(): Procedure[] {
  return getDb().prepare('SELECT * FROM procedures ORDER BY name').all() as Procedure[];
}

export function getProcedureBySlug(slug: string): Procedure | undefined {
  return getDb().prepare('SELECT * FROM procedures WHERE slug = ?').get(slug) as Procedure | undefined;
}

export function getAllProcedureSlugs(): { slug: string }[] {
  return getDb().prepare('SELECT slug FROM procedures ORDER BY name').all() as { slug: string }[];
}

export function getProceduresByCategory(category: string): Procedure[] {
  return getDb().prepare('SELECT * FROM procedures WHERE category = ? ORDER BY national_avg_cost DESC').all(category) as Procedure[];
}

export function getProcedureCategories(): { category: string; count: number }[] {
  return getDb().prepare('SELECT category, COUNT(*) as count FROM procedures GROUP BY category ORDER BY count DESC').all() as { category: string; count: number }[];
}

// ── State-Procedure queries ──────────────────────────────────────────────────

export function getStateProcedure(stateAbbr: string, procedureSlug: string): StateProcedure | undefined {
  return getDb().prepare('SELECT * FROM state_procedures WHERE state = ? AND procedure_slug = ?').get(stateAbbr, procedureSlug) as StateProcedure | undefined;
}

export function getStateProcedures(stateAbbr: string): (StateProcedure & { name: string; category: string })[] {
  return getDb().prepare(`
    SELECT sp.*, p.name, p.category
    FROM state_procedures sp
    JOIN procedures p ON p.slug = sp.procedure_slug
    WHERE sp.state = ?
    ORDER BY sp.avg_cost DESC
  `).all(stateAbbr) as (StateProcedure & { name: string; category: string })[];
}

export function getProcedureByState(procedureSlug: string): (StateProcedure & { state_name: string; state_slug: string })[] {
  return getDb().prepare(`
    SELECT sp.*, s.state as state_name, s.slug as state_slug
    FROM state_procedures sp
    JOIN states s ON s.abbr = sp.state
    WHERE sp.procedure_slug = ?
    ORDER BY sp.avg_cost DESC
  `).all(procedureSlug) as (StateProcedure & { state_name: string; state_slug: string })[];
}

export function getAllStateProcedurePairs(): { state_slug: string; procedure_slug: string }[] {
  return getDb().prepare(`
    SELECT s.slug as state_slug, sp.procedure_slug
    FROM state_procedures sp
    JOIN states s ON s.abbr = sp.state
  `).all() as { state_slug: string; procedure_slug: string }[];
}

export function getStateProcedureDetail(stateSlug: string, procedureSlug: string): {
  state: State;
  procedure: Procedure;
  stateProcedure: StateProcedure;
  allStates: (StateProcedure & { state_name: string; state_slug: string })[];
} | undefined {
  const state = getStateBySlug(stateSlug);
  if (!state) return undefined;
  const procedure = getProcedureBySlug(procedureSlug);
  if (!procedure) return undefined;
  const stateProcedure = getStateProcedure(state.abbr, procedureSlug);
  if (!stateProcedure) return undefined;
  const allStates = getProcedureByState(procedureSlug);
  return { state, procedure, stateProcedure, allStates };
}

// ── Search queries ───────────────────────────────────────────────────────────

export function searchProcedures(query: string, limit = 20): Procedure[] {
  const q = `%${query}%`;
  return getDb().prepare(
    'SELECT * FROM procedures WHERE name LIKE ? OR description LIKE ? OR category LIKE ? ORDER BY name LIMIT ?'
  ).all(q, q, q, limit) as Procedure[];
}

// ── Comparison queries ───────────────────────────────────────────────────────

export function getAllComparisonSlugs(): { slug: string }[] {
  return getDb().prepare('SELECT slug FROM comparisons').all() as { slug: string }[];
}

export function getComparisonBySlug(slug: string): { a: State; b: State } | undefined {
  const row = getDb().prepare('SELECT state_a, state_b FROM comparisons WHERE slug = ?').get(slug) as { state_a: string; state_b: string } | undefined;
  if (row) {
    const a = getStateByAbbr(row.state_a);
    const b = getStateByAbbr(row.state_b);
    if (a && b) return { a, b };
  }

  // Fallback: parse slug and look up each state dynamically
  const parts = slug.split('-vs-');
  if (parts.length !== 2) return undefined;
  const a = getStateBySlug(parts[0]);
  const b = getStateBySlug(parts[1]);
  if (!a || !b) return undefined;
  return { a, b };
}

export function getComparisonLinksForState(abbr: string, limit = 5): { slug: string; other: string }[] {
  const rows = getDb().prepare(`
    SELECT slug, state_a, state_b FROM comparisons
    WHERE state_a = ? OR state_b = ? LIMIT ?
  `).all(abbr, abbr, limit) as { slug: string; state_a: string; state_b: string }[];
  return rows.map(r => ({
    slug: r.slug,
    other: r.state_a === abbr ? r.state_b : r.state_a,
  }));
}

// ── Procedure Comparison queries ─────────────────────────────────────────────

export interface ProcedureComparison {
  id: number;
  slug: string;
  proc_a_slug: string;
  proc_b_slug: string;
}

export function getAllProcedureComparisonSlugs(limit = 50000): ProcedureComparison[] {
  return getDb().prepare('SELECT * FROM procedure_comparisons ORDER BY id LIMIT ?').all(limit) as ProcedureComparison[];
}

export function getProcedureComparisonBySlug(slug: string): { a: Procedure; b: Procedure } | undefined {
  const row = getDb().prepare('SELECT proc_a_slug, proc_b_slug FROM procedure_comparisons WHERE slug = ?').get(slug) as { proc_a_slug: string; proc_b_slug: string } | undefined;
  if (row) {
    const a = getProcedureBySlug(row.proc_a_slug);
    const b = getProcedureBySlug(row.proc_b_slug);
    if (a && b) return { a, b };
  }

  // Fallback: parse slug and look up each procedure dynamically
  const parts = slug.split('-vs-');
  if (parts.length !== 2) return undefined;
  const a = getProcedureBySlug(parts[0]);
  const b = getProcedureBySlug(parts[1]);
  if (!a || !b) return undefined;
  return { a, b };
}

// --- Related procedures (same category) ---

export function getRelatedProcedures(category: string, excludeSlug: string, limit = 6): Procedure[] {
  return getDb().prepare(
    'SELECT * FROM procedures WHERE category = ? AND slug != ? ORDER BY national_avg_cost DESC LIMIT ?'
  ).all(category, excludeSlug, limit) as Procedure[];
}

// --- Similar spending states ---

export function getSimilarSpendingStates(spending: number, excludeAbbr: string, limit = 6): State[] {
  return getDb().prepare(
    'SELECT * FROM states WHERE abbr != ? ORDER BY ABS(avg_medicare_spending_per_capita - ?) ASC LIMIT ?'
  ).all(excludeAbbr, spending, limit) as State[];
}

// --- Top procedures for a state (one per category) ---

export function getTopProceduresByCategory(stateAbbr: string, limit = 6): (StateProcedure & { name: string; category: string })[] {
  return getDb().prepare(`
    SELECT sp.*, p.name, p.category
    FROM state_procedures sp
    JOIN procedures p ON p.slug = sp.procedure_slug
    WHERE sp.state = ?
    GROUP BY p.category
    ORDER BY sp.avg_cost DESC
    LIMIT ?
  `).all(stateAbbr, limit) as (StateProcedure & { name: string; category: string })[];
}
