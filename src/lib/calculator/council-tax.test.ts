import { describe, expect, it } from 'vitest';
import { estimateCouncilTax, estimateFuelDuty, estimateOtherTaxes } from '@/lib/calculator/council-tax';

describe('council and duty estimators', () => {
  it('returns known values for known years', () => {
    expect(estimateCouncilTax('2023-24')).toBe(2065);
    expect(estimateFuelDuty('2023-24')).toBe(312);
    expect(estimateOtherTaxes('2023-24')).toBe(275);
  });

  it('falls back to latest values for unknown years', () => {
    expect(estimateCouncilTax('2016-17')).toBe(2100);
    expect(estimateFuelDuty('2016-17')).toBe(325);
    expect(estimateOtherTaxes('2016-17')).toBe(290);
  });
});
