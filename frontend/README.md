# ChainDeed Frontend

A modern Next.js frontend for the ChainDeed NFT certificate platform. This application allows users to mint and manage digital certificates as NFTs on the Sepolia blockchain.

## 🚀 Features

- **MetaMask Integration**: Seamless wallet connection with automatic network switching
- **NFT Minting**: Easy-to-use interface for minting ChainDeed certificates
- **Certificate Management**: View all certificates owned by your wallet
- **Responsive Design**: Beautiful UI built with Tailwind CSS
- **Real-time Updates**: Live blockchain interaction feedback

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask browser extension
- Sepolia testnet ETH (for transactions)

## 🛠️ Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your configuration:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xc2C9B98c538764F353993906e0F1e9427B49f061
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=Sepolia
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🚢 Deployment on Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and add environment variables when asked

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Import the repository in [Vercel Dashboard](https://vercel.com)
3. Set the root directory to `frontend`
4. Add environment variables:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_CHAIN_ID`
   - `NEXT_PUBLIC_NETWORK_NAME`
5. Click "Deploy"

### Environment Variables

Make sure to set these in your Vercel project settings:

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `0xc2C9B98c538764F353993906e0F1e9427B49f061` | ChainDeed contract address on Sepolia |
| `NEXT_PUBLIC_CHAIN_ID` | `11155111` | Sepolia testnet chain ID |
| `NEXT_PUBLIC_NETWORK_NAME` | `Sepolia` | Network display name |

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout with providers
│   │   ├── page.tsx         # Home page
│   │   ├── mint/            # Mint page
│   │   └── my-deeds/        # My Certificates page
│   ├── components/          # React components
│   │   ├── Navbar.tsx
│   │   ├── WalletConnect.tsx
│   │   └── MintForm.tsx
│   ├── context/             # React contexts
│   │   └── Web3Context.tsx  # Web3 provider
│   ├── config/              # Configuration files
│   │   ├── contract.ts
│   │   └── abi.ts
│   ├── utils/               # Utility functions
│   │   └── contract.ts
│   └── types/               # TypeScript types
└── public/                  # Static assets
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: ethers.js v6
- **Notifications**: react-hot-toast
- **Deployment**: Vercel

## 🔗 Smart Contract

- **Contract Address**: `0xc2C9B98c538764F353993906e0F1e9427B49f061`
- **Network**: Sepolia Testnet
- **Token Standard**: ERC-721
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0xc2C9B98c538764F353993906e0F1e9427B49f061)

## 🎯 Usage

### Connecting Wallet

1. Click "Connect MetaMask" in the navbar
2. Approve the connection in MetaMask
3. The app will automatically switch to Sepolia if needed

### Minting Certificates

1. Navigate to the "Mint" page
2. Must be the contract owner to mint
3. Enter recipient address
4. Provide token URI (IPFS link or metadata URL)
5. Confirm transaction in MetaMask

### Viewing Certificates

1. Navigate to "My Deeds"
2. View your certificate balance
3. See all certificates owned by your wallet

## 🛡️ Security

- All transactions require user confirmation
- Private keys never leave your browser
- Contract ownership is verified before minting
- Network validation ensures correct chain

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.
