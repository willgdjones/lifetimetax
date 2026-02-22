import { ImageResponse } from '@vercel/og';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { TheNumberCard } from '@/lib/cards/the-number';
import { TheBreakdownCard } from '@/lib/cards/the-breakdown';
import { TheReceiptCard } from '@/lib/cards/the-receipt';

export const runtime = 'edge';

type Params = { params: { type: string; id: string } };

export async function GET(_request: Request, { params }: Params) {
  const supabase = createSupabaseAdminClient();
  const { data: card } = await supabase.from('share_cards').select('*').eq('id', params.id).maybeSingle();

  if (!card) return new Response('Not found', { status: 404 });

  supabase.rpc('increment_share_card_views', { card_id: params.id }).catch(() => null);

  const publicData = (card.public_data ?? {}) as {
    total?: number;
    breakdown?: Record<string, number>;
    yearRange?: string;
    allocation?: Record<string, number>;
    receiptId?: string;
  };

  const type = params.type;

  return new ImageResponse(
    type === 'the-breakdown' ? (
      <TheBreakdownCard breakdown={publicData.breakdown ?? {}} yearRange={publicData.yearRange ?? 'Tax years'} />
    ) : type === 'the-receipt' ? (
      <TheReceiptCard receiptId={publicData.receiptId ?? params.id.slice(0, 8)} allocations={publicData.allocation ?? {}} total={Number(publicData.total ?? 0)} />
    ) : (
      <TheNumberCard total={Number(publicData.total ?? 0)} />
    ),
    { width: 1200, height: 675 },
  );
}
