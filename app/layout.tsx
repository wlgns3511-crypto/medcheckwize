import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UpgradeAnalytics } from "@/components/upgrades/UpgradeAnalytics";
import RelatedSites from "@/components/RelatedSites";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const SITE_NAME = "MedCheckWize";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://medcheckwize.com";

// HCU Phase C 2026-04-25: /es/ subtree killed (410 via middleware).
// Spanish mirror over identical CMS data drove 0 GSC clicks in 3 months.
const ROOT_ALTERNATE_LANGUAGES = {
  en: `${SITE_URL}/`,
  'x-default': `${SITE_URL}/`,
} as const;

const GA_ID = "G-G835HS88W4";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - Medicare & Medicaid Costs by State`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Compare Medicare and Medicaid costs, coverage, and healthcare expenses across all 50 US states. Find procedure costs, premium estimates, and coverage details.",
  metadataBase: new URL(SITE_URL),
  alternates: { languages: ROOT_ALTERNATE_LANGUAGES },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US" },
  twitter: { card: "summary_large_image" },
  other: { "google-adsense-account": "ca-pub-5724806562146685" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${GA_ID}")` }} />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5724806562146685"
          crossOrigin="anonymous"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "name": "MedCheckWize",
              "url": "https://medcheckwize.com",
              "description": "Compare Medicare and Medicaid costs, coverage, and healthcare expenses across all 50 US states. Find procedure costs, premium estimates, and coverage details.",
              "inLanguage": "en-US",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://medcheckwize.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@type": "Organization",
              "name": "MedCheckWize",
              "url": "https://medcheckwize.com",
              "description": "Compare Medicare and Medicaid costs, coverage, and healthcare expenses across all 50 US states. Find procedure costs, premium estimates, and coverage details.",
              "parentOrganization": {
                "@type": "Organization",
                "name": "DataPeek Research Network",
                "url": "https://datapeekfacts.com"
              }
            }
          ]
        }) }} />
      </head>
      <body className={`${inter.className} antialiased bg-white text-slate-900 min-h-screen flex flex-col`}>
        <UpgradeAnalytics />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-blue-600 focus:border focus:rounded">Skip to content</a>
        <header className="border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-teal-600">{SITE_NAME}</a>
            <nav className="flex gap-6 text-sm">
              {/* /compare/ + /es/ killed 2026-04-25 HCU Phase C */}
              <a href="/state/california/" className="hover:text-teal-600">States</a>
              <a href="/procedure/colonoscopy/" className="hover:text-teal-600">Procedures</a>
              <a href="/calculator/" className="hover:text-teal-600">Calculator</a>
            </nav>
          </div>
        </header>
        <main id="main-content" className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">{children}</main>
        <footer className="border-t border-slate-200 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-slate-500">
            <p>Built with public data from CMS.gov, Medicare.gov, and public healthcare cost databases (2026 estimates).</p>
            <p className="mt-2">
              <a href="/about/" className="hover:text-teal-600">About</a>{" | "}
              <a href="/methodology/" className="hover:text-teal-600">Methodology</a>{" | "}
              <a href="/editorial-policy/" className="hover:text-teal-600">Editorial Policy</a>{" | "}
              <a href="/corrections-policy/" className="hover:text-teal-600">Corrections</a>{" | "}
              <a href="/privacy/" className="hover:text-teal-600">Privacy</a>{" | "}
              <a href="/terms/" className="hover:text-teal-600">Terms</a>{" | "}
              <a href="/disclaimer/" className="hover:text-teal-600">Disclaimer</a>{" | "}
              <a href="/contact/" className="hover:text-teal-600">Contact</a>
            </p>
            <RelatedSites currentSite="MedCheckWize" accentClass="hover:text-teal-600" label="Companion Tools" />
            <p className="mt-3 text-xs italic text-slate-400">Demystifying Medicare coverage and healthcare costs for all Americans.</p>
            <p className="mt-1">&copy; {new Date().getFullYear()} {SITE_NAME}. Not affiliated with any government agency.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
