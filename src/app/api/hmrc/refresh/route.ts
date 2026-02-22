import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { decrypt, encrypt } from '@/lib/crypto';
import { refreshHmrcToken } from '@/lib/hmrc/client';
import { jsonError } from '@/lib/http';

export async function POST() {
  const auth = await requireUser();
  if (!auth) return jsonError('Unauthorized', 401);

  const supabase = createSupabaseAdminClient();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', auth.user.id).single();
  if (!profile?.hmrc_refresh_token_encrypted) return jsonError('HMRC refresh token missing', 400);

  const refreshed = await refreshHmrcToken(decrypt(profile.hmrc_refresh_token_encrypted));

  await supabase.from('profiles').update({
    hmrc_access_token_encrypted: encrypt(refreshed.access_token),
    hmrc_refresh_token_encrypted: encrypt(refreshed.refresh_token),
    hmrc_token_expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('id', auth.user.id);

  return NextResponse.json({ ok: true });
}
