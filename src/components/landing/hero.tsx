import { ButtonLink } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/95 p-8 shadow-sm sm:p-12">
      <p className="mb-4 inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">HMRC recognised tax insight</p>
      <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">You have paid more tax than you think.</h1>
      <p className="mt-5 max-w-2xl text-lg text-slate-600">Connect securely to HMRC, calculate your complete lifetime tax total, and generate your Lifetime Tax Receipt.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/dashboard">Find Out</ButtonLink>
        <ButtonLink href="/privacy" variant="ghost">
          Privacy & security
        </ButtonLink>
      </div>
    </section>
  );
}
