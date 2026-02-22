import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { jsonError } from '@/lib/http';

export async function POST() {
  const auth = await requireUser();
  if (!auth) return jsonError('Unauthorized', 401);

  const supabase = createSupabaseAdminClient();
  await supabase.from('profiles').delete().eq('id', auth.user.id);
  await supabase.auth.admin.deleteUser(auth.user.id);

  return NextResponse.json({ deleted: true });
}
