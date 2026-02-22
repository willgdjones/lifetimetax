export function Surface({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-xl border border-slate-200 bg-white/90 shadow-sm ${className}`}>{children}</div>;
}
