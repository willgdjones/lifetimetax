import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { ButtonLink } from '@/components/ui/button';

type PageProps = { params: { id: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.from('share_cards').select('*').eq('id', params.id).maybeSingle();

  const total = Number((data?.public_data as { total?: number } | null)?.total ?? 0);
  const title = total ? `I've paid £${Math.round(total).toLocaleString('en-GB')} in lifetime tax` : 'LifetimeTax receipt';

  return {
    title,
    description: 'Find out your lifetime tax total at LifetimeTax.co.uk',
    openGraph: {
      title,
      description: 'Find out your lifetime tax total at LifetimeTax.co.uk',
      images: [`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/card/the-number/${params.id}`],
    },
  };
}

export default async function SharePage({ params }: PageProps) {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.from('share_cards').select('*').eq('id', params.id).maybeSingle();

  if (!data) notFound();

  return (
    <main className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-4xl font-black">Lifetime Tax Receipt</h1>
      <Image
        src={`/card/${data.card_type}/${data.id}`}
        alt="Lifetime tax share card"
        width={1200}
        height={675}
        className="w-full rounded-xl border border-slate-200"
      />
      <div className="rounded-xl border border-slate-200 bg-white/95 p-6">
        <h2 className="text-xl font-bold">Calculate your own</h2>
        <p className="mt-1 text-slate-600">Connect HMRC, calculate your lifetime total, and share your own receipt.</p>
        <ButtonLink href="/dashboard" className="mt-4">Get started</ButtonLink>
      </div>
    </main>
  );
}
