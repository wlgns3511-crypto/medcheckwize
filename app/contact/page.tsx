import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Contact', description: 'Contact MedCheckWize.' };

export default function ContactPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Contact</h1>
      <div className="prose prose-slate max-w-none">
        <p>Have questions or feedback? Email us at: <strong>contact@medcheckwize.com</strong></p>
        <p>MedCheckWize is an independent resource not affiliated with CMS, Medicare, or any government agency.</p>
      </div>
    </>
  );
}
