# Quick Start Script for Windows PowerShell

Write-Host "🚀 ChainDeed Frontend - Quick Start" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend directory
Write-Host "📁 Navigating to frontend directory..." -ForegroundColor Yellow
Set-Location -Path "frontend"

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔧 Checking environment variables..." -ForegroundColor Yellow

# Check if .env.local exists
if (-Not (Test-Path ".env.local")) {
    Write-Host "⚠️  Creating .env.local file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✅ Environment file created!" -ForegroundColor Green
} else {
    Write-Host "✅ Environment file exists!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup complete! Starting development server..." -ForegroundColor Green
Write-Host ""
Write-Host "📱 Your app will open at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🦊 Remember to connect your MetaMask wallet!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start development server
npm run dev
