"use client";

import { useState, useMemo } from "react";

interface Props {
  procedureName: string;
  nationalAvgCost: number;
}

const INSURANCE_TYPES = [
  { value: "medicare", label: "Medicare (Original)" },
  { value: "private", label: "Private Insurance" },
  { value: "uninsured", label: "Uninsured / Self-Pay" },
] as const;

type InsuranceType = (typeof INSURANCE_TYPES)[number]["value"];

function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

export function OutOfPocketEstimator({ procedureName, nationalAvgCost }: Props) {
  const [insuranceType, setInsuranceType] = useState<InsuranceType>("medicare");

  const estimates = useMemo(() => {
    const cost = nationalAvgCost;
    const partBDeductible = 257; // 2025

    const medicare = {
      label: "Medicare",
      oop: Math.round(cost * 0.2 + partBDeductible),
      detail: `20% coinsurance + $${partBDeductible} Part B deductible`,
      color: "teal",
    };

    const privateIns = {
      label: "Private Insurance",
      oop: Math.round(cost * 0.3 + 500),
      detail: "~30% coinsurance + ~$500 avg deductible",
      color: "blue",
    };

    const uninsured = {
      label: "Uninsured / Self-Pay",
      oop: cost,
      detail: "Full cost (many hospitals offer 20-40% self-pay discount if you ask)",
      color: "amber",
    };

    return { medicare, private: privateIns, uninsured };
  }, [nationalAvgCost]);

  const allTypes = [estimates.medicare, estimates.private, estimates.uninsured];
  const maxOop = Math.max(...allTypes.map((t) => t.oop));
  const current = estimates[insuranceType === "private" ? "private" : insuranceType];

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-3">Out-of-Pocket Cost Estimator</h2>
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        {/* Insurance type selector */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Your insurance type
          </label>
          <select
            value={insuranceType}
            onChange={(e) => setInsuranceType(e.target.value as InsuranceType)}
            className="w-full max-w-xs border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            {INSURANCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Result card */}
        <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 mb-5">
          <div className="text-sm text-slate-500 mb-1">
            Estimated out-of-pocket for {procedureName}
          </div>
          <div className="text-3xl font-bold text-teal-700">{fmt(current.oop)}</div>
          <div className="text-sm text-slate-600 mt-1">{current.detail}</div>
          {insuranceType === "uninsured" && (
            <div className="mt-2 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 text-sm text-amber-800">
              Tip: Ask the hospital billing department about self-pay discounts, payment plans, or
              financial assistance programs. Many providers reduce bills 20-40% for uninsured patients
              who negotiate before the procedure.
            </div>
          )}
        </div>

        {/* Comparison bars */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-700 mb-1">
            Cost comparison across insurance types
          </div>
          {allTypes.map((type) => {
            const pct = maxOop > 0 ? (type.oop / maxOop) * 100 : 0;
            const isActive =
              type.label.toLowerCase().includes(insuranceType === "private" ? "private" : insuranceType);
            const bgClass =
              type.color === "teal"
                ? "bg-teal-500"
                : type.color === "blue"
                  ? "bg-blue-500"
                  : "bg-amber-500";
            return (
              <div key={type.label}>
                <div className="flex justify-between text-sm mb-0.5">
                  <span className={isActive ? "font-semibold" : "text-slate-600"}>
                    {type.label}
                  </span>
                  <span className={isActive ? "font-bold" : "font-medium"}>{fmt(type.oop)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${bgClass} ${isActive ? "opacity-100" : "opacity-40"}`}
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 mt-4">
          Estimates based on national average cost of {fmt(nationalAvgCost)} for {procedureName}.
          Actual costs vary by provider, plan, and location. Medicare figures assume Original Medicare
          Part B. Not financial or medical advice.
        </p>
      </div>
    </section>
  );
}
