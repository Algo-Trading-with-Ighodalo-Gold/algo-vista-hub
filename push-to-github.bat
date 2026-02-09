@echo off
REM Push ALL changes to main on GitHub. Double-click or run: push-to-github.bat
cd /d "%~dp0"

echo === Current branch ===
git branch --show-current

echo.
echo === Git status ===
git status --short

echo.
echo === Staging ALL changes ===
git add -A

echo.
echo === Committing ===
git commit -m "Sync all: Spline background, Paystack fixes, promo UI, Vercel config, header avatar, discount campaigns, 401 fix"
if errorlevel 1 echo (Nothing to commit or already committed.)

echo.
echo === Pushing to origin main ===
git push -u origin main

echo.
echo === Done. Check GitHub - main should be up to date. ===
pause
