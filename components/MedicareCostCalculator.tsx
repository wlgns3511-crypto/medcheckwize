"use client";

import { useState, useMemo } from "react";

const STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

const COMMON_PROCEDURES = [
  { name: "Knee Replacement", cost: 35000 },
  { name: "Hip Replacement", cost: 32000 },
  { name: "Colonoscopy", cost: 2000 },
  { name: "Cataract Surgery", cost: 3500 },
  { name: "MRI Scan", cost: 1500 },
  { name: "CT Scan", cost: 900 },
  { name: "Echocardiogram", cost: 600 },
  { name: "Physical Therapy (10 sessions)", cost: 1500 },
  { name: "Hernia Repair", cost: 11000 },
  { name: "Spinal Fusion", cost: 50000 },
];

export function MedicareCostCalculator() {
  const [age, setAge] = useState(67);
  const [selectedState, setSelectedState] = useState("Florida");
  const [partA, setPartA] = useState(true);
  const [partB, setPartB] = useState(true);
  const [partD, setPartD] = useState(true);
  const [medigapPlan, setMedigapPlan] = useState("none");
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([]);

  const toggleProcedure = (name: string) => {
    setSelectedProcedures(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  };

  const results = useMemo(() => {
    // Monthly premiums
    const partAPremium = 0; // Most qualify for premium-free Part A
    const partBPremium = partB ? 185 : 0;
    const partDPremium = partD ? 55 : 0;

    const medigapPremiums: Record<string, number> = {
      none: 0, F: 250, G: 200, N: 150,
    };
    const medigapMonthly = medigapPremiums[medigapPlan] || 0;

    const monthlyTotal = partAPremium + partBPremium + partDPremium + medigapMonthly;
    const annualPremiums = monthlyTotal * 12;

    // Part B deductible
    const partBDeductible = partB ? 257 : 0;

    // Procedure costs (patient responsibility ~20% after deductible, less with Medigap)
    let procedureCosts = 0;
    const procedureDetails: { name: string; total: number; youPay: number }[] = [];

    for (const proc of COMMON_PROCEDURES) {
      if (selectedProcedures.includes(proc.name)) {
        const medicarePays = proc.cost * 0.8;
        let patientPays = proc.cost * 0.2;

        // Medigap covers most/all of patient cost
        if (medigapPlan === "F") patientPays = 0;
        else if (medigapPlan === "G") patientPays = patientPays * 0.05;
        else if (medigapPlan === "N") patientPays = patientPays * 0.15;

        procedureCosts += patientPays;
        procedureDetails.push({ name: proc.name, total: proc.cost, youPay: Math.round(patientPays) });
      }
    }

    const annualOOP = annualPremiums + partBDeductible + procedureCosts;

    // Coverage gap analysis
    const hasGap = !partD && age >= 65;
    const gapNote = hasGap
      ? "Without Part D, you have no prescription drug coverage. Consider enrolling to avoid late enrollment penalties."
      : partD
        ? "Your Part D plan provides prescription drug coverage. The coverage gap (donut hole) has been largely closed."
        : "";

    return {
      monthlyTotal,
      annualPremiums,
      partBDeductible,
      procedureCosts: Math.round(procedureCosts),
      procedureDetails,
      annualOOP: Math.round(annualOOP),
      gapNote,
    };
  }, [age, selectedState, partA, partB, partD, medigapPlan, selectedProcedures]);

  const fmt = (n: number) => "$" + n.toLocaleString("en-US");

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Medicare Cost Estimator</h2>
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input
                type="number"
                min={0}
                max={120}
                value={age}
                onChange={e => setAge(Number(e.target.value) || 65)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
              <select
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Medicare Parts */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Medicare Parts</label>
              <div className="flex gap-3">
                {[
                  { label: "Part A", checked: partA, set: setPartA },
                  { label: "Part B", checked: partB, set: setPartB },
                  { label: "Part D", checked: partD, set: setPartD },
                ].map(p => (
                  <label key={p.label} className="flex items-center gap-1.5 text-sm">
                    <input
                      type="checkbox"
                      checked={p.checked}
                      onChange={e => p.set(e.target.checked)}
                      className="accent-teal-600"
                    />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Medigap Plan */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Medigap Plan</label>
              <select
                value={medigapPlan}
                onChange={e => setMedigapPlan(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="none">None</option>
                <option value="F">Plan F (~$250/mo)</option>
                <option value="G">Plan G (~$200/mo)</option>
                <option value="N">Plan N (~$150/mo)</option>
              </select>
            </div>

            {/* Expected Procedures */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Expected Procedures</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {COMMON_PROCEDURES.map(p => (
                  <label key={p.name} className="flex items-center gap-1.5 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedProcedures.includes(p.name)}
                      onChange={() => toggleProcedure(p.name)}
                      className="accent-teal-600"
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-5">
              <div className="text-sm text-slate-500 mb-1">Monthly Premium Total</div>
              <div className="text-3xl font-bold text-teal-700">{fmt(results.monthlyTotal)}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="text-sm text-slate-500 mb-1">Annual Out-of-Pocket Estimate</div>
              <div className="text-3xl font-bold text-slate-800">{fmt(results.annualOOP)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-500">Annual Premiums</div>
                <div className="text-lg font-bold">{fmt(results.annualPremiums)}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-500">Part B Deductible</div>
                <div className="text-lg font-bold">{fmt(results.partBDeductible)}</div>
              </div>
            </div>

            {/* Procedure Costs */}
            {results.procedureDetails.length > 0 && (
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-500 mb-2">Procedure Costs (Your Share)</div>
                {results.procedureDetails.map(p => (
                  <div key={p.name} className="flex justify-between text-sm py-0.5">
                    <span>{p.name}</span>
                    <span className="font-medium">{fmt(p.youPay)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between font-medium text-sm">
                  <span>Total Procedure Costs</span>
                  <span>{fmt(results.procedureCosts)}</span>
                </div>
              </div>
            )}

            {/* Coverage Gap Analysis */}
            {results.gapNote && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="text-xs font-medium text-amber-700 mb-1">Coverage Gap Analysis</div>
                <p className="text-sm text-amber-800">{results.gapNote}</p>
              </div>
            )}
          </div>
        </div>

        {/* High-CPC footer */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 leading-relaxed">
            This Medicare cost estimator provides approximate figures for informational purposes only.
            Actual costs vary by location, provider, and individual circumstances. Consider comparing
            Medicare supplement plans, Medicare Advantage comparison options, prescription drug coverage
            plans, and Medicare enrollment help resources. For long-term care insurance and personalized
            Medicare advice, consult a licensed insurance agent.
          </p>
        </div>
      </div>
    </section>
  );
}
