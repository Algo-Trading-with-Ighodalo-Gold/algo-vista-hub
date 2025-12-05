---
title: "EA Installation Guide"
subtitle: "Complete Step-by-Step Process for MetaTrader 5"
estimated_time: "5–10 minutes"
---

## What this guide covers

- Downloading your Expert Advisor from the client dashboard  
- Installing the EA correctly on MetaTrader 5  
- Activating your license for trading  
- Verifying that the EA is running properly  
- Troubleshooting the most common setup issues

## Before you begin

Make sure you have:

- MetaTrader 5 installed on your computer  
- A funded MT5-compatible broker account  
- An active EA license from AlgoTradingWithIghodalo  
- A stable internet connection

## Who should use this guide?

- New clients installing their EA for the first time  
- Existing clients migrating to a new device or VPS  
- Traders who need a crisp installation reference  
- Support teams assisting clients with configuration

---

## Step-by-step installation

### Step 1 — Download your EA
1. Log in to your client dashboard.  
2. Navigate to **Products & Licenses**.  
3. Click **Download EA** next to the product.  
4. Save the `.ex5` file to your computer.

### Step 2 — Install on MetaTrader 5
5. Open **MetaTrader 5**.  
6. Go to **File → Open Data Folder**.  
7. Open `MQL5 → Experts`.  
8. Move your EA (.ex5 file) into this folder.  
9. Restart MetaTrader 5.

### Step 3 — Activate your license
10. Open the recommended chart (e.g., XAUUSD M15).  
11. Drag the EA from the **Navigator** panel onto the chart.  
12. Tick **Allow Algo Trading**.  
13. Paste your license key.  
14. Click **OK** to start the EA.

### Step 4 — Verify installation
15. A smiley face should appear in the top-right corner of the chart.  
16. The **AutoTrading** button should be green.  
17. No errors should appear in the **Experts** tab.  
18. The chart should display an initialization message from the EA.

---

## Troubleshooting

### No smiley face?
- Enable **AutoTrading**.  
- Make sure **Allow Algo Trading** is enabled inside the EA settings.

### “Invalid license” error?
- Verify your license key is correct (copy/paste exactly).  
- Remove extra spaces.  
- Confirm the license is activated for the current account.

### EA not taking trades?
- Market might be closed.  
- Spread might be too high.  
- Account balance may be too low.  
- Wrong symbol or timeframe loaded.  
- Review EA-specific trading hours or filters.

