import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { getBaseUrl, getStripe } from '@/lib/stripe';
import { jsonError } from '@/lib/http';

export async function POST() {
  const auth = await requireUser();
  if (!auth) return jsonError('Unauthorized', 401);

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: { name: 'LifetimeTax Premium' },
          unit_amount: 499,
        },
        quantity: 1,
      },
    ],
    success_url: `${getBaseUrl()}/dashboard?premium=true`,
    cancel_url: `${getBaseUrl()}/dashboard`,
    metadata: { userId: auth.user.id },
  });

  return NextResponse.redirect(session.url!);
}
