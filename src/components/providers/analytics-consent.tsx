'use client';

import posthog from 'posthog-js';
import { useEffect, useState } from 'react';

const KEY = 'analytics_consent';

export function AnalyticsConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem(KEY);
    if (!existing) setShow(true);
    if (existing === 'granted') posthog.opt_in_capturing();
    if (existing === 'denied') posthog.opt_out_capturing();
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-lg border border-slate-300 bg-white p-4 shadow-lg sm:left-auto sm:right-6 sm:w-[420px]">
      <p className="text-sm text-slate-700">Can we use analytics cookies to improve LifetimeTax? You can change this later.</p>
      <div className="mt-3 flex gap-2">
        <button
          className="rounded bg-brand-600 px-3 py-2 text-sm font-semibold text-white"
          onClick={() => {
            localStorage.setItem(KEY, 'granted');
            posthog.opt_in_capturing();
            setShow(false);
          }}
        >
          Accept
        </button>
        <button
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          onClick={() => {
            localStorage.setItem(KEY, 'denied');
            posthog.opt_out_capturing();
            setShow(false);
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
