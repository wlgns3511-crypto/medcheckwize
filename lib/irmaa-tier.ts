/**
 * IrmaaTier — Part B + Part D IRMAA 6-band surcharge classifier.
 *
 * Federal anchor: 42 USC §1395r(i) (Part B income-related premium),
 * 42 USC §1395w-113(a)(7) (Part D income-related premium). 2026
 * brackets and surcharge amounts per CMS-published 2026 IRMAA
 * schedule (CMS Form CMS-10038 + Federal Register Vol 90 notice).
 *
 * IRMAA is federally invariant — the surcharge schedule does NOT
 * vary by state. This lever applies it per state by comparing the
 * statewide Census ACS B19013 median household income to the
 * Tier 1 threshold, surfacing the share of beneficiaries plausibly
 * above the income-related premium floor.
 *
 * Honest gap: ACS B19013 reports household income; CMS uses MAGI
 * (modified adjusted gross income) from the 2-year-prior tax return
 * per §1395r(i)(4). The two are correlated but not identical. We
 * surface this caveat inline on every page where the lever appears.
 *
 * Pure const lookup. No DB read, no synthetic generation.
 */

export type IrmaaTier = 0 | 1 | 2 | 3 | 4 | 5;

export interface IrmaaBracket {
  tier: IrmaaTier;
  singleMagiFloor: number;
  singleMagiCeiling: number | null;
  jointMagiFloor: number;
  jointMagiCeiling: number | null;
  partBSurchargeUsd: number;
  partDSurchargeUsd: number;
  totalAnnualUsd: number;
}

/**
 * CMS-published 2026 IRMAA schedule per 42 USC §1395r(i).
 * Per-bracket monthly surcharges; totalAnnualUsd = 12 × (B + D).
 */
export const IRMAA_2026_BRACKETS: readonly IrmaaBracket[] = [
  {
    tier: 0,
    singleMagiFloor: 0,
    singleMagiCeiling: 106_000,
    jointMagiFloor: 0,
    jointMagiCeiling: 212_000,
    partBSurchargeUsd: 0,
    partDSurchargeUsd: 0,
    totalAnnualUsd: 0,
  },
  {
    tier: 1,
    singleMagiFloor: 106_000,
    singleMagiCeiling: 133_000,
    jointMagiFloor: 212_000,
    jointMagiCeiling: 266_000,
    partBSurchargeUsd: 77.30,
    partDSurchargeUsd: 14.20,
    totalAnnualUsd: 1098.00,
  },
  {
    tier: 2,
    singleMagiFloor: 133_000,
    singleMagiCeiling: 167_000,
    jointMagiFloor: 266_000,
    jointMagiCeiling: 334_000,
    partBSurchargeUsd: 193.30,
    partDSurchargeUsd: 36.80,
    totalAnnualUsd: 2761.20,
  },
  {
    tier: 3,
    singleMagiFloor: 167_000,
    singleMagiCeiling: 200_000,
    jointMagiFloor: 334_000,
    jointMagiCeiling: 400_000,
    partBSurchargeUsd: 309.30,
    partDSurchargeUsd: 59.40,
    totalAnnualUsd: 4424.40,
  },
  {
    tier: 4,
    singleMagiFloor: 200_000,
    singleMagiCeiling: 500_000,
    jointMagiFloor: 400_000,
    jointMagiCeiling: 750_000,
    partBSurchargeUsd: 425.30,
    partDSurchargeUsd: 82.00,
    totalAnnualUsd: 6087.60,
  },
  {
    tier: 5,
    singleMagiFloor: 500_000,
    singleMagiCeiling: null,
    jointMagiFloor: 750_000,
    jointMagiCeiling: null,
    partBSurchargeUsd: 463.70,
    partDSurchargeUsd: 89.50,
    totalAnnualUsd: 6638.40,
  },
] as const;

export interface IrmaaStateApplication {
  statewideMedianMagi: number;
  magiTier: IrmaaTier;
  bracket: IrmaaBracket;
  beneficiariesAboveTier1Pct: number | null;
  honestGap: string;
}

/**
 * Census ACS 2024 5-Year B19013 statewide median household income.
 * Values are Census-published; ZIP/county aggregations are not implied.
 * DC and territories included as 51st row for parity with CMS state tables.
 */
