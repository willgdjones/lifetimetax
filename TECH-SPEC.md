# LifetimeTax — Technical Specification

**Project:** LifetimeTax (Lifetime Tax Receipt Generator)
**Author:** Perihelion Architect
**Date:** 2026-02-22
**Status:** READY FOR BUILD

---

## 1. What You're Building

A web app where UK taxpayers log in with their Government Gateway credentials (HMRC OAuth), the app pulls their complete tax history via HMRC APIs, calculates their lifetime tax total across all types, and generates shareable "Lifetime Tax Receipt" cards showing what their contributions paid for — using real ONS government spending data.

**Spotify Wrapped for taxes.**

**Model:** Completely free. No payments, no premium tier.

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR for landing, API routes for HMRC integration |
| Hosting | Railway | Auto-scaling, custom domains |
| Database | Supabase (Postgres + Auth) | Row Level Security, realtime not needed |
| Analytics | PostHog | Self-serve, EU hosting available |
| Share Card Rendering | `@vercel/og` (Satori) | Edge-rendered OG images, no Puppeteer overhead |
| Styling | Tailwind CSS | Standard |
| State | React Server Components + minimal client state | No Redux/Zustand needed |

---

## 3. Project Structure

```
lifetimetax/
├── package.json
├── next.config.js
├── tailwind.config.js
├── .env.local                    # HMRC credentials, Supabase keys
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout, PostHog provider
│   │   ├── page.tsx              # Landing page (marketing + CTA)
│   │   ├── auth/
│   │   │   ├── callback/route.ts # HMRC OAuth callback handler
│   │   │   └── logout/route.ts
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Main results page
│   │   ├── card/
│   │   │   └── [type]/
│   │   │       └── [id]/
│   │   │           └── route.tsx # OG image generation endpoint
│   │   ├── api/
│   │   │   ├── hmrc/
│   │   │   │   ├── connect/route.ts    # Initiate HMRC OAuth
│   │   │   │   ├── callback/route.ts   # Handle OAuth callback
│   │   │   │   ├── refresh/route.ts    # Token refresh
│   │   │   │   └── fetch/route.ts      # Pull tax data from HMRC
│   │   │   ├── calculate/route.ts      # Run tax calculation engine
│   │   │   └── share/route.ts          # Generate share URLs
│   │   ├── share/
│   │   │   └── [id]/page.tsx           # Public share page
│   │   ├── privacy/page.tsx            # Privacy policy
│   │   └── terms/page.tsx              # Terms and conditions
│   ├── lib/
│   │   ├── hmrc/
│   │   │   ├── client.ts         # HMRC API client (OAuth + REST)
│   │   │   ├── types.ts          # HMRC API response types
│   │   │   ├── scopes.ts         # Required OAuth scopes
│   │   │   └── apis.ts           # Individual API fetchers (NI, income, etc.)
│   │   ├── calculator/
│   │   │   ├── engine.ts         # Core calculation logic
│   │   │   ├── vat-estimator.ts  # VAT estimation from ONS data
│   │   │   ├── council-tax.ts    # Council tax estimation
│   │   │   └── spending.ts       # ONS spending allocation data
│   │   ├── cards/
│   │   │   ├── the-number.tsx    # Card template: big total
│   │   │   ├── the-breakdown.tsx # Card template: by tax type
│   │   │   └── the-receipt.tsx   # Card template: spending allocation
│   │   ├── supabase/
│   │   │   ├── client.ts         # Supabase client init
│   │   │   ├── server.ts         # Server-side Supabase client
│   │   │   └── types.ts          # DB types (generated)
│   │   └── encryption.ts         # AES-256-GCM helpers
│   └── components/
│       ├── landing/              # Landing page sections
│       ├── dashboard/            # Results display components
│       ├── cards/                # Interactive card previews
│       └── ui/                   # Shared UI primitives
├── supabase/
│   └── migrations/
│       └── 001_initial.sql
└── public/
    └── ons/                      # Static ONS spending data JSON files
```

---

## 4. HMRC Integration

### 4.1 OAuth Flow

HMRC uses standard OAuth 2.0 Authorization Code Grant with optional PKCE (use PKCE).

**Sandbox:**
- Auth URL: `https://test-www.tax.service.gov.uk/oauth/authorize`
- Token URL: `https://test-api.service.hmrc.gov.uk/oauth/token`
- API base: `https://test-api.service.hmrc.gov.uk`

**Production:**
- Auth URL: `https://www.tax.service.gov.uk/oauth/authorize`
- Token URL: `https://api.service.hmrc.gov.uk/oauth/token`
- API base: `https://api.service.hmrc.gov.uk`

