import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * HCU Phase C kill list (2026-04-25).
 *
 * GSC after 3 months: 878 queries / 2 clicks. Discovery:
 *   - 8,000 /state/{state}/{procedure}/ leaf matrix = pure state×procedure doorway
 *     (50 × 160). Pattern matches wagepeek/salarybycity occupation×location class.
 *     Top 10 GSC queries 100% landed on /procedure/{slug}/, never the leaf.
 *   - 100 /compare/{state-vs-state}/ — 0 clicks, "발견됨-색인X" pile
 *   - 100 /procedure-compare/{a-vs-b}/ — 0 clicks, same
 *   - /es/* legacy — Spanish mirror of identical CMS data, 0 ES queries in GSC
 *   - /embed/medicare-calc/ — embed widget, never meant for indexing
 *
 * Real signal kept: /procedure/{slug}/ × 160 (top GSC queries land here),
 * /state/{slug}/ × 50 (hub only — west-virginia 2 clicks 28-day Discover),
 * /blog/, /guide/, /calculator/, static pages.
 *
 * Sitemap: 8,456 → ~258 URLs (-97%).
 *
 * IMPORTANT regex notes:
 *   - `/state/{slug}/` MUST stay alive → use `/state/[^/]+/[^/]+` to match
 *     2-segment leaf only (state+procedure), never the 1-segment hub.
 *   - `/procedure-compare/` listed BEFORE `/procedure/` would over-match;
 *     use explicit `/procedure-compare(?:\/|$)` separately, never as a
 *     prefix vs `/procedure/`.
 */
const KILLED_LEAF_MATRIX = /^\/state\/[^/]+\/[^/]+/;
const KILLED_FLAT_ROUTES = /^\/(?:procedure-compare|compare|embed)(?:\/|$)|^\/es(?:\/|$)/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (KILLED_LEAF_MATRIX.test(pathname) || KILLED_FLAT_ROUTES.test(pathname)) {
    return new NextResponse(
      '<!doctype html><meta charset="utf-8"><title>410 Gone</title><h1>410 Gone</h1><p>This page has been permanently removed.</p>',
      {
        status: 410,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'x-robots-tag': 'noindex',
          'cache-control': 'public, max-age=86400',
        },
      },
    );
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|robots.txt|sitemap.xml|api).*)'],
};
