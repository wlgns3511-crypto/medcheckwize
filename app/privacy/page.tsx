import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy', description: 'MedCheckWize privacy policy.', alternates: { canonical: "/privacy/" },
  openGraph: { url: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none">
        <p>Last updated: March 2026</p>
        <h2>Information We Collect</h2>
        <p>MedCheckWize does not collect personal information. We do not require account creation. We use cookies through Google Analytics and Google AdSense to analyze traffic and serve ads.</p>
        <h2>Third-Party Services</h2>
        <p>We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits. You can opt out via <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> or visit <a href="https://www.aboutads.info/choices/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</p>
        <h2>Contact</h2>
        <p>Questions? Visit our <a href="/contact/">contact page</a>.</p>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-semibold mb-3">Part of DataPeek Facts Network</h2>
        <p>
          MedCheckWize is part of the{" "}
          <a href="https://datapeekfacts.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            DataPeek Facts
          </a>{" "}
          network of free US data tools. For general inquiries about our data network, privacy practices, or partnership
          opportunities, please contact the DataPeek Facts team at{" "}
          <a href="mailto:datapeekfacts@gmail.com" className="text-blue-600 hover:underline">
            datapeekfacts@gmail.com
          </a>
          . You can also visit the{" "}
          <a href="https://datapeekfacts.com/privacy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            DataPeek Facts Privacy Policy
          </a>{" "}
          for network-wide privacy information.
        </p>
      </div>
    </>
  );
}
