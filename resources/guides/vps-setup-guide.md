---
title: "VPS Setup Guide"
subtitle: "Keeping Your EA Online 24/7"
---

A Virtual Private Server (VPS) keeps your EA running non-stop—even when your personal computer is turned off. It eliminates internet interruptions, prevents platform crashes, and minimizes execution delays.

## Prerequisites

- An active VPS subscription  
- MetaTrader 5 installer or broker download link  
- Your EA `.ex5` file and license key  
- Stable internet connection

---

## Recommended VPS providers

**Best overall:** Contabo VPS, ForexVPS  
**Affordable:** Kamatera, OVH, UltaHost  
**Broker-integrated:** IC Markets VPS, RoboForex VPS, Pepperstone VPS

---

## Connect to your VPS (Windows)

1. Press **Windows Key + R**, type `mstsc`, press Enter.  
2. The Remote Desktop Connection window opens.  
3. Enter your VPS **IP address** and click **Connect**.  
4. Enter the **username & password** supplied by your VPS provider.  
5. You are now inside the VPS desktop.

## Connect to your VPS (macOS)

1. Install **Microsoft Remote Desktop** from the App Store.  
2. Click **Add PC** and enter the VPS IP address.  
3. Save, then double-click the entry to connect.  
4. Enter your login credentials.

---

## Install MT5 inside the VPS

1. Open the browser inside the VPS.  
2. Download MetaTrader 5 from your broker’s official link.  
3. Complete the installation.

---

## Transfer your EA to the VPS

Choose any method:

- **Drag & Drop:** Drag the EA file from your local machine into the VPS window.  
- **Cloud Storage:** Upload the EA to email or Google Drive, open inside the VPS, then download.  
- **Direct Download:** If the EA resides in your dashboard, download it directly from the VPS browser.

---

## Install and activate the EA (same as PC)

1. Open MT5.  
2. Go to **File → Open Data Folder**.  
3. Navigate to `MQL5 → Experts`.  
4. Move the EA file into this folder.  
5. Restart MT5.  
6. Open the correct chart (e.g., XAUUSD M15).  
7. Drag the EA onto the chart, enable **Allow Algo Trading**, enter the license key.  
8. Click **OK**.

---

## Keep the EA running 24/7

Before disconnecting from the VPS:

- MT5 must remain open.  
- The chart with the EA must stay active.  
- Algo Trading button must be green.  
- No errors should appear in the **Experts** tab.

Close the Remote Desktop window without shutting down the VPS.  
The EA keeps running even when:

- Your local computer is off  
- Your personal internet drops  
- You close the remote session

---

## VPS performance tips

- Disable sleep mode or power saving on the VPS.  
- Avoid installing unnecessary apps.  
- Restart the VPS monthly for fresh uptime.  
- Keep MT5 updated.  
- Limit the number of open charts to conserve RAM/CPU.

---

## Maintenance checklist

**Before disconnecting**

- [ ] MT5 open  
- [ ] EA loaded on chart  
- [ ] Algo Trading ON  
- [ ] No errors in Experts tab

**Monthly**

- [ ] Restart VPS  
- [ ] Check EA performance logs  
- [ ] Update MT5 if required

