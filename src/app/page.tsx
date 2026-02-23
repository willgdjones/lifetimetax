import { HeroSection } from '@/components/landing/hero';
import { HowItWorksSection } from '@/components/landing/how-it-works';
import { FaqSection } from '@/components/landing/faq';
import { AuthCta } from '@/components/landing/auth-cta';

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <AuthCta />
      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white/90 p-6">
          <h2 className="text-2xl font-black">See where your tax went</h2>
          <p className="mt-2 text-slate-600">Discover your lifetime tax contribution using HMRC history and ONS spending allocation data.</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white/90 p-6">
          <h2 className="text-2xl font-black">Your data stays protected</h2>
          <p className="mt-2 text-slate-600">AES-256-GCM encryption at rest. We never see your Government Gateway credentials.</p>
        </article>
      </section>
      <HowItWorksSection />
      <FaqSection />
    </main>
  );
}
