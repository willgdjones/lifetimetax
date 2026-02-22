export const SPENDING_ALLOCATION: Record<string, number> = {
  'NHS & Health': 0.203,
  'Pensions & Welfare': 0.283,
  Education: 0.118,
  Defence: 0.052,
  Transport: 0.033,
  'Public Order & Safety': 0.044,
  'Housing & Environment': 0.026,
  'Industry & Agriculture': 0.024,
  'Debt Interest': 0.061,
  Other: 0.156,
};

export function allocateSpending(totalTax: number): Record<string, number> {
  return Object.fromEntries(
    Object.entries(SPENDING_ALLOCATION).map(([category, ratio]) => [category, Number((totalTax * ratio).toFixed(2))]),
  );
}
