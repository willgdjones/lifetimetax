'use client';

import { FormEvent, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function AuthCta() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('saving');
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.from('waitlist').insert({ email });
      if (error) {
        // duplicate is fine — they're already on the list
        if (error.code === '23505') {
          setStatus('done');
          return;
        }
        throw error;
      }
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 rounded-xl border border-slate-200 bg-white/90 p-5">
      <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
        Get notified when we launch
      </label>
      <p className="mt-1 text-sm text-slate-500">Enter your email and we&apos;ll let you know the moment Lifetime Tax is live.</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="you@example.com"
          disabled={status === 'done'}
        />
        <button
          type="submit"
          disabled={status === 'saving' || status === 'done'}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {status === 'done' ? 'You\'re on the list!' : status === 'saving' ? 'Saving...' : 'Notify me'}
        </button>
      </div>
      {status === 'done' && <p className="mt-2 text-sm text-green-600">✓ We&apos;ll email you when Lifetime Tax goes live.</p>}
      {status === 'error' && <p className="mt-2 text-sm text-red-600">Something went wrong — please try again.</p>}
    </form>
  );
}
