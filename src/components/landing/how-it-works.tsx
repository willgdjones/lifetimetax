const steps = [
  { title: 'Connect HMRC', body: 'Sign in with Government Gateway through HMRC OAuth with 2FA.' },
  { title: 'We calculate', body: 'We combine HMRC history with ONS spending data to estimate total lifetime tax.' },
  { title: 'Share your receipt', body: 'Generate social cards and compare your contribution with national spending.' },
];

export function HowItWorksSection() {
  return (
    <section className="mt-10 grid gap-4 md:grid-cols-3">
      {steps.map((step, idx) => (
        <article key={step.title} className="rounded-xl border border-slate-200 bg-white/90 p-6">
          <p className="mb-2 text-xs font-bold text-brand-700">STEP {idx + 1}</p>
          <h2 className="text-xl font-bold text-slate-900">{step.title}</h2>
          <p className="mt-2 text-slate-600">{step.body}</p>
        </article>
      ))}
    </section>
  );
}
