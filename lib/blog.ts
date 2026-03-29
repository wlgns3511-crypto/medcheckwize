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
