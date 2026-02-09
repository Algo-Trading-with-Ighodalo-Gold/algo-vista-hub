# Fix: "Currency not supported by merchant" (Enable USD on Paystack)

Your site charges in **USD**, but your Paystack merchant account must have **USD** enabled to accept dollar payments. Until then, Paystack returns "Currency not supported by merchant".

## Enable USD on Paystack

1. **Log in** to [Paystack Dashboard](https://dashboard.paystack.com).
2. Go to **Settings** (gear icon).
3. Open the **Payout Accounts** (or **Settlement**) section.
4. Find **USD** and click **Add bank account** (or **Enable USD**).
5. Add your **USD domiciliary account** (e.g. Zenith Bank or supported bank).
6. Submit and wait for **approval** (often 24–48 hours).

After approval, you can accept USD payments and the error will stop.

**Requirements (Nigeria):**

- A **USD domiciliary account** with a supported bank (e.g. Zenith Bank).
- Business must be based in Nigeria.

**Details:**

- [Paystack: Accept payments in USD](https://support.paystack.com/hc/en-us/articles/360009973799-Can-I-accept-payments-in-US-Dollars-USD)
- [Paystack blog: USD settlement](https://paystack.com/blog/product/new-accept-payments-in-usd)

## If you can’t use USD yet

If you don’t have a USD domiciliary account yet, you have two options:

1. **Enable USD** when your bank supports it (recommended if you want to charge in dollars).
2. **Charge in Naira (NGN)** for now: the codebase can be switched to send `currency: 'NGN'` and display prices in Naira until USD is enabled. Ask your developer to switch checkout to NGN if you want this.

Once USD is enabled in Paystack, no code change is needed—payments will go through.
