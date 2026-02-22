import { Surface } from '@/components/ui/card';

export function BreakdownList({ title, values }: { title: string; values: Record<string, number> }) {
  return (
    <Surface className="p-6">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <div className="mt-3 space-y-2">
        {Object.entries(values).map(([key, amount]) => (
          <div key={key} className="flex justify-between border-b border-slate-200 pb-2 text-sm">
            <span className="text-slate-600">{key}</span>
            <span className="font-semibold text-slate-900">£{Math.round(amount).toLocaleString('en-GB')}</span>
          </div>
        ))}
      </div>
    </Surface>
  );
}
