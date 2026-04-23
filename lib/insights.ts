export interface Insight {
  text: string;
  sentiment?: "positive" | "negative" | "neutral";
}

interface ProcedureData {
  name: string;
  national_avg_cost: number;
  medicare_pays: number;
  patient_pays: number;
  category: string;
  description?: string;
}

interface StateData {
  state_name: string;
  avg_cost: number;
  medicare_pays: number;
  patient_pays: number;
}

export function generateInsights(
  proc: ProcedureData,
  stateData: StateData[],
): Insight[] {
  const insights: Insight[] = [];

  // 1. Medicare coverage ratio
  const coverageRatio = proc.medicare_pays / proc.national_avg_cost;
  const coveragePct = Math.round(coverageRatio * 100);
  if (coveragePct >= 75) {
    insights.push({
      text: `Medicare covers ${coveragePct}% of the ${proc.name} cost nationally, leaving a relatively small out-of-pocket burden for beneficiaries.`,
      sentiment: "positive",
    });
  } else if (coveragePct >= 50) {
    insights.push({
      text: `Medicare covers ${coveragePct}% of the ${proc.name} cost. Beneficiaries should budget approximately $${Math.round(proc.patient_pays)} in out-of-pocket costs.`,
      sentiment: "neutral",
    });
  } else {
    insights.push({
      text: `Medicare covers only ${coveragePct}% of the ${proc.name} cost. A Medigap or Medicare Advantage plan is strongly recommended to offset the $${Math.round(proc.patient_pays)} patient responsibility.`,
      sentiment: "negative",
    });
  }

  // 2. Cost range across states
  if (stateData.length >= 2) {
    const sorted = [...stateData].sort((a, b) => a.avg_cost - b.avg_cost);
    const cheapest = sorted[0];
    const mostExpensive = sorted[sorted.length - 1];
    const spread = mostExpensive.avg_cost - cheapest.avg_cost;
    const spreadPct = Math.round((spread / cheapest.avg_cost) * 100);
    insights.push({
      text: `${proc.name} costs vary ${spreadPct}% across states: from $${Math.round(cheapest.avg_cost)} in ${cheapest.state_name} to $${Math.round(mostExpensive.avg_cost)} in ${mostExpensive.state_name}.`,
      sentiment: spreadPct > 50 ? "negative" : "neutral",
    });
  }

  // 3. Typical cost category assessment
  if (proc.national_avg_cost < 200) {
    insights.push({
      text: `At $${Math.round(proc.national_avg_cost)} nationally, ${proc.name} is a low-cost procedure. For most Medicare beneficiaries, the coinsurance will be under $50.`,
      sentiment: "positive",
    });
  } else if (proc.national_avg_cost < 1000) {
    insights.push({
      text: `${proc.name} falls in the moderate cost range at $${Math.round(proc.national_avg_cost)}. Without supplemental insurance, expect to pay around $${Math.round(proc.patient_pays)} after Medicare.`,
      sentiment: "neutral",
    });
  } else {
    insights.push({
      text: `${proc.name} is a high-cost procedure at $${Math.round(proc.national_avg_cost)} nationally. Beneficiaries without Medigap coverage could face a $${Math.round(proc.patient_pays)} out-of-pocket bill.`,
      sentiment: "negative",
    });
  }

  // 4. Patient out-of-pocket relative to annual Part B deductible
  const partBDeductible = 257;
  if (proc.patient_pays > partBDeductible) {
    insights.push({
      text: `The patient cost of $${Math.round(proc.patient_pays)} exceeds the annual Part B deductible ($${partBDeductible}), meaning this single procedure could use your entire deductible plus coinsurance.`,
      sentiment: "negative",
    });
  } else {
    insights.push({
      text: `The patient cost of $${Math.round(proc.patient_pays)} is within the annual Part B deductible ($${partBDeductible}), making this relatively affordable for Medicare beneficiaries.`,
      sentiment: "positive",
    });
  }

  // 5. State-level savings opportunity
  if (stateData.length >= 5) {
    const sorted = [...stateData].sort((a, b) => a.patient_pays - b.patient_pays);
    const cheapestPatient = sorted[0];
    const medianIdx = Math.floor(sorted.length / 2);
    const medianPatient = sorted[medianIdx];
    const savings = medianPatient.patient_pays - cheapestPatient.patient_pays;
    if (savings > 20) {
      insights.push({
        text: `Beneficiaries in ${cheapestPatient.state_name} pay $${Math.round(savings)} less out-of-pocket than the median state for ${proc.name}. Location matters for this procedure.`,
        sentiment: "positive",
      });
    }
  }

  return insights.slice(0, 5);
}

