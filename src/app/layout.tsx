import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { PostHogProvider } from '@/components/providers/posthog-provider';
import { FraudDataProvider } from '@/components/providers/fraud-data-provider';
import { AnalyticsConsentBanner } from '@/components/providers/analytics-consent';

export const metadata: Metadata = {
  title: 'LifetimeTax',
  description: 'Calculate your lifetime tax total using HMRC tax history.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <PostHogProvider>
          <FraudDataProvider />
          <AnalyticsConsentBanner />
          <div className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            <header className="mb-8 flex items-center justify-between">
              <Link href="/" className="text-xl font-black tracking-tight text-slate-900">
                LifetimeTax
              </Link>
              <nav className="flex items-center gap-4 text-sm text-slate-600">
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/privacy">Privacy</Link>
              </nav>
            </header>
            {children}
            <footer className="mt-16 border-t border-slate-200 pt-6 text-sm text-slate-600">
              <div className="flex flex-wrap gap-4">
                <Link href="/privacy">Privacy policy</Link>
                <span>Terms</span>
                <span>Perihelion Limited</span>
              </div>
            </footer>
          </div>
        </PostHogProvider>
      </body>
    </html>
  );
}
