import councilTaxByYear from '../../../public/ons/council_tax_average.json';
import duties from '../../../public/ons/fuel_and_other_rates.json';

export function estimateCouncilTax(taxYear: string) {
  const lookup = councilTaxByYear as Record<string, number>;
  return lookup[taxYear] ?? lookup.latest ?? 0;
}

export function estimateFuelDuty(taxYear: string) {
  const lookup = duties as Record<string, { fuelDuty: number; other: number }>;
  return lookup[taxYear]?.fuelDuty ?? lookup.latest?.fuelDuty ?? 0;
}

export function estimateOtherTaxes(taxYear: string) {
  const lookup = duties as Record<string, { fuelDuty: number; other: number }>;
  return lookup[taxYear]?.other ?? lookup.latest?.other ?? 0;
}