// --- State-level Medicare Insights (for state/[slug] page) ---

interface StateInsightData {
  state: string;
  abbr: string;
  avg_medicare_spending_per_capita: number;
  medicare_enrollees: number;
  medicaid_enrollees: number;
  part_b_premium: number;
  part_d_premium_avg: number;
  medigap_avg_premium: number;
  medicaid_expansion: string;
  uninsured_rate: number;
}

interface NationalAverages {
  avg_spending: number;
  avg_uninsured: number;
  avg_part_b: number;
  avg_part_d: number;
  avg_medigap: number;
}

export function getStateInsights(
  state: StateInsightData,
  national: NationalAverages,
  affordRank: number,
): Insight[] {
  const insights: Insight[] = [];

  // 1. Spending vs national average
  const spendingDiff = ((state.avg_medicare_spending_per_capita - national.avg_spending) / national.avg_spending * 100);
  insights.push({
    text: `Medicare spending in ${state.state} is $${Math.round(state.avg_medicare_spending_per_capita).toLocaleString()}/capita — ${Math.abs(Math.round(spendingDiff))}% ${spendingDiff > 0 ? "above" : "below"} the national average of $${Math.round(national.avg_spending).toLocaleString()}. ${spendingDiff > 15 ? "Higher spending may reflect more intensive care patterns or higher regional healthcare costs." : spendingDiff < -15 ? "Lower spending could mean more efficient care delivery or a healthier population." : ""}`,
    sentiment: spendingDiff > 10 ? "negative" : spendingDiff < -10 ? "positive" : "neutral",
  });

  // 2. Affordability rank
  insights.push({
    text: `${state.state} ranks #${affordRank} out of 50 states for Medicare affordability (lower spending = better rank). ${affordRank <= 10 ? "One of the most affordable states for Medicare beneficiaries." : affordRank >= 40 ? "Among the most expensive states for Medicare costs." : "Mid-range affordability compared to other states."}`,
    sentiment: affordRank <= 15 ? "positive" : affordRank >= 35 ? "negative" : "neutral",
  });

  // 3. Total premium burden
  const premiumTotal = state.part_b_premium + state.part_d_premium_avg + state.medigap_avg_premium;
  const avgPremiumTotal = national.avg_part_b + national.avg_part_d + national.avg_medigap;
  const premiumDiff = premiumTotal - avgPremiumTotal;
  insights.push({
    text: `Combined monthly premiums (Part B + Part D + Medigap) average $${Math.round(premiumTotal)}/mo in ${state.state}, which is $${Math.abs(Math.round(premiumDiff))} ${premiumDiff > 0 ? "more" : "less"} than the national average of $${Math.round(avgPremiumTotal)}/mo. That's $${Math.abs(Math.round(premiumDiff * 12))}/yr in ${premiumDiff > 0 ? "extra" : "saved"} premium costs.`,
    sentiment: premiumDiff < -20 ? "positive" : premiumDiff > 20 ? "negative" : "neutral",
  });

  // 4. Uninsured rate
  const uninsuredDiff = state.uninsured_rate - national.avg_uninsured;
  insights.push({
    text: `${state.state}'s uninsured rate of ${state.uninsured_rate.toFixed(1)}% is ${Math.abs(uninsuredDiff).toFixed(1)} percentage points ${uninsuredDiff > 0 ? "above" : "below"} the national average of ${national.avg_uninsured.toFixed(1)}%. ${state.medicaid_expansion === "yes" ? "Medicaid expansion has helped broaden coverage." : "The state has not expanded Medicaid, which may limit coverage options for low-income residents."}`,
    sentiment: uninsuredDiff < -1 ? "positive" : uninsuredDiff > 1 ? "negative" : "neutral",
  });

  // 5. Enrollment scale
  const totalEnrolled = state.medicare_enrollees + state.medicaid_enrollees;
  insights.push({
    text: `${state.state} has ${(state.medicare_enrollees / 1e6).toFixed(1)}M Medicare and ${(state.medicaid_enrollees / 1e6).toFixed(1)}M Medicaid beneficiaries — ${(totalEnrolled / 1e6).toFixed(1)}M total enrolled in public health programs. ${totalEnrolled > 5e6 ? "A major healthcare market with significant policy influence." : totalEnrolled > 1e6 ? "A mid-size healthcare market." : "A smaller market where individual provider choices have outsized impact."}`,
    sentiment: "neutral",
  });

  return insights.slice(0, 5);
}
