import type { State, Procedure, StateProcedure } from './db';
import { formatCurrency, formatPercent, getDataYear } from './format';
import { PUBLISHER, EDITORIAL_TEAM, SOURCE_AUTHORITIES } from './authorship';

const SITE_NAME = 'MedCheckWize';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://medcheckwize.com';

/**
 * Granular CMS / KFF / Census data providers actually backing rows on
 * MedCheckWize. Listed as schema.org `sourceOrganization` on every Dataset
 * payload so search engines can independently verify data lineage.
 */
const DATASET_SOURCE_ORGS = [
  { name: 'Centers for Medicare & Medicaid Services', url: 'https://data.cms.gov/' },
  { name: 'CMS Medicare Inpatient Hospitals by Geography & Service', url: 'https://data.cms.gov/provider-summary-by-type-of-service/medicare-inpatient-hospitals/medicare-inpatient-hospitals-by-geography-and-service' },
  { name: 'CMS Medicare Physician & Other Practitioners by Geography & Service', url: 'https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners/medicare-physician-other-practitioners-by-geography-and-service' },
  { name: 'CMS Medicare Outpatient Hospitals by Geography & Service (HOPPS APC)', url: 'https://data.cms.gov/provider-summary-by-type-of-service/medicare-outpatient-hospitals/medicare-outpatient-hospitals-by-geography-and-service' },
  { name: 'CMS Clinical Laboratory Fee Schedule', url: 'https://www.cms.gov/medicare/payment/fee-schedules/clinical-laboratory-fee-schedule-clfs-files' },
  { name: 'CMS Medicare Monthly Enrollment', url: 'https://data.cms.gov/summary-statistics-on-beneficiary-enrollment/medicare-and-medicaid-reports/medicare-monthly-enrollment' },
  { name: 'CMS Medicare Geographic Variation', url: 'https://data.cms.gov/summary-statistics-on-use-and-payments/medicare-geographic-comparisons/medicare-geographic-variation-by-national-state-county' },
  { name: 'KFF Health Policy', url: 'https://www.kff.org/medicare/' },
  { name: 'US Census Bureau ACS', url: 'https://www.census.gov/programs-surveys/acs/' },
] as const;

interface DatasetArgs {
  name: string;
  description: string;
  url: string;
  vintage: string;             // ISO date for dateModified
  temporalCoverage?: string;   // e.g. "2024" or "2024/2025"
  variableMeasured: readonly string[];
  // Per-lever creator override. When provided, replaces the default
  // SOURCE_AUTHORITIES[0] creator on this Dataset. Useful when a lever
  // is anchored to a different primary data origin (NAIC for Medigap
  // regulation, CMS+SSA+IRS for IRMAA, CMS+KFF for Medicare Stack).
  creatorOverride?: ReadonlyArray<{ name: string; url: string }>;
}

/**
 * schema.org Dataset payload with reviewedBy + sourceOrganization +
 * isBasedOn + variableMeasured + dateModified. Replaces the prior minimal
 * inline Dataset JSON-LD on /state and /procedure pages.
 */