**Flow:**
1. User clicks "Connect to HMRC" → redirect to HMRC auth URL with scopes + PKCE challenge
2. User logs in with Government Gateway credentials, completes 2FA, grants consent
3. HMRC redirects back with auth code → exchange for access token + refresh token
4. Access token: valid 4 hours. Refresh token: valid 18 months, single-use (each refresh returns a new refresh token)
5. Store encrypted tokens in Supabase, refresh proactively before expiry

**Required scopes:**
```
read:national-insurance
read:individual-income
read:individual-employment
read:individual-benefits
read:individual-calculations
```

**OAuth parameters:**
```typescript
const authUrl = new URL('https://www.tax.service.gov.uk/oauth/authorize');
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('client_id', process.env.HMRC_CLIENT_ID!);
authUrl.searchParams.set('scope', SCOPES.join(' '));
authUrl.searchParams.set('state', csrfToken);
authUrl.searchParams.set('redirect_uri', process.env.HMRC_REDIRECT_URI!);
authUrl.searchParams.set('code_challenge', codeChallenge);
authUrl.searchParams.set('code_challenge_method', 'S256');
```

**Token exchange:**
```typescript
const tokenResponse = await fetch('https://api.service.hmrc.gov.uk/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authCode,
    client_id: process.env.HMRC_CLIENT_ID!,
    client_secret: process.env.HMRC_CLIENT_SECRET!,
    redirect_uri: process.env.HMRC_REDIRECT_URI!,
    code_verifier: codeVerifier,
  }),
});
```

**CRITICAL:** Do NOT store Government Gateway credentials. Do NOT alter the auth journey. Do NOT use HMRC logos. Only use "HMRC recognised" terminology (not "approved" or "accredited").

### 4.2 HMRC APIs to Call

After OAuth, fetch data for each tax year from the earliest available to present:

| API | Endpoint Pattern | Data |
|---|---|---|
| National Insurance | `GET /national-insurance/sa/{nino}/{taxYear}` | Class 1 earnings, Class 2 NI contributions |
| Individual Income | `GET /individuals/income/?matchId={id}` | SA income, PAYE income, employments income |
| Individual Employment | `GET /individuals/employments/?matchId={id}` | Employment history, employer details |
| Individual Benefits | `GET /individuals/benefits-and-credits/?matchId={id}` | Tax credits, benefits received |
| Individual Tax (SA) | `GET /individuals/self-assessment/?matchId={id}` | Self-assessment returns, tax paid |

**Data fetching strategy:**
1. On first connect, fetch ALL available tax years in parallel (batch of 5 concurrent requests max — respect HMRC rate limits)
2. Cache results in Supabase (encrypted) — no need to re-fetch unless user requests refresh
3. HMRC APIs may return partial data for older years — handle gracefully
4. Some APIs use NINO (National Insurance Number) — obtained from the user's OAuth profile
5. Some use `matchId` from the Individual Details API — call that first to get the match ID

**Rate limits:** HMRC doesn't publish explicit rate limits but recommends reasonable usage. Cap at 5 concurrent requests per user, 1 request/second burst.

### 4.3 Production Approval Process

**Timeline: ~10 working days** (HMRC states this on their Developer Hub).

**Requirements for production credentials:**
1. Register application on HMRC Developer Hub
2. Subscribe to required APIs
3. Complete terms of use questionnaire:
   - Organisation details (Perihelion Limited, Companies House reg)
   - Responsible individual details (Will)
   - Confirm no HMRC logos used
   - Confirm GDPR compliance
   - Confirm data encryption at rest and in transit
   - Confirm security breach notification process
   - Confirm accessibility (WCAG AA)
   - Confirm advertising standards compliance
   - Confirm customers can export/delete their data
   - Confirm you don't store Government Gateway credentials
   - Demonstrate fraud prevention headers implementation
4. Submit for review

**Fraud Prevention Headers:** HMRC requires specific headers on API calls for production. These include device info, client IP, timestamps, etc. Implementation required — see HMRC fraud prevention docs.

**To accelerate:**
- Submit the production application NOW, before the build is complete
- The questionnaire can be answered truthfully based on the planned architecture
- Build in sandbox while waiting for production approval
- Everything works identically between sandbox and production (just swap URLs + credentials)

**Action for Will:** Register on HMRC Developer Hub, create the application, subscribe to APIs, and start the production credentials request immediately. This is the critical path.

---

