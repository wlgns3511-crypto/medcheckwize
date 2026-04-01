import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Contact', description: 'Contact MedCheckWize.', alternates: { canonical: "/contact/" },
  openGraph: { url: "/contact/" },
};

export default function ContactPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Contact</h1>
      <div className="prose prose-slate max-w-none">
        <p>Have questions or feedback? Email us at: <strong>datapeekfacts@gmail.com</strong></p>
        <p>MedCheckWize is an independent resource not affiliated with CMS, Medicare, or any government agency.</p>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200">
        <h2 className="text-xl font-semibold mb-3">DataPeek Facts Network</h2>
        <p>
          MedCheckWize is part of the{" "}
          <a href="https://datapeekfacts.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            DataPeek Facts
          </a>{" "}
          network of free US data tools. For general inquiries about the network, partnerships, or cross-platform
          questions, contact the DataPeek Facts team at{" "}
          <a href="mailto:datapeekfacts@gmail.com" className="text-blue-600 hover:underline">
            datapeekfacts@gmail.com
          </a>.
        </p>
      </div>
    </>
  );
}