export function datasetSchema(args: DatasetArgs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: args.name,
    description: args.description,
    url: args.url,
    license: 'https://creativecommons.org/publicdomain/zero/1.0/',
    // Trap #105: creator = primary data origin org (CMS), NOT the publisher.
    // Inlined SOURCE_AUTHORITIES[0] so audit grep can verify honest attribution.
    // Per-lever override (NAIC / SSA+IRS) accepted via creatorOverride; first
    // element renders as the canonical Dataset.creator org, rest stack into
    // sourceOrganization on top of the network defaults.
    creator: {
      '@type': 'Organization',
      name: (args.creatorOverride?.[0] ?? SOURCE_AUTHORITIES[0]).name,
      url: (args.creatorOverride?.[0] ?? SOURCE_AUTHORITIES[0]).url,
    },
    publisher: {
      '@type': 'Organization',
      name: PUBLISHER.name,
      url: PUBLISHER.url,
    },
    reviewedBy: {
      '@type': 'Organization',
      name: EDITORIAL_TEAM.name,
      url: EDITORIAL_TEAM.url,
    },
    sourceOrganization: [
      // Per-lever override authorities (NAIC, SSA, IRS) stack on top so each
      // Dataset surfaces its exact data origin set, not just the network defaults.
      ...((args.creatorOverride ?? []).slice(1).map(o => ({
        '@type': 'Organization' as const,
        name: o.name,
        url: o.url,
      }))),
      ...DATASET_SOURCE_ORGS.map(o => ({
        '@type': 'Organization' as const,
        name: o.name,
        url: o.url,
      })),
    ],
    isBasedOn: DATASET_SOURCE_ORGS.map(o => o.url),
    temporalCoverage: args.temporalCoverage ?? String(getDataYear()),
    dateModified: args.vintage,
    variableMeasured: args.variableMeasured,
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'text/html',
      contentUrl: args.url,
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function articleSchema(post: { title: string; description: string; slug: string; urlPath?: string; publishedAt: string; updatedAt?: string; category?: string }) {
  // slug is treated as a full path fragment (e.g. "guide/my-guide")
  const articlePath = post.urlPath ?? (post.slug.includes('/') ? `/${post.slug.replace(/^\/+|\/+$/g, '')}/` : `/blog/${post.slug}/`);
  const url = `${SITE_URL}${articlePath}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { '@type': 'Organization', name: EDITORIAL_TEAM.name, url: EDITORIAL_TEAM.url },
    publisher: { '@type': 'Organization', name: PUBLISHER.name, url: PUBLISHER.url },
    mainEntityOfPage: url,
    ...(post.category && { articleSection: post.category }),
  };
}

export function generateStateFAQs(state: State): { question: string; answer: string }[] {
  const year = getDataYear();
  return [
    {
      question: `How much does Medicare spend per person in ${state.state}?`,
      answer: `In ${year}, the average Medicare spending per beneficiary in ${state.state} is ${formatCurrency(state.avg_medicare_spending_per_capita)}.`,
    },
    {
      question: `How many people are enrolled in Medicare in ${state.state}?`,
      answer: `${state.state} has approximately ${state.medicare_enrollees.toLocaleString('en-US')} Medicare beneficiaries.`,
    },
    {
      question: `Did ${state.state} expand Medicaid?`,
      answer: state.medicaid_expansion === 'yes'
        ? `Yes, ${state.state} expanded Medicaid under the Affordable Care Act.`
        : `No, ${state.state} has not expanded Medicaid under the Affordable Care Act.`,
    },
    {
      question: `What is the uninsured rate in ${state.state}?`,
      answer: `The uninsured rate in ${state.state} is ${formatPercent(state.uninsured_rate)}.`,
    },
    {
      question: `What is the average Medigap premium in ${state.state}?`,
      answer: `The average Medigap (Medicare Supplement) premium in ${state.state} is ${formatCurrency(state.medigap_avg_premium)} per month.`,
    },
  ];
}

export function generateProcedureFAQs(proc: Procedure): { question: string; answer: string }[] {
  return [
    {
      question: `How much does a ${proc.name} cost with Medicare?`,
      answer: `The national average cost for ${proc.name} is ${formatCurrency(proc.national_avg_cost)}. Medicare typically pays ${formatCurrency(proc.medicare_pays)}, leaving a patient responsibility of ${formatCurrency(proc.patient_pays)}.`,
    },
    {
      question: `Does Medicare cover ${proc.name}?`,
      answer: proc.medicare_pays > 0
        ? `Yes, Medicare covers ${proc.name}. The average Medicare payment is ${formatCurrency(proc.medicare_pays)} out of a total cost of ${formatCurrency(proc.national_avg_cost)}.`
        : `Coverage for ${proc.name} may vary. Check with your Medicare plan for specific coverage details.`,
    },
    {
      question: `What category is ${proc.name}?`,
      answer: `${proc.name} is classified as a ${proc.category} procedure.`,
    },
  ];
}

export function generateComparisonFAQs(a: State, b: State): { question: string; answer: string }[] {
  const year = getDataYear();
  return [
    {
      question: `Which state has higher Medicare spending, ${a.state} or ${b.state}?`,
      answer: a.avg_medicare_spending_per_capita > b.avg_medicare_spending_per_capita
        ? `${a.state} has higher Medicare spending at ${formatCurrency(a.avg_medicare_spending_per_capita)} per capita vs ${formatCurrency(b.avg_medicare_spending_per_capita)} in ${b.state}.`
        : `${b.state} has higher Medicare spending at ${formatCurrency(b.avg_medicare_spending_per_capita)} per capita vs ${formatCurrency(a.avg_medicare_spending_per_capita)} in ${a.state}.`,
    },
    {
      question: `Which state has a lower uninsured rate?`,
      answer: a.uninsured_rate < b.uninsured_rate
        ? `${a.state} has a lower uninsured rate of ${formatPercent(a.uninsured_rate)} compared to ${formatPercent(b.uninsured_rate)} in ${b.state}.`
        : `${b.state} has a lower uninsured rate of ${formatPercent(b.uninsured_rate)} compared to ${formatPercent(a.uninsured_rate)} in ${a.state}.`,
    },
    {
      question: `Have both ${a.state} and ${b.state} expanded Medicaid?`,
      answer: `${a.state} ${a.medicaid_expansion === 'yes' ? 'has' : 'has not'} expanded Medicaid. ${b.state} ${b.medicaid_expansion === 'yes' ? 'has' : 'has not'} expanded Medicaid.`,
    },
  ];
}

export function generateStateProcedureFAQs(state: State, proc: Procedure, sp: StateProcedure): { question: string; answer: string }[] {
  return [
    {
      question: `How much does ${proc.name} cost in ${state.state}?`,
      answer: `The average cost of ${proc.name} in ${state.state} is ${formatCurrency(sp.avg_cost)}. Medicare pays approximately ${formatCurrency(sp.medicare_pays)}, with the patient responsible for about ${formatCurrency(sp.patient_pays)}.`,
    },
    {
      question: `Is ${proc.name} more expensive in ${state.state} than the national average?`,
      answer: sp.avg_cost > proc.national_avg_cost
        ? `Yes, ${proc.name} costs ${formatCurrency(sp.avg_cost)} in ${state.state}, which is above the national average of ${formatCurrency(proc.national_avg_cost)}.`
        : `No, ${proc.name} costs ${formatCurrency(sp.avg_cost)} in ${state.state}, which is below the national average of ${formatCurrency(proc.national_avg_cost)}.`,
    },
  ];
}
