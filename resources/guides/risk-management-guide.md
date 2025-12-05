---
title: "Risk Management Guide"
subtitle: "Core Principles for Automated Trading"
---

Effective risk management is the foundation of successful algorithmic trading. Even the smartest EA cannot protect an account that is poorly managed. Use this guide to safeguard capital, maintain stability, and compound profits for the long term.

## What you will learn

- How to select safe lot sizes  
- Recommended risk-per-trade (RPT) settings  
- How to shield your account from unexpected volatility  
- Equity protection rules  
- Best practices for disciplined automated trading

---

## 1. Risk per trade (RPT)

| Risk Profile | Recommended RPT |
|--------------|-----------------|
| Low Risk     | 0.5% – 1%        |
| Moderate     | 1% – 2%          |
| High         | 3%+ (not advised for long-term trading) |

---

## 2. Choosing the right lot size

Lot size depends on account balance, leverage, broker contract size, and EA strategy logic.

| Account Balance | Suggested Lot Size |
|-----------------|--------------------|
| $100 – $300     | 0.01 (micro lots)  |
| $500 – $3,000   | 0.01 – 0.05        |
| $5,000 – $10,000| 0.05 – 0.20        |

Always start on the conservative side and scale up only after verifying live performance.

---

## 3. Equity protection rules

- Enable built-in equity stops (if your EA includes them).  
- Avoid trading during **high-impact news** (NFP, CPI, FOMC).  
- Pause during periods of **extreme spreads** or broker maintenance.  
- Maintain at least **20–30% free margin** at all times.

---

## 4. Avoid over-leverage

High leverage amplifies both profits and losses.  
- Recommended: **1:100 – 1:300** for most strategies.  
- Avoid 1:500+ unless you fully understand the risks and have deep buffers.

---

## 5. Always use a VPS

To keep your EA safe and running 24/5:

- Keep MT5 online continuously.  
- Prevent internet interruptions.  
- Minimize slippage and order delays.  
- A VPS ensures the EA does not shut down during volatility spikes.

---

## 6. Diversify your risk

- Run multiple EAs with differing logic.  
- Split capital across more than one account.  
- Trade different assets (XAUUSD, FX majors, indices) to avoid single-market dependence.

---

## 7. Emotional discipline

Even with automation, human intervention can ruin systems. Avoid:

- Interfering with trades unless absolutely necessary.  
- Closing trades manually out of fear.  
- Increasing lot sizes impulsively.  
- Turning EAs on/off randomly.  
- Let the strategy execute as designed.

