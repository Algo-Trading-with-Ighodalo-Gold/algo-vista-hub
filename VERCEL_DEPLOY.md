# Deploy on Vercel

## 1. Connect repo

- Push your code to GitHub, then in [Vercel](https://vercel.com) import the repo.
- Vercel will detect **Vite** and use `npm run build` and `dist` automatically (see `vercel.json`).

## 2. Environment variables

In **Vercel → Project → Settings → Environment Variables**, add:

| Variable | Required | Notes |
|----------|----------|--------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `VITE_APP_URL` | Yes (prod) | Your Vercel URL, e.g. `https://your-app.vercel.app` |
| `VITE_PAYSTACK_PUBLIC_KEY` | If using Paystack | Paystack public key (client-side) |

Optional (for features you use):

- `VITE_PAYSTACK_PUBLIC_KEY` – Paystack
- `VITE_STRIPE_PUBLISHABLE_KEY` – Stripe
- Other `VITE_*` from `env.example`

**Important:** Set `VITE_APP_URL` to your production URL (e.g. `https://your-app.vercel.app`) so redirects and links work. Redeploy after changing env vars.

## 3. Supabase / Paystack (Edge Function)

- Payment uses **Supabase Edge Functions** (e.g. `paystack-initialize`). Those run on Supabase, not Vercel.
- In **Supabase**: set `PAYSTACK_SECRET_KEY` and optionally `SITE_URL` (your Vercel URL) in Edge Function secrets.
- In **Paystack**: set the success/callback URL and webhook URL to your Supabase Edge Function URLs and your app URL as needed.

## 4. Deploy

- Push to `main` (or your connected branch) to trigger a deploy, or use **Redeploy** in the Vercel dashboard.
