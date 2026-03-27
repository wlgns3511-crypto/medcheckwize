export function FAQ({ items }: { items: { question: string; answer: string }[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {items.map((faq, i) => (
          <details key={i} className="border border-slate-200 rounded-lg">
            <summary className="px-4 py-3 cursor-pointer font-medium hover:bg-slate-50">{faq.question}</summary>
            <p className="px-4 pb-3 text-slate-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
