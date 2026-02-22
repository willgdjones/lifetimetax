import React from 'react';

export function TheReceiptCard({
  receiptId,
  allocations,
  total,
}: {
  receiptId: string;
  allocations: Record<string, number>;
  total: number;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#f8fafc',
        color: '#0f172a',
        padding: 42,
        fontFamily: 'ui-monospace',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22 }}>
        <span>LIFETIMETAX RECEIPT</span>
        <span>#{receiptId}</span>
      </div>
      <div style={{ marginTop: 20, borderTop: '2px dashed #64748b', marginBottom: 16 }} />
      {Object.entries(allocations)
        .slice(0, 8)
        .map(([label, amount]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 27, marginBottom: 10 }}>
            <span>{label}</span>
            <span>£{Math.round(amount).toLocaleString('en-GB')}</span>
          </div>
        ))}
      <div style={{ marginTop: 'auto', borderTop: '2px dashed #64748b', paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 34 }}>
        <span>TOTAL</span>
        <span>£{Math.round(total).toLocaleString('en-GB')}</span>
      </div>
      <div style={{ fontSize: 20, opacity: 0.75, marginTop: 12 }}>Find out yours: LifetimeTax.co.uk</div>
    </div>
  );
}
