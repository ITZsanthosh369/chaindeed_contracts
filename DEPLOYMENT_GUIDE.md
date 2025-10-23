# 🚀 ChainDeed - Complete Deployment Guide

## 📊 Project Status Analysis

### ✅ Backend (Smart Contract) - COMPLETED
- **Contract**: ChainDeed NFT (ERC-721)
- **Deployed Address**: `0xc2C9B98c538764F353993906e0F1e9427B49f061`
- **Network**: Sepolia Testnet (Chain ID: 11155111)
- **Features**:
  - ✅ ERC-721 compliant NFT
  - ✅ Owner-only minting
  - ✅ URI storage for metadata
  - ✅ Successfully deployed and verified

### ✅ Frontend - COMPLETED
- **Framework**: Next.js 14 with TypeScript
- **Features**:
  - ✅ MetaMask wallet integration
  - ✅ Automatic network switching to Sepolia
  - ✅ NFT minting interface (owner only)
  - ✅ Certificate viewing dashboard
  - ✅ Responsive design with Tailwind CSS
  - ✅ Real-time transaction feedback

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Navigate to http://localhost:3000

### Step 4: Connect MetaMask
- Click "Connect MetaMask" button
- Approve connection
- Switch to Sepolia network (automatic)

---

## 🌐 Deploy to Vercel (Production)

### Method 1: Quick Deploy (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Navigate to Frontend**
```bash
cd frontend
```

3. **Deploy**
```bash
vercel
```

4. **Follow Prompts**
   - Set up and deploy: Yes
   - Scope: Your account
   - Link to existing project: No
   - Project name: chaindeed-frontend
   - Directory: ./ (current)
   - Override settings: No

5. **Add Environment Variables**
```bash
vercel env add NEXT_PUBLIC_CONTRACT_ADDRESS
# Enter: 0xc2C9B98c538764F353993906e0F1e9427B49f061

vercel env add NEXT_PUBLIC_CHAIN_ID
# Enter: 11155111

vercel env add NEXT_PUBLIC_NETWORK_NAME
# Enter: Sepolia
```

6. **Deploy to Production**
```bash
vercel --prod
```

### Method 2: GitHub + Vercel Dashboard

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Next.js
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Add Environment Variables in Dashboard**
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS = 0xc2C9B98c538764F353993906e0F1e9427B49f061
   NEXT_PUBLIC_CHAIN_ID = 11155111
   NEXT_PUBLIC_NETWORK_NAME = Sepolia
   ```

4. **Click "Deploy"**

---

## 🔧 Configuration Details

### Environment Variables (REQUIRED)

Create `.env.local` in the `frontend` directory:

```env
# Smart Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0xc2C9B98c538764F353993906e0F1e9427B49f061

# Network Configuration  
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=Sepolia
```

### Vercel Configuration

The `vercel.json` file is already configured:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

---

## 🎨 Features Overview

### 1. Home Page (`/`)
- Welcome section with project overview
- Feature highlights
- Contract information display
- Quick access to mint and view certificates

### 2. Mint Page (`/mint`)
- **Owner Only**: Restricted to contract owner
- Form to mint new NFT certificates:
  - Recipient address input
  - Token URI (IPFS link) input
  - Transaction confirmation
  - Success/error notifications

### 3. My Deeds Page (`/my-deeds`)
- Display wallet's certificate balance
- Show all owned certificates
- Future: Display certificate metadata

### 4. Wallet Integration
- MetaMask connection
- Automatic Sepolia network switching
- Account change detection
- Network change handling

---

## 📱 Testing Your Deployment

### Prerequisites
- MetaMask installed in browser
- Some Sepolia testnet ETH (get from faucet)
- Contract owner wallet (for minting)

### Test Workflow

1. **Connect Wallet**
   - Click "Connect MetaMask"
   - Approve connection
   - Verify correct network (Sepolia)

2. **View Home Page**
   - Check contract address display
   - Verify network information
   - Test navigation links

3. **Test Minting** (Owner Only)
   - Navigate to `/mint`
   - Enter recipient address
   - Enter token URI (e.g., `ipfs://QmExample123...`)
   - Click "Mint NFT"
   - Confirm transaction in MetaMask
   - Wait for confirmation
   - Verify success message

