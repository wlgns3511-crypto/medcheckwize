import { JSX } from "react";

interface ProprietaryMetricsBlockProps {
  stackAffordabilityScore: number;
  medigapAccessScore: number;
  irmaaRiskScore: number;
  overallGrade: string;
  commentary: string;
}

function getAffordabilityLevel(score: number): { label: string; color: string; ringColor: string; bg: string } {
  if (score >= 80) {
    return { label: "High Affordability", color: "text-teal-700", ringColor: "stroke-teal-500", bg: "bg-teal-50" };
  }
  if (score >= 50) {
    return { label: "Moderate Premiums", color: "text-amber-700", ringColor: "stroke-amber-500", bg: "bg-amber-50" };
  }
  return { label: "High Premium Burden", color: "text-rose-700", ringColor: "stroke-rose-500", bg: "bg-rose-50" };
}

function getAccessLevel(score: number): { label: string; color: string; ringColor: string; bg: string } {
  if (score >= 80) {
    return { label: "Strong Protection", color: "text-teal-700", ringColor: "stroke-teal-500", bg: "bg-teal-50" };
  }
  if (score >= 50) {
    return { label: "Moderate Rules", color: "text-amber-700", ringColor: "stroke-amber-500", bg: "bg-amber-50" };
  }
  return { label: "Underwriting Risk", color: "text-rose-700", ringColor: "stroke-rose-500", bg: "bg-rose-50" };
}

function getGradeStyles(grade: string): { badge: string; border: string; bg: string } {
  const cleanGrade = grade.charAt(0);
  switch (cleanGrade) {
    case "A":
      return { badge: "text-teal-800 bg-teal-100", border: "border-teal-200", bg: "bg-teal-50/30" };
    case "B":
      return { badge: "text-amber-800 bg-amber-100", border: "border-amber-200", bg: "bg-amber-50/30" };
    case "C":
      return { badge: "text-amber-900 bg-amber-100/70", border: "border-amber-100", bg: "bg-amber-50/20" };
    case "D":
    case "F":
    default:
      return { badge: "text-rose-800 bg-rose-100", border: "border-rose-200", bg: "bg-rose-50/30" };
  }
}

export function ProprietaryMetricsBlock({
  stackAffordabilityScore,
  medigapAccessScore,
  irmaaRiskScore,
  overallGrade,
  commentary,
}: ProprietaryMetricsBlockProps): JSX.Element {
  const aff = getAffordabilityLevel(stackAffordabilityScore);
  const acc = getAccessLevel(medigapAccessScore);
  const gradeStyles = getGradeStyles(overallGrade);

  // SVG Circle parameters for progress gauge
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const affDashoffset = circumference - (stackAffordabilityScore / 100) * circumference;
  const accDashoffset = circumference - (medigapAccessScore / 100) * circumference;

  return (
    <section
      data-upgrade="proprietary-metrics"
      aria-label="MedCheckWize Proprietary Medicare Plan Ratings"
      className="not-prose my-8 rounded-xl border border-teal-200 bg-white p-5 shadow-sm"
    >
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
        <svg
          aria-hidden="true"
          className="h-4.5 w-4.5 text-teal-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
          />
        </svg>
        MedCheckWize Medicare Index & Ratings
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Metric Gauges Row */}
        <div className="flex flex-row items-center gap-6 flex-shrink-0">
          {/* Premium Affordability Ring */}
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
                {/* Background Ring */}
                <circle
                  className="text-slate-100"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="48"
                  cy="48"
                />
                {/* Active Ring */}
                <circle
                  className={`${aff.ringColor} transition-all duration-500`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={affDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="48"
                  cy="48"
                />
              </svg>
              {/* Score Text */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800">{stackAffordabilityScore}</span>
                <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider text-center max-w-[50px] leading-tight font-sans">Affordability</span>
              </div>
            </div>
            <span className={`text-xs font-bold mt-2 ${aff.color}`}>{aff.label}</span>
          </div>

          {/* Medigap Access Ring */}
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
                {/* Background Ring */}
                <circle
                  className="text-slate-100"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="48"
                  cy="48"
                />
                {/* Active Ring */}
                <circle
                  className={`${acc.ringColor} transition-all duration-500`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={accDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="48"
                  cy="48"
                />
              </svg>
              {/* Score Text */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800">{medigapAccessScore}</span>
                <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider text-center max-w-[50px] leading-tight font-sans">Access</span>
              </div>
            </div>
            <span className={`text-xs font-bold mt-2 ${acc.color}`}>{acc.label}</span>
          </div>

          {/* Overall Grade Badge */}
          <div className="flex flex-col items-center">
            <div className={`w-24 h-24 rounded-full border-2 ${gradeStyles.border} ${gradeStyles.bg} flex items-center justify-center`}>
              <div className={`w-18 h-18 rounded-full flex items-center justify-center font-black text-3xl shadow-sm ${gradeStyles.badge}`}>
                {overallGrade}
              </div>
            </div>
            <span className="text-xs font-bold text-slate-700 mt-2 font-sans">Plan Grade</span>
          </div>
        </div>

        {/* Dynamic Commentary Text */}
        <div className="flex-1 bg-teal-50/20 border border-teal-100/50 rounded-xl p-4.5">
          <h4 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1 font-sans">Medicare Policy Analysis</h4>
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            {commentary}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400">
        <span>* Premium Affordability measures combined Part B + Part D + Medigap monthly cost against other states (higher is cheaper).</span>
        <span>* Access Score measures state regulatory protections against attained-age rate hikes and medical underwriting rules.</span>
        <span>* Plan Grade is a composite ranking combining premium stack cost, Medigap access rules, and local IRMAA surcharge risk.</span>
      </div>
    </section>
  );
}
