---
title: "Account Configuration Guide"
subtitle: "Optimizing Your MT5 Environment for Expert Advisors"
---

Proper account configuration is essential for stable, consistent EA performance. This guide walks you through the exact platform, chart, and connection settings required to keep your algorithms running smoothly.

## What you will learn

- How to configure the MT5 platform for EA trading  
- Recommended account types and broker settings  
- How to prepare charts before loading an EA  
- Permissions and options that must be enabled  
- Common configuration mistakes to avoid

---

## 1. Choose the right account type

**Recommended:**
- ECN or Raw Spread accounts  
- Low-spread, low-latency brokers  
- Leverage: 1:100 – 1:500 (depending on regulations)

**Avoid:**
- Standard accounts with high spreads  
- Brokers with slow execution or restrictive policies

---

## 2. Platform settings (MT5)

Navigate to **Tools → Options** and configure:

### General Tab
- ☑ Allow automated trading  
- ☑ Allow DLL imports (if required by your EA)  
- ☑ Allow algo trading for newly added EAs

### Expert Advisors Tab
- Ensure “Allow Algo Trading” is enabled globally  
- Disable restrictions that block EA operations

---

## 3. Chart setup

Before loading your EA:
- Open the **correct symbol** (e.g., XAUUSD).  
- Set the **recommended timeframe** (M5, M15, H1, etc.).  
- Use **Candlestick** mode.  
- Remove unnecessary indicators unless explicitly required.

---

## 4. Account preparation checklist

- Maintain sufficient account balance/free margin.  
- Confirm your account is not read-only.  
- Close conflicting manual trades if the EA requires a clean slate.  
- Ensure your broker permits algorithmic trading.

---

## 5. Connection & execution quality

EA performance depends on connection stability:

- Keep MT5 connected 24/5.  
- Avoid frequent internet interruptions.  
- Use a VPS for continuous uptime (see VPS Setup Guide).

---

## 6. Common configuration mistakes

- Using the wrong chart timeframe  
- Loading the EA on symbols not supported by the broker  
- Forgetting to enable AutoTrading  
- Running MT5 on unstable internet  
- Closing MT5 and expecting the EA to continue trading

