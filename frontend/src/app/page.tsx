'use client';

import Link from 'next/link';
import { useWeb3 } from '@/context/Web3Context';
import { CONTRACT_ADDRESS, NETWORK_NAME } from '@/config/contract';

export default function HomePage() {
  const { account } = useWeb3();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-primary">ChainDeed</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Create, mint, and manage digital certificates as NFTs on the {NETWORK_NAME} blockchain.
          Secure, transparent, and verifiable proof of achievements.
        </p>
        
        {account ? (
          <div className="flex justify-center gap-4">
            <Link
              href="/mint"
              className="bg-primary hover:bg-secondary text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
            >
              Mint Certificate
            </Link>
            <Link
              href="/my-deeds"
              className="bg-white hover:bg-gray-50 text-primary border-2 border-primary font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
            >
              View My Certificates
            </Link>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-yellow-800 font-medium">
              Connect your MetaMask wallet to get started
            </p>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Immutable</h3>
          <p className="text-gray-600">
            Certificates stored on blockchain are tamper-proof and permanently verifiable.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Minting</h3>
          <p className="text-gray-600">
            Deploy certificates in seconds with our streamlined minting process.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Transparent</h3>
          <p className="text-gray-600">
            All transactions are publicly verifiable on the {NETWORK_NAME} blockchain.
          </p>
        </div>
      </div>

      {/* Contract Info */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contract Information</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Network:</span>
            <span className="text-gray-900 font-mono">{NETWORK_NAME}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Contract Address:</span>
            <a
              href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary font-mono text-sm transition-colors"
            >
              {CONTRACT_ADDRESS.substring(0, 10)}...{CONTRACT_ADDRESS.substring(CONTRACT_ADDRESS.length - 8)}
            </a>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Token Standard:</span>
            <span className="text-gray-900 font-mono">ERC-721</span>
          </div>
        </div>
      </div>
    </div>
  );
}
