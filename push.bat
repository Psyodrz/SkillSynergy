@echo off
echo Stage 1: Adding files...
git add .

if "%~1"=="" (
    echo Stage 2: Committing with default message...
    git commit -m "Auto update"
) else (
    echo Stage 2: Committing with message: "%~1"
    git commit -m "%~1"
)

echo Stage 3: Pushing to GitHub...
git push origin master
echo Done!
