import { Surface } from '@/components/ui/card';

export function SummaryPanel({ total, years }: { total: number; years: number }) {
  return (
    <Surface className="p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Your Lifetime Tax</p>
      <h1 className="mt-3 text-5xl font-black text-slate-900">£{Math.round(total).toLocaleString('en-GB')}</h1>
      <p className="mt-2 text-slate-600">Calculated across {years} tax years</p>
    </Surface>
  );
}
