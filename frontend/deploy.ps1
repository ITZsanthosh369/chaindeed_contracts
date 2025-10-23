# ChainDeed Vercel Deployment Script for Windows
Write-Host "🚀 Starting ChainDeed deployment process..." -ForegroundColor Cyan

# Check if vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Run production build test
Write-Host "📦 Testing production build..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    # Deploy to Vercel
    Write-Host "🌐 Deploying to Vercel..." -ForegroundColor Cyan
    vercel --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 Deployment successful!" -ForegroundColor Green
        Write-Host "Visit your deployed site at the URL shown above." -ForegroundColor Cyan
    } else {
        Write-Host "❌ Deployment failed. Check the error messages above." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Build failed. Fix the errors and try again." -ForegroundColor Red
    exit 1
}