4. **View Certificates**
   - Navigate to `/my-deeds`
   - Check balance display
   - Verify owned certificates

---

## 🔒 Security Features

- ✅ Owner-only minting enforced at contract level
- ✅ All transactions require MetaMask confirmation
- ✅ Private keys never exposed
- ✅ Network validation before transactions
- ✅ Error handling for failed transactions

---

## 🐛 Troubleshooting

### MetaMask Won't Connect
- Ensure MetaMask is installed and unlocked
- Check browser console for errors
- Try refreshing the page

### Wrong Network
- App will prompt to switch to Sepolia
- Approve network switch in MetaMask
- If Sepolia not added, app will add it automatically

### Minting Fails
- Ensure you're the contract owner
- Check you have enough Sepolia ETH
- Verify recipient address is valid
- Check token URI format is correct

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

---

## 📊 Project Structure

```
chaindeed_contracts/
├── contracts/              # Solidity smart contracts
│   └── ChainDeed.sol      # Main NFT contract
├── scripts/               # Deployment scripts
│   └── mint-nft.ts        # Minting script
├── ignition/              # Hardhat Ignition deployment
│   └── deployments/       # Deployment artifacts
└── frontend/              # Next.js frontend ⭐
    ├── src/
    │   ├── app/           # Next.js pages
    │   ├── components/    # React components
    │   ├── context/       # Web3 context
    │   ├── config/        # Contract config
    │   └── utils/         # Helper functions
    ├── public/            # Static files
    ├── .env.local         # Environment variables
    ├── package.json       # Dependencies
    └── vercel.json        # Vercel config
```

---

## 🎓 Usage Guide

### For Contract Owner

1. **Deploy Frontend** (see deployment sections above)
2. **Connect Your Owner Wallet**
3. **Mint Certificates**:
   - Go to `/mint`
   - Enter recipient's wallet address
   - Provide metadata URI (IPFS recommended)
   - Confirm transaction
   - Share certificate with recipient

### For Certificate Recipients

1. **Connect MetaMask**
2. **Switch to Sepolia Network**
3. **View Certificates**:
   - Go to `/my-deeds`
   - See your certificate balance
   - View certificate details

### Metadata Format (Token URI)

For full functionality, host metadata on IPFS:

```json
{
  "name": "ChainDeed Certificate #1",
  "description": "Achievement certificate",
  "image": "ipfs://QmImageHash...",
  "attributes": [
    {
      "trait_type": "Recipient",
      "value": "John Doe"
    },
    {
      "trait_type": "Date",
      "value": "2025-10-23"
    }
  ]
}
```

---

## 🚀 Next Steps & Enhancements

### Suggested Improvements

1. **Enhanced NFT Display**
   - Fetch and display metadata
   - Show certificate images
   - Add certificate details modal

2. **Search & Filter**
   - Search certificates by ID
   - Filter by date or attributes
   - Sort options

3. **Batch Minting**
   - Mint multiple certificates at once
   - CSV import for bulk operations

4. **Analytics Dashboard**
   - Total certificates minted
   - Distribution statistics
   - Activity timeline

5. **Mobile App**
   - React Native version
   - WalletConnect integration
   - Push notifications

---

## 📞 Support

- **Contract Explorer**: https://sepolia.etherscan.io/address/0xc2C9B98c538764F353993906e0F1e9427B49f061
- **Sepolia Faucet**: https://sepoliafaucet.com/
- **MetaMask Support**: https://metamask.io/support/

---

## 🎉 Congratulations!

You now have a fully functional NFT certificate platform:
- ✅ Smart contract deployed on Sepolia
- ✅ Frontend ready for Vercel deployment
- ✅ MetaMask integration complete
- ✅ Minting and viewing functionality
- ✅ Production-ready codebase

**Next**: Deploy to Vercel and start minting certificates! 🚀
