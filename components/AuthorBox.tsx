import {
  ENTITY_VINTAGE,
  STATE_VINTAGE,
  METHODOLOGY_VINTAGE,
  ABOUT_VINTAGE,
  SITE_VINTAGE,
  EDITORIAL_TEAM,
  PUBLISHER,
  SOURCE_AUTHORITIES,
  REVIEWER_DISCLAIMER,
} from "@/lib/authorship";

type VintageLayer = 'entity' | 'state' | 'methodology' | 'about' | 'site';

const VINTAGE_BY_LAYER: Record<VintageLayer, string> = {
  entity: ENTITY_VINTAGE,
  state: STATE_VINTAGE,
  methodology: METHODOLOGY_VINTAGE,
  about: ABOUT_VINTAGE,
  site: SITE_VINTAGE,
};

interface AuthorBoxProps {
  /** Which vintage layer to display. Defaults to `entity` for backwards compat. */
  layer?: VintageLayer;
  /** Override vintage with an explicit ISO date (e.g. blog updatedAt). Wins over `layer`. */
  reviewedAt?: string;
  /** Optional dataset-level descriptor shown alongside the vintage. */
  dataVintage?: string;
  /** Show the YMYL reviewer disclaimer line (recommended for entity/state/procedure pages). */
  showDisclaimer?: boolean;
}

export function AuthorBox({ layer = 'entity', reviewedAt, dataVintage, showDisclaimer = false }: AuthorBoxProps = {}) {
  const resolvedReviewedAt = reviewedAt ?? VINTAGE_BY_LAYER[layer];
  const resolvedDataVintage = dataVintage ?? (
    layer === 'methodology' || layer === 'about' || layer === 'site'
      ? 'Editorial review'
      : 'CMS provider data + KFF + Census ACS'
  );

  return (
    <div className="mt-10 p-5 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-900 text-sm">
            Reviewed by the {EDITORIAL_TEAM.name}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Part of the <a href={PUBLISHER.url} className="text-slate-700 hover:underline" rel="noopener">{PUBLISHER.name}</a>
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed mb-3">
        Each Medicare cost figure on MedCheckWize is cross-referenced against {SOURCE_AUTHORITIES.map((s, i) => (
          <span key={s.name}>
            {i > 0 && (i === SOURCE_AUTHORITIES.length - 1 ? ', and ' : ', ')}
            <a href={s.url} className="text-slate-700 underline underline-offset-2 hover:text-slate-900" rel="noopener" target="_blank">
              {s.name}
            </a>
          </span>
        ))} before publication. Our editorial workflow audits source URLs, payment-system mappings, and data vintage on every release cycle.
      </p>
      {showDisclaimer && (
        <p className="text-xs text-slate-600 leading-relaxed mb-3 italic">
          {REVIEWER_DISCLAIMER}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        {resolvedReviewedAt && (
          <>
            <span>Last reviewed: <time dateTime={resolvedReviewedAt}>{resolvedReviewedAt}</time></span>
            <span className="text-slate-300">·</span>
          </>
        )}
        <span>Data vintage: {resolvedDataVintage}</span>
        <span className="text-slate-300">·</span>
        <a href="https://datapeekfacts.com/editorial-policy/" className="underline underline-offset-2 hover:text-slate-900" rel="noopener">Editorial policy</a>
        <span className="text-slate-300">·</span>
        <a href="/methodology/" className="underline underline-offset-2 hover:text-slate-900">Methodology</a>
        <span className="text-slate-300">·</span>
        <a href="/contact/" className="underline underline-offset-2 hover:text-slate-900">Send a correction</a>
      </div>
    </div>
  );
}
