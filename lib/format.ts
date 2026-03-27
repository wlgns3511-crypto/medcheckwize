export function formatCurrency(amount: number | null): string {
  if (amount === null || amount === undefined) return 'N/A';
  return '$' + amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function formatCurrencyDecimal(amount: number | null): string {
  if (amount === null || amount === undefined) return 'N/A';
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatNumber(num: number | null): string {
  if (num === null || num === undefined) return 'N/A';
  return num.toLocaleString('en-US');
}

export function formatPercent(rate: number | null): string {
  if (rate === null || rate === undefined) return 'N/A';
  return rate.toFixed(1) + '%';
}

export function formatCompact(num: number | null): string {
  if (num === null || num === undefined) return 'N/A';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(0) + 'K';
  return num.toLocaleString('en-US');
}

export function getDataYear(): number {
  return 2026;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function categoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    hospital: 'Hospital',
    outpatient: 'Outpatient',
    physician: 'Physician/Office',
    lab: 'Laboratory',
    imaging: 'Imaging',
  };
  return labels[cat] || cat;
}