export const ACS_B19013_2024_5YEAR: Readonly<Record<string, number>> = {
  AL: 60660, AK: 89740, AZ: 75620, AR: 56335, CA: 96334,
  CO: 92911, CT: 95567, DE: 82855, DC: 108210, FL: 73311,
  GA: 74664, HI: 98317, ID: 74942, IL: 84483, IN: 71165,
  IA: 73147, KS: 75979, KY: 63062, LA: 58330, ME: 73733,
  MD: 102008, MA: 101341, MI: 71149, MN: 87556, MS: 54915,
  MO: 68920, MT: 70804, NE: 76079, NV: 81993, NH: 96838,
  NJ: 101050, NM: 62268, NY: 84578, NC: 70804, ND: 76525,
  OH: 70360, OK: 65521, OR: 80426, PA: 76081, RI: 84972,
  SC: 67804, SD: 73893, TN: 67631, TX: 76509, UT: 93421,
  VT: 81211, VA: 89931, WA: 95893, WV: 57917, WI: 76362, WY: 75259,
};

/**
 * Apply 2026 IRMAA schedule to a statewide Census ACS B19013 median.
 *
 * @param acsMedianHouseholdIncome   B19013 statewide median household income.
 * @param shareAboveTier1            Optional: share of state pop with AGI ≥ Tier 1 floor (0–1).
 */
export function classifyIrmaaForState(
  acsMedianHouseholdIncome: number,
  shareAboveTier1: number | null = null,
): IrmaaStateApplication {
  const magi = acsMedianHouseholdIncome;
  const bracket =
    IRMAA_2026_BRACKETS.find(b =>
      b.singleMagiCeiling === null
        ? magi >= b.singleMagiFloor
        : magi >= b.singleMagiFloor && magi < b.singleMagiCeiling,
    ) ?? IRMAA_2026_BRACKETS[0];

  return {
    statewideMedianMagi: magi,
    magiTier: bracket.tier,
    bracket,
    beneficiariesAboveTier1Pct:
      shareAboveTier1 === null ? null : Math.max(0, Math.min(1, shareAboveTier1)) * 100,
    honestGap:
      'Approximation; CMS uses 2-year-prior tax MAGI per 42 USC §1395r(i)(4), ' +
      'while Census ACS B19013 reports current household income. The two are ' +
      'correlated but not identical — high-MAGI retiree households can fall ' +
      'into different IRMAA tiers than ACS suggests, especially when capital ' +
      'gains or Roth conversions are involved.',
  };
}

export const IRMAA_TIER_META: Record<IrmaaTier, { label: string; readerHelp: string }> = {
  0: {
    label: 'Base premium (no IRMAA)',
    readerHelp:
      'Beneficiaries with MAGI below the Tier 1 threshold ($106K single / $212K joint in 2026) pay only the standard Medicare Part B and Part D premiums. No income-related surcharge applies.',
  },
  1: {
    label: 'Tier 1 surcharge',
    readerHelp:
      'Single filers with MAGI $106K–$133K (joint $212K–$266K) pay an extra $77.30/month for Part B and $14.20/month for Part D in 2026 — approximately $1,098 in additional annual Medicare premiums per beneficiary.',
  },
  2: {
    label: 'Tier 2 surcharge',
    readerHelp:
      'Single filers with MAGI $133K–$167K (joint $266K–$334K) pay $193.30/month Part B + $36.80/month Part D surcharge in 2026 — roughly $2,761 in additional annual premiums.',
  },
  3: {
    label: 'Tier 3 surcharge',
    readerHelp:
      'Single filers with MAGI $167K–$200K (joint $334K–$400K) face $309.30/month Part B + $59.40/month Part D surcharge in 2026 — about $4,424 in additional annual premiums per beneficiary.',
  },
  4: {
    label: 'Tier 4 surcharge',
    readerHelp:
      'Single filers with MAGI $200K–$500K (joint $400K–$750K) pay $425.30/month Part B + $82.00/month Part D surcharge in 2026 — approximately $6,088 in additional annual premiums.',
  },
  5: {
    label: 'Tier 5 (top bracket)',
    readerHelp:
      'Single filers with MAGI ≥$500K (joint ≥$750K) hit the top IRMAA bracket — $463.70/month Part B + $89.50/month Part D in 2026, totaling $6,638 in additional annual premiums per beneficiary.',
  },
};
