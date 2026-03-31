import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const SITE_NAME = "MedCheckWize";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://medcheckwize.com";
const GA_ID = "G-G835HS88W4";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - Medicare & Medicaid Costs by State`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Compare Medicare and Medicaid costs, coverage, and healthcare expenses across all 50 US states. Find procedure costs, premium estimates, and coverage details.",
  metadataBase: new URL(SITE_URL),
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US" },
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
              "sameAs": ["https://vocabwize.com", "https://vocablibre.com", "https://wortwize.com", "https://kalimawize.com", "https://dicionariowize.com", "https://kotobapeek.com", "https://salarybycity.com", "https://netpaypeek.com", "https://wagepeek.com", "https://costbycity.com", "https://fairrentwize.com", "https://propertytaxpeek.com", "https://degreewize.com", "https://nameblooms.com", "https://myschoolpeek.com", "https://medcostpeek.com", "https://eldercarepeek.com", "https://ingredipeek.com", "https://caloriewize.com", "https://powerbillpeek.com", "https://sunpowerpeek.com", "https://shipcalcwize.com", "https://tariffpeek.com", "https://visapeek.com", "https://zippeek.com", "https://calcpeek.com", "https://datapeekfacts.com", "https://guidebycity.com"]
            }
          ]
        }) }} />
      </head>
      <body className={`${inter.className} antialiased bg-white text-slate-900 min-h-screen flex flex-col`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-blue-600 focus:border focus:rounded">Skip to content</a>
        <header className="border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-teal-600">{SITE_NAME}</a>
            <nav className="flex gap-6 text-sm">
              <a href="/state/california/" className="hover:text-teal-600">States</a>
              <a href="/procedure/colonoscopy/" className="hover:text-teal-600">Procedures</a>
              <a href="/calculator/" className="hover:text-teal-600">Calculator</a>
              <a href="/compare/alabama-vs-alaska/" className="hover:text-teal-600">Compare</a>
              <a href="/blog/" className="hover:text-teal-600">Guides</a>
              <a href="/es/" className="text-slate-400 hover:text-teal-600 text-xs">ES</a>
            </nav>
          </div>
        </header>
        <main id="main-content" className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">{children}</main>
        <footer className="border-t border-slate-200 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-slate-500">
            <p>Data sourced from CMS.gov, Medicare.gov, and public healthcare cost databases (2026 estimates).</p>
            <p className="mt-2">
              <a href="/about/" className="hover:text-teal-600">About</a>{" | "}
              <a href="/privacy/" className="hover:text-teal-600">Privacy</a>{" | "}
              <a href="/terms/" className="hover:text-teal-600">Terms</a>{" | "}
              <a href="/disclaimer/" className="hover:text-teal-600">Disclaimer</a>{" | "}
              <a href="/contact/" className="hover:text-teal-600">Contact</a>
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Related Resources</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                <a href="https://eldercarepeek.com" className="hover:text-teal-600">Elder Care</a>
                <a href="https://costbycity.com" className="hover:text-teal-600">Cost of Living</a>
                <a href="https://zippeek.com" className="hover:text-teal-600">ZIP Codes</a>
                <a href="https://calcpeek.com" className="hover:text-teal-600">Calculators</a>
              </div>
            </div>
            <p className="mt-1">&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
