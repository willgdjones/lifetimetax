import spendingByDecile from '../../../public/ons/spending_by_decile.json';

const VAT_ELIGIBLE_RATIO = 0.55;

function decileByIncome(income: number) {
  if (income < 15000) return 1;
  if (income < 22000) return 2;
  if (income < 28000) return 3;
  if (income < 34000) return 4;
  if (income < 42000) return 5;
  if (income < 50000) return 6;
  if (income < 62000) return 7;
  if (income < 78000) return 8;
  if (income < 100000) return 9;
  return 10;
}

export function estimateVAT(annualIncome: number, taxYear: string) {
  const decile = String(decileByIncome(annualIncome));
  const yearData = (spendingByDecile as Record<string, Record<string, number>>)[taxYear] ?? (spendingByDecile as Record<string, Record<string, number>>).latest;
  const spending = yearData[decile] ?? 0;
  const vatEligibleSpending = spending * VAT_ELIGIBLE_RATIO;
  return Number((vatEligibleSpending * 0.2).toFixed(2));
}
