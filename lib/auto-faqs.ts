import type { Procedure } from './db';
import { formatCurrency, categoryLabel, getDataYear } from './format';

export interface FaqItem {
  question: string;
  answer: string;
}

interface StateRow {
  state_name: string;
  state_slug: string;
  avg_cost: number;
  medicare_pays: number;
  patient_pays: number;
}

export function generateAutoFaqs(
  proc: Procedure,
  stateData: StateRow[],
): FaqItem[] {
  return [];
}
