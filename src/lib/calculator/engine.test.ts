import { describe, expect, it } from 'vitest';
import { allocateSpending } from '@/lib/calculator/spending';
import { runLifetimeCalculation, type TaxYearInput } from '@/lib/calculator/engine';

describe('runLifetimeCalculation', () => {
  it('returns a zeroed payload for empty input', () => {
    expect(runLifetimeCalculation([])).toEqual({
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
    });
  });

  it('aggregates, rounds, sorts years, and builds breakdown/allocation', () => {
    const years: TaxYearInput[] = [
      { taxYear: '2023-24', incomeTaxPaid: 1000.129, niContributions: 500.555, totalEarnings: 22000 },
      { taxYear: '2021-22', incomeTaxPaid: null, niContributions: 200, totalEarnings: 14000 },
      { taxYear: '2022-23', incomeTaxPaid: 800, niContributions: undefined, totalEarnings: 60000 },
    ];

    const result = runLifetimeCalculation(years);

    expect(result.yearsCovered).toBe(3);
    expect(result.earliestYear).toBe('2021-22');
    expect(result.latestYear).toBe('2023-24');

    expect(result.totalIncomeTax).toBe(1800.13);
    expect(result.totalNi).toBe(700.56);
    expect(result.estimatedVat).toBe(10065);
    expect(result.estimatedCouncilTax).toBe(5933);
    expect(result.estimatedFuelDuty).toBe(935);
    expect(result.estimatedOther).toBe(825);
    expect(result.grandTotal).toBe(20258.68);

    expect(result.spendingAllocation).toEqual(allocateSpending(result.grandTotal));
    expect(result.breakdown).toEqual({
      'Income Tax': 1800.13,
      'National Insurance': 700.56,
      VAT: 10065,
      'Council Tax': 5933,
      'Fuel Duty': 935,
      Other: 825,
    });
  });

  it('handles years with missing tax fields and zero earnings', () => {
    const result = runLifetimeCalculation([
      { taxYear: '2023-24', totalEarnings: 0 },
      { taxYear: '2022-23' },
    ]);

    expect(result.totalIncomeTax).toBe(0);
    expect(result.totalNi).toBe(0);
    expect(result.estimatedVat).toBe(4785);
    expect(result.estimatedCouncilTax).toBe(4035);
    expect(result.estimatedFuelDuty).toBe(610);
    expect(result.estimatedOther).toBe(535);
    expect(result.grandTotal).toBe(9965);
  });
});
