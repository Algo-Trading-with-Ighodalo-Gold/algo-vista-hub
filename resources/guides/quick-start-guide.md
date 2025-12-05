---
title: "Quick Start Guide"
subtitle: "From Purchase to Live Trading in 10 Minutes"
---

Need the fastest possible path from download to trading? This guide compresses the full installation, configuration, and verification process into a rapid-fire checklist. For deeper detail, refer to the accompanying Installation, Configuration, and Troubleshooting manuals.

---

## 1. Download your EA (≈1 minute)

1. Log in to your AlgoTradingWithIghodalo dashboard.  
2. Navigate to **My Products / My EAs**.  
3. Download the EA file (e.g., `EAName.ex5`).  
4. Copy or save your license key.

---

## 2. Install into MT5 (≈2 minutes)

1. Open **MetaTrader 5**.  
2. Go to **File → Open Data Folder**.  
3. Navigate to `MQL5 → Experts`.  
4. Paste the EA file inside the **Experts** folder.  
5. Restart MT5.

---

## 3. Load the EA on your chart (≈2 minutes)

6. Open the correct currency pair (e.g., XAUUSD, EURUSD).  
7. Switch to the recommended timeframe (M5, M15, or H1 depending on the EA).  
8. In the **Navigator**, locate your EA under *Expert Advisors*.  
9. Drag the EA onto the chart.  
10. In the settings window:  
   - Enable **Allow Algo Trading**  
   - Enter your license key  
   - Adjust risk/lot settings if required

---

## 4. Enable Algo Trading (≈1 minute)

- On the top toolbar, click **Algo Trading** so the icon turns green.

---

## 5. Verify the EA is active (≈1 minute)

The EA is running correctly if:

- **Terminal → Experts** tab shows “EA successfully loaded / initialized.”  
- **Terminal → Journal** has no error messages.  
- The chart displays the EA’s status/smiley face.  
- The AutoTrading icon remains green.

If you see errors, jump to the Troubleshooting Guide.

---

## 6. Start trading (≈2 minutes)

Once active, the EA will:

- Automatically scan for setups  
- Execute entries and exits per its logic  
- Manage stops and targets without intervention

Let MT5 run continuously. For best results use a VPS (see VPS Setup Guide).

---

## 7. Quick checklist (copy & keep)

**Before running the EA**

- [ ] MT5 installed  
- [ ] Correct broker account selected  
- [ ] EA file installed in `MQL5/Experts`  
- [ ] License key activated  
- [ ] Chart & timeframe loaded  
- [ ] Algo Trading ON  
- [ ] VPS connected (recommended)

**After starting**

- [ ] EA shows “active / smiling”  
- [ ] No warning messages  
- [ ] Auto-trading enabled globally

