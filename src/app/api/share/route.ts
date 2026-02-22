import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { jsonError } from '@/lib/http';

export async function POST(request: Request) {
  const auth = await requireUser();
  if (!auth) return jsonError('Unauthorized', 401);

  const body = (await request.json().catch(() => ({}))) as {
    cardType?: 'the-number' | 'the-breakdown' | 'the-receipt';
  };

  const cardType = body.cardType ?? 'the-number';
  const supabase = createSupabaseAdminClient();
  const [{ data: summary }, { data: profile }] = await Promise.all([
    supabase.from('lifetime_summary').select('*').eq('user_id', auth.user.id).single(),
    supabase.from('profiles').select('share_id').eq('id', auth.user.id).single(),
  ]);

  const publicData = {
    total: Number(summary?.grand_total ?? 0),
    breakdown: {
      'Income Tax': Number(summary?.total_income_tax ?? 0),
      'National Insurance': Number(summary?.total_ni ?? 0),
      VAT: Number(summary?.estimated_vat ?? 0),
      'Council Tax': Number(summary?.estimated_council_tax ?? 0),
      'Fuel Duty': Number(summary?.estimated_fuel_duty ?? 0),
      Other: Number(summary?.estimated_other ?? 0),
    },
    yearRange: `${summary?.earliest_year ?? 'N/A'} - ${summary?.latest_year ?? 'N/A'}`,
    allocation: {
      'NHS & Health': Number(summary?.grand_total ?? 0) * 0.203,
      'Pensions & Welfare': Number(summary?.grand_total ?? 0) * 0.283,
      Education: Number(summary?.grand_total ?? 0) * 0.118,
    },
    receiptId: profile?.share_id ?? auth.user.id,
  };

  const { data, error } = await supabase
    .from('share_cards')
    .insert({
      user_id: auth.user.id,
      card_type: cardType,
      public_data: publicData,
      share_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/share/PLACEHOLDER`,
    })
    .select('*')
    .single();

  if (error || !data) return jsonError('Failed to create share card', 500);

  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/share/${data.id}`;
  await supabase.from('share_cards').update({ share_url: shareUrl }).eq('id', data.id);

  return NextResponse.json({ id: data.id, shareUrl, ogImageUrl: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/card/${cardType}/${data.id}` });
}
