import { describe, expect, it } from 'vitest';
import { estimateVAT } from '@/lib/calculator/vat-estimator';

describe('estimateVAT', () => {
  it('calculates VAT for a known tax year and income decile', () => {
    expect(estimateVAT(14999, '2023-24')).toBe(2365);
    expect(estimateVAT(22000, '2023-24')).toBe(3025);
  });

  it('falls back to latest year when tax year is missing', () => {
    expect(estimateVAT(120000, '2017-18')).toBe(6710);
  });
});