## 5. Database Schema (Supabase)

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    hmrc_access_token_encrypted TEXT,
    hmrc_refresh_token_encrypted TEXT,
    hmrc_token_expires_at TIMESTAMPTZ,
    hmrc_nino_encrypted TEXT,
    hmrc_match_id TEXT,
    hmrc_connected_at TIMESTAMPTZ,
    share_id TEXT UNIQUE DEFAULT gen_random_uuid()::text,
    data_fetched_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tax data per year (cached from HMRC)
CREATE TABLE tax_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    tax_year TEXT NOT NULL,
    income_tax_paid NUMERIC(12,2),
    ni_contributions NUMERIC(12,2),
    student_loan_repaid NUMERIC(12,2),
    total_earnings NUMERIC(12,2),
    employment_count INTEGER,
    raw_data_encrypted JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, tax_year)
);

-- Calculated lifetime summary (derived)
CREATE TABLE lifetime_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    total_income_tax NUMERIC(14,2),
    total_ni NUMERIC(14,2),
    estimated_vat NUMERIC(14,2),
    estimated_council_tax NUMERIC(14,2),
    estimated_fuel_duty NUMERIC(14,2),
    estimated_other NUMERIC(14,2),
    grand_total NUMERIC(14,2),
    years_covered INTEGER,
    earliest_year TEXT,
    latest_year TEXT,
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Share cards (public, no sensitive data)
CREATE TABLE share_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    card_type TEXT NOT NULL,
    public_data JSONB NOT NULL,
    share_url TEXT UNIQUE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifetime_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can read own tax years" ON tax_years FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own summary" ON lifetime_summary FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Share cards are publicly readable" ON share_cards FOR SELECT USING (true);
CREATE POLICY "Users can manage own cards" ON share_cards FOR ALL USING (auth.uid() = user_id);
```

**Encryption:** HMRC tokens and raw tax data must be encrypted at rest using AES-256-GCM. Encryption key stored in Railway environment variables, NOT in Supabase. Use a server-side encryption/decryption helper — never expose raw tokens to the client.

---

## 6. Calculation Engine

### 6.1 Precise Data (from HMRC)

Directly from API responses — no estimation needed:
- **Income Tax paid** — from SA returns and PAYE records
- **National Insurance** — from NI API (Class 1, 2, 4)
- **Student Loan repayments** — if available in employment data

### 6.2 Estimated Data (from ONS + user's income)

These taxes aren't in HMRC APIs but are significant parts of lifetime tax:

**VAT Estimation:**
- ONS publishes average household spending by income decile
- Place user in income decile based on their HMRC earnings data
- Apply 20% VAT to VAT-eligible spending categories (ONS breakdown available)
- Store ONS data as static JSON in `/public/ons/` — update annually

```typescript
function estimateVAT(annualIncome: number, year: string): number {
  const decile = getIncomeDecile(annualIncome, year);
  const spending = ONS_SPENDING_BY_DECILE[year]?.[decile] ?? ONS_SPENDING_BY_DECILE['latest'][decile];
  const vatEligibleSpending = spending * VAT_ELIGIBLE_RATIO; // ~0.55 of total spending
  return vatEligibleSpending * 0.2; // 20% VAT
}
```

**Council Tax Estimation:**
- Average council tax by year (publicly available from DLUHC)
- Could refine by region if user provides postcode (optional future feature)
- Default to England average if no postcode

**Fuel Duty, Insurance Premium Tax, etc.:**
- Use ONS average household spending on fuel, insurance
- Apply known duty rates per year
- These are smaller but add up over a lifetime

### 6.3 "Your Tax Paid For" Allocation

Use HM Treasury's Country and Regional Analysis (CRA) data — published annually, shows government spending by category:

```typescript
const SPENDING_ALLOCATION = {
  'NHS & Health': 0.203,
  'Pensions & Welfare': 0.283,
  'Education': 0.118,
  'Defence': 0.052,
  'Transport': 0.033,
  'Public Order & Safety': 0.044,
  'Housing & Environment': 0.026,
  'Industry & Agriculture': 0.024,
  'Debt Interest': 0.061,
  'Other': 0.156,
};
```

This gives users concrete numbers: "Your £287,000 lifetime tax paid for £58,261 of NHS care, £33,846 of education..."

---

## 7. Share Card Generation

### 7.1 Three Card Types (all free)

**The Number:**
- Giant lifetime tax total in the centre
- "I've paid £X in lifetime tax"
- Subtle LifetimeTax.co.uk branding
- Optimised for X (1200×675) and LinkedIn (1200×627)

**The Breakdown:**
- Pie chart / bar breakdown by tax type
- Income Tax, NI, VAT, Council Tax, Other
- Year range shown

**The Receipt:**
- Styled like an actual receipt
- Line items: "NHS — £58,261", "Education — £33,846", etc.
- Total at bottom
- "Receipt #" is their share ID
- Most viral format

### 7.2 Implementation: `@vercel/og` (Satori)

Use Vercel's OG image generation — runs at the edge, no Puppeteer, no Chrome, fast.

```typescript
// src/app/card/[type]/[id]/route.tsx
import { ImageResponse } from '@vercel/og';

