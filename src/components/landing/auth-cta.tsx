'use client';

import { FormEvent, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function AuthCta() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Sending magic link...');
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus('Check your inbox for the login link.');
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 rounded-xl border border-slate-200 bg-white/90 p-5">
      <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
        Continue with email magic link
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="you@example.com"
        />
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Send link
        </button>
      </div>
      {status ? <p className="mt-2 text-sm text-slate-600">{status}</p> : null}
    </form>
  );
}
