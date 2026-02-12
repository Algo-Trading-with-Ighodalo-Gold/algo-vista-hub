# Push ALL changes to main on GitHub (nothing left behind)
# Run in PowerShell from project root: .\push-to-github.ps1

Set-Location $PSScriptRoot

Write-Host "=== Current branch ===" -ForegroundColor Cyan
git branch --show-current

Write-Host "`n=== Git status (before add) ===" -ForegroundColor Cyan
git status --short

Write-Host "`n=== Staging ALL changes (including new/untracked files) ===" -ForegroundColor Cyan
git add -A

Write-Host "`n=== Status after add ===" -ForegroundColor Cyan
git status --short

$msg = "Sync all: Polar migration, promo UI, Vercel config, header avatar, discount campaigns"
$committed = $false
try {
    git commit -m $msg
    if ($LASTEXITCODE -eq 0) { $committed = $true }
} catch {}
if (-not $committed) {
    Write-Host "`n(No new changes to commit, or commit already done.)" -ForegroundColor Yellow
}

Write-Host "`n=== Pushing to origin main ===" -ForegroundColor Cyan
git push -u origin main

Write-Host "`n=== Done. Check GitHub - main should be up to date. ===" -ForegroundColor Green
