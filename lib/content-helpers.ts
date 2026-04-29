// Content helpers: deterministic per-slug variant pickers + small formatting utilities.
// All variant pickers must be deterministic for SSR/CSR consistency (no random at runtime).

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = ((h << 5) - h) + slug.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function pickVariant<T>(items: readonly T[], seed: string): T {
  if (items.length === 0) throw new Error("pickVariant: empty list");
  const idx = hashSlug(seed) % items.length;
  return items[idx];
}

export function aOrAn(word: string): string {
  return /^[aeiouAEIOU]/.test(word) ? "an" : "a";
}

export function ratioPhrase(numerator: number, denominator: number): string {
  if (denominator <= 0) return "—";
  const pct = Math.round((numerator / denominator) * 100);
  return `$${numerator.toFixed(2)} / $${denominator.toFixed(2)} (${pct}%)`;
}

export function oneInEveryN(ratio: number): string {
  if (ratio <= 0) return "—";
  const n = Math.round(1 / ratio);
  return `1 in every ${n}`;
}
