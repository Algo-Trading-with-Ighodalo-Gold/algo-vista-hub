---
title: "Troubleshooting Guide"
subtitle: "Fast Solutions to Common EA Issues"
---

Use this guide to quickly diagnose and resolve the most common challenges encountered during installation, activation, or runtime on MetaTrader 5.

## 1. EA not showing in MT5

**Possible causes**
- EA placed in the wrong folder  
- MT5 not restarted after copying the file  
- Incorrect file type (should be `.ex5`)

**Solutions**
- Ensure the EA is in `MQL5/Experts`  
- Restart MetaTrader 5  
- Confirm the file extension is `.ex5`

---

## 2. EA not loading on chart

**Possible causes**
- Algo Trading disabled globally  
- Permissions blocked in MT5 settings  
- Wrong symbol or timeframe loaded

**Solutions**
- Enable **AutoTrading** (button must be green)  
- Go to **Tools → Options → Expert Advisors** and allow automated trading  
- Load the EA on the recommended symbol/timeframe

---

## 3. “Invalid license” or activation error

**Possible causes**
- Incorrect license key entry  
- Extra spaces before/after the key  
- License not activated for the current account

**Solutions**
- Copy/paste the license key exactly as provided  
- Remove leading/trailing spaces  
- Contact support if the key still fails

---

## 4. EA not taking trades

**Possible causes**
- Market is closed  
- Spread too high  
- Insufficient balance or free margin  
- Lot size exceeds broker limits  
- Trading disabled on the account

**Solutions**
- Check market hours  
- Confirm spread is within the EA’s limits  
- Ensure sufficient balance/free margin  
- Reduce lot size  
- Ask your broker to enable algorithmic trading

---

## 5. MT5 freezing or lagging

**Possible causes**
- Too many charts or heavy indicators  
- Weak PC specs or low RAM  
- Running resource-heavy apps in parallel

**Solutions**
- Close unused charts  
- Remove unnecessary indicators  
- Use a VPS for better stability

---

## 6. EA stops trading suddenly

**Possible causes**
- Internet or VPS disconnection  
- VPS restarted or powered off  
- Broker server downtime  
- Equity protection or safety rules triggered

**Solutions**
- Check connection status  
- Restart MT5 if needed  
- Review the **Experts** tab for error messages  
- Verify the EA has not hit equity stop or capital protection rules

