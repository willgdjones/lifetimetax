import { allocateSpending } from '@/lib/calculator/spending';
import { estimateVAT } from '@/lib/calculator/vat-estimator';
import { estimateCouncilTax, estimateFuelDuty, estimateOtherTaxes } from '@/lib/calculator/council-tax';

export type TaxYearInput = {
  taxYear: string;
  incomeTaxPaid?: number | null;
  niContributions?: number | null;
  studentLoanRepaid?: number | null;
  totalEarnings?: number | null;
};

export type LifetimeCalculation = {
  totalIncomeTax: number;
  totalNi: number;
  estimatedVat: number;
  estimatedCouncilTax: number;
  estimatedFuelDuty: number;
  estimatedOther: number;
  grandTotal: number;
  yearsCovered: number;
  earliestYear: string;
  latestYear: string;
  spendingAllocation: Record<string, number>;
  breakdown: Record<string, number>;
};

export function runLifetimeCalculation(years: TaxYearInput[]): LifetimeCalculation {
  if (!years.length) {
    return {
      totalIncomeTax: 0,
      totalNi: 0,
      estimatedVat: 0,
      estimatedCouncilTax: 0,
      estimatedFuelDuty: 0,
      estimatedOther: 0,
      grandTotal: 0,
      yearsCovered: 0,
      earliestYear: '',
      latestYear: '',
      spendingAllocation: {},
      breakdown: {},
    };
  }

  const sorted = [...years].sort((a, b) => a.taxYear.localeCompare(b.taxYear));

  const totals = sorted.reduce(
    (acc, item) => {
      const earnings = item.totalEarnings ?? 0;
      acc.totalIncomeTax += item.incomeTaxPaid ?? 0;
      acc.totalNi += item.niContributions ?? 0;
      acc.estimatedVat += estimateVAT(earnings, item.taxYear);
      acc.estimatedCouncilTax += estimateCouncilTax(item.taxYear);
      acc.estimatedFuelDuty += estimateFuelDuty(item.taxYear);
      acc.estimatedOther += estimateOtherTaxes(item.taxYear);
      return acc;
    },
    {
      totalIncomeTax: 0,
      totalNi: 0,
      estimatedVat: 0,
      estimatedCouncilTax: 0,
      estimatedFuelDuty: 0,
      estimatedOther: 0,
    },
  );

  const grandTotal =
    totals.totalIncomeTax +
    totals.totalNi +
    totals.estimatedVat +
    totals.estimatedCouncilTax +
    totals.estimatedFuelDuty +
    totals.estimatedOther;

  const rounded = {
    totalIncomeTax: Number(totals.totalIncomeTax.toFixed(2)),
    totalNi: Number(totals.totalNi.toFixed(2)),
    estimatedVat: Number(totals.estimatedVat.toFixed(2)),
    estimatedCouncilTax: Number(totals.estimatedCouncilTax.toFixed(2)),
    estimatedFuelDuty: Number(totals.estimatedFuelDuty.toFixed(2)),
    estimatedOther: Number(totals.estimatedOther.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
  };

  return {
    ...rounded,
    yearsCovered: sorted.length,
    earliestYear: sorted[0].taxYear,
    latestYear: sorted[sorted.length - 1].taxYear,
    spendingAllocation: allocateSpending(rounded.grandTotal),
    breakdown: {
      'Income Tax': rounded.totalIncomeTax,
      'National Insurance': rounded.totalNi,
      VAT: rounded.estimatedVat,
      'Council Tax': rounded.estimatedCouncilTax,
      'Fuel Duty': rounded.estimatedFuelDuty,
      Other: rounded.estimatedOther,
    },
  };
}
