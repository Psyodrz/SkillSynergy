param (
    [string]$Message = "Update code"
)

# 1. Show current status
Write-Host "`n=== Current Status ===" -ForegroundColor Yellow
git status
Write-Host "======================`n" -ForegroundColor Yellow

# 2. Add all changes
Write-Host "-> Adding all files..." -ForegroundColor Cyan
git add .

# 3. Commit changes
Write-Host "-> Committing changes with message: '$Message'..." -ForegroundColor Cyan
git commit -m "$Message"

# 4. Push to GitHub
Write-Host "-> Pushing to GitHub..." -ForegroundColor Cyan
git push

Write-Host "`n✅ Success! Codebase updated to GitHub." -ForegroundColor Green
