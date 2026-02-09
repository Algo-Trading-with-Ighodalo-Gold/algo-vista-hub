# Fix: 401 "Missing authorization header" on Paystack Edge Functions

## Why you see 401

- **paystack-initialize** and **paystack-verify**  
  These are called by **your app** (browser) with the logged-in user’s JWT in the `Authorization` header.  
  If you open their URLs in the browser (e.g. to test), there is **no** header, so you get **401 Missing authorization header**. That’s expected. Real payment and verify flows from your site do send the header.

- **paystack-webhook**  
  This is called by **Paystack’s servers**, not by your app. Paystack does **not** send a Supabase JWT, only `x-paystack-signature`. So the webhook must be callable **without** JWT verification.

---

## What was changed in the app

- The app now sends both when calling the Edge Functions:
  - `Authorization: Bearer <user_jwt>` (for initialize; and for verify when the user is logged in)
  - `apikey: <your_supabase_anon_key>` (so the Supabase gateway accepts the request)

That should fix 401 when **paying from your site** (initialize) and when **verifying** (success page).

---

## Webhook: deploy without JWT verification

Paystack cannot send a Supabase JWT, so the webhook function must be deployed with JWT verification **off**:

```bash
supabase functions deploy paystack-webhook --no-verify-jwt
```

After that, the webhook URL will respond to Paystack without requiring an `Authorization` header.

---

## Optional: disable JWT for initialize/verify (not recommended)

If your app still gets 401 when starting payment from the site, you can temporarily deploy with JWT off to confirm the rest works:

```bash
supabase functions deploy paystack-initialize --no-verify-jwt
supabase functions deploy paystack-verify --no-verify-jwt
```

Then fix auth (session, headers) and redeploy **without** `--no-verify-jwt` so only your app (with a valid token) can call them.

---

## Summary

| Function             | Called by        | Needs JWT? | Action |
|----------------------|------------------|------------|--------|
| paystack-initialize  | Your app (user)  | Yes        | App sends `Authorization` + `apikey` (done in code). |
| paystack-verify      | Your app (user)  | Yes        | Same as above. |
| paystack-webhook     | Paystack servers | No         | Deploy with `--no-verify-jwt`. |
