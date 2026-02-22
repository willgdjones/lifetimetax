import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { jsonError } from '@/lib/http';

export async function GET() {
  const auth = await requireUser();
  if (!auth) return jsonError('Unauthorized', 401);

  const supabase = createSupabaseAdminClient();
  const [profile, taxYears, summary, cards] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', auth.user.id).single(),
    supabase.from('tax_years').select('*').eq('user_id', auth.user.id),
    supabase.from('lifetime_summary').select('*').eq('user_id', auth.user.id).maybeSingle(),
    supabase.from('share_cards').select('*').eq('user_id', auth.user.id),
  ]);

  return NextResponse.json({
    exportedAt: new Date().toISOString(),
    userId: auth.user.id,
    profile: profile.data,
    taxYears: taxYears.data,
    lifetimeSummary: summary.data,
    shareCards: cards.data,
  });
}
