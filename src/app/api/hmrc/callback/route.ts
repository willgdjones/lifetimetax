import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/lib/hmrc/client';
import { getIndividualDetails } from '@/lib/hmrc/apis';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { encrypt } from '@/lib/crypto';
import { requireUser } from '@/lib/auth';
import { parseFraudData } from '@/lib/hmrc/fraud-data';
import type { FraudPreventionClientData } from '@/lib/fraud';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expectedState = request.cookies.get('hmrc_oauth_state')?.value;
  const codeVerifier = request.cookies.get('hmrc_pkce_verifier')?.value;

  if (!code || !state || !expectedState || state !== expectedState || !codeVerifier) {
    return NextResponse.redirect(new URL('/dashboard?hmrc=error_state', url.origin));
  }

  const auth = await requireUser();
  const user = auth?.user;
  const supabase = createSupabaseAdminClient();

  if (!user) {
    return NextResponse.redirect(new URL('/dashboard?hmrc=unauthorized', url.origin));
  }

  try {
    const token = await exchangeCodeForToken({ code, codeVerifier });
    const cookieClientData = request.cookies.get('fraud_client_data')?.value;
    let clientData: FraudPreventionClientData | undefined;
    if (cookieClientData) {
      try {
        clientData = parseFraudData(JSON.parse(decodeURIComponent(cookieClientData)));
      } catch {
        clientData = undefined;
      }
    }

    const details = await getIndividualDetails({
      accessToken: token.access_token,
      requestHeaders: request.headers,
      userId: user.id,
      clientData,
    });

    await supabase.from('profiles').upsert({
      id: user.id,
      hmrc_access_token_encrypted: encrypt(token.access_token),
      hmrc_refresh_token_encrypted: encrypt(token.refresh_token),
      hmrc_token_expires_at: new Date(Date.now() + token.expires_in * 1000).toISOString(),
      hmrc_nino_encrypted: details.nino ? encrypt(details.nino) : null,
      hmrc_match_id: details.matchId,
      hmrc_connected_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const response = NextResponse.redirect(new URL('/dashboard?hmrc=connected', url.origin));
    response.cookies.delete('hmrc_oauth_state');
    response.cookies.delete('hmrc_pkce_verifier');
    return response;
  } catch {
    return NextResponse.redirect(new URL('/dashboard?hmrc=error_exchange', url.origin));
  }
}
