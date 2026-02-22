import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { HMRC_SCOPES } from '@/lib/hmrc/scopes';
import { getHmrcAuthUrl, makePkcePair } from '@/lib/hmrc/client';
import { requireUser } from '@/lib/auth';
import { jsonError } from '@/lib/http';

export async function GET() {
  const auth = await requireUser();
  if (!auth) return jsonError('Unauthorized', 401);

  const state = randomUUID();
  const { verifier, challenge } = makePkcePair();

  const authUrl = new URL(getHmrcAuthUrl());
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', process.env.HMRC_CLIENT_ID!);
  authUrl.searchParams.set('scope', HMRC_SCOPES.join(' '));
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('redirect_uri', process.env.HMRC_REDIRECT_URI!);
  authUrl.searchParams.set('code_challenge', challenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  const secure = process.env.NODE_ENV === 'production';

  const response = NextResponse.redirect(authUrl);
  response.cookies.set('hmrc_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: 600,
  });
  response.cookies.set('hmrc_pkce_verifier', verifier, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: 600,
  });

  return response;
}
