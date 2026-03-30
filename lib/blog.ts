export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  readingTime: number;
  content: string;
}

const posts: BlogPost[] = [
  {
    slug: "medicare-vs-medicaid-differences",
    title: "Medicare vs. Medicaid: Key Differences Every American Should Know",
    description:
      "Medicare and Medicaid are two of the largest government health programs in the US, but they serve very different populations. Here's what you need to know about each.",
    publishedAt: "2024-10-15",
    updatedAt: "2025-01-10",
    category: "Medicare Basics",
    readingTime: 7,
    content: `
<h2>What Is Medicare?</h2>
<p>Medicare is a <strong>federal health insurance program</strong> primarily for people aged 65 and older. It also covers certain younger individuals with disabilities and people with End-Stage Renal Disease (ESRD). Unlike Medicaid, Medicare is not means-tested — eligibility is based on age and work history, not income.</p>
<p>Medicare is divided into four parts:</p>
<ul>
  <li><strong>Part A</strong> — Hospital insurance (inpatient care, skilled nursing, hospice)</li>
  <li><strong>Part B</strong> — Medical insurance (outpatient care, doctor visits, preventive services)</li>
  <li><strong>Part C</strong> — Medicare Advantage (private plans bundling A+B, often with extras)</li>
  <li><strong>Part D</strong> — Prescription drug coverage</li>
</ul>

<h2>What Is Medicaid?</h2>
<p>Medicaid is a <strong>joint federal-state program</strong> that provides health coverage to low-income individuals and families. Unlike Medicare, Medicaid is means-tested — you must meet income and asset limits to qualify. Because it's administered by states, eligibility rules, covered services, and provider payments vary significantly from state to state.</p>
<p>Medicaid covers a broad population including:</p>
<ul>
  <li>Low-income adults (especially following ACA expansion)</li>
  <li>Children in low-income families</li>
  <li>Pregnant women below income thresholds</li>
  <li>People with disabilities</li>
  <li>Low-income seniors (often dually eligible with Medicare)</li>
</ul>

<h2>Key Differences at a Glance</h2>
<table>
  <thead><tr><th>Feature</th><th>Medicare</th><th>Medicaid</th></tr></thead>
  <tbody>
    <tr><td>Who runs it?</td><td>Federal government (CMS)</td><td>Federal + state governments</td></tr>
    <tr><td>Who qualifies?</td><td>65+, disabled, ESRD</td><td>Low-income individuals/families</td></tr>
    <tr><td>Income-based?</td><td>No</td><td>Yes</td></tr>
    <tr><td>Premiums?</td><td>Yes (Part B, D)</td><td>Rarely, very low if any</td></tr>
    <tr><td>Long-term care?</td><td>Very limited</td><td>Yes (primary payer)</td></tr>
  </tbody>
</table>

<h2>What Each Program Covers</h2>
<h3>Medicare Coverage</h3>
<p>Medicare covers hospital stays, physician visits, outpatient services, preventive screenings, and prescription drugs. However, it does <strong>not</strong> cover dental, vision, hearing aids, or long-term custodial care. These gaps are significant, and many beneficiaries buy supplemental Medigap policies to fill them.</p>

<h3>Medicaid Coverage</h3>
<p>Medicaid often covers everything Medicare does, plus dental care, vision, hearing, and — critically — <strong>long-term care in nursing homes</strong>. This makes Medicaid the primary payer for nursing home care in the US for those who qualify after a spend-down process.</p>

<h2>Dual Eligibility</h2>
<p>About 12 million Americans qualify for <strong>both Medicare and Medicaid</strong>, known as "dual eligibles." These individuals typically have Medicare as their primary insurer, with Medicaid covering premiums, cost-sharing, and services Medicare doesn't cover. Dual eligibles often have access to special D-SNP (Dual Special Needs Plan) Medicare Advantage plans.</p>

<h2>Cost Differences</h2>
<p>Medicare beneficiaries pay premiums (Part B is $174.70/month in 2024 at standard), deductibles, and coinsurance. Medicaid is typically free or very low cost for enrollees — the federal government reimburses states for 50–77% of costs based on a state's per-capita income.</p>

<h2>How to Enroll</h2>
<p><strong>Medicare</strong>: You can enroll through Social Security Administration (SSA) online, by phone, or at a local SSA office. Most people are automatically enrolled at 65 if they're already receiving Social Security benefits.</p>
<p><strong>Medicaid</strong>: Apply through your state's Medicaid agency or through HealthCare.gov. Income and asset documentation is required. Eligibility is re-determined annually.</p>
`,
  },
  {
    slug: "medicare-advantage-vs-original",
    title: "Medicare Advantage vs. Original Medicare: Which Is Better?",
    description:
      "Should you choose Medicare Advantage or stick with Original Medicare? The answer depends on your health needs, finances, and where you live. Here's a complete comparison.",
    publishedAt: "2024-10-20",
    updatedAt: "2025-01-12",
    category: "Medicare Plans",
    readingTime: 8,
    content: `
<h2>Understanding Original Medicare</h2>
<p>Original Medicare consists of <strong>Part A</strong> (hospital coverage) and <strong>Part B</strong> (medical coverage). It operates on a fee-for-service model — you can see any doctor or specialist who accepts Medicare, nationwide, with no referrals required. Medicare pays approximately 80% of covered costs after your deductible; you pay the remaining 20% with no out-of-pocket maximum.</p>
<p>The lack of an out-of-pocket cap is the major weakness of Original Medicare. A serious illness could cost you tens of thousands of dollars in cost-sharing — which is why many people add a <strong>Medigap (Medicare Supplement)</strong> policy.</p>

<h2>Understanding Medicare Advantage (Part C)</h2>
<p>Medicare Advantage plans are offered by private insurers approved by CMS. These plans must cover everything Original Medicare covers, but they often add extra benefits and change the cost structure. They typically feature:</p>
<ul>
  <li><strong>Lower premiums</strong> — many plans cost $0/month beyond the Part B premium</li>
  <li><strong>Out-of-pocket maximums</strong> — legally required cap (up to $8,850 in 2024 for in-network)</li>
  <li><strong>Extra benefits</strong> — dental, vision, hearing, fitness memberships, transportation</li>
  <li><strong>Network restrictions</strong> — HMO plans require staying in-network; PPO plans allow out-of-network at higher cost</li>
</ul>

<h2>HMO vs. PPO Medicare Advantage</h2>
<table>
  <thead><tr><th>Feature</th><th>HMO</th><th>PPO</th></tr></thead>
  <tbody>
    <tr><td>Network requirement</td><td>Must stay in-network</td><td>Can go out-of-network (at higher cost)</td></tr>
    <tr><td>Primary care physician</td><td>Required; needs referrals</td><td>Optional; no referrals needed</td></tr>
    <tr><td>Premium</td><td>Typically lower</td><td>Typically higher</td></tr>
    <tr><td>Best for</td><td>Those who want lower costs and have local providers</td><td>Those who want flexibility</td></tr>
  </tbody>
</table>

<h2>Medigap as an Alternative</h2>
<p>If you choose Original Medicare, Medigap fills the cost-sharing gaps. Plan G (the most popular post-2020) covers nearly all out-of-pocket costs after the Part B deductible (~$240/year). Monthly premiums range from $100–$300+ depending on age, gender, and state. The tradeoff: you get nationwide coverage and predictable costs, but pay more monthly.</p>

<h2>Who Should Choose What?</h2>
<h3>Medicare Advantage may be better if you:</h3>
<ul>
  <li>Are relatively healthy and want low monthly costs</li>
  <li>Live in an area with strong plan networks</li>
  <li>Want dental, vision, or hearing coverage bundled in</li>
  <li>Don't travel frequently across state lines for care</li>
</ul>

<h3>Original Medicare + Medigap may be better if you:</h3>
<ul>
  <li>Have chronic conditions requiring frequent specialist care</li>
  <li>Travel frequently or have doctors in multiple states</li>
  <li>Want predictability and no network restrictions</li>
  <li>Can afford the higher monthly Medigap premium</li>
</ul>

<h2>The Switching Problem</h2>
<p>One important caveat: if you enroll in Medicare Advantage and later want to switch to Original Medicare + Medigap, you may face <strong>medical underwriting</strong> in most states (except during your initial enrollment window). Insurers can deny or charge more for Medigap if you have pre-existing conditions. Plan your initial choice carefully.</p>

<h2>Star Ratings Matter</h2>
<p>CMS rates Medicare Advantage plans from 1–5 stars based on quality and performance. Plans rated 4 or 5 stars receive bonus payments and often offer better benefits. Check plan ratings at Medicare.gov before enrolling.</p>
`,
  },
  {
    slug: "how-much-medicare-costs-2024",
    title: "How Much Does Medicare Cost in 2024? Complete Breakdown",
    description:
      "Medicare costs include premiums, deductibles, coinsurance, and out-of-pocket expenses. Here's every number you need to budget for Medicare in 2024.",
    publishedAt: "2024-11-01",
    category: "Medicare Costs",
    readingTime: 6,
    content: `
<h2>Part A Costs (Hospital Insurance)</h2>
<p>Most Medicare beneficiaries pay <strong>$0 per month</strong> for Part A if they or their spouse worked and paid Medicare taxes for at least 10 years (40 quarters). Those with fewer qualifying quarters pay $278–$506/month in 2024.</p>
<p>Even with no premium, Part A has significant cost-sharing:</p>
<ul>
  <li><strong>Inpatient deductible</strong>: $1,632 per benefit period (not per year)</li>
  <li><strong>Days 1–60</strong>: $0 coinsurance after deductible</li>
  <li><strong>Days 61–90</strong>: $408/day coinsurance</li>
  <li><strong>Lifetime reserve days</strong>: $816/day (60 days total, used once)</li>
  <li><strong>Skilled nursing facility</strong>: First 20 days free, days 21–100 cost $204/day</li>
</ul>

<h2>Part B Costs (Medical Insurance)</h2>
<p>The <strong>standard Part B premium is $174.70/month</strong> in 2024. This covers doctor visits, outpatient care, preventive services, and durable medical equipment.</p>
<p>The Part B deductible is <strong>$240 per year</strong> in 2024. After that, Medicare pays 80% and you pay 20% — with no out-of-pocket maximum under Original Medicare.</p>

<h2>IRMAA: Income-Related Premium Surcharges</h2>
<p>If your income exceeds certain thresholds (based on your tax return from 2 years prior), you pay higher Part B and Part D premiums. These Income-Related Monthly Adjustment Amounts (IRMAA) can be substantial:</p>
<table>
  <thead><tr><th>Individual Income</th><th>Part B Premium</th></tr></thead>
  <tbody>
    <tr><td>Up to $103,000</td><td>$174.70/month</td></tr>
    <tr><td>$103,001 – $129,000</td><td>$244.60/month</td></tr>
    <tr><td>$129,001 – $161,000</td><td>$349.40/month</td></tr>
    <tr><td>$161,001 – $193,000</td><td>$454.20/month</td></tr>
    <tr><td>Over $500,000</td><td>$594.00/month</td></tr>
  </tbody>
</table>

<h2>Part D Costs (Prescription Drugs)</h2>
<p>Part D premiums vary by plan but average about <strong>$55.50/month</strong> in 2024. The annual deductible cannot exceed $545. After the deductible, cost-sharing applies until you reach the out-of-pocket maximum of <strong>$8,000 in 2024</strong> (a new cap this year under the Inflation Reduction Act).</p>
<p>Important 2024 change: once you reach $8,000 out-of-pocket on drugs, Medicare covers 100% — the catastrophic phase with 5% cost-sharing has been eliminated.</p>

<h2>Medigap Premiums</h2>
<p>If you buy a Medigap policy to cover Original Medicare gaps, expect to pay <strong>$100–$300+/month</strong> depending on:</p>
<ul>
  <li>Your age (premiums increase with age in most states)</li>
  <li>Plan type (Plan G covers most, Plan N has lower premiums with some copays)</li>
  <li>Your state (some states regulate Medigap pricing)</li>
  <li>Whether you smoke (insurers can charge more in most states)</li>
</ul>

<h2>Total Annual Cost Estimates</h2>
<p>For a typical Medicare beneficiary on Original Medicare with Plan G Medigap and a Part D plan, expect to pay roughly <strong>$3,500–$6,000 per year</strong> in premiums alone, before any copays or drug costs. Medicare Advantage can reduce this significantly — some plans cost only the Part B premium (~$2,100/year) but with network restrictions and variable cost-sharing.</p>
`,
  },
  {
    slug: "medicare-enrollment-deadlines",
    title: "Medicare Enrollment Deadlines: Miss These and Pay Penalties Forever",
    description:
      "Medicare enrollment has strict deadlines — miss them and you'll pay permanent premium penalties. Here are all the windows you need to know.",
    publishedAt: "2024-11-15",
    category: "Medicare Basics",
    readingTime: 6,
    content: `
<h2>Initial Enrollment Period (IEP)</h2>
<p>Your Initial Enrollment Period is a <strong>7-month window</strong> around your 65th birthday:</p>
<ul>
  <li>3 months before the month you turn 65</li>
  <li>The month you turn 65</li>
  <li>3 months after the month you turn 65</li>
</ul>
<p>If you enroll during the first 3 months, coverage starts the first day of your birthday month. If you enroll in month 4 or later, your coverage start is delayed 1–3 months. Enroll as early as possible to avoid gaps.</p>

<h2>Special Enrollment Period (SEP)</h2>
<p>If you're covered by employer-sponsored insurance (your own or a spouse's) when you turn 65, you can delay Medicare without penalty. When that coverage ends, you have an <strong>8-month SEP</strong> to enroll in Part A and B.</p>
<p>Important: COBRA and retiree coverage do NOT count as "employer coverage" for SEP purposes. If you lose employer coverage and rely on COBRA, your SEP clock started when employment ended, not when COBRA ends.</p>

<h2>General Enrollment Period (GEP)</h2>
<p>If you miss your IEP and don't qualify for an SEP, you must wait for the <strong>General Enrollment Period: January 1 – March 31</strong> each year. Coverage begins July 1 of that year — meaning you could have up to 6 months without coverage.</p>
<p>Worse, you'll likely pay a <strong>permanent Part B premium penalty</strong>: 10% added for each full 12-month period you were eligible but not enrolled. Miss 2 years? Your premium goes up 20% — forever.</p>

<h2>Part D Late Enrollment Penalty</h2>
<p>The Part D penalty is calculated as <strong>1% of the national base beneficiary premium for every month</strong> you were without creditable drug coverage. In 2024, the base premium is about $34.70/month, so each month of delay adds roughly $0.35/month to your premium — permanently.</p>
<p>Example: Miss Part D for 24 months = 24% penalty ≈ $8.33/month extra, every year for life.</p>

<h2>Employer Coverage Exception Rules</h2>
<p>You're exempt from penalties if you had coverage through an employer with <strong>20 or more employees</strong> during the gap period. Smaller employer plans may not qualify — check with your HR department and get written confirmation that your employer coverage is "creditable."</p>
<p>For Part D, any drug coverage that's "at least as good as Medicare" counts as creditable — including employer plans, VA coverage, and TRICARE. Your insurer must send you an annual notice of creditable coverage.</p>

<h2>Medicare Advantage and Part D Open Enrollment</h2>
<p>Each year, Medicare Advantage and Part D have an <strong>Annual Enrollment Period (AEP): October 15 – December 7</strong>. Changes made during AEP take effect January 1. There's also an Open Enrollment Period (OEP) from January 1 – March 31 specifically to switch Medicare Advantage plans or return to Original Medicare.</p>

<h2>Key Dates Summary</h2>
<table>
  <thead><tr><th>Enrollment Period</th><th>Dates</th><th>Covers</th></tr></thead>
  <tbody>
    <tr><td>Initial Enrollment Period</td><td>7 months around 65th birthday</td><td>Parts A, B, D, MA</td></tr>
    <tr><td>Special Enrollment Period</td><td>8 months after employer coverage ends</td><td>Parts A, B</td></tr>
    <tr><td>General Enrollment Period</td><td>Jan 1 – Mar 31</td><td>Parts A, B (penalty applies)</td></tr>
    <tr><td>Annual Enrollment Period</td><td>Oct 15 – Dec 7</td><td>Part D, MA plans</td></tr>
    <tr><td>Medicare Advantage OEP</td><td>Jan 1 – Mar 31</td><td>MA plan switches only</td></tr>
  </tbody>
</table>
`,
  },
  {
    slug: "medicare-coverage-gaps-what-to-know",
    title: "Medicare Coverage Gaps: What It Doesn't Cover and What to Do",
    description:
      "Original Medicare has significant gaps — no dental, no vision, no long-term care, and no out-of-pocket cap. Here's what's missing and how to fill the gaps.",
    publishedAt: "2024-12-01",
    category: "Medicare Planning",
    readingTime: 7,
    content: `
<h2>The Big Gaps in Original Medicare</h2>
<p>Original Medicare (Parts A and B) covers a lot, but it has well-known gaps that can leave beneficiaries with substantial out-of-pocket costs. Understanding these gaps before you retire is essential for financial planning.</p>

<h2>No Dental Coverage</h2>
<p>Original Medicare does <strong>not</strong> cover routine dental care — cleanings, fillings, extractions, dentures, or most other dental procedures. This is a significant gap: Americans over 65 spend an average of $874/year on dental care out of pocket. The exceptions are very narrow: dental care directly related to a covered medical procedure (e.g., jaw reconstruction after an injury) may be covered.</p>
<p><strong>What to do:</strong> Purchase a standalone dental insurance plan (average $30–50/month) or choose a Medicare Advantage plan that includes dental benefits. Dental discount plans are another lower-cost option.</p>

<h2>No Vision or Hearing Coverage</h2>
<p>Routine eye exams, glasses, contact lenses, and hearing aids are <strong>not covered</strong> under Original Medicare. Given that about 70% of Americans over 70 have some hearing loss, this is a major gap. Hearing aids typically cost $2,000–$7,000 per pair.</p>
<p>Limited exceptions: Medicare covers annual eye exams for diabetic retinopathy, and cataract surgery with standard lens replacement is covered. Low vision aids and hearing exams related to medical diagnosis may also be covered.</p>

<h2>No Long-Term Care Coverage</h2>
<p>Perhaps the most consequential gap: Medicare does <strong>not</strong> cover custodial care (help with bathing, dressing, eating) in nursing homes or at home on an ongoing basis. Medicare only covers skilled nursing facility care for up to 100 days after a qualifying hospital stay — and only if you're making medical progress.</p>
<p>Long-term care is expensive: nursing home care averages $8,500–$9,000/month nationally. Medicaid covers it, but only after you've spent down most of your assets. Long-term care insurance, if purchased early enough, is the main alternative.</p>

<h2>The Part A Deductible Trap</h2>
<p>The Part A deductible in 2024 is <strong>$1,632 per benefit period</strong> — and "benefit period" resets each time you're readmitted to a hospital after being out for 60 consecutive days. A person who is hospitalized 3 times in a year with gaps less than 60 days between stays could pay $4,896 in deductibles.</p>

<h2>The Part D Donut Hole</h2>
<p>The "donut hole" (coverage gap) in Part D has been largely closed by the Inflation Reduction Act, but cost-sharing still applies. In 2024, there's a new $2,000 out-of-pocket cap for Part D drugs — the first time a cap has existed. Above that amount, Medicare covers 100%.</p>
<p>However, reaching that $2,000 threshold still represents significant out-of-pocket spending, and many specialty drugs can push you there quickly.</p>

<h2>No Coverage Outside the US</h2>
<p>Medicare generally does <strong>not</strong> cover health care outside the United States (with very limited exceptions near the Canadian or Mexican border). If you travel internationally, you need separate travel health insurance.</p>

<h2>How Medigap Fills the Gaps</h2>
<p>Medigap (Medicare Supplement) policies are standardized plans lettered A through N. The most popular plans:</p>
<ul>
  <li><strong>Plan G</strong>: Covers almost all Original Medicare cost-sharing (except the $240 Part B deductible). Most comprehensive coverage available to those new to Medicare after January 2020.</li>
  <li><strong>Plan N</strong>: Similar to G but you pay up to $20 for office visits and $50 for emergency room visits. Lower monthly premium.</li>
  <li><strong>Plan K/L</strong>: Cover a percentage of costs; lower premiums but more out-of-pocket exposure.</li>
</ul>
<p>Medigap does <strong>not</strong> cover dental, vision, hearing, or long-term care — it only covers Medicare cost-sharing. For those needs, separate supplemental plans are required.</p>
`,
  },
  // ── NEW POSTS (20) ──────────────────────────────────────────────
  {
    slug: "medicare-advantage-vs-original-medicare-2026",
    title: "Medicare Advantage vs. Original Medicare in 2026: Updated Comparison Guide",
    description:
      "With new 2026 premiums, benefit changes, and tighter Medicare Advantage rules, choosing between MA and Original Medicare is more complex than ever. Here is the latest comparison.",
    publishedAt: "2026-03-15",
    category: "Medicare Plans",
    readingTime: 9,
    content: `
<h2>What Changed for 2026?</h2>
<p>The Centers for Medicare &amp; Medicaid Services (CMS) finalized significant changes for plan year 2026 that affect both <strong>Original Medicare</strong> and <strong>Medicare Advantage (MA)</strong>. Understanding these updates is critical before you lock in a plan during the Annual Enrollment Period.</p>
<p>Key 2026 adjustments include revised Part B premiums, tighter network-adequacy standards for MA plans, expanded supplemental benefit categories, and new consumer-protection guardrails around prior authorization. If you are comparing options, the landscape has shifted noticeably from prior years.</p>

<h2>2026 Cost Snapshot: Original Medicare</h2>
<table>
  <thead><tr><th>Cost Component</th><th>2025</th><th>2026</th></tr></thead>
  <tbody>
    <tr><td>Part B premium (standard)</td><td>$185.00/mo</td><td>$190.40/mo</td></tr>
    <tr><td>Part B deductible</td><td>$257/yr</td><td>$264/yr</td></tr>
    <tr><td>Part A inpatient deductible</td><td>$1,676/benefit period</td><td>$1,724/benefit period</td></tr>
    <tr><td>Part D out-of-pocket cap</td><td>$2,000/yr</td><td>$2,000/yr</td></tr>
  </tbody>
</table>
<p>Under Original Medicare there is still <strong>no annual out-of-pocket maximum</strong> on Part A and Part B services. That gap remains the primary reason beneficiaries pair Original Medicare with a <a href="/procedure/medigap-enrollment/">Medigap supplement policy</a>.</p>

<h2>2026 Medicare Advantage Highlights</h2>
<p>Medicare Advantage enrollment now exceeds 35 million beneficiaries — more than half of all eligible Medicare enrollees. For 2026, CMS is requiring plans to meet stricter standards:</p>
<ul>
  <li><strong>Prior authorization reforms</strong> — Plans must resolve standard prior-auth requests within 7 days (down from 14) and expedited requests within 72 hours.</li>
  <li><strong>Network adequacy</strong> — Maximum travel-time and distance standards tightened, especially in rural areas.</li>
  <li><strong>Supplemental benefits</strong> — More plans now offer groceries, pest control, and non-medical transportation as Special Supplemental Benefits for the Chronically Ill (SSBCI).</li>
  <li><strong>Out-of-pocket cap</strong> — The in-network MOOP limit remains capped at approximately $9,350.</li>
</ul>

<h2>Head-to-Head Comparison</h2>
<table>
  <thead><tr><th>Feature</th><th>Original Medicare</th><th>Medicare Advantage</th></tr></thead>
  <tbody>
    <tr><td>Provider choice</td><td>Any Medicare-accepting provider nationwide</td><td>Network-based (HMO/PPO)</td></tr>
    <tr><td>Out-of-pocket cap</td><td>None (unlimited liability)</td><td>Required by law (~$9,350 in-network)</td></tr>
    <tr><td>Drug coverage</td><td>Separate Part D plan needed</td><td>Usually bundled (MAPD)</td></tr>
    <tr><td>Dental / vision / hearing</td><td>Not covered</td><td>Often included</td></tr>
    <tr><td>Monthly premium beyond Part B</td><td>Medigap $110–$350+</td><td>Many plans $0</td></tr>
    <tr><td>Prior authorization</td><td>Rarely required</td><td>Frequently required</td></tr>
    <tr><td>Travel coverage</td><td>Some Medigap plans cover foreign emergencies</td><td>Limited to plan service area</td></tr>
  </tbody>
</table>

<h2>When Original Medicare Wins</h2>
<h3>Complex or chronic conditions</h3>
<p>If you see multiple specialists across different health systems — for example, managing both a <a href="/procedure/cardiac-catheterization/">cardiac condition</a> and cancer treatment — Original Medicare allows unrestricted access to any Medicare-participating provider. No referrals, no prior authorization delays, and no network surprises.</p>

<h3>Frequent interstate travel</h3>
<p>Snowbirds and full-time RV travelers benefit from nationwide coverage. Medicare Advantage HMO plans typically deny claims received outside the service area except in emergencies.</p>

<h2>When Medicare Advantage Wins</h2>
<h3>Budget-conscious and relatively healthy</h3>
<p>A beneficiary who rarely sees specialists can save thousands per year with a $0-premium MA plan that bundles dental, vision, and drug coverage. The built-in out-of-pocket cap also provides catastrophic protection that Original Medicare lacks.</p>

<h3>Need extra benefits</h3>
<p>MA extras like fitness programs, meal delivery after hospitalization, and OTC allowances have real value — especially for beneficiaries in <a href="/state/florida/">states like Florida</a> and <a href="/state/texas/">Texas</a> where plan competition is fierce and benefits are generous.</p>

<h2>The Switching Trap Remains</h2>
<p>Moving from Medicare Advantage back to Original Medicare is allowed during the Open Enrollment Period (January 1 through March 31). However, obtaining a Medigap policy after leaving MA may involve <strong>medical underwriting</strong> in most states. Only Connecticut, Massachusetts, New York, and a few others guarantee Medigap issue rights year-round. Plan your initial decision with this lock-in risk in mind.</p>

<h2>Bottom Line</h2>
<p>There is no universally better option — the right choice depends on your health status, provider preferences, geographic flexibility, and budget. Use the <a href="/state/california/">state-level cost data</a> on this site to compare average procedure costs in your area before deciding.</p>
`,
  },
  {
    slug: "medicare-part-d-prescription-drug-plans-guide",
    title: "Medicare Part D Prescription Drug Plans: The Complete 2026 Guide",
    description:
      "Part D drug plans are essential for most Medicare beneficiaries. Learn how formularies, tiers, the coverage gap, and the new $2,000 cap work in 2026.",
    publishedAt: "2026-03-16",
    category: "Prescription Drugs",
    readingTime: 9,
    content: `
<h2>How Medicare Part D Works</h2>
<p><strong>Medicare Part D</strong> is the prescription drug benefit available to all Medicare enrollees. It is offered exclusively through private insurance companies approved by CMS — there is no government-run Part D plan. You can get Part D coverage in two ways: a standalone Prescription Drug Plan (PDP) paired with Original Medicare, or a Medicare Advantage Prescription Drug plan (MAPD) that bundles medical and drug coverage together.</p>
<p>Every Part D plan must meet minimum coverage standards set by CMS, but plans vary widely in premiums, formularies, pharmacy networks, and cost-sharing. Choosing the right plan based on the specific drugs you take can save hundreds or even thousands of dollars per year.</p>

<h2>2026 Part D Cost Structure</h2>
<table>
  <thead><tr><th>Coverage Phase</th><th>Your Responsibility</th></tr></thead>
  <tbody>
    <tr><td>Deductible (up to $590)</td><td>100% of drug costs until deductible met</td></tr>
    <tr><td>Initial coverage</td><td>Copays or coinsurance per tier (typically 25%)</td></tr>
    <tr><td>Coverage gap (donut hole)</td><td>Effectively eliminated — manufacturer discounts + plan coverage keep your share at 25%</td></tr>
    <tr><td>Catastrophic coverage ($2,000 OOP cap)</td><td>$0 — Medicare covers 100% above the cap</td></tr>
  </tbody>
</table>
<p>The <strong>$2,000 annual out-of-pocket cap</strong>, introduced by the Inflation Reduction Act, continues into 2026. Once your true out-of-pocket spending hits that threshold, you pay nothing for the rest of the year. Many plans also offer a monthly payment option (the Medicare Prescription Payment Plan) so you can spread costs evenly across the year.</p>

<h2>Understanding Drug Tiers</h2>
<p>Part D plans organize covered drugs into tiers, each with different cost-sharing:</p>
<ul>
  <li><strong>Tier 1</strong> — Preferred generics (lowest copay, often $0–$10)</li>
  <li><strong>Tier 2</strong> — Non-preferred generics ($10–$25)</li>
  <li><strong>Tier 3</strong> — Preferred brand-name drugs ($30–$50)</li>
  <li><strong>Tier 4</strong> — Non-preferred brand-name drugs (25–50% coinsurance)</li>
  <li><strong>Tier 5</strong> — Specialty drugs (25–33% coinsurance, often $100+)</li>
</ul>
<p>Always check whether your medications are on a plan's formulary and at what tier <strong>before</strong> enrolling. A drug on Tier 2 in one plan may be Tier 4 in another — costing you hundreds more annually.</p>

<h2>Formulary Restrictions to Watch</h2>
<h3>Prior authorization</h3>
<p>The plan requires your doctor to get approval before the drug is covered. This is common for expensive biologics and specialty medications used for conditions like <a href="/procedure/chemotherapy/">cancer treatment</a> or autoimmune disorders.</p>
<h3>Step therapy</h3>
<p>You must try a lower-cost drug first and show it did not work before the plan covers the preferred medication. This is frequent with blood pressure medications, antidepressants, and pain management drugs.</p>
<h3>Quantity limits</h3>
<p>The plan caps how many pills or doses you can get per fill. Common with opioids but also applied to medications for diabetes and heart conditions.</p>

<h2>How to Choose the Right Part D Plan</h2>
<p>The single best tool is the <strong>Medicare Plan Finder</strong> at Medicare.gov. Enter your zip code and the exact drugs you take (including dosages), and the tool ranks plans by estimated total annual cost. Focus on:</p>
<ul>
  <li><strong>Total estimated annual cost</strong> — not just the monthly premium</li>
  <li><strong>Your pharmacy</strong> — preferred pharmacies have lower copays</li>
  <li><strong>Formulary coverage</strong> — all your drugs should be listed without burdensome restrictions</li>
  <li><strong>Star rating</strong> — 4+ star plans tend to offer better service and fewer claim issues</li>
</ul>

<h2>Part D Late Enrollment Penalty</h2>
<p>If you go 63 or more consecutive days without <strong>creditable</strong> drug coverage after your Initial Enrollment Period, you will pay a permanent penalty when you finally enroll. The penalty equals 1% of the national base beneficiary premium (approximately $36.78 in 2026) multiplied by the number of uncovered months. After 2 years without coverage, that is roughly $8.83/month added to your premium for life.</p>
<p>Creditable coverage includes employer drug plans, VA benefits, TRICARE, and Federal Employee Health Benefits (FEHB). If you have creditable coverage, keep the annual notice your insurer sends — you may need it as proof.</p>

<h2>Insulin and Vaccine Cost Caps</h2>
<p>Under the Inflation Reduction Act, <strong>insulin copays are capped at $35 per month</strong> across all Part D plans. Additionally, all adult vaccines recommended by the Advisory Committee on Immunization Practices (ACIP) — including shingles, Tdap, and hepatitis B — are covered at <strong>$0 cost-sharing</strong> under Part D. These provisions represent major savings, especially for diabetic beneficiaries who previously paid hundreds for insulin. Check your <a href="/state/new-york/">state-specific costs</a> for average prescription pricing.</p>

<h2>Switching Plans Annually</h2>
<p>Part D plans change formularies, premiums, and pharmacies every year. Even if your plan worked well this year, review it during the Annual Enrollment Period (October 15 through December 7). CMS data shows that beneficiaries who compare plans annually save an average of $500 or more compared to those who auto-renew without checking.</p>
`,
  },
  {
    slug: "medigap-supplemental-insurance-comparison",
    title: "Medigap Plans Compared: Which Medicare Supplement Is Best for You?",
    description:
      "Medigap policies fill Original Medicare's cost-sharing gaps. Compare Plans G, N, K, L, and others to find the right balance of premium and coverage.",
    publishedAt: "2026-03-17",
    category: "Medicare Plans",
    readingTime: 8,
    content: `
<h2>What Is Medigap?</h2>
<p><strong>Medigap (Medicare Supplement Insurance)</strong> is private insurance that covers cost-sharing under Original Medicare — deductibles, coinsurance, and copayments that would otherwise come out of your pocket. Because Original Medicare has no annual out-of-pocket maximum, a single hospital stay or serious illness can generate tens of thousands of dollars in costs. Medigap eliminates or greatly reduces that exposure.</p>
<p>Important: Medigap only works with Original Medicare. If you have a Medicare Advantage plan, you cannot purchase or use a Medigap policy.</p>

<h2>Standardized Plan Letters</h2>
<p>Medigap plans are standardized by the federal government and labeled with letters. Every Plan G from every insurer covers the same benefits — only the premiums and customer service differ. The available plans (in most states) are A, B, D, G, K, L, M, and N. Plans C and F are no longer available to people who became newly eligible for Medicare on or after January 1, 2020.</p>

<h2>Plan Comparison Table</h2>
<table>
  <thead><tr><th>Benefit</th><th>Plan G</th><th>Plan N</th><th>Plan K</th><th>Plan L</th></tr></thead>
  <tbody>
    <tr><td>Part A coinsurance (days 61–90)</td><td>100%</td><td>100%</td><td>100%</td><td>100%</td></tr>
    <tr><td>Part A hospital deductible</td><td>100%</td><td>100%</td><td>50%</td><td>75%</td></tr>
    <tr><td>Skilled nursing coinsurance</td><td>100%</td><td>100%</td><td>50%</td><td>75%</td></tr>
    <tr><td>Part B deductible ($264 in 2026)</td><td>Not covered</td><td>Not covered</td><td>Not covered</td><td>Not covered</td></tr>
    <tr><td>Part B excess charges</td><td>100%</td><td>Not covered</td><td>Not covered</td><td>Not covered</td></tr>
    <tr><td>Part B copay/coinsurance</td><td>100%</td><td>100% (with up to $20 office / $50 ER copays)</td><td>50%</td><td>75%</td></tr>
    <tr><td>Foreign travel emergency</td><td>80%</td><td>80%</td><td>Not covered</td><td>Not covered</td></tr>
    <tr><td>Annual OOP limit</td><td>None needed</td><td>None (copays apply)</td><td>$7,060</td><td>$3,530</td></tr>
  </tbody>
</table>

<h2>Plan G: The Gold Standard</h2>
<p>Plan G is the most comprehensive Medigap policy available to new enrollees. It covers <strong>all</strong> Original Medicare cost-sharing except the annual Part B deductible ($264 in 2026). Once you pay that deductible, your out-of-pocket costs for Medicare-covered services are effectively zero for the rest of the year.</p>
<p>Monthly premiums for Plan G typically range from <strong>$120 to $350</strong> depending on your age, gender, tobacco use, and state. Compare rates in your <a href="/state/california/">state</a> to find the lowest cost for identical coverage.</p>

<h3>Who should pick Plan G?</h3>
<ul>
  <li>People with chronic conditions who see doctors frequently</li>
  <li>Anyone who wants maximum financial predictability</li>
  <li>Beneficiaries who travel and want foreign emergency coverage</li>
  <li>Those who can afford the premium and want peace of mind</li>
</ul>

<h2>Plan N: The Budget-Friendly Alternative</h2>
<p>Plan N is identical to Plan G except for two differences: it does <strong>not</strong> cover Part B excess charges, and it applies small copays — up to $20 for some office visits and up to $50 for emergency room visits that do not result in an inpatient admission. In exchange, Plan N premiums are typically <strong>$30–$80 less per month</strong> than Plan G.</p>

<h3>Who should pick Plan N?</h3>
<ul>
  <li>Healthy beneficiaries who visit the doctor infrequently</li>
  <li>Those comfortable with small, predictable copays</li>
  <li>People in states where few providers charge excess fees</li>
  <li>Budget-conscious enrollees looking for solid protection at lower cost</li>
</ul>

<h2>Plans K and L: High-Deductible Options</h2>
<p>Plans K and L cover a percentage of costs (50% and 75% respectively) rather than 100%, but they come with <strong>annual out-of-pocket limits</strong> — $7,060 for Plan K and $3,530 for Plan L in 2026. Once you hit those limits, the plan covers 100%. These are useful for people who want catastrophic protection at the lowest possible premium.</p>

<h2>When to Buy Medigap</h2>
<p>The single most important rule: enroll during your <strong>Medigap Open Enrollment Period</strong>, which is the 6-month window starting the month you are both age 65 or older <strong>and</strong> enrolled in Part B. During this window, insurers must sell you any Medigap plan at the best rate regardless of health status — no medical underwriting, no pre-existing condition exclusions.</p>
<p>After this window closes, most states allow insurers to deny coverage or charge more based on health conditions. Certain states — Connecticut, Massachusetts, and New York — guarantee open enrollment year-round, but those are exceptions. Timing your enrollment is crucial.</p>

<h2>Medigap Pricing Methods</h2>
<p>Insurers use one of three pricing approaches, which significantly affects how your premium grows over time:</p>
<ul>
  <li><strong>Community-rated</strong> — Same premium regardless of age. Best long-term value.</li>
  <li><strong>Issue-age-rated</strong> — Premium based on age at purchase; does not increase with age (but may increase for inflation).</li>
  <li><strong>Attained-age-rated</strong> — Premium increases as you age. Cheapest initially, most expensive over time.</li>
</ul>
<p>Compare pricing methodology as well as current rates. A community-rated plan at $180/month will almost certainly be cheaper than an attained-age plan starting at $130/month after 10 years. Use tools on our <a href="/procedure/medigap-enrollment/">Medigap enrollment page</a> to compare in your area.</p>
`,
  },
  {
    slug: "medicare-open-enrollment-mistakes-to-avoid",
    title: "7 Costly Medicare Open Enrollment Mistakes to Avoid in 2026",
    description:
      "Open enrollment is your annual chance to optimize Medicare coverage. Avoid these common and expensive mistakes that cost beneficiaries thousands of dollars.",
    publishedAt: "2026-03-18",
    category: "Medicare Planning",
    readingTime: 8,
    content: `
<h2>Why Open Enrollment Matters</h2>
<p>The <strong>Annual Enrollment Period (AEP)</strong>, running from October 15 through December 7 each year, is the one window where every Medicare beneficiary can change their coverage. You can switch from Original Medicare to Medicare Advantage (or vice versa), change MA plans, or enroll in a new Part D drug plan. Decisions made during this period take effect January 1.</p>
<p>Despite its importance, millions of beneficiaries simply auto-renew their existing plan without reviewing alternatives. CMS data consistently shows that <strong>active comparison shoppers save hundreds to thousands of dollars annually</strong> compared to passive enrollees. Here are the most expensive mistakes to avoid.</p>

<h2>Mistake 1: Keeping the Same Part D Plan Without Checking</h2>
<p>Part D plans change their formularies, copay tiers, and premiums every year. A drug that was Tier 1 this year could move to Tier 3 next year, tripling your copay. Your preferred pharmacy might leave the plan's network. The only way to know is to re-enter your medications into the <strong>Medicare Plan Finder</strong> tool each fall.</p>
<p>Beneficiaries who compare plans annually save an average of $500+. This 30-minute exercise is among the most valuable financial tasks a senior can perform each year.</p>

<h2>Mistake 2: Ignoring Star Ratings</h2>
<p>CMS assigns <strong>star ratings</strong> (1 to 5 stars) to Medicare Advantage and Part D plans. Ratings reflect quality of care, member satisfaction, and plan administration. Plans with 4+ stars receive federal bonus payments that they typically pass on as better benefits. Enrolling in a 2-star plan to save $15/month on premiums can cost you far more in worse care coordination, denied claims, and limited benefits.</p>

<h2>Mistake 3: Not Checking Provider Networks</h2>
<p>If you are enrolling in or staying with a Medicare Advantage plan, confirm that your doctors, specialists, and preferred hospital remain in-network for the coming year. Networks change annually. Losing access to your oncologist or cardiologist mid-treatment because they left the network is not just inconvenient — it can be medically dangerous.</p>
<p>Check the plan's <strong>provider directory</strong> directly (not just the summary) and call your doctor's office to confirm they will accept the plan in the new year. This is especially important in states like <a href="/state/florida/">Florida</a> and <a href="/state/arizona/">Arizona</a> where MA plan turnover is high.</p>

<h2>Mistake 4: Overlooking the Total Cost of Care</h2>
<p>A $0-premium Medicare Advantage plan sounds appealing, but premiums are only one component of cost. You must also consider:</p>
<ul>
  <li><strong>Copays</strong> for primary care, specialists, and ER visits</li>
  <li><strong>Coinsurance</strong> for procedures like <a href="/procedure/knee-replacement/">knee replacement</a> or <a href="/procedure/hip-replacement/">hip replacement</a></li>
  <li><strong>Drug cost-sharing</strong> beyond Part D premium</li>
  <li><strong>Out-of-pocket maximum</strong> (could be as high as $9,350 in-network)</li>
</ul>
<p>The plan with the lowest premium is frequently not the plan with the lowest total annual cost. Calculate your expected total spending based on your actual healthcare usage.</p>

<h2>Mistake 5: Missing the Deadline Entirely</h2>
<p>The AEP ends <strong>December 7</strong> — not December 31. Many beneficiaries confuse this with calendar-year deadlines and miss the window. If you miss AEP, your options are limited to the Medicare Advantage Open Enrollment Period (January 1 through March 31), which only allows switching between MA plans or dropping MA for Original Medicare. You cannot enroll in a new standalone Part D plan outside AEP without a qualifying event.</p>

<h2>Mistake 6: Not Accounting for Life Changes</h2>
<p>Your healthcare needs change over time. A plan that worked when you were 67 and healthy may be inadequate at 72 with new prescriptions and specialists. Re-evaluate your plan each year based on:</p>
<ul>
  <li>New diagnoses or conditions</li>
  <li>Changes in prescription medications</li>
  <li>Planned surgeries or procedures</li>
  <li>A move to a different state or county</li>
  <li>Changes in income (affecting IRMAA surcharges)</li>
</ul>

<h2>Mistake 7: Confusing AEP with Medigap Enrollment</h2>
<p>The Annual Enrollment Period is for Medicare Advantage and Part D plans. <strong>Medigap enrollment follows different rules entirely.</strong> Your guaranteed-issue period for Medigap is the 6 months starting when you turn 65 and are enrolled in Part B. Confusing these timelines can result in being denied Medigap coverage due to medical underwriting or paying much higher premiums.</p>

<h2>Action Checklist for Open Enrollment</h2>
<ul>
  <li>List all current medications with dosages</li>
  <li>Use Medicare Plan Finder to compare Part D or MAPD plans</li>
  <li>Verify your doctors are in-network for any MA plan</li>
  <li>Check star ratings (aim for 4 stars or higher)</li>
  <li>Calculate total estimated annual cost, not just premiums</li>
  <li>Make your selection before December 7</li>
  <li>Keep confirmation documentation for your records</li>
</ul>
`,
  },
  {
    slug: "medicaid-eligibility-requirements-by-state",
    title: "Medicaid Eligibility Requirements by State: 2026 Income Limits and Rules",
    description:
      "Medicaid eligibility varies dramatically by state. Learn the income limits, asset tests, expansion status, and application process for every state.",
    publishedAt: "2026-03-19",
    category: "Medicaid",
    readingTime: 9,
    content: `
<h2>How Medicaid Eligibility Works</h2>
<p><strong>Medicaid</strong> is a joint federal-state program, which means each state sets its own eligibility rules within broad federal guidelines. This creates significant variation: a family qualifying in one state might be ineligible just across the border. The two biggest factors determining eligibility are <strong>income</strong> and whether your state expanded Medicaid under the Affordable Care Act (ACA).</p>

<h2>ACA Medicaid Expansion Status</h2>
<p>Under the ACA, states can expand Medicaid to cover all adults with incomes up to <strong>138% of the Federal Poverty Level (FPL)</strong>. As of 2026, 40 states plus DC have adopted expansion. The 10 non-expansion states leave a significant coverage gap — adults without children earning below 100% FPL may qualify for neither Medicaid nor ACA marketplace subsidies.</p>
<table>
  <thead><tr><th>Status</th><th>States</th></tr></thead>
  <tbody>
    <tr><td>Expanded (40 + DC)</td><td>Including CA, NY, TX (partial), FL (pending), OH, PA, IL, and most others</td></tr>
    <tr><td>Not expanded (10)</td><td>AL, FL, GA, KS, MS, SC, TN, TX, WI*, WY</td></tr>
  </tbody>
</table>
<p><em>*Wisconsin covers adults up to 100% FPL through a waiver but has not formally adopted expansion.</em></p>

<h2>2026 Federal Poverty Level Guidelines</h2>
<table>
  <thead><tr><th>Household Size</th><th>100% FPL</th><th>138% FPL (Expansion Threshold)</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>$15,650</td><td>$21,597</td></tr>
    <tr><td>2</td><td>$21,150</td><td>$29,187</td></tr>
    <tr><td>3</td><td>$26,650</td><td>$36,777</td></tr>
    <tr><td>4</td><td>$32,150</td><td>$44,367</td></tr>
  </tbody>
</table>
<p>In expansion states, a single adult earning under approximately $21,597 per year qualifies for Medicaid. In non-expansion states, adults without dependent children often face much lower thresholds — sometimes as low as 17-26% FPL.</p>

<h2>Eligibility Categories</h2>
<h3>Adults in expansion states</h3>
<p>Income at or below 138% FPL. No asset test in most states. This is the broadest category and covers the most enrollees.</p>
<h3>Children (CHIP)</h3>
<p>Children are covered at higher income levels — typically 200-300% FPL depending on the state. Some states cover children up to 400% FPL through the Children's Health Insurance Program (CHIP).</p>
<h3>Pregnant women</h3>
<p>Covered at 138-200%+ FPL in most states, with some states extending eligibility to 300% FPL. Coverage typically begins immediately and extends through 12 months postpartum under new federal rules.</p>
<h3>Seniors and people with disabilities</h3>
<p>Supplemental Security Income (SSI) recipients automatically qualify in most states. Others must meet income and asset tests. Many seniors who qualify for both Medicare and Medicaid become <strong>dual eligibles</strong> with enhanced benefits.</p>

<h2>Asset Tests</h2>
<p>For most working-age adults in expansion states, there is <strong>no asset test</strong> — only income matters. However, seniors and people with disabilities applying for long-term care Medicaid typically face strict asset limits:</p>
<ul>
  <li><strong>Individual</strong>: $2,000 in countable assets (some states higher)</li>
  <li><strong>Married couple</strong>: Community Spouse Resource Allowance up to $154,140 in 2026</li>
  <li><strong>Exempt assets</strong>: Primary home (up to $713,000 equity in most states), one vehicle, personal belongings, burial funds</li>
</ul>
<p>Medicaid <strong>look-back rules</strong> examine asset transfers made within 60 months before application. Gifts or transfers during this period can trigger a penalty period of ineligibility for nursing home coverage.</p>

<h2>State-by-State Highlights</h2>
<h3><a href="/state/california/">California (Medi-Cal)</a></h3>
<p>Expanded Medicaid, eliminated the asset test entirely for all categories including seniors. Among the most generous programs in the country, covering dental, vision, and comprehensive mental health services.</p>

<h3><a href="/state/texas/">Texas</a></h3>
<p>Has not expanded Medicaid. Non-disabled adults without children do not qualify regardless of how low their income is. Parents qualify only at approximately 17% FPL (~$3,700/year for a family of 3).</p>

<h3><a href="/state/new-york/">New York</a></h3>
<p>Expanded Medicaid with relatively generous income thresholds. Strong provider networks and comprehensive benefits including extensive home and community-based services.</p>

<h2>How to Apply</h2>
<p>Apply through your state's Medicaid agency website, HealthCare.gov, by phone, or in person. You will need proof of income (pay stubs, tax returns), identification, residency documentation, and Social Security number. Most states process applications within 45 days (90 days for disability-based applications). If denied, you have the right to appeal.</p>
`,
  },
  {
    slug: "medicare-costs-premiums-deductibles-2026",
    title: "Medicare Costs in 2026: Every Premium, Deductible, and Coinsurance Amount",
    description:
      "A complete breakdown of every Medicare cost for 2026 including Part A, Part B, Part D premiums, deductibles, IRMAA surcharges, and out-of-pocket estimates.",
    publishedAt: "2026-03-20",
    category: "Medicare Costs",
    readingTime: 8,
    content: `
<h2>2026 Medicare Cost Overview</h2>
<p>Medicare costs increase almost every year, driven by healthcare inflation, utilization trends, and legislative changes. For 2026, CMS has finalized new premiums and deductibles across all parts of Medicare. This guide covers every number you need to budget for healthcare in retirement.</p>

<h2>Part A Costs (Hospital Insurance)</h2>
<p>Most beneficiaries pay <strong>$0/month for Part A</strong> if they or their spouse paid Medicare taxes for at least 40 quarters (10 years). Those with 30-39 quarters pay a reduced premium; those with fewer pay the full amount.</p>
<table>
  <thead><tr><th>Part A Cost</th><th>2026 Amount</th></tr></thead>
  <tbody>
    <tr><td>Premium (40+ quarters)</td><td>$0/month</td></tr>
    <tr><td>Premium (30-39 quarters)</td><td>$295/month</td></tr>
    <tr><td>Premium (&lt;30 quarters)</td><td>$518/month</td></tr>
    <tr><td>Inpatient deductible</td><td>$1,724/benefit period</td></tr>
    <tr><td>Days 1-60 coinsurance</td><td>$0/day</td></tr>
    <tr><td>Days 61-90 coinsurance</td><td>$431/day</td></tr>
    <tr><td>Lifetime reserve days (91-150)</td><td>$862/day</td></tr>
    <tr><td>Skilled nursing facility days 21-100</td><td>$215.50/day</td></tr>
  </tbody>
</table>
<p>The Part A inpatient deductible applies <strong>per benefit period</strong>, not per year. A benefit period starts when you are admitted and ends after 60 consecutive days out of the hospital. Multiple hospitalizations in one year can mean paying the deductible multiple times.</p>

<h2>Part B Costs (Medical Insurance)</h2>
<p>The <strong>standard Part B premium for 2026 is $190.40/month</strong> — up from $185.00 in 2025. The Part B annual deductible is <strong>$264</strong>. After the deductible, Medicare covers 80% of approved charges and you pay 20% coinsurance with no annual limit under Original Medicare.</p>

<h2>IRMAA: Income-Related Monthly Adjustment Amounts</h2>
<p>Higher-income beneficiaries pay surcharges on both Part B and Part D premiums. IRMAA is based on your modified adjusted gross income (MAGI) from <strong>two years prior</strong> (2024 tax return for 2026 premiums).</p>
<table>
  <thead><tr><th>Individual MAGI</th><th>Couple MAGI</th><th>Part B Monthly</th><th>Part D Surcharge</th></tr></thead>
  <tbody>
    <tr><td>$106,000 or less</td><td>$212,000 or less</td><td>$190.40</td><td>$0</td></tr>
    <tr><td>$106,001–$133,000</td><td>$212,001–$266,000</td><td>$257.40</td><td>$13.70</td></tr>
    <tr><td>$133,001–$167,000</td><td>$266,001–$334,000</td><td>$370.40</td><td>$35.30</td></tr>
    <tr><td>$167,001–$200,000</td><td>$334,001–$400,000</td><td>$483.40</td><td>$57.00</td></tr>
    <tr><td>$200,001–$500,000</td><td>$400,001–$750,000</td><td>$596.40</td><td>$78.60</td></tr>
    <tr><td>Above $500,000</td><td>Above $750,000</td><td>$628.90</td><td>$85.80</td></tr>
  </tbody>
</table>
<p>If your income dropped significantly due to a <strong>life-changing event</strong> — retirement, death of a spouse, divorce, or loss of income-producing property — you can file Form SSA-44 to request an IRMAA reduction based on more recent income.</p>

<h2>Part D Costs (Prescription Drugs)</h2>
<p>Part D premiums vary by plan and average approximately <strong>$46/month</strong> in 2026. The maximum Part D deductible is <strong>$590</strong>. The most significant cost protection is the <strong>$2,000 annual out-of-pocket cap</strong> — once your true out-of-pocket spending reaches that threshold, Medicare covers 100% of remaining drug costs for the year.</p>

<h2>Medigap Premium Ranges by Plan</h2>
<p>For beneficiaries on Original Medicare who purchase Medigap supplemental coverage, expect these typical 2026 monthly premium ranges:</p>
<ul>
  <li><strong>Plan G</strong>: $120–$350/month (most popular, comprehensive)</li>
  <li><strong>Plan N</strong>: $80–$260/month (lower premium, small copays)</li>
  <li><strong>Plan K</strong>: $50–$120/month (50% cost-sharing, OOP cap)</li>
  <li><strong>High-Deductible Plan G</strong>: $30–$80/month ($2,870 deductible before coverage kicks in)</li>
</ul>

<h2>Total Annual Cost Estimates</h2>
<table>
  <thead><tr><th>Coverage Combination</th><th>Estimated Annual Cost</th></tr></thead>
  <tbody>
    <tr><td>Original Medicare + Plan G + Part D</td><td>$5,200–$8,400</td></tr>
    <tr><td>Original Medicare + Plan N + Part D</td><td>$4,200–$7,000</td></tr>
    <tr><td>Medicare Advantage ($0 premium MAPD)</td><td>$2,285 (Part B only) + copays</td></tr>
  </tbody>
</table>
<p>These estimates do not include out-of-pocket drug costs, dental, vision, or hearing expenses. Use our <a href="/state/florida/">state cost pages</a> and <a href="/procedure/colonoscopy/">procedure cost lookups</a> to estimate your specific expenses.</p>
`,
  },
  {
    slug: "how-to-appeal-medicare-claim-denial",
    title: "How to Appeal a Medicare Claim Denial: Step-by-Step Guide",
    description:
      "Medicare denies millions of claims each year. Learn the 5-level appeals process, deadlines, and strategies to overturn a denial and get the coverage you deserve.",
    publishedAt: "2026-03-21",
    category: "Medicare Rights",
    readingTime: 8,
    content: `
<h2>Why Medicare Claims Get Denied</h2>
<p>Medicare denies a significant percentage of claims each year — estimates suggest between 10-20% of initial claims receive some form of denial. Common reasons include:</p>
<ul>
  <li><strong>Not medically necessary</strong> — Medicare does not agree the service was required</li>
  <li><strong>Coding errors</strong> — incorrect procedure or diagnosis codes on the claim</li>
  <li><strong>Prior authorization missing</strong> — particularly common in Medicare Advantage plans</li>
  <li><strong>Service not covered</strong> — the procedure is excluded from Medicare benefits</li>
  <li><strong>Provider not enrolled</strong> — the doctor or facility is not a Medicare-participating provider</li>
  <li><strong>Frequency limits exceeded</strong> — too many of the same service in a time period</li>
</ul>
<p>The good news: the appeals process is well-defined, and beneficiaries who appeal <strong>win a substantial percentage of the time</strong>. Studies show that roughly 75-80% of appeals that reach an Administrative Law Judge result in a favorable decision.</p>

<h2>The 5 Levels of Medicare Appeals</h2>
<h3>Level 1: Redetermination</h3>
<p>File with the Medicare Administrative Contractor (MAC) that processed the original claim. You have <strong>120 days</strong> from the date on your Medicare Summary Notice (MSN). The MAC reviews the claim with different staff than those who made the initial decision. This is the fastest level — decisions typically come within 60 days.</p>

<h3>Level 2: Reconsideration</h3>
<p>If the redetermination upholds the denial, request reconsideration by a <strong>Qualified Independent Contractor (QIC)</strong> within 180 days. The QIC is independent of Medicare and provides a fresh review. Decision within 60 days. At this level, submit additional medical records, doctor letters, and clinical evidence.</p>

<h3>Level 3: Administrative Law Judge (ALJ)</h3>
<p>If the amount in controversy meets the minimum threshold (<strong>$190 in 2026</strong>), you can request a hearing before an ALJ at the Office of Medicare Hearings and Appeals. This is where your chances improve dramatically. You can present your case in person or by phone, and your doctor can testify. Decisions within 90 days.</p>

<h3>Level 4: Medicare Appeals Council</h3>
<p>If the ALJ rules against you, appeal to the <strong>Medicare Appeals Council</strong> (also called the Departmental Appeals Board) within 60 days. The Council can affirm, reverse, or remand the case. Decisions within 90 days.</p>

<h3>Level 5: Federal District Court</h3>
<p>The final level: judicial review in federal court if the amount in controversy exceeds <strong>$1,900 in 2026</strong>. File within 60 days of the Appeals Council decision. This is rare but available for high-value claims.</p>

<h2>Tips for a Successful Appeal</h2>
<ul>
  <li><strong>Get your doctor involved</strong> — A letter of medical necessity from your treating physician is the single most powerful piece of evidence</li>
  <li><strong>Cite Medicare coverage rules</strong> — Reference the specific National Coverage Determination (NCD) or Local Coverage Determination (LCD) that supports your claim</li>
  <li><strong>Include medical records</strong> — Lab results, imaging, clinical notes showing why the service was needed</li>
  <li><strong>Meet every deadline</strong> — Missing a filing deadline can forfeit your appeal rights entirely</li>
  <li><strong>Keep copies of everything</strong> — Document every submission with dates and tracking numbers</li>
</ul>

<h2>Medicare Advantage Appeals: Different Rules</h2>
<p>If you have a <strong>Medicare Advantage plan</strong>, the first two levels of appeal go through the plan itself (not a MAC). The plan must make decisions within specific timeframes — 30 days for standard requests, 72 hours for expedited requests. If the plan denies your appeal, an independent review entity conducts the reconsideration. After that, the process follows the same ALJ and higher-level tracks.</p>
<p>Under 2026 rules, MA plans face tighter prior authorization requirements. If your plan denies a service that requires prior auth, you can request an <strong>expedited appeal</strong> if delay would jeopardize your health. The plan must respond within 72 hours.</p>

<h2>Free Help Is Available</h2>
<p>You do not have to navigate the appeals process alone. <strong>State Health Insurance Assistance Programs (SHIP)</strong> provide free, unbiased counseling in every state. SHIP counselors can help you understand your denial, prepare your appeal, and even represent you at an ALJ hearing. Find your local SHIP at <a href="/state/california/">your state page</a> or call 1-800-MEDICARE.</p>
`,
  },
  {
    slug: "dual-eligible-medicare-medicaid-benefits",
    title: "Dual Eligible for Medicare and Medicaid: Benefits, Programs, and How to Qualify",
    description:
      "About 12 million Americans qualify for both Medicare and Medicaid. Learn what dual eligibility means, the extra benefits it provides, and how to enroll.",
    publishedAt: "2026-03-22",
    category: "Medicare & Medicaid",
    readingTime: 8,
    content: `
<h2>What Does Dual Eligible Mean?</h2>
<p><strong>Dual eligible</strong> refers to individuals who qualify for both Medicare and Medicaid simultaneously. These are typically low-income seniors (65+) or younger adults with disabilities who meet Medicare eligibility through age or disability and Medicaid eligibility through income. About 12.3 million Americans — roughly 20% of all Medicare beneficiaries — are dually eligible.</p>
<p>Dual eligibles have some of the most complex health needs in the country. On average, they have higher rates of chronic conditions, mental health diagnoses, and functional limitations than Medicare-only beneficiaries. The combination of both programs provides comprehensive coverage that neither offers alone.</p>

<h2>Types of Dual Eligibility</h2>
<table>
  <thead><tr><th>Category</th><th>Medicaid Covers</th><th>Income Threshold</th></tr></thead>
  <tbody>
    <tr><td>Full dual eligible</td><td>All Medicaid services + Medicare cost-sharing</td><td>Varies by state (typically up to 100% FPL)</td></tr>
    <tr><td>Qualified Medicare Beneficiary (QMB)</td><td>Part A &amp; B premiums, deductibles, coinsurance</td><td>Up to 100% FPL</td></tr>
    <tr><td>Specified Low-Income Medicare Beneficiary (SLMB)</td><td>Part B premium only</td><td>100–120% FPL</td></tr>
    <tr><td>Qualifying Individual (QI)</td><td>Part B premium only</td><td>120–135% FPL</td></tr>
    <tr><td>Qualified Disabled and Working Individual (QDWI)</td><td>Part A premium only</td><td>Up to 200% FPL</td></tr>
  </tbody>
</table>

<h2>Benefits of Dual Eligibility</h2>
<h3>Medicare premiums paid</h3>
<p>QMB-level dual eligibles have their <strong>Part B premium ($190.40/month in 2026)</strong> and Part A premium (if applicable) paid by Medicaid. That alone saves over $2,200 per year.</p>

<h3>No Medicare cost-sharing</h3>
<p>Full dual eligibles and QMBs owe <strong>$0 in deductibles, coinsurance, or copays</strong> for Medicare-covered services. Providers cannot bill QMB individuals for Medicare cost-sharing — it is prohibited by federal law.</p>

<h3>Extra Help with prescriptions</h3>
<p>Dual eligibles automatically receive <strong>Extra Help (Low-Income Subsidy)</strong> for Part D prescription drugs. This means $0 or low copays on medications — typically $1.55 for generics and $4.60 for brand-name drugs in 2026. No deductible, no coverage gap.</p>

<h3>Long-term care coverage</h3>
<p>Medicaid is the primary payer for <strong>nursing home and long-term care</strong> services that Medicare does not cover. For dual eligibles needing ongoing custodial care, this is a critical benefit. Medicaid also funds <a href="/procedure/home-health-assessment/">home and community-based services</a> (HCBS) that allow people to remain at home rather than entering a facility.</p>

<h3>Dental, vision, and hearing</h3>
<p>Where Medicare falls short — dental, vision, and hearing — Medicaid typically fills the gap. Most state Medicaid programs cover dental care, eyeglasses, and hearing aids that Original Medicare does not.</p>

<h2>Dual Special Needs Plans (D-SNPs)</h2>
<p>D-SNPs are specialized <strong>Medicare Advantage plans</strong> designed exclusively for dual eligibles. These plans coordinate Medicare and Medicaid benefits in a single plan, offering:</p>
<ul>
  <li>$0 premiums (beyond the Part B premium paid by Medicaid)</li>
  <li>$0 or very low copays for services</li>
  <li>Care coordination with dedicated case managers</li>
  <li>Extra benefits like transportation, OTC allowances, meals, and fitness programs</li>
  <li>Integrated Medicaid and Medicare benefits (in states with D-SNP integration)</li>
</ul>
<p>D-SNP enrollment has grown rapidly — now exceeding 6 million beneficiaries. In states like <a href="/state/california/">California</a>, <a href="/state/new-york/">New York</a>, and <a href="/state/texas/">Texas</a>, multiple D-SNP options compete for enrollees with increasingly generous supplemental benefits.</p>

<h2>How to Qualify and Enroll</h2>
<p>You must apply for Medicaid through your state's Medicaid agency. If approved, your dual eligibility status is communicated to CMS automatically. To confirm your status and enroll in a D-SNP or receive MSP benefits, contact your state Medicaid office or call 1-800-MEDICARE.</p>
<p>If you are already on Medicare and your income drops, apply for Medicaid as soon as possible — there is no wrong time to apply. Benefits can be retroactive up to 3 months before your application date in most states.</p>
`,
  },
  {
    slug: "medicare-preventive-services-free-screenings",
    title: "Medicare Preventive Services: Complete List of Free Screenings and Wellness Benefits",
    description:
      "Medicare covers dozens of preventive services at no cost. Know which screenings, vaccines, and wellness visits are free so you can use them every year.",
    publishedAt: "2026-03-23",
    category: "Medicare Benefits",
    readingTime: 8,
    content: `
<h2>Why Preventive Care Matters Under Medicare</h2>
<p>Medicare Part B covers a wide range of <strong>preventive services at zero cost-sharing</strong> — no copay, no coinsurance, and no deductible — as long as you see a provider who accepts Medicare assignment. These services are designed to detect health problems early, when treatment is most effective and least expensive. Yet studies show that many Medicare beneficiaries underutilize these free benefits.</p>

<h2>Free Cancer Screenings</h2>
<table>
  <thead><tr><th>Screening</th><th>Frequency</th><th>Who Qualifies</th></tr></thead>
  <tbody>
    <tr><td>Mammogram (breast cancer)</td><td>Once every 12 months</td><td>Women 40+</td></tr>
    <tr><td><a href="/procedure/colonoscopy/">Colonoscopy</a> (colorectal)</td><td>Once every 10 years (high-risk: every 2 years)</td><td>All beneficiaries 45+</td></tr>
    <tr><td>Fecal occult blood test</td><td>Once every 12 months</td><td>All beneficiaries 45+</td></tr>
    <tr><td>Pap smear / pelvic exam</td><td>Every 24 months (high-risk: every 12 months)</td><td>All women</td></tr>
    <tr><td>Prostate cancer screening (PSA)</td><td>Once every 12 months</td><td>Men 50+</td></tr>
    <tr><td>Lung cancer screening (low-dose CT)</td><td>Once per year</td><td>Ages 50-77, 20+ pack-year smoking history</td></tr>
  </tbody>
</table>
<p>The colonoscopy benefit has been expanded — if a polyp is found and removed during a screening colonoscopy, Medicare now covers the procedure at the preventive rate (no cost-sharing). Previously, finding a polyp reclassified the procedure as diagnostic, triggering coinsurance.</p>

<h2>Cardiovascular Screenings</h2>
<ul>
  <li><strong>Cardiovascular disease risk reduction visit</strong> — Annual intensive behavioral therapy with a primary care doctor</li>
  <li><strong>Cardiovascular screening blood tests</strong> — Cholesterol, lipid, and triglyceride levels every 5 years</li>
  <li><strong>Abdominal aortic aneurysm screening</strong> — One-time ultrasound for men 65-75 who have smoked</li>
  <li><strong>EKG screening</strong> — One-time within first 12 months of Part B enrollment</li>
</ul>

<h2>Diabetes Prevention and Management</h2>
<p>Medicare covers extensive diabetes-related preventive services:</p>
<ul>
  <li><strong>Diabetes screening tests</strong> — Fasting glucose or A1C, up to 2 per year for those at risk</li>
  <li><strong>Diabetes self-management training (DSMT)</strong> — Initial 10 hours of training, then 2 hours of follow-up annually</li>
  <li><strong>Medical nutrition therapy</strong> — For beneficiaries with diabetes or renal disease (referred by a physician)</li>
  <li><strong>Medicare Diabetes Prevention Program (MDPP)</strong> — Group lifestyle coaching sessions for those with pre-diabetes</li>
</ul>

<h2>Vaccines Covered at $0</h2>
<p>Under Part B and Part D combined, Medicare now covers all recommended vaccines at no cost:</p>
<ul>
  <li><strong>COVID-19 vaccines</strong> — covered under Part B at $0</li>
  <li><strong>Flu shot</strong> — once per flu season (Part B)</li>
  <li><strong>Pneumococcal vaccine</strong> — two shots for most beneficiaries (Part B)</li>
  <li><strong>Hepatitis B</strong> — for those at medium-to-high risk (Part B)</li>
  <li><strong>Shingles (Shingrix)</strong> — 2-dose series covered under Part D at $0</li>
  <li><strong>Tdap (tetanus, diphtheria, pertussis)</strong> — covered under Part D at $0</li>
  <li><strong>RSV vaccine</strong> — for adults 60+ (Part D at $0)</li>
</ul>

<h2>Mental Health and Behavioral Screenings</h2>
<ul>
  <li><strong>Depression screening</strong> — annually in primary care settings</li>
  <li><strong>Alcohol misuse screening and counseling</strong> — annually, with up to 4 brief counseling sessions</li>
  <li><strong>Tobacco cessation counseling</strong> — up to 8 sessions per year for smokers</li>
  <li><strong>Obesity screening and counseling</strong> — intensive behavioral therapy for BMI 30+</li>
</ul>

<h2>Annual Wellness Visit</h2>
<p>The <strong>Annual Wellness Visit (AWV)</strong> is free every year after your first 12 months on Part B. It is a comprehensive health planning session — not a physical exam — that includes a health risk assessment, personalized prevention plan, cognitive assessment, and advance care planning discussion. See our <a href="/procedure/annual-wellness-visit/">Annual Wellness Visit guide</a> for details on what to expect.</p>

<h2>How to Ensure You Pay $0</h2>
<p>To receive preventive services at no cost, you must see a provider who <strong>accepts Medicare assignment</strong>. If a provider does not accept assignment, they can bill you directly. Additionally, the service must be coded correctly as preventive — if your doctor orders additional diagnostic tests during a preventive visit, those may trigger cost-sharing. Ask your provider to clearly distinguish between the free preventive portion and any diagnostic add-ons.</p>
`,
  },
  {
    slug: "social-security-disability-medicare-guide",
    title: "Social Security Disability and Medicare: How SSDI Leads to Medicare Coverage",
    description:
      "SSDI recipients qualify for Medicare after a 24-month waiting period. Learn the timeline, what is covered, and how to bridge the gap before Medicare begins.",
    publishedAt: "2026-03-24",
    category: "Medicare Basics",
    readingTime: 8,
    content: `
<h2>The SSDI-to-Medicare Pathway</h2>
<p>If you receive <strong>Social Security Disability Insurance (SSDI)</strong> benefits, you become eligible for Medicare after a <strong>24-month waiting period</strong> from the date your SSDI benefits begin. This applies regardless of your age — you do not need to be 65. Approximately 8.5 million Americans under 65 have Medicare through disability.</p>
<p>The waiting period counts from your <strong>SSDI entitlement date</strong>, which is typically 5 months after your disability onset date. Since SSDI itself has a 5-month waiting period, the total time from disability onset to Medicare coverage can be approximately 29 months.</p>

<h2>Timeline Example</h2>
<table>
  <thead><tr><th>Event</th><th>Example Date</th></tr></thead>
  <tbody>
    <tr><td>Disability onset</td><td>January 2024</td></tr>
    <tr><td>SSDI waiting period (5 months)</td><td>February – June 2024</td></tr>
    <tr><td>First SSDI payment</td><td>July 2024</td></tr>
    <tr><td>Medicare waiting period (24 months)</td><td>July 2024 – June 2026</td></tr>
    <tr><td>Medicare coverage begins</td><td>July 2026</td></tr>
  </tbody>
</table>

<h2>Exceptions to the 24-Month Wait</h2>
<p>Two groups qualify for Medicare <strong>immediately</strong> without a waiting period:</p>
<ul>
  <li><strong>End-Stage Renal Disease (ESRD)</strong> — Individuals with permanent kidney failure requiring dialysis or a transplant qualify for Medicare the month dialysis begins or the month of a kidney transplant</li>
  <li><strong>Amyotrophic Lateral Sclerosis (ALS / Lou Gehrig's disease)</strong> — Medicare begins the same month SSDI benefits start, waiving the 24-month wait entirely</li>
</ul>

<h2>Bridging the Coverage Gap</h2>
<p>The 24-month waiting period creates a significant gap where disabled individuals need healthcare coverage but do not yet have Medicare. Options during this period include:</p>
<ul>
  <li><strong>COBRA continuation</strong> — If you had employer coverage, COBRA extends it for up to 18 months (29 months for disabled individuals in some cases)</li>
  <li><strong>ACA Marketplace plans</strong> — SSDI recipients may qualify for significant subsidies based on their low income. Disability does not disqualify you from the Marketplace.</li>
  <li><strong>Medicaid</strong> — Many SSDI recipients qualify for Medicaid based on their income. In expansion states, qualifying is easier. Check <a href="/state/california/">your state's eligibility</a>.</li>
  <li><strong>Spouse's employer plan</strong> — If your spouse has employer-sponsored insurance, you can remain on that plan</li>
</ul>

<h2>What Medicare Covers for Disabled Beneficiaries</h2>
<p>Disabled Medicare beneficiaries receive the <strong>same Part A and Part B benefits</strong> as those who qualify through age. You can also enroll in Part D for prescription drugs and choose between Original Medicare and Medicare Advantage. There are no coverage differences based on qualifying through disability versus age.</p>
<p>However, some benefits are particularly relevant for younger disabled beneficiaries:</p>
<ul>
  <li><strong>Physical and occupational therapy</strong> — covered under Part B with no annual cap on medically necessary therapy</li>
  <li><strong>Durable medical equipment</strong> — wheelchairs, prosthetics, home hospital beds covered at 80% after deductible</li>
  <li><strong>Mental health services</strong> — outpatient therapy, psychiatry, and partial hospitalization covered under Part B</li>
  <li><strong>Home health care</strong> — skilled nursing and therapy at home if you are homebound (covered at <a href="/procedure/home-health-assessment/">100% with no copay</a>)</li>
</ul>

<h2>Medigap and Medicare Advantage for Under-65</h2>
<p>Disabled beneficiaries under 65 face a challenge with <strong>Medigap</strong>: federal law only guarantees Medigap open enrollment rights at age 65. Under 65, Medigap availability depends on your state. Some states — including California, Connecticut, Massachusetts, Minnesota, New York, Oregon, Vermont, and Wisconsin — require insurers to offer Medigap to disabled beneficiaries under 65. Other states have no such requirement, and insurers may charge substantially higher premiums or deny coverage entirely.</p>
<p>Medicare Advantage plans are generally available to all Medicare beneficiaries regardless of age, and can be a good alternative for under-65 disabled enrollees who cannot obtain affordable Medigap coverage.</p>

<h2>Returning to Work</h2>
<p>Social Security offers work incentive programs that allow you to test your ability to work while keeping SSDI and Medicare. Under the <strong>Trial Work Period</strong>, you receive full SSDI benefits for 9 months (not necessarily consecutive) regardless of earnings. After the trial period, an <strong>Extended Period of Eligibility</strong> provides 36 months where benefits resume automatically if earnings drop below substantial gainful activity ($1,620/month in 2026). Medicare continues for at least 93 months (approximately 7.75 years) after you return to work, even if SSDI cash benefits stop.</p>
`,
  },
  {
    slug: "medicare-home-health-care-coverage",
    title: "Medicare Home Health Care Coverage: What Is Covered and How to Qualify",
    description:
      "Medicare covers home health care at 100% with no copay, but strict eligibility rules apply. Learn what services are covered and how to qualify.",
    publishedAt: "2026-03-25",
    category: "Medicare Benefits",
    readingTime: 8,
    content: `
<h2>Overview of Medicare Home Health Benefits</h2>
<p>Medicare Part A and Part B cover <strong>home health care services at 100%</strong> — no deductible, no copay, no coinsurance. This makes it one of the most valuable but least understood Medicare benefits. Home health covers skilled nursing, physical therapy, occupational therapy, speech-language pathology, medical social services, and home health aide services delivered in your home.</p>
<p>The benefit is designed for people who need <strong>skilled medical care</strong> on an intermittent basis while recovering from an illness, injury, or surgery. It is not custodial care — Medicare does not cover ongoing assistance with daily living activities unless skilled care is also needed.</p>

<h2>Eligibility Requirements</h2>
<p>To qualify for Medicare home health coverage, you must meet all four criteria:</p>
<ul>
  <li><strong>Homebound status</strong> — Leaving home requires considerable effort and you normally do not leave (except for medical appointments, occasional trips, or religious services)</li>
  <li><strong>Skilled care need</strong> — You need skilled nursing care, physical therapy, speech-language pathology, or continued occupational therapy</li>
  <li><strong>Intermittent care</strong> — You need care on a part-time or intermittent basis (not 24/7)</li>
  <li><strong>Doctor's order</strong> — A physician must certify your need and establish a plan of care</li>
</ul>

<h3>What "homebound" really means</h3>
<p>Many beneficiaries misunderstand the homebound requirement. You do <strong>not</strong> need to be bedridden or completely unable to leave. You qualify if leaving home is a major effort — needing assistive devices, special transportation, or help from another person. Occasional absences for medical care, religious services, adult day programs, or brief outings do not disqualify you.</p>

<h2>Covered Services</h2>
<table>
  <thead><tr><th>Service</th><th>Coverage Details</th></tr></thead>
  <tbody>
    <tr><td>Skilled nursing</td><td>Wound care, injections, IV therapy, medication management, patient education</td></tr>
    <tr><td>Physical therapy</td><td>Exercises, gait training, fall prevention, post-surgery rehab</td></tr>
    <tr><td>Occupational therapy</td><td>Adaptive techniques for daily activities, home safety assessment</td></tr>
    <tr><td>Speech-language pathology</td><td>Swallowing therapy, communication skills after stroke</td></tr>
    <tr><td>Medical social services</td><td>Counseling, community resource coordination, care planning</td></tr>
    <tr><td>Home health aide</td><td>Bathing, dressing, personal care (only if skilled services are also needed)</td></tr>
  </tbody>
</table>
<p>Medicare also covers <strong>medical supplies</strong> used in treatment (wound dressings, catheters) and <strong>durable medical equipment</strong> (hospital beds, walkers, wheelchairs) at 80% after the Part B deductible.</p>

<h2>What Is Not Covered</h2>
<ul>
  <li><strong>24-hour care</strong> — Medicare only covers intermittent visits, not round-the-clock staffing</li>
  <li><strong>Custodial care alone</strong> — Help with bathing, cooking, or housekeeping without a skilled care need</li>
  <li><strong>Meal delivery</strong> — Not covered (though some Medicare Advantage plans include this)</li>
  <li><strong>Homemaker services</strong> — Cleaning, laundry, shopping are not Medicare benefits</li>
</ul>
<p>For long-term custodial care, <strong>Medicaid</strong> is the primary payer for those who qualify. Many states offer Medicaid Home and Community-Based Services (HCBS) waivers that fund personal care attendants and homemaker services. Check eligibility in <a href="/state/new-york/">your state</a>.</p>

<h2>How Long Can Home Health Continue?</h2>
<p>There is <strong>no strict time limit</strong> on Medicare home health services as long as you continue to meet the eligibility criteria. Your doctor must recertify your need every 60 days. As long as you remain homebound, need skilled care, and are making progress (or skilled care is needed to maintain function or prevent decline), coverage continues.</p>
<p>That said, Medicare does conduct audits. Home health agencies must demonstrate that continued care is reasonable and necessary. If your condition stabilizes to the point where you no longer need skilled intervention, the benefit ends.</p>

<h2>Choosing a Home Health Agency</h2>
<p>Medicare-certified home health agencies are rated by CMS using a star system (1 to 5 stars) based on quality measures, patient outcomes, and satisfaction. Check ratings at Medicare.gov's <strong>Home Health Compare</strong> tool. Key factors to evaluate:</p>
<ul>
  <li>Overall star rating (aim for 4+ stars)</li>
  <li>Timeliness of care initiation</li>
  <li>Improvement in mobility and pain management</li>
  <li>Hospital readmission rates</li>
  <li>Patient satisfaction scores</li>
</ul>

<h2>Home Health After a Hospital Stay</h2>
<p>Home health is frequently used after discharge from a hospital or <a href="/procedure/skilled-nursing-facility/">skilled nursing facility</a>. If you had a <a href="/procedure/hip-replacement/">hip replacement</a> or <a href="/procedure/knee-replacement/">knee replacement</a> and are discharged home, a home health physical therapist can continue rehabilitation at home — covered at 100% by Medicare.</p>
`,
  },
  {
    slug: "affordable-care-act-marketplace-vs-medicare",
    title: "ACA Marketplace vs. Medicare: When to Use Which and How They Interact",
    description:
      "Confused about ACA Marketplace insurance vs. Medicare? Learn who qualifies for each, when you can have both, and critical timing rules to avoid penalties.",
    publishedAt: "2026-03-26",
    category: "Health Insurance",
    readingTime: 8,
    content: `
<h2>ACA Marketplace and Medicare: Different Programs, Different Rules</h2>
<p>The <strong>Affordable Care Act (ACA) Marketplace</strong> and <strong>Medicare</strong> are separate health insurance systems that serve different populations. The Marketplace (HealthCare.gov or state exchanges) provides subsidized private insurance for working-age adults who lack employer coverage. Medicare covers people 65 and older and those with qualifying disabilities. Understanding how they interact is critical — especially during the transition around age 65.</p>

<h2>Key Differences</h2>
<table>
  <thead><tr><th>Feature</th><th>ACA Marketplace</th><th>Medicare</th></tr></thead>
  <tbody>
    <tr><td>Eligibility</td><td>US residents not eligible for Medicare or affordable employer coverage</td><td>65+, disabled (after 24 months SSDI), or ESRD</td></tr>
    <tr><td>Subsidies</td><td>Premium tax credits based on income (up to 400%+ FPL)</td><td>No income-based premium subsidies (except IRMAA thresholds)</td></tr>
    <tr><td>Enrollment</td><td>Annual Open Enrollment (Nov 1 – Jan 15) or Special Enrollment</td><td>Initial, General, and Annual Enrollment Periods</td></tr>
    <tr><td>Network</td><td>Plan-specific networks</td><td>Original Medicare: any participating provider; MA: plan network</td></tr>
    <tr><td>Drug coverage</td><td>Included in plan</td><td>Separate Part D or bundled in MA</td></tr>
    <tr><td>Long-term care</td><td>Not covered</td><td>Not covered (limited skilled nursing)</td></tr>
  </tbody>
</table>

<h2>Can You Have Both?</h2>
<p>Legally, once you are <strong>eligible for Medicare</strong> (entitled to Part A), you are no longer eligible for ACA Marketplace premium subsidies. This is a firm rule. If you continue a Marketplace plan after becoming Medicare-eligible, you must pay the full unsubsidized premium. In almost all cases, this makes keeping a Marketplace plan impractical and more expensive than Medicare.</p>
<p>You <strong>can</strong> technically have both a Marketplace plan and Medicare simultaneously, but the Marketplace plan becomes secondary and you receive no subsidies. There is virtually no financial reason to maintain both.</p>

<h2>Turning 65: The Critical Transition</h2>
<p>If you are on a Marketplace plan and approaching age 65, the transition timing matters enormously:</p>
<ul>
  <li><strong>Enroll in Medicare during your Initial Enrollment Period</strong> — the 7-month window around your 65th birthday</li>
  <li><strong>Cancel your Marketplace plan</strong> once Medicare coverage begins to stop paying Marketplace premiums</li>
  <li><strong>Do not delay Medicare enrollment</strong> thinking your Marketplace plan is a substitute — it is not considered creditable employer coverage, and delaying will trigger permanent Part B penalties</li>
</ul>

<h3>Common mistake: Marketplace = employer coverage?</h3>
<p>No. A Marketplace plan does <strong>not</strong> qualify as employer-sponsored coverage for the purpose of delaying Medicare without penalty. Only group coverage through an active employer with 20+ employees qualifies. If you are self-employed with a Marketplace plan, you must enroll in Medicare at 65 or face penalties.</p>

<h2>Under 65 and Disabled: Special Considerations</h2>
<p>If you are under 65, receiving SSDI, and in the 24-month Medicare waiting period, you <strong>can</strong> use a Marketplace plan with subsidies during the waiting period. Once Medicare kicks in after 24 months, you must transition off the Marketplace. This is one scenario where having a Marketplace plan makes sense temporarily.</p>

<h2>ACA Plans vs. Medigap</h2>
<p>Some people wonder whether an ACA plan could substitute for Medigap supplemental coverage. It cannot — ACA plans are primary insurance, while Medigap is designed specifically to work alongside Original Medicare. The two products serve fundamentally different roles and are not interchangeable.</p>

<h2>Cost Comparison for a 64-Year-Old vs. 65-Year-Old</h2>
<table>
  <thead><tr><th>Scenario</th><th>Monthly Cost Estimate</th></tr></thead>
  <tbody>
    <tr><td>Age 64, Marketplace Silver plan (with subsidy, $50K income)</td><td>$200–$400/month</td></tr>
    <tr><td>Age 65, Original Medicare + Plan G + Part D</td><td>$350–$550/month</td></tr>
    <tr><td>Age 65, Medicare Advantage ($0 premium MAPD)</td><td>$190/month (Part B only)</td></tr>
  </tbody>
</table>
<p>For many people, the transition to Medicare actually provides <strong>better coverage at similar or lower cost</strong>, especially if choosing Medicare Advantage. Those with higher incomes may face IRMAA surcharges that increase costs. Use our <a href="/state/texas/">state cost comparison tools</a> to estimate your specific situation.</p>

<h2>What Happens to Your ACA Subsidy at 65</h2>
<p>ACA premium tax credits stop the month your Medicare coverage begins. If you do not cancel your Marketplace plan promptly and continue receiving subsidies, you may be required to <strong>repay overpaid subsidies</strong> when you file your tax return. Avoid this by proactively contacting your Marketplace exchange and ending your plan as soon as Medicare starts.</p>
`,
  },
  {
    slug: "medicare-telehealth-coverage-guide",
    title: "Medicare Telehealth Coverage in 2026: What Is Covered and How to Access It",
    description:
      "Medicare telehealth coverage expanded dramatically since 2020 and many flexibilities are now permanent. Learn what telehealth services Medicare covers in 2026.",
    publishedAt: "2026-03-27",
    category: "Medicare Benefits",
    readingTime: 7,
    content: `
<h2>The Evolution of Medicare Telehealth</h2>
<p>Before 2020, Medicare telehealth was extremely limited — available primarily to beneficiaries in rural areas who traveled to approved originating sites. The COVID-19 public health emergency triggered an unprecedented expansion, allowing millions of beneficiaries to receive care from home via video and phone. Congress has since made many of these flexibilities <strong>permanent or extended them through 2026</strong>.</p>

<h2>What Telehealth Services Does Medicare Cover?</h2>
<p>Medicare Part B covers a broad range of telehealth services at the <strong>same cost-sharing as in-person visits</strong> (typically 20% coinsurance after the Part B deductible). Covered services include:</p>
<ul>
  <li><strong>Office visits</strong> — primary care and specialist consultations</li>
  <li><strong>Mental health services</strong> — therapy, psychiatric evaluations, counseling</li>
  <li><strong>Chronic care management</strong> — ongoing monitoring for diabetes, heart failure, COPD</li>
  <li><strong>Physical and occupational therapy</strong> — evaluations and certain therapy sessions</li>
  <li><strong>Substance use disorder treatment</strong> — counseling and medication management</li>
  <li><strong>Annual wellness visits</strong> — including health risk assessments</li>
  <li><strong>Advance care planning</strong> — discussions about healthcare wishes and directives</li>
  <li><strong>Nutrition therapy</strong> — for diabetes and kidney disease management</li>
</ul>

<h2>Geographic and Site Restrictions Relaxed</h2>
<p>The most significant permanent change: beneficiaries can now receive telehealth from <strong>their homes</strong> for behavioral health services without geographic restrictions. For other services, Congress has extended home-as-originating-site waivers through at least the end of 2026. Previously, you had to travel to an approved healthcare facility in a rural area — a requirement that made telehealth impractical for most beneficiaries.</p>

<h2>Audio-Only (Phone) Visits</h2>
<p>Medicare continues to cover <strong>audio-only telephone visits</strong> for beneficiaries who lack access to video technology. This is critical for older adults who do not own smartphones or computers or lack reliable internet access. Audio-only visits are covered for established patients with their existing providers. The reimbursement rate is slightly lower than video visits but the benefit is identical from the beneficiary's cost-sharing perspective.</p>

<h2>Telehealth for Mental Health</h2>
<p>Mental health services represent the largest category of Medicare telehealth usage. Medicare covers virtual therapy sessions, psychiatric medication management, and substance use disorder counseling without geographic limits. An <strong>in-person visit is required within 6 months</strong> of starting telehealth mental health treatment and annually thereafter — this is a CMS requirement to maintain the care relationship.</p>
<p>Coverage applies to licensed clinical social workers, psychologists, psychiatrists, and other qualified mental health professionals. For beneficiaries in <a href="/state/montana/">rural states</a> or areas with mental health provider shortages, telehealth removes a major barrier to accessing care.</p>

<h2>Medicare Advantage and Telehealth</h2>
<p>Many Medicare Advantage plans offer <strong>expanded telehealth benefits</strong> beyond what Original Medicare covers. These may include:</p>
<ul>
  <li>$0 copay virtual urgent care visits (24/7)</li>
  <li>Virtual primary care programs with dedicated online providers</li>
  <li>Remote patient monitoring devices and programs</li>
  <li>Virtual physical therapy and rehabilitation programs</li>
  <li>Telehealth dental consultations (triage and referral)</li>
</ul>
<p>If telehealth access is important to you, compare MA plans' virtual care offerings during the <a href="/procedure/annual-enrollment/">Annual Enrollment Period</a>. Some plans partner with telehealth platforms that provide unlimited virtual visits at no additional cost.</p>

<h2>Remote Patient Monitoring</h2>
<p>Medicare covers <strong>Remote Patient Monitoring (RPM)</strong>, where a provider uses connected devices to track your vital signs from home — blood pressure monitors, glucose meters, pulse oximeters, and weight scales. The provider reviews data periodically and adjusts your care plan. RPM is covered under Part B with standard cost-sharing and requires your provider to enroll in the RPM program.</p>

<h2>How to Access Medicare Telehealth</h2>
<p>Getting started with telehealth is straightforward:</p>
<ul>
  <li>Ask your existing doctor if they offer telehealth appointments</li>
  <li>If using Medicare Advantage, check your plan's telehealth portal or app</li>
  <li>Ensure you have a device with video capability (smartphone, tablet, or computer) — or confirm audio-only is available</li>
  <li>Have your Medicare card number ready for check-in</li>
  <li>Find a private, quiet space for your appointment</li>
</ul>
`,
  },
  {
    slug: "skilled-nursing-facility-medicare-coverage",
    title: "Skilled Nursing Facility Coverage Under Medicare: Rules, Costs, and Limits",
    description:
      "Medicare covers skilled nursing facility care for up to 100 days after a qualifying hospital stay, but strict rules apply. Learn the costs, eligibility, and limitations.",
    publishedAt: "2026-03-28",
    category: "Medicare Benefits",
    readingTime: 8,
    content: `
<h2>When Medicare Covers Skilled Nursing Care</h2>
<p>Medicare Part A covers care in a <strong>skilled nursing facility (SNF)</strong> when you need skilled medical services — such as physical therapy, intravenous medications, or wound care — on a daily basis following a qualifying hospital stay. This benefit is among the most misunderstood in all of Medicare, and the strict eligibility rules surprise many beneficiaries and their families.</p>

<h2>The Three-Day Hospital Stay Rule</h2>
<p>To qualify for SNF coverage, you must have a <strong>qualifying inpatient hospital stay of at least 3 consecutive days</strong> (not counting the discharge day). The SNF admission must occur within 30 days of the hospital discharge. This rule trips up many beneficiaries because:</p>
<ul>
  <li><strong>Observation status does not count</strong> — If you are in the hospital under "observation" rather than formally admitted as an inpatient, those days do not count toward the 3-day requirement, even if you spend 4+ days in the hospital</li>
  <li><strong>The Medicare Outpatient Observation Notice (MOON)</strong> — Hospitals must notify you in writing if you have been in observation status for more than 24 hours. Always ask your admission status on arrival.</li>
</ul>

<h2>Cost-Sharing in a Skilled Nursing Facility</h2>
<table>
  <thead><tr><th>Days</th><th>Your Cost (2026)</th><th>Medicare Pays</th></tr></thead>
  <tbody>
    <tr><td>Days 1–20</td><td>$0</td><td>100% of approved charges</td></tr>
    <tr><td>Days 21–100</td><td>$215.50/day coinsurance</td><td>Remainder of approved charges</td></tr>
    <tr><td>Days 101+</td><td>100% (Medicare coverage ends)</td><td>$0</td></tr>
  </tbody>
</table>
<p>The coinsurance for days 21-100 is substantial: a full 80-day extension would cost <strong>$17,240 out of pocket</strong>. This is one of the primary costs that <a href="/procedure/medigap-enrollment/">Medigap supplemental plans</a> cover — Plans C, F, G, and N all pay the SNF coinsurance in full.</p>

<h2>What Skilled Nursing Covers</h2>
<p>During a covered SNF stay, Medicare pays for:</p>
<ul>
  <li>Semi-private room and board</li>
  <li>Skilled nursing care (24-hour availability)</li>
  <li>Physical, occupational, and speech therapy</li>
  <li>Medications administered during the stay</li>
  <li>Medical social services</li>
  <li>Dietary counseling</li>
  <li>Ambulance transportation to nearest required medical services</li>
  <li>Medical supplies and equipment used during the stay</li>
</ul>

<h2>What Ends SNF Coverage</h2>
<p>Medicare stops paying for SNF care when any of these occur:</p>
<ul>
  <li>You no longer need daily skilled care (custodial care alone does not qualify)</li>
  <li>You are not making progress toward recovery goals and skilled care is not needed for maintenance</li>
  <li>You have used all 100 days in a benefit period</li>
  <li>You no longer meet Medicare criteria as determined by the facility and Medicare reviewers</li>
</ul>

<h3>The Jimmo settlement</h3>
<p>An important legal clarification: the <strong>Jimmo v. Sebelius settlement</strong> established that Medicare cannot deny SNF coverage solely because a patient is not improving. Skilled care needed to <strong>maintain function or prevent decline</strong> qualifies for coverage. If your SNF stay is denied based on lack of improvement, this is potentially grounds for appeal.</p>

<h2>Skilled Nursing vs. Custodial Care</h2>
<p>The critical distinction Medicare makes:</p>
<table>
  <thead><tr><th>Skilled Care (Covered)</th><th>Custodial Care (Not Covered)</th></tr></thead>
  <tbody>
    <tr><td>Physical therapy for post-hip replacement rehab</td><td>Help with bathing and dressing without skilled need</td></tr>
    <tr><td>IV antibiotics administration</td><td>Supervision for safety/dementia without skilled services</td></tr>
    <tr><td>Complex wound care requiring nursing assessment</td><td>Long-term residential care in a nursing home</td></tr>
    <tr><td>Medication management after acute illness</td><td>Companionship and meal assistance</td></tr>
  </tbody>
</table>
<p>For ongoing custodial nursing home care, <strong>Medicaid</strong> is the primary payer for those who qualify financially. Many families must plan for Medicaid eligibility through careful asset management. See our guide on <a href="/state/florida/">state-by-state Medicaid rules</a> for nursing home coverage.</p>

<h2>Medicare Advantage and SNF Care</h2>
<p>Medicare Advantage plans cover SNF care with the same basic benefit but may have <strong>different cost-sharing structures</strong> and network requirements. Some MA plans have eliminated the 3-day hospital stay requirement for SNF admission — a significant advantage. Check your specific plan's Evidence of Coverage document. If your plan requires using an in-network SNF, verify which facilities are available in your <a href="/state/california/">service area</a> before you need one.</p>

<h2>Planning Ahead</h2>
<p>The average SNF stay is approximately 25 days. If you anticipate needing SNF care — for example, after a planned <a href="/procedure/knee-replacement/">joint replacement surgery</a> — confirm your hospital admission status, choose a Medicare-certified SNF with strong quality ratings, and ensure your supplemental coverage (Medigap or MA plan) will adequately cover the coinsurance for days 21 and beyond.</p>
`,
  },
  {
    slug: "medicare-annual-wellness-visit-guide",
    title: "Medicare Annual Wellness Visit: What to Expect and How It Differs from a Physical",
    description:
      "The Annual Wellness Visit is free for all Medicare beneficiaries but is not a physical exam. Learn what it covers, how to prepare, and why you should schedule one.",
    publishedAt: "2026-03-29",
    category: "Medicare Benefits",
    readingTime: 7,
    content: `
<h2>What Is the Annual Wellness Visit?</h2>
<p>The <strong>Medicare Annual Wellness Visit (AWV)</strong> is a free preventive care appointment available to all Medicare Part B beneficiaries once every 12 months (after your first year on Part B). It is covered at <strong>$0 cost</strong> — no copay, no coinsurance, no deductible — when performed by a provider who accepts Medicare assignment.</p>
<p>Important distinction: the AWV is <strong>not a physical exam</strong>. Your doctor will not perform a head-to-toe physical examination, listen to your lungs, or check your reflexes as part of the AWV. It is a health planning and risk assessment visit focused on prevention and early detection.</p>

<h2>AWV vs. "Welcome to Medicare" Visit</h2>
<table>
  <thead><tr><th>Feature</th><th>Welcome to Medicare (IPPE)</th><th>Annual Wellness Visit</th></tr></thead>
  <tbody>
    <tr><td>When available</td><td>First 12 months of Part B only</td><td>Every 12 months after first year</td></tr>
    <tr><td>Physical exam included</td><td>Yes (basic)</td><td>No</td></tr>
    <tr><td>Health risk assessment</td><td>Yes</td><td>Yes (updated annually)</td></tr>
    <tr><td>Cost</td><td>$0</td><td>$0</td></tr>
    <tr><td>Personalized prevention plan</td><td>No</td><td>Yes</td></tr>
  </tbody>
</table>

<h2>What Happens During the Visit</h2>
<h3>Health risk assessment</h3>
<p>You complete a questionnaire (often before the visit) covering your medical history, family history, medications, functional abilities, fall risk, mood, and health habits. This information forms the basis of your personalized prevention plan.</p>

<h3>Measurements taken</h3>
<ul>
  <li>Height, weight, and BMI calculation</li>
  <li>Blood pressure reading</li>
  <li>Vision screening (if applicable)</li>
</ul>

<h3>Cognitive assessment</h3>
<p>Starting in 2026, the AWV includes a <strong>structured cognitive assessment</strong> — a brief screening for signs of cognitive impairment or early dementia. This is not a diagnosis but a detection tool. If concerns arise, your provider will recommend follow-up testing.</p>

<h3>Personalized prevention plan</h3>
<p>Based on your health risk assessment, your provider creates a written prevention plan that includes:</p>
<ul>
  <li>A schedule of recommended screenings (mammogram, <a href="/procedure/colonoscopy/">colonoscopy</a>, bone density, etc.)</li>
  <li>A list of risk factors and conditions to monitor</li>
  <li>Referrals for preventive services you are due for</li>
  <li>Immunization recommendations</li>
  <li>Advance care planning discussion (covered separately if extended)</li>
</ul>

<h3>Advance care planning</h3>
<p>The AWV may include a discussion about <strong>advance directives</strong> — your wishes regarding end-of-life care, living wills, and healthcare power of attorney. If this discussion extends beyond the AWV, Medicare covers advance care planning as a separate billable service at no additional cost when performed during the AWV.</p>

<h2>How to Prepare for Your AWV</h2>
<ul>
  <li><strong>Bring a complete medication list</strong> — include all prescriptions, over-the-counter drugs, vitamins, and supplements with dosages</li>
  <li><strong>List your current providers</strong> — names and contact information for all doctors and specialists you see</li>
  <li><strong>Note any new symptoms or concerns</strong> — the AWV is a good time to flag issues for follow-up</li>
  <li><strong>Complete the health risk assessment questionnaire</strong> in advance if your provider sends one</li>
  <li><strong>Bring family medical history</strong> — conditions affecting parents, siblings, and children</li>
  <li><strong>Prepare advance care planning questions</strong> if you want to discuss end-of-life preferences</li>
</ul>

<h2>Avoiding Surprise Bills</h2>
<p>A common complaint: beneficiaries schedule an AWV expecting $0 cost but receive a bill. This happens when the visit goes beyond pure wellness and into <strong>diagnostic territory</strong>. If you mention a new symptom and the doctor evaluates it, that evaluation is billed as a separate office visit with standard cost-sharing.</p>
<p>To avoid this, clearly communicate that you want the wellness visit only. If a concern arises, ask: "Can we address this at a separate appointment?" or ask the provider to clarify what will be billed as preventive versus diagnostic before proceeding.</p>

<h2>Why Scheduling Matters</h2>
<p>Only about 50% of Medicare beneficiaries take advantage of the free AWV each year. This is a missed opportunity — the AWV identifies risk factors early, ensures you are current on all recommended screenings, and creates a documented prevention plan. Over time, beneficiaries who attend regular AWVs have better health outcomes and lower total healthcare costs. Schedule yours through your primary care provider or check <a href="/state/california/">your state page</a> for finding Medicare-accepting physicians near you.</p>
`,
  },
  {
    slug: "prescription-drug-savings-tips-seniors",
    title: "16 Ways Seniors Can Save Money on Prescription Drugs in 2026",
    description:
      "Prescription drugs are a major expense for Medicare beneficiaries. Use these proven strategies to reduce your drug costs significantly.",
    publishedAt: "2026-03-30",
    category: "Prescription Drugs",
    readingTime: 8,
    content: `
<h2>Why Drug Costs Are a Major Concern</h2>
<p>The average Medicare beneficiary fills approximately 50 prescriptions per year, and out-of-pocket drug spending averages over $1,500 annually even with Part D coverage. For those taking specialty medications, costs can be far higher. The good news: multiple strategies can significantly reduce what you pay at the pharmacy.</p>

<h2>Strategy 1: Use the $2,000 Out-of-Pocket Cap</h2>
<p>The Inflation Reduction Act capped Part D out-of-pocket costs at <strong>$2,000 per year</strong>. Once you reach that threshold, Medicare covers 100% of remaining drug costs. If you take expensive medications, you can also enroll in the <strong>Medicare Prescription Payment Plan</strong>, which spreads your out-of-pocket costs into equal monthly installments throughout the year — no interest charged.</p>

<h2>Strategy 2: Apply for Extra Help (Low-Income Subsidy)</h2>
<p>If your annual income is below approximately $22,590 (individual) or $30,660 (couple) and your assets are limited, you may qualify for <strong>Extra Help</strong>. This federal program pays for most of your Part D premium, eliminates the deductible, and reduces copays to $0–$11 per prescription. Apply through Social Security (SSA.gov) or your <a href="/state/new-york/">state Medicaid office</a>.</p>

<h2>Strategy 3: Compare Part D Plans Every Year</h2>
<p>Drug plans change formularies, tiers, and pharmacy networks annually. Use <strong>Medicare Plan Finder</strong> at Medicare.gov to enter your exact medications and find the plan with the lowest total estimated annual cost — not just the lowest premium.</p>

<h2>Strategy 4: Ask for Generics</h2>
<p>Generic drugs are FDA-approved equivalents of brand-name medications at a fraction of the cost. On average, generics cost <strong>80-85% less</strong> than their brand-name counterparts. Ask your doctor if a generic alternative exists for every brand-name drug you take. If your doctor prescribes brand-only, ask them to explain why the generic is not appropriate.</p>

<h2>Strategy 5: Use Preferred Pharmacies</h2>
<p>Most Part D plans have <strong>preferred pharmacy networks</strong> with lower copays. The same drug at a preferred pharmacy might cost $5, while a non-preferred pharmacy charges $25. Check your plan's pharmacy network and switch pharmacies if it reduces costs. Mail-order pharmacies often have the best pricing for maintenance medications.</p>

<h2>Strategy 6: Request 90-Day Supplies</h2>
<p>For maintenance medications you take regularly, ask for a <strong>90-day supply</strong> instead of 30-day fills. Most plans charge less per pill for 90-day quantities, and mail-order pharmacies typically offer the best 90-day pricing.</p>

<h2>Strategy 7: Explore Patient Assistance Programs (PAPs)</h2>
<p>Pharmaceutical manufacturers offer PAPs that provide free or deeply discounted medications to qualifying patients. Programs exist for most expensive brand-name drugs and many biologics. Check each manufacturer's website or use NeedyMeds.org to find programs for your medications.</p>

<h2>Strategy 8: Use the $35 Insulin Cap</h2>
<p>All Part D plans must cap insulin costs at <strong>$35 per month per prescription</strong>, regardless of the type or quantity. If you take insulin, ensure you are benefiting from this cap. Some Medicare Advantage plans offer insulin at $0.</p>

<h2>Strategy 9: Take Advantage of Free Vaccines</h2>
<p>Under the Inflation Reduction Act, all ACIP-recommended vaccines are covered at $0 under Part D. This includes <strong>shingles (Shingrix)</strong>, which previously cost $150+ out of pocket. Get all recommended vaccines to avoid costly preventable illnesses.</p>

<h2>Additional Savings Strategies</h2>
<ul>
  <li><strong>Strategy 10: Pill splitting</strong> — If your doctor approves, get a higher-dose pill and split it. Many tablets cost the same regardless of dose.</li>
  <li><strong>Strategy 11: Therapeutic substitution</strong> — Ask your doctor about switching to a different drug in the same class that is on a lower tier in your plan's formulary.</li>
  <li><strong>Strategy 12: State pharmaceutical assistance programs (SPAPs)</strong> — Many states offer additional drug subsidies. Check with your <a href="/state/pennsylvania/">state pharmacy assistance program</a>.</li>
  <li><strong>Strategy 13: Discount cards and coupons</strong> — GoodRx and similar tools sometimes offer prices lower than your Part D copay for certain drugs. However, these payments do not count toward your Part D out-of-pocket cap.</li>
  <li><strong>Strategy 14: VA benefits</strong> — Veterans may get lower drug costs through VA pharmacies, which can be used alongside Medicare.</li>
  <li><strong>Strategy 15: Charitable foundations</strong> — Organizations like the HealthWell Foundation and Patient Advocate Foundation provide copay assistance for specific conditions.</li>
  <li><strong>Strategy 16: Review your medication list with your doctor</strong> — Deprescribing (safely stopping unnecessary medications) reduces costs and side effects. Ask your doctor annually if every medication is still needed.</li>
</ul>

<h2>What NOT to Do</h2>
<ul>
  <li><strong>Do not skip medications</strong> to save money — this leads to hospitalizations that cost far more</li>
  <li><strong>Do not buy from unlicensed online pharmacies</strong> — counterfeit drugs are dangerous and widespread</li>
  <li><strong>Do not ignore the Annual Enrollment Period</strong> — switching plans can save hundreds with 30 minutes of research</li>
</ul>
`,
  },
  {
    slug: "medicare-fraud-scams-how-to-protect-yourself",
    title: "Medicare Fraud and Scams: How to Protect Yourself and Report Abuse",
    description:
      "Medicare fraud costs billions annually and increasingly targets beneficiaries directly. Learn to recognize common scams and protect your Medicare number.",
    publishedAt: "2026-03-30",
    updatedAt: "2026-03-30",
    category: "Medicare Rights",
    readingTime: 7,
    content: `
<h2>The Scale of Medicare Fraud</h2>
<p>Medicare fraud costs the federal government an estimated <strong>$60–$90 billion per year</strong> — roughly 10% of total Medicare spending. Fraud takes many forms, from providers billing for services never rendered to organized criminal rings stealing beneficiary identities. Increasingly, scammers directly target Medicare beneficiaries through phone calls, emails, and even door-to-door visits.</p>

<h2>Common Medicare Scams Targeting Beneficiaries</h2>
<h3>The Medicare card scam</h3>
<p>Callers claim to be from Medicare and say you need a "new Medicare card" — often citing a supposed system upgrade or redesign. They ask you to verify your Medicare number, Social Security number, or bank information to "activate" the card. <strong>Medicare will never call you to ask for your Medicare number.</strong> They already have it.</p>

<h3>Fake plan enrollment calls</h3>
<p>During open enrollment season, scammers impersonate insurance agents and pressure you to enroll in a specific Medicare Advantage or Part D plan. They may promise benefits that do not exist or claim your current plan is being cancelled. Legitimate agents do not cold-call to sell Medicare plans — this is prohibited by CMS marketing rules.</p>

<h3>Free medical equipment offers</h3>
<p>You receive a call offering free back braces, knee braces, or genetic testing kits. The caller asks for your Medicare number to "verify eligibility." They then bill Medicare for equipment or tests you never needed, never received, or that were medically inappropriate. This generates fraudulent claims under your name.</p>

<h3>COVID and prescription drug scams</h3>
<p>Scammers offer free COVID tests, vaccines, or prescription drug discount cards in exchange for your Medicare number. While vaccines and certain tests are genuinely free, you should only access them through legitimate pharmacies and healthcare providers — never through unsolicited calls or websites.</p>

<h2>How to Protect Yourself</h2>
<ul>
  <li><strong>Guard your Medicare number</strong> like a credit card number — do not share it with anyone who contacts you unsolicited</li>
  <li><strong>Review your Medicare Summary Notice (MSN)</strong> every quarter — check for services you did not receive or providers you did not visit</li>
  <li><strong>Never give personal information</strong> to unsolicited callers, even if they claim to be from Medicare, Social Security, or your insurance company</li>
  <li><strong>Hang up on pressure tactics</strong> — legitimate Medicare representatives never pressure you to make immediate decisions</li>
  <li><strong>Verify independently</strong> — if someone claims to be from Medicare, hang up and call 1-800-MEDICARE directly</li>
  <li><strong>Shred Medicare documents</strong> before discarding them — dumpster diving for Medicare numbers is a real tactic</li>
</ul>

<h2>Signs of Provider Fraud</h2>
<p>Not all fraud comes from external scammers — some comes from healthcare providers themselves. Watch for:</p>
<ul>
  <li>Being billed for services you did not receive</li>
  <li>Receiving duplicate bills for the same service</li>
  <li>Being billed for more expensive procedures than what was performed (upcoding)</li>
  <li>A provider ordering unnecessary tests or procedures</li>
  <li>Being asked to provide your Medicare number for a "free" screening or service at a health fair</li>
</ul>

<h2>How to Report Medicare Fraud</h2>
<table>
  <thead><tr><th>Who to Contact</th><th>When</th></tr></thead>
  <tbody>
    <tr><td>1-800-MEDICARE (1-800-633-4227)</td><td>Questions about suspicious charges on your MSN</td></tr>
    <tr><td>OIG Hotline: 1-800-HHS-TIPS</td><td>Suspected provider fraud, kickbacks, or abuse</td></tr>
    <tr><td>Senior Medicare Patrol (SMP)</td><td>Free volunteer program in every state for fraud education and reporting</td></tr>
    <tr><td>State Attorney General</td><td>Scams and identity theft affecting state residents</td></tr>
    <tr><td>FTC (reportfraud.ftc.gov)</td><td>General consumer fraud and identity theft</td></tr>
  </tbody>
</table>

<h2>If Your Medicare Number Is Compromised</h2>
<p>If you believe your Medicare number has been stolen or used fraudulently:</p>
<ul>
  <li>Call 1-800-MEDICARE immediately to report the breach</li>
  <li>Request a <strong>new Medicare Beneficiary Identifier (MBI)</strong> — Medicare can issue a replacement number</li>
  <li>Place a fraud alert on your credit reports through the three bureaus</li>
  <li>Monitor your MSN and Explanation of Benefits carefully for the next 12 months</li>
  <li>Contact your local <a href="/state/california/">State Health Insurance Assistance Program (SHIP)</a> for free counseling</li>
</ul>
`,
  },
  {
    slug: "long-term-care-planning-guide",
    title: "Long-Term Care Planning: Costs, Insurance Options, and How to Prepare",
    description:
      "70% of Americans over 65 will need long-term care. Medicare barely covers it. Learn the true costs, insurance options, Medicaid rules, and planning strategies.",
    publishedAt: "2026-03-30",
    category: "Medicare Planning",
    readingTime: 9,
    content: `
<h2>The Long-Term Care Reality</h2>
<p>Approximately <strong>70% of Americans turning 65 today will need some form of long-term care</strong> during their remaining years, according to the Department of Health and Human Services. Long-term care includes assistance with activities of daily living (ADLs) — bathing, dressing, eating, toileting, transferring, and continence — as well as cognitive support for conditions like Alzheimer's disease and dementia.</p>
<p>The financial impact is severe: the median annual cost of a private nursing home room exceeds <strong>$116,000 nationally</strong> in 2026. Home health aide services average $75,000+ per year for full-time care. Most families are unprepared for these expenses.</p>

<h2>What Medicare Does and Does Not Cover</h2>
<p>Medicare's coverage of long-term care is <strong>extremely limited</strong>:</p>
<ul>
  <li><strong>Skilled nursing facility</strong> — Up to 100 days after a qualifying 3-day hospital stay, for skilled (not custodial) care only</li>
  <li><strong>Home health</strong> — Skilled intermittent care if you are homebound; does not cover 24-hour care or custodial assistance alone</li>
  <li><strong>Hospice</strong> — End-of-life care for terminal illness (6-month prognosis)</li>
</ul>
<p>Medicare does <strong>not</strong> cover ongoing nursing home stays, assisted living facilities, adult day care, or long-term home care aides providing custodial support. This gap is the single biggest financial risk for retirees. See our <a href="/procedure/skilled-nursing-facility/">SNF coverage guide</a> for details on what Medicare does cover.</p>

<h2>Long-Term Care Costs by Setting</h2>
<table>
  <thead><tr><th>Care Setting</th><th>National Median Annual Cost (2026)</th></tr></thead>
  <tbody>
    <tr><td>Nursing home (private room)</td><td>$116,800</td></tr>
    <tr><td>Nursing home (semi-private)</td><td>$104,000</td></tr>
    <tr><td>Assisted living facility</td><td>$64,200</td></tr>
    <tr><td>Home health aide (44 hrs/week)</td><td>$75,500</td></tr>
    <tr><td>Adult day health care</td><td>$22,360</td></tr>
  </tbody>
</table>
<p>Costs vary dramatically by state. Nursing home care in <a href="/state/new-york/">New York</a> can exceed $170,000/year, while <a href="/state/texas/">Texas</a> and southern states tend to be lower. Use our state cost pages for local estimates.</p>

<h2>Funding Options</h2>
<h3>Long-term care insurance (LTCI)</h3>
<p>Traditional LTCI policies pay a daily or monthly benefit when you cannot perform a specified number of ADLs or have cognitive impairment. Key considerations:</p>
<ul>
  <li>Best purchased between ages <strong>55-65</strong> when premiums are more affordable and you can pass medical underwriting</li>
  <li>Annual premiums range from $2,000–$6,000+ depending on age, health, benefit amount, and benefit period</li>
  <li>Premiums can increase over time — insurers have raised rates significantly on older policy blocks</li>
  <li>Tax-qualified policies offer limited tax deductions on premiums</li>
</ul>

<h3>Hybrid life/LTC policies</h3>
<p>Increasingly popular, hybrid policies combine life insurance with long-term care benefits. If you need care, the policy pays LTC benefits. If you never need care, your beneficiaries receive a death benefit. Advantages include guaranteed premiums (no rate increases) and a return of value if LTC is never used. The tradeoff is higher upfront cost — typically a single premium of $75,000–$200,000 or annual premiums for a fixed period.</p>

<h3>Medicaid</h3>
<p>For those who cannot afford private coverage, <strong>Medicaid is the primary payer for nursing home care</strong>. However, qualifying requires spending down most assets to very low limits (typically $2,000 for an individual). Medicaid planning — legally structuring assets to protect a community spouse or preserve some inheritance — is a complex area that typically requires an elder law attorney.</p>

<h3>Self-funding</h3>
<p>Wealthy retirees may choose to self-insure against long-term care risk by earmarking savings specifically for potential care needs. Financial planners generally recommend having at least <strong>$300,000–$500,000</strong> in dedicated long-term care reserves if self-funding, given the potential duration and cost of care.</p>

<h2>Medicaid Asset Protection Strategies</h2>
<p>If Medicaid is part of your planning, be aware of key rules:</p>
<ul>
  <li><strong>Look-back period</strong> — Medicaid examines asset transfers made within 60 months (5 years) before application. Gifts during this period trigger penalty periods of ineligibility.</li>
  <li><strong>Spousal protections</strong> — The community spouse (non-applicant) can keep the home, one vehicle, and assets up to the Community Spouse Resource Allowance ($154,140 in 2026).</li>
  <li><strong>Irrevocable trusts</strong> — Assets placed in irrevocable trusts more than 5 years before applying are generally protected, but this requires careful legal planning.</li>
  <li><strong>Medicaid estate recovery</strong> — After death, the state may seek repayment from your estate for Medicaid benefits paid. Proper planning can minimize this recovery.</li>
</ul>

<h2>When to Start Planning</h2>
<p>The ideal time to begin long-term care planning is in your <strong>mid-50s</strong> — when insurance is affordable, asset protection strategies have time to mature, and you can make informed decisions without the pressure of an imminent need. Waiting until care is needed eliminates most options. Consult an elder law attorney and a financial planner who specializes in retirement healthcare costs.</p>
`,
  },
  {
    slug: "medicare-supplement-plan-g-vs-plan-n",
    title: "Medigap Plan G vs. Plan N: Which Medicare Supplement Is Right for You?",
    description:
      "Plan G and Plan N are the two most popular Medigap policies. Compare their coverage, costs, copays, and which beneficiary profile each plan suits best.",
    publishedAt: "2026-03-30",
    category: "Medicare Plans",
    readingTime: 8,
    content: `
<h2>The Two Most Popular Medigap Plans</h2>
<p>Since Medicare Plan F became unavailable to new enrollees in 2020, <strong>Plan G</strong> and <strong>Plan N</strong> have emerged as the most popular Medigap choices. Together, they account for the majority of new Medigap enrollments nationwide. Both provide strong protection against Original Medicare's cost-sharing, but they differ in important ways that affect your out-of-pocket costs and monthly premium.</p>

<h2>Coverage Comparison</h2>
<table>
  <thead><tr><th>Benefit</th><th>Plan G</th><th>Plan N</th></tr></thead>
  <tbody>
    <tr><td>Part A hospital coinsurance + 365 extra days</td><td>100%</td><td>100%</td></tr>
    <tr><td>Part A hospice coinsurance/copay</td><td>100%</td><td>100%</td></tr>
    <tr><td>Part A deductible ($1,724 in 2026)</td><td>100%</td><td>100%</td></tr>
    <tr><td>Part B coinsurance (normally 20%)</td><td>100%</td><td>100% (with copays noted below)</td></tr>
    <tr><td>Part B deductible ($264 in 2026)</td><td>Not covered</td><td>Not covered</td></tr>
    <tr><td>Part B excess charges</td><td>100%</td><td>Not covered</td></tr>
    <tr><td>Skilled nursing facility coinsurance</td><td>100%</td><td>100%</td></tr>
    <tr><td>Foreign travel emergency (80%)</td><td>Covered</td><td>Covered</td></tr>
    <tr><td>Blood (first 3 pints)</td><td>100%</td><td>100%</td></tr>
    <tr><td>Office visit copay</td><td>$0</td><td>Up to $20</td></tr>
    <tr><td>ER visit copay (no admission)</td><td>$0</td><td>Up to $50</td></tr>
  </tbody>
</table>

<h2>Understanding the Key Differences</h2>
<h3>Difference 1: Office visit and ER copays</h3>
<p>Plan N applies a copay of up to <strong>$20 per office visit</strong> and up to <strong>$50 per emergency room visit</strong> that does not result in an inpatient admission. Plan G has no copays at all. For someone who visits a doctor 6 times a year, that is potentially $120 in extra costs with Plan N. For someone who visits 2 times, it is only $40.</p>

<h3>Difference 2: Part B excess charges</h3>
<p>Plan G covers <strong>Part B excess charges</strong> — the amount a non-participating provider can charge above the Medicare-approved amount (up to 15% more). Plan N does not cover these charges. In practice, this matters less than it sounds: the vast majority of doctors (96%+) accept Medicare assignment and do not bill excess charges. However, if you see specialists who do not accept assignment, Plan G protects you while Plan N does not.</p>

<h3>Difference 3: Premium savings</h3>
<p>The primary reason to choose Plan N over Plan G is the <strong>lower monthly premium</strong>. Nationally, Plan N premiums average $30–$80 less per month than Plan G — savings of $360–$960 per year. For a healthy beneficiary with few doctor visits, the premium savings almost always exceed the occasional copays.</p>

<h2>Cost Analysis: Plan G vs. Plan N</h2>
<table>
  <thead><tr><th>Scenario</th><th>Plan G Annual Cost</th><th>Plan N Annual Cost</th></tr></thead>
  <tbody>
    <tr><td>Healthy (3 doctor visits, no ER)</td><td>$2,520 premium only</td><td>$1,920 premium + $60 copays = $1,980</td></tr>
    <tr><td>Moderate (8 visits, 1 ER no admission)</td><td>$2,520 premium only</td><td>$1,920 premium + $210 copays = $2,130</td></tr>
    <tr><td>High use (15 visits, 2 ER no admission)</td><td>$2,520 premium only</td><td>$1,920 premium + $400 copays = $2,320</td></tr>
  </tbody>
</table>
<p><em>Example based on Plan G at $210/mo and Plan N at $160/mo. Actual premiums vary by age, state, and insurer.</em></p>

<h2>Who Should Choose Plan G?</h2>
<ul>
  <li>Beneficiaries with <strong>chronic conditions</strong> requiring frequent specialist visits</li>
  <li>Those who see providers that <strong>do not accept Medicare assignment</strong></li>
  <li>People who value <strong>maximum predictability</strong> and simplicity — after the $264 Part B deductible, there are truly $0 out-of-pocket costs</li>
  <li>Beneficiaries who prefer to <strong>never think about copays</strong> at the point of service</li>
</ul>

<h2>Who Should Choose Plan N?</h2>
<ul>
  <li>Relatively <strong>healthy beneficiaries</strong> with few doctor visits per year</li>
  <li>Those who see only <strong>Medicare-participating providers</strong> (no excess charges)</li>
  <li>Budget-conscious enrollees who want <strong>strong protection at lower monthly cost</strong></li>
  <li>People comfortable with small, <strong>predictable copays</strong> at the point of service</li>
</ul>

<h2>High-Deductible Plan G: A Third Option</h2>
<p>For beneficiaries willing to accept more risk in exchange for very low premiums, the <strong>High-Deductible Plan G</strong> requires you to pay the first $2,870 (2026) of Medicare cost-sharing out of pocket before coverage kicks in. After meeting this deductible, it covers everything Plan G covers. Monthly premiums are often <strong>$30–$80/month</strong> — a fraction of standard Plan G. This option works well for very healthy beneficiaries who want catastrophic protection at minimal cost.</p>

<h2>Shopping and Switching Tips</h2>
<p>Because Medigap plans are standardized, the coverage for any Plan G is identical across all insurers. Shop purely on <strong>premium, financial stability of the insurer, and customer service reputation</strong>. Use your <a href="/state/florida/">state insurance department</a> rate comparison tools. If you currently have Plan G and want to switch to Plan N (or vice versa), be aware that outside your initial open enrollment period, you may face medical underwriting in most states.</p>
`,
  },
  {
    slug: "health-savings-account-hsa-with-medicare",
    title: "Health Savings Accounts and Medicare: HSA Rules, Penalties, and Strategies",
    description:
      "You cannot contribute to an HSA once enrolled in Medicare, but you can use existing funds tax-free. Learn the rules, deadlines, and smart HSA strategies for Medicare enrollees.",
    publishedAt: "2026-03-30",
    category: "Medicare Planning",
    readingTime: 8,
    content: `
<h2>HSAs and Medicare: The Basic Rule</h2>
<p>A <strong>Health Savings Account (HSA)</strong> is a tax-advantaged account paired with a high-deductible health plan (HDHP) that allows you to save pre-tax dollars for medical expenses. HSAs offer a triple tax advantage: contributions are tax-deductible, growth is tax-free, and withdrawals for qualified medical expenses are tax-free. However, there is a critical rule: <strong>you cannot contribute to an HSA if you are enrolled in any part of Medicare</strong>, including Part A.</p>

<h2>Why Medicare Enrollment Stops HSA Contributions</h2>
<p>The IRS considers Medicare (Parts A, B, C, and D) to be non-HDHP coverage. Since HSA contributions are only allowed when you have an HDHP and <strong>no other disqualifying coverage</strong>, any Medicare enrollment — even premium-free Part A — makes you ineligible to contribute. This rule catches many people by surprise, especially those who:</p>
<ul>
  <li>Are automatically enrolled in Part A when they start Social Security benefits</li>
  <li>Turn 65 and are retroactively enrolled in Part A (Medicare Part A is retroactive up to 6 months)</li>
  <li>Continue working past 65 with an HDHP and assume they can keep contributing</li>
</ul>

<h2>The Retroactive Enrollment Trap</h2>
<p>When you enroll in Medicare Part A, coverage can be retroactive by up to <strong>6 months</strong> (but not before age 65). This means if you sign up for Part A in December, your coverage start date might be backdated to June. Any HSA contributions made during those retroactive months are <strong>excess contributions</strong> subject to a 6% excise tax for every year they remain in the account.</p>
<p>To avoid this, stop HSA contributions <strong>at least 6 months before</strong> enrolling in Medicare Part A. If you plan to enroll in Medicare at age 65 and 3 months, stop contributing by the month you turn 65 at the latest.</p>

<h2>Can You Still Use Your HSA After Enrolling in Medicare?</h2>
<p>Absolutely. You can <strong>withdraw existing HSA funds tax-free</strong> for qualified medical expenses at any time, regardless of Medicare enrollment. You just cannot make new contributions. Qualified medical expenses for Medicare beneficiaries include:</p>
<ul>
  <li><strong>Medicare Part B premiums</strong> ($190.40/month in 2026)</li>
  <li><strong>Medicare Part D premiums</strong></li>
  <li><strong>Medicare Advantage premiums</strong></li>
  <li><strong>IRMAA surcharges</strong></li>
  <li><strong>Copays, deductibles, and coinsurance</strong></li>
  <li><strong>Prescription drug costs</strong></li>
  <li><strong>Dental, vision, and hearing expenses</strong></li>
  <li><strong>Long-term care insurance premiums</strong> (up to age-based limits)</li>
</ul>
<p>The one exception: HSA funds <strong>cannot</strong> be used tax-free to pay Medigap (Medicare Supplement) premiums. This is a specific IRS exclusion. Using HSA funds for Medigap premiums is treated as a non-qualified withdrawal and will be included in taxable income (but no penalty after age 65).</p>

<h2>Strategy: Maximize HSA Before Medicare</h2>
<p>If you are working past 65 with employer-sponsored HDHP coverage and have <strong>not yet enrolled in Medicare</strong> (including Part A), you can continue contributing to your HSA. This strategy works when:</p>
<ul>
  <li>Your employer has 20+ employees (so employer coverage is primary)</li>
  <li>You have not filed for Social Security benefits (which triggers automatic Part A enrollment)</li>
  <li>You have not enrolled in any Medicare part</li>
</ul>
<p>In this scenario, maximize your HSA contributions ($4,300 individual / $8,550 family in 2026, plus $1,000 catch-up for those 55+) as long as possible. The accumulated funds become a powerful <strong>tax-free health spending account</strong> once you transition to Medicare.</p>

<h2>Strategy: Build an HSA Bridge Fund</h2>
<p>Some financial planners recommend aggressively funding an HSA in your late 50s and early 60s to build a <strong>healthcare bridge fund</strong> for Medicare years. A well-funded HSA can cover Medicare premiums, out-of-pocket costs, and even dental and vision expenses tax-free for many years. An HSA with $100,000 at age 65 could cover approximately 10+ years of average Medicare out-of-pocket costs.</p>

<h2>After Age 65: No Penalty for Non-Medical Withdrawals</h2>
<p>After age 65, HSA withdrawals for <strong>non-medical expenses</strong> are no longer subject to the 20% penalty (though they are still taxed as ordinary income, similar to traditional IRA withdrawals). This effectively makes an HSA a hybrid retirement account — tax-free if used for healthcare, tax-deferred if used for anything else. This flexibility makes the HSA one of the most powerful retirement planning tools available.</p>

<h2>Common Mistakes to Avoid</h2>
<table>
  <thead><tr><th>Mistake</th><th>Consequence</th></tr></thead>
  <tbody>
    <tr><td>Contributing to HSA after enrolling in Part A</td><td>6% excise tax on excess contributions each year</td></tr>
    <tr><td>Not accounting for Part A retroactivity</td><td>Up to 6 months of excess contributions</td></tr>
    <tr><td>Filing for Social Security while contributing to HSA</td><td>Auto-enrollment in Part A triggers excess contributions</td></tr>
    <tr><td>Using HSA for Medigap premiums</td><td>Taxable income (no penalty after 65, but loses tax-free benefit)</td></tr>
    <tr><td>Not using HSA funds at all in retirement</td><td>Missing tax-free healthcare spending opportunity</td></tr>
  </tbody>
</table>
<p>Consult a tax advisor or financial planner to coordinate your HSA strategy with Medicare enrollment timing. For state-specific considerations, see your <a href="/state/california/">state's Medicare cost information</a>.</p>
`,
  },
];

export function getAllPosts(): BlogPost[] {
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(posts.map((p) => p.category)));
}
