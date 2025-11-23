param (
    [string]$Message = "Update code"
)

Write-Host "Stage 1: Adding files..." -ForegroundColor Cyan
git add .

Write-Host "Stage 2: Committing changes..." -ForegroundColor Cyan
git commit -m "$Message"

Write-Host "Stage 3: Pushing to GitHub..." -ForegroundColor Cyan
git push origin master

Write-Host "Done! Code pushed successfully." -ForegroundColor Green
