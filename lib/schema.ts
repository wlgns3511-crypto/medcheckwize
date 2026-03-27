import type { State, Procedure, StateProcedure } from './db';
import { formatCurrency, formatPercent, getDataYear } from './format';

const SITE_NAME = 'MedCheckWize';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://medcheckwize.com';

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
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
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
