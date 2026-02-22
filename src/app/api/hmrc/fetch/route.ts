import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { decrypt, encryptJson } from '@/lib/crypto';
import { getBenefitsAndCredits, getEmployments, getIndividualIncome, getNationalInsurance, getSelfAssessment } from '@/lib/hmrc/apis';
import { getTaxYears } from '@/lib/hmrc/tax-years';
import { jsonError } from '@/lib/http';
import { parseFraudData } from '@/lib/hmrc/fraud-data';
import type { HMRCBenefits, HMRCEmployment, HMRCIncome, HMRCNationalInsurance, HMRCSelfAssessment } from '@/lib/hmrc/types';

async function pause(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(request: NextRequest) {
  const auth = await requireUser();
  if (!auth) return jsonError('Unauthorized', 401);

  const supabase = createSupabaseAdminClient();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', auth.user.id).single();
  if (!profile?.hmrc_access_token_encrypted || !profile.hmrc_match_id) {
    return jsonError('HMRC not connected', 400);
  }

  const accessToken = decrypt(profile.hmrc_access_token_encrypted);
  const matchId = profile.hmrc_match_id;
  const nino = profile.hmrc_nino_encrypted ? decrypt(profile.hmrc_nino_encrypted) : '';
  const years = getTaxYears(2005);

  let clientData = parseFraudData((await request.json().catch(() => null))?.fraudData);
  if (!clientData) {
    const headerData = request.headers.get('x-fraud-data');
    if (headerData) {
      try {
        clientData = parseFraudData(JSON.parse(headerData));
      } catch {
        clientData = undefined;
      }
    }
  }

  const chunks: string[][] = [];
  for (let i = 0; i < years.length; i += 5) {
    chunks.push(years.slice(i, i + 5));
  }

  for (const batch of chunks) {
    await Promise.all(
      batch.map(async (taxYear) => {
        const [income, employment, benefits, sa, ni] = await Promise.allSettled([
          getIndividualIncome({ accessToken, requestHeaders: request.headers, userId: auth.user.id, matchId, clientData }),
          getEmployments({ accessToken, requestHeaders: request.headers, userId: auth.user.id, matchId, clientData }),
          getBenefitsAndCredits({ accessToken, requestHeaders: request.headers, userId: auth.user.id, matchId, clientData }),
          getSelfAssessment({ accessToken, requestHeaders: request.headers, userId: auth.user.id, matchId, clientData }),
          nino ? getNationalInsurance({ accessToken, requestHeaders: request.headers, userId: auth.user.id, nino, taxYear, clientData }) : Promise.resolve({}),
        ]);

        const incomeData: Partial<HMRCIncome> = income.status === 'fulfilled' ? income.value : {};
        const employmentData: Partial<HMRCEmployment> = employment.status === 'fulfilled' ? employment.value : {};
        const benefitsData: Partial<HMRCBenefits> = benefits.status === 'fulfilled' ? benefits.value : {};
        const saData: Partial<HMRCSelfAssessment> = sa.status === 'fulfilled' ? sa.value : {};
        const niData: Partial<HMRCNationalInsurance> = ni.status === 'fulfilled' ? ni.value : {};

        const incomeTaxPaid = Number(incomeData.incomeTaxPaid ?? saData.taxPaid ?? 0);
        const niContributions = Number(
          (niData.class1Contributions ?? 0) + (niData.class2Contributions ?? 0) + (niData.class4Contributions ?? 0),
        );
        const studentLoanRepaid = Number(incomeData.studentLoanRepayment ?? 0);
        const totalEarnings = Number(incomeData.totalIncome ?? niData.totalEarnings ?? 0);
        const employmentCount = Array.isArray(employmentData.employments) ? employmentData.employments.length : 0;

        await supabase.from('tax_years').upsert({
          user_id: auth.user.id,
          tax_year: taxYear,
          income_tax_paid: incomeTaxPaid,
          ni_contributions: niContributions,
          student_loan_repaid: studentLoanRepaid,
          total_earnings: totalEarnings,
          employment_count: employmentCount,
          raw_data_encrypted: {
            encrypted_payload: encryptJson({ income: incomeData, employment: employmentData, benefits: benefitsData, sa: saData, ni: niData }),
          },
        });
      }),
    );

    await pause(1000);
  }

  await supabase.from('profiles').update({ data_fetched_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', auth.user.id);

  return NextResponse.redirect(new URL('/dashboard?hmrc=fetched', request.url));
}
