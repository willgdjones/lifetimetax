'use client';

import { useState } from 'react';

function readFraudData() {
  try {
    return localStorage.getItem('fraud_prevention_data') ?? '';
  } catch {
    return '';
  }
}

export function DashboardActions() {
  const [loading, setLoading] = useState('');

  async function run(path: string, action: string) {
    setLoading(action);
    const fraud = readFraudData();
    const response = await fetch(path, {
      method: 'GET',
      headers: fraud ? { 'x-fraud-data': fraud } : {},
      credentials: 'include',
    });

    if (response.redirected) {
      window.location.assign(response.url);
      return;
    }

    window.location.reload();
  }

  return (
    <div className="flex flex-wrap gap-3">
      <a href="/api/hmrc/connect" className="inline-flex items-center rounded-md bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
        Connect to HMRC
      </a>
      <button
        className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
        type="button"
        onClick={() => run('/api/hmrc/fetch', 'fetch')}
        disabled={loading !== ''}
      >
        {loading === 'fetch' ? 'Fetching...' : 'Fetch tax history'}
      </button>
      <button
        className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
        type="button"
        onClick={() => run('/api/calculate', 'calculate')}
        disabled={loading !== ''}
      >
        {loading === 'calculate' ? 'Calculating...' : 'Recalculate'}
      </button>
      <a href="/auth/logout" className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-slate-600">
        Log out
      </a>
    </div>
  );
}
