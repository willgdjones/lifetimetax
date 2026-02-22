const faqs = [
  {
    q: 'Do you store my Government Gateway password?',
    a: 'No. HMRC handles login directly and only OAuth tokens are stored encrypted server-side.',
  },
  {
    q: 'Is this HMRC approved?',
    a: 'We use HMRC recognised APIs. We never state HMRC approval or accreditation.',
  },
  {
    q: 'Can I delete my data?',
    a: 'Yes. You can export your data and permanently delete your account data at any time.',
  },
];

export function FaqSection() {
  return (
    <section className="mt-10 rounded-xl border border-slate-200 bg-white/90 p-8">
      <h2 className="text-2xl font-black text-slate-900">FAQ</h2>
      <div className="mt-4 space-y-4">
        {faqs.map((item) => (
          <div key={item.q}>
            <h3 className="font-semibold text-slate-900">{item.q}</h3>
            <p className="text-slate-600">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
