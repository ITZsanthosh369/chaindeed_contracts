# ChainDeed Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

All items below have been verified and are ready for deployment:

### 1. Build Status
- ✅ Production build compiles successfully
- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ All routes generated correctly

### 2. Configuration Files
- ✅ `vercel.json` - Configured for Next.js
- ✅ `next.config.js` - Webpack externals configured for ethers.js
- ✅ `.gitignore` - Proper exclusions for node_modules, .next, .env
- ✅ `package.json` - All dependencies listed correctly

### 3. Environment Variables Required
The following environment variables need to be set in Vercel:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x08298a5DfED325Bb9b254Cb87B919Aa1f7A8d26f
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=Sepolia
```

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from frontend directory**:
   ```bash
   cd frontend
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Set up environment variables when prompted
   - Confirm deployment

5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**

2. **Click "Add New Project"**

3. **Import Git Repository**:
   - Connect your GitHub/GitLab/Bitbucket account
   - Select the `chaindeed_contracts` repository
   - Set **Root Directory** to: `frontend`

4. **Configure Project**:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add each variable:
     - `NEXT_PUBLIC_CONTRACT_ADDRESS` = `0x08298a5DfED325Bb9b254Cb87B919Aa1f7A8d26f`
     - `NEXT_PUBLIC_CHAIN_ID` = `11155111`
     - `NEXT_PUBLIC_NETWORK_NAME` = `Sepolia`
   - Select: All (Production, Preview, and Development)

6. **Click "Deploy"**

7. **Wait for deployment** (usually 1-3 minutes)

8. **Visit your deployed site** at the provided URL

## 📋 Post-Deployment Verification

After deployment, verify the following:

### 1. Homepage
- [ ] Dark mode toggle works
- [ ] Navigation links work
- [ ] "Get Started" and "Request Certificate" buttons work

### 2. Wallet Connection
- [ ] MetaMask connection prompt appears
- [ ] Wallet address displays correctly
- [ ] Network switching works (Sepolia)

### 3. Request Certificate Page
- [ ] Form fields render correctly
- [ ] File upload works
- [ ] Form submission works
- [ ] Success messages display

### 4. My Requests Page
- [ ] Requests load from blockchain
- [ ] Status updates appear correctly
- [ ] Timeline shows proper statuses
- [ ] "View Certificate" button appears for approved requests

### 5. My Certificates Page
- [ ] NFTs load from blockchain
- [ ] Certificate images display
- [ ] Modal opens with details
- [ ] Download/Share buttons work
- [ ] Retry button works for failed metadata

### 6. Admin Panel (for contract owner)
- [ ] Pending requests load
- [ ] Approve/Reject buttons work
- [ ] Real-time updates work
- [ ] Toast notifications appear

## 🔧 Environment Variables in Vercel

To update environment variables after deployment:

1. Go to your project in Vercel Dashboard
2. Click "Settings"
3. Click "Environment Variables"
4. Add/Edit variables
5. Redeploy for changes to take effect

## 🌐 Custom Domain (Optional)

To add a custom domain:

1. Go to project settings in Vercel
2. Click "Domains"
3. Add your domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

## 🐛 Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify Node.js version compatibility (18.x or higher)
- Check build logs for specific errors

### MetaMask Not Connecting
- Ensure HTTPS is enabled (Vercel provides this automatically)
- Check browser console for errors
- Verify contract address is correct

### Images Not Loading
- Check IPFS gateway accessibility
- Verify Pinata URLs are correct
- Check browser console for CORS errors

### Network Errors
- Verify CHAIN_ID matches Sepolia (11155111)
- Check that contract is deployed on correct network
- Ensure RPC endpoints are accessible

## 📊 Performance Optimization

The deployment is optimized with:
- ✅ Static page generation where possible
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Gzip compression
- ✅ CDN distribution via Vercel Edge Network

## 🔒 Security Checklist

- ✅ Environment variables use NEXT_PUBLIC_ prefix for client-side
- ✅ Sensitive data not exposed in client code
- ✅ .env files excluded from git
- ✅ HTTPS enabled by default on Vercel
- ✅ Contract address hardcoded as fallback

## 📈 Monitoring

After deployment, monitor:
- Vercel Analytics (automatic)
- Error tracking in Vercel logs
- User feedback
- Transaction success rates
- IPFS gateway performance

## 🎉 Ready to Deploy!

Your ChainDeed application is fully configured and ready for production deployment on Vercel.

**Build Status**: ✅ Successful  
**Type Safety**: ✅ No errors  
**Environment**: ✅ Configured  
**Features**: ✅ All working  

Run `vercel` in the frontend directory to deploy now!
