# LifetimeTax

LifetimeTax calculates a UK user's lifetime tax contribution using HMRC OAuth data plus ONS-based estimations, then generates shareable receipt cards.

## Stack

- Next.js 14 App Router + TypeScript + Tailwind
- Supabase (Postgres + Auth + RLS)
- All features free (no paywall)
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

**Hosted on Railway** — auto-deploys from `main` branch on push.

| Item | Value |
|------|-------|
| Platform | [Railway](https://railway.app) |
| Service name | `Lifetime Tax` (service ID: `7b06d76e-b096-49c3-9a2b-964519ea4d26`) |
| Railway domain | `tender-dedication-production.up.railway.app` |
| Project ID | `3d5f148e-7cc1-4940-ac5f-412b8b345009` |
| Domain | `lifetimetax.co.uk` (Cloudflare DNS → `mhm0druv.up.railway.app`) |
| DB | Supabase (project `kncmgrbnqnoftiqwptdo`) |

### How deploys work

1. Push to `main` on GitHub → Railway auto-builds and deploys
2. Railway runs `npm run build` (Next.js) and serves the output
3. Environment variables are set in the Railway dashboard (not in git)

### Environment variables (Railway dashboard)

All the same vars from `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — **must be the legacy JWT key** (starts with `eyJhbG...`), NOT the `sb_publishable_` key
- `SUPABASE_SERVICE_ROLE_KEY` — **must be the legacy JWT key**, NOT `sb_secret_` key
- `NEXT_PUBLIC_BASE_URL` = `https://lifetimetax.co.uk`
- `ENCRYPTION_KEY` (32-byte hex)
- HMRC credentials, Stripe keys, PostHog keys

### Updating env vars

1. Go to https://railway.app → project → `tender-dedication` service → Variables tab
2. Edit/add the variable
3. Railway will auto-redeploy after saving

### Supabase key gotcha

Supabase now issues two key formats:
- **Legacy JWT keys** (start with `eyJhbG...`) — these are what PostgREST/Supabase JS client actually uses
- **New format keys** (`sb_publishable_...` / `sb_secret_...`) — shown in new Supabase dashboard UI but **don't work with PostgREST RLS**

Always use the legacy JWT keys. Get them from the Supabase Management API:
```bash
curl -s "https://api.supabase.com/v1/projects/kncmgrbnqnoftiqwptdo/api-keys" \
  -H "Authorization: Bearer <SUPABASE_PERSONAL_ACCESS_TOKEN>"
```

### Railway CLI quick reference

```bash
# Link to project (from repo directory)
railway link -p 3d5f148e-7cc1-4940-ac5f-412b8b345009
railway service link "Lifetime Tax"

# Check status
railway service status --all

# View/set env vars
railway variable list
railway variable set KEY=value

# View logs
railway service logs

# Redeploy
railway service redeploy
```

### DNS (Cloudflare)

- CNAME `lifetimetax.co.uk` → `mhm0druv.up.railway.app`
- Nameservers: `brit.ns.cloudflare.com`, `evan.ns.cloudflare.com`
