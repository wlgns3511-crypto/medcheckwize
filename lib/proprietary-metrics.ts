import type { State } from './db';
import type { MedicareStackIndex } from './medicare-stack';
import type { MedigapAccessClassification } from './medigap-access-tier';
import type { IrmaaStateApplication } from './irmaa-tier';

export interface MedicareProprietaryMetrics {
  stackAffordabilityScore: number;
  medigapAccessScore: number;
  irmaaRiskScore: number;
  overallGrade: string;
  commentary: string;
}

/**
 * Returns a deterministic commentary paragraph based on state name, dominant signal, and slug-based hash
 * to rotate content variation and prevent duplicate content.
 */
function getDeterministicCommentary(
  stateName: string,
  dominantSignal: string,
  slug: string
): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % 3;

  const variations: Record<string, string[]> = {
    BirthdayWindowOpen: [
      `Beneficiaries in ${stateName} are protected by the birthday-rule switching window, which allows you to change Medigap plans around your birthday without medical underwriting. This state regulation provides excellent long-term flexibility if your premium rates rise.`,
      `With an active annual birthday rule in ${stateName}, switching Medigap carriers is significantly easier than in standard federal-floor states. This allows seniors to compare plans yearly and bypass health-status underwriting.`,
      `${stateName} includes a vital consumer protection: a birthday-rule window that lets you adjust supplemental coverage without proving good health, offering a major safety net against rising insurer rates.`
    ],
    IrmaaHighEarnerBurden: [
      `${stateName} features high median household incomes, meaning a larger share of retirees here are at risk of crossing the federal IRMAA thresholds and paying monthly Part B and Part D premium surcharges.`,
      `With an elevated household income baseline, retirees in ${stateName} should actively monitor their tax MAGI. Crossing the Tier 1 IRMAA boundary triggers substantial surcharges on both medical and prescription drug coverage.`,
      `Medicare enrollees in ${stateName} face a higher likelihood of IRMAA exposure. Proactive income planning, such as managing capital gains and Roth conversions, is highly recommended to control annual premium surcharges.`
    ],
    MedigapUnderwritingTrap: [
      `Because ${stateName} relies on attained-age rated Medigap policies without year-round guaranteed-issue rights, seniors face a potential underwriting trap. Switching supplement plans after your initial OEP can result in rejection or high rates.`,
      ` Supplemental coverage in ${stateName} is highly sensitive to health status outside the initial enrollment period. Seniors must plan ahead, as underwriters can review pre-existing conditions if you attempt to switch carriers.`,
      `With minimal state-level Medigap overlays, ${stateName} leaves enrollees exposed to health-based underwriting outside their initial window. Locking in a stable Plan G or Plan N early is crucial.`
    ],
    StackLowMedigapOpen: [
      `Retirees in ${stateName} enjoy the best of both worlds: a highly affordable monthly premium stack combined with excellent state-level guaranteed-issue rights. Supplemental plans are accessible and competitively priced.`,
      `${stateName} represents an ideal Medicare planning environment, combining low baseline premiums with year-round Medigap accessibility rules. This keeps out-of-pocket exposure minimal for local seniors.`,
      `Stable pricing and consumer-friendly enrollment rules make ${stateName} one of the most favorable states for Medicare beneficiaries, allowing easy navigation of supplemental plan options.`
    ],
    ExpansionStateMedicaidBridge: [
      `${stateName} has expanded Medicaid under the ACA, providing a critical low-income bridge for near-retirees. This safety net reduces the uninsured rate and helps vulnerable populations transition smoothly into Medicare.`,
      `Medicaid expansion in ${stateName} offers a robust financial buffer for low-income seniors. This state policy helps cover costs that standard Medicare premiums might otherwise make prohibitive.`,
      `By expanding Medicaid, ${stateName} ensures that lower-income beneficiaries have access to dual-eligible pathways, bridging the gap between work-years and senior healthcare coverage.`
    ],
    StandardSelfPayLane: [
      `Medicare administration in ${stateName} follows the standard federal baseline. Lacking custom state-level Medigap or premium overlays, seniors should expect standard attained-age rate adjustments and planning rules.`,
      `Beneficiaries in ${stateName} navigate a standard federal Medicare environment. Supplemental choices are governed by standard OEP windows, and rates follow general regional healthcare inflation.`,
      `Without custom state-level DOI overlays, ${stateName} represents a standard Medicare lane. Early enrollment planning is recommended to lock in favorable rates before underwriting rules apply.`
    ]
  };

  const list = variations[dominantSignal] || variations['StandardSelfPayLane'];
  return list[index];
}

/**
 * Calculates proprietary Medicare metrics for MedCheckWize.
 */
export function calculateProprietaryMetrics(
  state: State,
  stack: MedicareStackIndex | null,
  medigap: MedigapAccessClassification,
  irmaa: IrmaaStateApplication,
  dominantSignal: string,
  slug: string
): MedicareProprietaryMetrics {
  // 1. Premium Affordability Score (0-100)
  // Higher is better (cheaper stack)
  const stackAffordabilityScore = stack ? stack.affordabilityScore : 50;

  // 2. Medigap Access Security Score (0-100)
  // Higher is better (more consumer protections)
  const medigapScores: Record<string, number> = {
    A: 95, // guaranteed-issue year-round
    B: 80, // community-rated
    C: 65, // issue-age rated / birthday rule
    D: 40, // attained-age rated
    E: 20, // medically underwritten outside OEP
  };
  const medigapAccessScore = medigapScores[medigap.tier] || 50;

  // 3. IRMAA Risk Score (0-100)
  // Higher is better (lower risk of surcharges at median income)
  // magiTier is 0 to 5.
  const irmaaScores: Record<number, number> = {
    0: 95,
    1: 75,
    2: 55,
    3: 35,
    4: 20,
    5: 10,
  };
  const irmaaRiskScore = irmaaScores[irmaa.magiTier] || 50;

  // 4. Overall Medicare Plan Grade
  const composite = 0.5 * stackAffordabilityScore + 0.3 * medigapAccessScore + 0.2 * irmaaRiskScore;
  let overallGrade = 'C';
  if (composite >= 90) overallGrade = 'A+';
  else if (composite >= 85) overallGrade = 'A';
  else if (composite >= 80) overallGrade = 'A-';
  else if (composite >= 75) overallGrade = 'B+';
  else if (composite >= 70) overallGrade = 'B';
  else if (composite >= 65) overallGrade = 'B-';
  else if (composite >= 60) overallGrade = 'C+';
  else if (composite >= 55) overallGrade = 'C';
  else if (composite >= 50) overallGrade = 'C-';
  else if (composite >= 45) overallGrade = 'D+';
  else if (composite >= 40) overallGrade = 'D';
  else overallGrade = 'F';

  // 5. Commentary
  const commentary = getDeterministicCommentary(state.state, dominantSignal, slug);

  return {
    stackAffordabilityScore,
    medigapAccessScore,
    irmaaRiskScore,
    overallGrade,
    commentary,
  };
}
