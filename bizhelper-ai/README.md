# BizHelper AI

A premium, dark-themed **SaaS platform** for an AI marketing tool aimed at small businesses. Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Supabase** (auth + database), and **PayPal** monthly subscriptions.

The marketing site and demo generator work with **zero configuration**. Accounts, the dashboard, and billing switch on as soon as you add the relevant keys.

---

## What's inside

- Marketing site: Hero, Features, How it works, Live demo, Pricing, Testimonials, FAQ, Contact, CTA, Footer
- Logo in the navbar, footer, and as the favicon/app icon (via `next/image`)
- Auth (Supabase): sign up, login, forgot/reset password, email callback
- Protected dashboard: overview, usage meter, AI generator, recent content, account settings, billing
- PayPal monthly subscriptions: Free / Basic / Pro / Business, webhook sync, success + cancel pages
- Per-plan usage limits enforced server-side (Free plan is capped)
- AI generator wired for `mock` today, `openai` or `gemini` later via one env var

---

## Run it locally

Requires Node.js 18.17+ (Node 20 LTS recommended).

```bash
npm install
cp .env.example .env.local   # optional - site runs without it
npm run dev
```

Open http://localhost:3000.

---

## Supabase setup (auth + database)

1. Create a project at https://supabase.com.
2. Project -> Settings -> API, copy into `.env.local`:
   - Project URL -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY` (secret, server only)
3. Project -> SQL Editor -> New query, paste `supabase/schema.sql`, Run. Creates the `profiles` table, the auto-create-on-signup trigger, and RLS policies.
4. Project -> Authentication -> URL Configuration: set the Site URL and add `<site>/auth/callback` to the redirect allow-list.

`profiles` columns: id, email, username, created_at, current_plan, paypal_subscription_id, subscription_status, subscription_started_at, subscription_renews_at, generations_used, usage_period_start.

---

## PayPal setup (monthly subscriptions)

1. At https://developer.paypal.com create an app -> copy Client ID and Secret.
   - Client ID -> `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
   - Secret -> `PAYPAL_CLIENT_SECRET` (secret)
2. Create a Product, then a monthly Plan per tier (Basic $9, Pro $19, Business $49). Paste each Plan ID:
   - `PAYPAL_BASIC_PLAN_ID`, `PAYPAL_PRO_PLAN_ID`, `PAYPAL_BUSINESS_PLAN_ID`
3. Create a Webhook to `https://<your-domain>/api/paypal/webhook`, subscribe to `BILLING.SUBSCRIPTION.*`, copy the Webhook ID -> `PAYPAL_WEBHOOK_ID`.
4. Keep `PAYPAL_ENV=sandbox` while testing; set `PAYPAL_ENV=live` for production.

Secret keys never reach the browser - only `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is public. After a successful subscription, the webhook (and the subscribe route) update the user's `current_plan` in Supabase.

---

## Connect real AI (optional)

The front end always calls `POST /api/generate`; the provider is chosen by `AI_PROVIDER`:

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
# or
AI_PROVIDER=gemini
GEMINI_API_KEY=...
```

Leave `AI_PROVIDER=mock` (default) for built-in sample content. Provider branches already live in `app/api/generate/route.ts`.

---

## Deploy to Vercel

1. Push to GitHub and import the repo at vercel.com.
2. Project -> Settings -> Environment Variables: add every key from `.env.example` you use (set `NEXT_PUBLIC_SITE_URL` to your real Vercel URL, `PAYPAL_ENV=live` for production).
3. Deploy. Update the Supabase Auth URL config and the PayPal webhook URL to your live domain.

---

## New in this upgrade

```
app/
  login, signup, forgot-password, reset-password   # auth pages
  auth/actions.ts, auth/callback/route.ts          # auth server actions + callback
  dashboard/(layout,page), account, billing        # protected dashboard
  api/usage/route.ts                               # usage snapshot
  api/paypal/(subscribe,cancel,webhook)/route.ts   # billing
components/
  auth/*                                           # auth UI
  dashboard/*                                      # shell, generator, billing, meter
lib/
  supabase/(client,server,middleware,config).ts    # Supabase wiring
  plans.ts, profile.ts, usage.ts, paypal.ts, siteUrl.ts
middleware.ts                                       # session refresh + route protection
supabase/schema.sql                                # database schema
```
