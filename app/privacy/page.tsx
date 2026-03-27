import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy', description: 'MedCheckWize privacy policy.' };

export default function PrivacyPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none">
        <p>Last updated: March 2026</p>
        <h2>Information We Collect</h2>
        <p>MedCheckWize does not collect personal information. We do not require account creation or use tracking cookies.</p>
        <h2>Third-Party Services</h2>
        <p>We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits. You can opt out via Google&apos;s Ads Settings.</p>
        <h2>Contact</h2>
        <p>Questions? Visit our <a href="/contact/">contact page</a>.</p>
      </div>
    </>
  );
}
