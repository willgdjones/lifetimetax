import { redirect } from 'next/navigation';
import { SummaryPanel } from '@/components/dashboard/summary';
import { BreakdownList } from '@/components/dashboard/breakdown';
import { CardPreview } from '@/components/cards/card-preview';
import { DashboardActions } from '@/components/dashboard/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const [{ data: summary }, { data: profile }] = await Promise.all([
    supabase.from('lifetime_summary').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
  ]);

  const total = Number(summary?.grand_total ?? 0);
  const years = Number(summary?.years_covered ?? 0);
  const breakdownValues = {
    'Income Tax': Number(summary?.total_income_tax ?? 0),
    'National Insurance': Number(summary?.total_ni ?? 0),
    VAT: Number(summary?.estimated_vat ?? 0),
    'Council Tax': Number(summary?.estimated_council_tax ?? 0),
    'Fuel Duty': Number(summary?.estimated_fuel_duty ?? 0),
    Other: Number(summary?.estimated_other ?? 0),
  };

  return (
    <main className="space-y-6">
      <DashboardActions />

      <SummaryPanel total={total} years={years} />

      {summary ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <BreakdownList title="Breakdown" values={breakdownValues} />
          <BreakdownList
            title="What your tax paid for"
            values={{
              'NHS & Health': total * 0.203,
              'Pensions & Welfare': total * 0.283,
              Education: total * 0.118,
              Defence: total * 0.052,
            }}
          />
        </div>
      ) : (
        <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">No calculation yet. Connect HMRC and run fetch + calculate.</p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <CardPreview shareId={profile?.share_id ?? user.id} />
        <div className="rounded-xl border border-brand-200 bg-brand-50 p-6">
          <h3 className="text-xl font-black text-brand-900">Premium £4.99</h3>
          <p className="mt-2 text-brand-800">Unlock The Breakdown card, The Receipt card, and full lifetime category analysis.</p>
          {profile?.is_premium ? (
            <a href="/premium" className="mt-4 inline-block rounded-md bg-brand-700 px-5 py-3 text-sm font-semibold text-white">
              Open premium
            </a>
          ) : (
            <form action="/api/stripe/checkout" method="post" className="mt-4">
              <button className="rounded-md bg-brand-700 px-5 py-3 text-sm font-semibold text-white" type="submit">
                Unlock premium
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
