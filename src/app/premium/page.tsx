import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { BreakdownList } from '@/components/dashboard/breakdown';

export default async function PremiumPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/');

  const [{ data: profile }, { data: summary }] = await Promise.all([
    supabase.from('profiles').select('is_premium').eq('id', user.id).single(),
    supabase.from('lifetime_summary').select('*').eq('user_id', user.id).single(),
  ]);

  if (!profile?.is_premium) redirect('/dashboard');

  return (
    <main className="space-y-4">
      <h1 className="text-4xl font-black">Premium Breakdown</h1>
      <p className="text-slate-600">Full tax type totals, spending allocation, and all share cards.</p>
      <div className="grid gap-4 lg:grid-cols-2">
        <BreakdownList
          title="All Tax Types"
          values={{
            'Income Tax': Number(summary?.total_income_tax ?? 0),
            'National Insurance': Number(summary?.total_ni ?? 0),
            VAT: Number(summary?.estimated_vat ?? 0),
            'Council Tax': Number(summary?.estimated_council_tax ?? 0),
            'Fuel Duty': Number(summary?.estimated_fuel_duty ?? 0),
            Other: Number(summary?.estimated_other ?? 0),
          }}
        />
        <BreakdownList
          title="Your tax paid for"
          values={{
            'NHS & Health': Number(summary?.grand_total ?? 0) * 0.203,
            'Pensions & Welfare': Number(summary?.grand_total ?? 0) * 0.283,
            Education: Number(summary?.grand_total ?? 0) * 0.118,
            Defence: Number(summary?.grand_total ?? 0) * 0.052,
            Transport: Number(summary?.grand_total ?? 0) * 0.033,
          }}
        />
      </div>
    </main>
  );
}
