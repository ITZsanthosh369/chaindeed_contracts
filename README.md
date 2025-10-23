# ChainDeed Project - Main README

## 🎯 Project Overview

**ChainDeed** is a blockchain-based NFT certificate platform that allows you to mint, manage, and verify digital certificates as NFTs on the Ethereum Sepolia testnet.

### What's Included

✅ **Smart Contract** (Solidity)
- ERC-721 NFT contract
- Owner-only minting
- Deployed on Sepolia: `0xc2C9B98c538764F353993906e0F1e9427B49f061`

✅ **Frontend Application** (Next.js + TypeScript)
- Modern React interface
- MetaMask integration
- Minting and viewing functionality
- Ready for Vercel deployment

---

## 🚀 Quick Start

### Option 1: Run Frontend Locally (Recommended First)

**Windows PowerShell:**
```powershell
.\start-frontend.ps1
```

**Or manually:**
```bash
cd frontend
npm install
npm run dev
```

Then open: http://localhost:3000

### Option 2: Deploy to Production

See `DEPLOYMENT_GUIDE.md` for complete instructions.

**Quick Deploy with Vercel CLI:**
```bash
cd frontend
npm install -g vercel
vercel
```

---

## 📁 Project Structure

```
chaindeed_contracts/
├── contracts/              # Smart contracts
│   └── ChainDeed.sol      # Main NFT contract
├── scripts/               # Hardhat scripts  
│   └── mint-nft.ts        # Minting script
├── ignition/              # Deployment configs
├── test/                  # Contract tests
├── frontend/              # ⭐ Next.js frontend
│   ├── src/
│   │   ├── app/           # Pages
│   │   ├── components/    # React components
│   │   ├── context/       # Web3 provider
│   │   └── config/        # Contract config
│   ├── package.json
│   └── README.md          # Frontend docs
├── hardhat.config.ts      # Hardhat config
├── package.json           # Backend deps
├── DEPLOYMENT_GUIDE.md    # 📖 Deployment instructions
└── start-frontend.ps1     # Quick start script
```

---

## 📖 Documentation

| File | Description |
|------|-------------|
| `frontend/README.md` | Complete frontend documentation |
| `DEPLOYMENT_GUIDE.md` | Step-by-step deployment guide |
| `frontend/PROJECT_SUMMARY.md` | Technical overview |

---

## 🔗 Important Links

- **Contract Address**: `0xc2C9B98c538764F353993906e0F1e9427B49f061`
- **Network**: Sepolia Testnet (Chain ID: 11155111)
- **Etherscan**: https://sepolia.etherscan.io/address/0xc2C9B98c538764F353993906e0F1e9427B49f061
- **Sepolia Faucet**: https://sepoliafaucet.com/

---

## 🎯 Features

### Smart Contract
- ✅ ERC-721 compliant NFT
- ✅ Owner-only minting
- ✅ Token URI storage
- ✅ Deployed and verified on Sepolia

### Frontend
- ✅ MetaMask wallet integration
- ✅ Automatic network switching
- ✅ NFT minting interface (owner only)
- ✅ Certificate viewing dashboard
- ✅ Responsive design
- ✅ Real-time notifications
- ✅ Vercel deployment ready

---

## 🛠️ Tech Stack

**Backend:**
- Solidity ^0.8.20
- Hardhat
- OpenZeppelin Contracts
- Ethers.js

**Frontend:**
- Next.js 14
- TypeScript
- Tailwind CSS
- Ethers.js v6
- React Hot Toast

---

## 🎓 Usage

### For Contract Owner

1. **Start Frontend**: Run `.\start-frontend.ps1`
2. **Connect Wallet**: Click "Connect MetaMask"
3. **Mint Certificate**:
   - Navigate to `/mint`
   - Enter recipient address
   - Provide token URI (IPFS link)
   - Confirm transaction
4. **View Results**: Check on Etherscan

### For Certificate Recipients

1. **Connect Wallet**: Connect MetaMask to Sepolia
2. **View Certificates**: Go to `/my-deeds`
3. **See Balance**: View owned certificates

---

## 🚀 Deployment

### Local Development
```bash
cd frontend
npm install
npm run dev
```

### Production (Vercel)
```bash
cd frontend
vercel
```

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## 🔒 Security

- ✅ Owner-only minting enforced at contract level
- ✅ All transactions require MetaMask confirmation
- ✅ Network validation (Sepolia only)
- ✅ No private key exposure
- ✅ Error handling throughout

---

## 📝 Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xc2C9B98c538764F353993906e0F1e9427B49f061
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=Sepolia
```

---

## 🐛 Troubleshooting

### Frontend Won't Start
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules, .next
npm install
npm run dev
```

### MetaMask Issues
- Ensure MetaMask is installed and unlocked
- Check you're on Sepolia network
- Try refreshing the page

### Need Sepolia ETH
- Use Sepolia faucet: https://sepoliafaucet.com/
- Alternative faucet: https://sepolia-faucet.pk910.de/

---

## 🎉 Next Steps

1. ✅ **Test Locally**: Run frontend and test all features
2. ✅ **Deploy to Vercel**: Follow deployment guide
3. ✅ **Mint Certificates**: Start creating NFT certificates
4. ✅ **Share**: Share your app URL with users

---

## 📞 Support

- Review documentation in `frontend/README.md`
- Check `DEPLOYMENT_GUIDE.md` for deployment help
- View contract on Etherscan for transaction details

---

## 🎊 Congratulations!

You have a complete NFT certificate platform:
- Smart contract deployed ✅
- Frontend application ready ✅
- MetaMask integration ✅
- Deployment configured ✅

**Ready to mint your first certificate!** 🚀

---

Built with ❤️ using Hardhat, Next.js, and Ethereum
