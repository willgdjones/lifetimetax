import React from 'react';

export function TheNumberCard({ total }: { total: number }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(145deg, #0f172a, #4f46e5)',
        color: 'white',
        fontFamily: 'ui-sans-serif',
      }}
    >
      <div style={{ fontSize: 38, opacity: 0.85 }}>I have paid</div>
      <div style={{ fontSize: 94, fontWeight: 800 }}>£{Math.round(total).toLocaleString('en-GB')}</div>
      <div style={{ fontSize: 34, opacity: 0.95 }}>in lifetime tax</div>
      <div style={{ marginTop: 24, fontSize: 24, opacity: 0.8 }}>LifetimeTax.co.uk</div>
    </div>
  );
}
