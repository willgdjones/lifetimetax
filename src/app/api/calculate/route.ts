import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { runLifetimeCalculation, TaxYearInput } from '@/lib/calculator/engine';
import { jsonError } from '@/lib/http';
import type { Database } from '@/lib/supabase/types';

type TaxYearRow = Database['public']['Tables']['tax_years']['Row'];
type LifetimeSummaryInsert = Database['public']['Tables']['lifetime_summary']['Insert'];

export async function GET(request: NextRequest) {
  const auth = await requireUser();
  if (!auth) return jsonError('Unauthorized', 401);

  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from('tax_years')
    .select('*')
    .eq('user_id', auth.user.id)
    .order('tax_year', { ascending: true });

  const years = (data ?? []) as unknown as TaxYearRow[];

  const result = runLifetimeCalculation(
    years.map((year): TaxYearInput => ({
      taxYear: year.tax_year,
      incomeTaxPaid: year.income_tax_paid,
      niContributions: year.ni_contributions,
      studentLoanRepaid: year.student_loan_repaid,
      totalEarnings: year.total_earnings,
    })),
  );

  const summaryRow: LifetimeSummaryInsert = {
    user_id: auth.user.id,
    total_income_tax: result.totalIncomeTax,
    total_ni: result.totalNi,
    estimated_vat: result.estimatedVat,
    estimated_council_tax: result.estimatedCouncilTax,
    estimated_fuel_duty: result.estimatedFuelDuty,
    estimated_other: result.estimatedOther,
    grand_total: result.grandTotal,
    years_covered: result.yearsCovered,
    earliest_year: result.earliestYear,
    latest_year: result.latestYear,
    calculated_at: new Date().toISOString(),
  };

  await supabase.from('lifetime_summary').upsert(summaryRow as any);

  return NextResponse.redirect(new URL('/dashboard?calc=done', request.url));
}
