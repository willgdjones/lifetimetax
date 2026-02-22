import React from 'react';

type Breakdown = Record<string, number>;

export function TheBreakdownCard({ breakdown, yearRange }: { breakdown: Breakdown; yearRange: string }) {
  const rows = Object.entries(breakdown).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 48,
        background: '#0b1220',
        color: '#e2e8f0',
        fontFamily: 'ui-sans-serif',
      }}
    >
      <div style={{ fontSize: 42, fontWeight: 700, marginBottom: 8 }}>My Lifetime Tax Breakdown</div>
      <div style={{ fontSize: 24, opacity: 0.7, marginBottom: 26 }}>{yearRange}</div>
      {rows.map(([label, value]) => (
        <div
          key={label}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(148,163,184,0.25)',
            paddingBottom: 10,
            marginBottom: 10,
            fontSize: 28,
          }}
        >
          <span>{label}</span>
          <span>£{Math.round(value).toLocaleString('en-GB')}</span>
        </div>
      ))}
      <div style={{ marginTop: 'auto', fontSize: 20, opacity: 0.65 }}>LifetimeTax.co.uk</div>
    </div>
  );
}
