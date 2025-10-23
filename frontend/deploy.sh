#!/bin/bash

# ChainDeed Vercel Deployment Script
echo "🚀 Starting ChainDeed deployment process..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Run production build test
echo "📦 Testing production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Vercel
    echo "🌐 Deploying to Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo "Visit your deployed site at the URL shown above."
    else
        echo "❌ Deployment failed. Check the error messages above."
        exit 1
    fi
else
    echo "❌ Build failed. Fix the errors and try again."
    exit 1
fi
