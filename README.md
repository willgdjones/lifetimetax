# LifetimeTax

LifetimeTax calculates a UK user's lifetime tax contribution using HMRC OAuth data plus ONS-based estimations, then generates shareable receipt cards.

## Stack

- Next.js 14 App Router + TypeScript + Tailwind
- Supabase (Postgres + Auth + RLS)
- Stripe Checkout (one-time £4.99)
- HMRC OAuth + HMRC APIs
- `@vercel/og` image generation
- PostHog analytics (consent-gated)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create local env file:

```bash
cp .env.example .env.local
```

3. Fill required values in `.env.local`:
- HMRC credentials and sandbox URLs
- Supabase URL/keys
- Stripe keys
- `ENCRYPTION_KEY` (32-byte hex)
- PostHog values
- `NEXT_PUBLIC_BASE_URL`

4. Run migration in Supabase SQL editor:
- `supabase/migrations/001_initial.sql`

5. Start app:

```bash
npm run dev
```

## Core Routes

- `/` landing page + magic-link auth entry
- `/dashboard` free results view
- `/premium` premium-only expanded insights
- `/privacy` GDPR policy page
- `/share/[id]` public share page
- `/card/[type]/[id]` OG image endpoint

## API Routes

- HMRC: `/api/hmrc/connect`, `/api/hmrc/callback`, `/api/hmrc/refresh`, `/api/hmrc/fetch`
- Calculation: `/api/calculate`
- Stripe: `/api/stripe/checkout`, `/api/stripe/webhook`
- Sharing: `/api/share`
- GDPR tools: `/api/data-export`, `/api/account/delete`

## Security

- AES-256-GCM encryption for HMRC tokens, NINO, and raw HMRC payloads (`src/lib/crypto.ts`)
- HMRC fraud prevention header builder (`src/lib/fraud.ts`)
- RLS on all user data tables
- No client-side HMRC API calls

## Compliance Notes

- Uses HMRC sandbox URLs by default.
- Branding language is HMRC recognised (not approved/accredited).
- Weekly HMRC sandbox smoke workflow: `.github/workflows/weekly-hmrc-sandbox.yml`

## Deployment

Deploy to Vercel. Ensure all environment variables are set in Vercel project settings before first production build.
