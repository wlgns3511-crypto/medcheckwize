export function AuthorBox() {
  return (
    <div className="mt-10 flex gap-4 p-5 bg-green-50 border-green-200 border rounded-xl">
      <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
        <span>💊</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-semibold text-slate-900 text-sm">MedCheckWize Health Team</span>
          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-medium">Healthcare Data & Drug Safety Analysts</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mb-2">
          Our medical researchers and pharmacists track drug interactions, FDA safety data, and clinical guidelines. Information sourced from FDA databases, NIH clinical research, and peer-reviewed medical literature.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">✓ FDA Data Verified</span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">✓ Clinically Reviewed</span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">✓ Peer-Reviewed Sources</span>
        </div>
      </div>
    </div>
  );
}
