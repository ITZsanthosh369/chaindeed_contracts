# ✅ ChainDeed - Ready for Vercel Deployment

## 🎯 Pre-Deployment Verification Complete

### Build Status
✅ **Production build successful**
- All TypeScript types validated
- No compilation errors
- All 7 pages generated successfully
- Bundle size optimized

### Files Verified
✅ `package.json` - All dependencies correct
✅ `next.config.js` - Webpack configuration for ethers.js
✅ `vercel.json` - Deployment configuration
✅ `tsconfig.json` - TypeScript configuration
✅ `.env.local` - Local environment variables (contains Pinata keys)
✅ `.gitignore` - Excludes .env and .next from git

### Bug Fixes Applied
✅ Fixed TypeScript error in `contract.ts` - Added type guard for event.args

---

## 🚀 DEPLOY NOW - Choose One Method

### Method 1: Quick Deploy via Vercel CLI (Fastest)

```powershell
# Install Vercel CLI (if needed)
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to frontend and deploy
cd C:\Users\tenys\chaindeed\chaindeed_contracts\frontend
vercel --prod
```

### Method 2: Automated Deploy Script

```powershell
cd C:\Users\tenys\chaindeed\chaindeed_contracts\frontend
.\deploy.ps1
```

### Method 3: Vercel Dashboard (Most Visual)

1. Visit https://vercel.com/new
2. Import Git Repository
3. Select repository: `chaindeed_contracts`
4. **Set Root Directory: `frontend`** ⚠️ IMPORTANT
5. Framework: Next.js (auto-detected)
6. Add Environment Variables:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x08298a5DfED325Bb9b254Cb87B919Aa1f7A8d26f
   NEXT_PUBLIC_CHAIN_ID=11155111
   NEXT_PUBLIC_NETWORK_NAME=Sepolia
   NEXT_PUBLIC_PINATA_API_KEY=673b13389986d7bfa85b
   NEXT_PUBLIC_PINATA_SECRET_KEY=d03ae9621bf18b93489dc07c6b1a0e2887efca767ce7d36cb25740098c1bbe4f
   NEXT_PUBLIC_PINATA_JWT=<your-jwt-from-env-file>
   ```
7. Click **Deploy**

---

## 🔐 Environment Variables for Vercel

Copy these to Vercel Dashboard (Settings > Environment Variables):

### Contract Configuration
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x08298a5DfED325Bb9b254Cb87B919Aa1f7A8d26f
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=Sepolia
```

### Pinata IPFS Configuration
```
NEXT_PUBLIC_PINATA_API_KEY=673b13389986d7bfa85b
NEXT_PUBLIC_PINATA_SECRET_KEY=d03ae9621bf18b93489dc07c6b1a0e2887efca767ce7d36cb25740098c1bbe4f
```

### Pinata JWT (Full Token)
```
NEXT_PUBLIC_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyZTBkMGU5YS05MjRlLTQ1M2EtYTcxZS1kNTFkNzc1YzQyMjAiLCJlbWFpbCI6InRlbnlzb240NTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjY3M2IxMzM4OTk4NmQ3YmZhODViIiwic2NvcGVkS2V5U2VjcmV0IjoiZDAzYWU5NjIxYmYxOGI5MzQ4OWRjMDdjNmIxYTBlMjg4N2VmY2E3NjdjZTdkMzZjYjI1NzQwMDk4YzFiYmU0ZiIsImV4cCI6MTc5Mjc1OTc5OH0.iYWEceRRRMsFTXyYnKVEAhKC_HlGbGtjGoNCqYd5cKA
```

**Note**: Set environment variables for **Production, Preview, and Development**

---

## 📦 What Gets Deployed

### Pages (7 total)
- `/` - Homepage with hero section
- `/request` - Certificate request form
- `/my-requests` - User's certificate requests
- `/my-deeds` - User's NFT certificates
- `/admin` - Admin panel (owner only)
- `/mint` - Direct mint page (owner only)
- `/_not-found` - 404 page

### Features Included
✅ Dark mode toggle
✅ Wallet connection (MetaMask)
✅ Certificate request system
✅ IPFS/Pinata image upload
✅ Real-time blockchain updates
✅ Admin approval system
✅ NFT certificate display
✅ Certificate metadata viewer
✅ Download & share certificates
✅ Mobile responsive design
✅ Toast notifications
✅ Confetti animations

---

## 🧪 Post-Deployment Testing

After deployment, test these critical paths:

### 1. Connect Wallet
- Visit deployed URL
- Click "Connect Wallet"
- Approve MetaMask connection
- Verify address displays

### 2. Request Certificate
- Go to "Request Certificate"
- Fill form with test data
- Upload image to Pinata
- Submit request
- Verify transaction on Sepolia Etherscan

### 3. Admin Approval (if owner)
- Go to "Admin Panel"
- See pending request
- Click "Approve"
- Confirm transaction
- Verify real-time update

### 4. View Certificate
- Go to "My Requests"
- See approved status
- Click "View Certificate"
- Verify certificate displays

### 5. My Certificates
- Go to "My Certificates"
- See NFT grid
- Click certificate
- Verify modal displays
- Test download/share

---

## 🎉 Deployment Checklist

Before deploying, confirm:
- [ ] Git repository is up to date
- [ ] All changes are committed
- [ ] .env files are not in git
- [ ] Build passes locally
- [ ] Environment variables ready to copy

After deploying, verify:
- [ ] All pages load
- [ ] Wallet connects
- [ ] Forms work
- [ ] Images display
- [ ] Transactions work
- [ ] Admin panel works (if owner)

---

## 🔗 Important Links

**Contract on Sepolia**:
https://sepolia.etherscan.io/address/0x08298a5DfED325Bb9b254Cb87B919Aa1f7A8d26f

**Pinata Dashboard**:
https://app.pinata.cloud/

**Vercel Dashboard**:
https://vercel.com/dashboard

---

## 🆘 Troubleshooting

### Build fails on Vercel
- Check that root directory is set to `frontend`
- Verify all environment variables are added
- Check build logs for specific errors

### MetaMask not connecting
- Ensure site is on HTTPS (Vercel does this automatically)
- Check browser console for errors
- Try clearing browser cache

### Images not loading
- Verify Pinata API keys are correct
- Check IPFS gateway is accessible
- Look for CORS errors in console

### Transactions failing
- Verify contract address is correct
- Check Sepolia testnet is selected in MetaMask
- Ensure sufficient SepoliaETH for gas

---

## 🚀 Ready to Deploy!

**Status**: ✅ ALL SYSTEMS GO  
**Build**: ✅ Successful  
**Config**: ✅ Complete  
**Environment**: ✅ Ready  

Run `vercel --prod` in the frontend directory to deploy now!