export async function GET(req: Request, { params }: { params: { type: string; id: string } }) {
  const card = await getShareCard(params.id);
  if (!card) return new Response('Not found', { status: 404 });
  
  incrementViewCount(params.id);
  
  return new ImageResponse(
    <CardTemplate type={params.type} data={card.public_data} />,
    { width: 1200, height: 675 }
  );
}
```

**Share page (`/share/[id]`):**
```html
<meta property="og:image" content="https://lifetimetax.co.uk/card/the-number/{id}" />
<meta property="og:title" content="I've paid £287,000 in lifetime tax" />
<meta property="og:description" content="Find out your lifetime tax total at LifetimeTax.co.uk" />
```

---

## 8. Data Security

### 8.1 Encryption

| Data | At Rest | In Transit |
|---|---|---|
| HMRC access/refresh tokens | AES-256-GCM (server-side) | TLS 1.3 |
| NINO | AES-256-GCM (server-side) | TLS 1.3 |
| Raw HMRC API responses | AES-256-GCM in JSONB column | TLS 1.3 |
| Calculated totals | Plaintext (not PII) | TLS 1.3 |
| Share card data | Plaintext (aggregated only, no PII) | TLS 1.3 |

**Encryption key:** Stored in Railway environment variable `ENCRYPTION_KEY`. 256-bit key, generated via `crypto.randomBytes(32)`. Never committed to git, never in Supabase.

### 8.2 Data Retention & Deletion

- **HMRC tokens:** Deleted on user request or after 18 months (refresh token expiry)
- **Tax data:** Retained while account exists. User can delete at any time via settings.
- **Account deletion:** CASCADE delete removes all data (profiles → tax_years → lifetime_summary → share_cards)

### 8.3 HMRC Fraud Prevention Headers

HMRC requires fraud prevention headers on production API calls. Connection method: `WEB_APP_VIA_SERVER`.

All headers must be sent with every HMRC API call:

| Header | Source |
|---|---|
| `Gov-Client-Connection-Method` | Static: `WEB_APP_VIA_SERVER` |
| `Gov-Client-Browser-JS-User-Agent` | Client JS: `navigator.userAgent` |
| `Gov-Client-Device-ID` | Client cookie: persistent UUID |
| `Gov-Client-Public-IP` | Server: `x-forwarded-for` |
| `Gov-Client-Public-IP-Timestamp` | Server: UTC timestamp |
| `Gov-Client-Screens` | Client JS: screen dimensions |
| `Gov-Client-Timezone` | Client JS: UTC offset |
| `Gov-Client-User-IDs` | Server: `lifetimetax={user_id}` |
| `Gov-Client-Window-Size` | Client JS: window dimensions |
| `Gov-Vendor-Version` | Static: `lifetimetax=1.0.0` |

---

## 9. Scaling for Viral Load

### 9.1 Architecture for 100k Visitors/Day

**Railway handles this natively:**
- Static landing page → CDN
- API routes → auto-scale
- OG image generation → edge functions
- No persistent server to overload

**Supabase considerations:**
- Use Supabase Pro ($25/mo) minimum — 8GB DB, 250GB bandwidth
- Connection pooling via Supavisor (built in)

**Bottleneck: HMRC API, not our infra.** Mitigations:
- Queue HMRC data fetches (don't hammer them on login)
- Show "Calculating your lifetime tax..." with progress indicator
- Cache aggressively — once fetched, never re-fetch unless user requests
- Background job pattern: user connects → queue fetch → notify when ready

### 9.2 Cost at Scale

| Component | 100k users | Cost |
|---|---|---|
| Railway | — | ~$20/mo |
| Supabase Pro | 100k rows | $25/mo |
| PostHog | 100k events | Free tier |
| Domain | — | ~£10/year |

---

## 10. User Flow

1. **Landing page** — "How much tax have you paid in your lifetime?" + big CTA
2. **Click "Find Out"** → Supabase auth (magic link or email/password)
3. **Click "Connect to HMRC"** → HMRC OAuth flow (Government Gateway login, 2FA, consent)
4. **Redirected back** → "Fetching your tax history..." (loading state while APIs are called)
5. **Dashboard** — Big number: "Your Lifetime Tax: £287,431" + year-by-year chart
6. **Full breakdown** — by tax type, "Your Tax Paid For" allocation, all 3 card types
7. **Share:** Click card → generates share URL → copy or share directly to X/LinkedIn

---

## 11. Landing Page

Conversion-optimised single page:
- Hero: "You've paid more tax than you think." + big CTA button
- Social proof: "Join 50,000+ people who've discovered their lifetime tax total" (update dynamically)
- How it works: 3 steps (Connect HMRC → We Calculate → Share Your Receipt)
- Example card (anonymised) showing the format
- Security messaging: "Your data is encrypted. We never see your Government Gateway password."
- FAQ section
- Footer: Privacy policy, Terms, Perihelion Limited

**SEO:** Target "lifetime tax calculator UK", "how much tax have I paid total", "tax receipt UK"

---

## 12. Environment Variables

```bash
# HMRC
HMRC_CLIENT_ID=
HMRC_CLIENT_SECRET=
HMRC_REDIRECT_URI=https://lifetimetax.co.uk/api/hmrc/callback
HMRC_BASE_URL=https://api.service.hmrc.gov.uk

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Encryption
ENCRYPTION_KEY=  # 256-bit hex string

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# App
NEXT_PUBLIC_BASE_URL=https://lifetimetax.co.uk
```

---

## 13. HMRC Production Approval Checklist

Submit this ASAP — it's the critical path blocker.

- [ ] Register on HMRC Developer Hub (developer.service.hmrc.gov.uk)
- [ ] Create sandbox application
- [ ] Subscribe to: National Insurance, Individual Income, Individual Employment, Individual Benefits, Individual Calculations (MTD)
- [ ] Test in sandbox with test users (HMRC provides test user creation API)
- [ ] Create production application
- [ ] Subscribe to same APIs in production
- [ ] Complete Terms of Use questionnaire
- [ ] Submit for review (~10 working days)

---

## 14. Deliverables

1. Complete Next.js project with all routes and components
2. HMRC OAuth integration (sandbox-ready, production-ready with env swap)
3. Tax calculation engine with precise (HMRC) + estimated (ONS) data
4. Three share card templates rendered via `@vercel/og`
5. Supabase schema with RLS policies
6. Landing page (conversion-optimised)
7. Dashboard with full breakdown
8. Share pages with OG meta tags
9. PostHog analytics integration
10. Encryption helpers for HMRC tokens and PII
11. Fraud prevention header collection
12. Privacy policy page
13. Terms and conditions page
14. README with setup, env vars, deployment instructions

---

## 15. HMRC & Regulatory Compliance

### 15.1 HMRC Development Practices
- Single Developer Hub production application named "Perihelion Limited"
- No certificate pinning, no IP pinning
- No OAuth automation — user must manually interact with Government Gateway
- No CORS — all HMRC API calls server-side only
- Weekly sandbox CI tests

### 15.2 UK GDPR Compliance
- Privacy policy at `/privacy` (comprehensive, 15 sections)
- Terms and conditions at `/terms` (17 sections)
- Consent banner for analytics cookies (PostHog)
- Data export endpoint: `/api/data-export`
- Account deletion: `/api/account/delete` — CASCADE removes all data
- Privacy policy URL provided to HMRC during production application

### 15.3 Encryption
- AES-256-GCM at rest for tokens, NINO, raw HMRC responses
- TLS 1.2+ in transit everywhere
- No HTTP fallback

### 15.4 User Separation
- Supabase Row Level Security on all tables
- API routes always derive user_id from authenticated session

### 15.5 Security Breach Notification
- SDSTeam@hmrc.gov.uk within 72h
- ICO within 72h
- Affected users notified without undue delay

### 15.6 Accessibility
- WCAG 2.1 Level AA
- Semantic HTML, keyboard navigable, contrast ≥ 4.5:1

### 15.7 HMRC Branding Rules
- No HMRC logos
- Only "HMRC recognised" (not "approved" or "accredited")

---

## 16. Out of Scope (v1)

- Mobile app (web-only, responsive)
- Scottish income tax separate calculation (use UK average rates)
- Historical council tax by region (use national average)
- Employer NI visualisation ("your employer paid X on top")
- Social login (HMRC OAuth is the only auth that matters)
- PDF export of receipt
- API for third-party integrations
- Payments / premium tier
