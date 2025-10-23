'use client';

import Link from 'next/link';
import { useWeb3 } from '@/context/Web3Context';
import { CONTRACT_ADDRESS, NETWORK_NAME } from '@/config/contract';
import { useState, useEffect } from 'react';
import { getPendingRequests, getUserRequests, type MintRequest } from '@/utils/contract';
import { getTokenBalance } from '@/utils/contract';

export default function HomePage() {
  const { account, provider, isOwner } = useWeb3();
  const [pendingCount, setPendingCount] = useState(0);
  const [userRequestsCount, setUserRequestsCount] = useState(0);
  const [nftBalance, setNftBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account && provider) {
      loadDashboardData();
    }
  }, [account, provider, isOwner]);

  const loadDashboardData = async () => {
    if (!account || !provider) return;

    try {
      setLoading(true);
      
      if (isOwner) {
        // Load admin data
        const pending = await getPendingRequests(provider);
        setPendingCount(pending.length);
      } else {
        // Load user data
        const requests = await getUserRequests(provider, account);
        setUserRequestsCount(requests.length);
      }

      // Load NFT balance for both
      const balance = await getTokenBalance(provider, account);
      setNftBalance(Number(balance));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Admin Dashboard
  if (account && isOwner) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Welcome back, Contract Owner
          </p>
        </div>

        {/* Admin Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700 rounded-xl shadow-md p-6 hover:shadow-lg transition-smooth">
            <p className="text-yellow-800 dark:text-yellow-300 font-medium mb-1">Pending Requests</p>
            <p className="text-4xl font-bold text-yellow-900 dark:text-yellow-100">{loading ? '...' : pendingCount}</p>
            <Link href="/admin" className="inline-block mt-3 text-yellow-700 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-200 font-semibold text-sm transition-smooth">
              Review Now →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-xl shadow-md p-6 hover:shadow-lg transition-smooth">
            <p className="text-green-800 dark:text-green-300 font-medium mb-1">My NFTs</p>
            <p className="text-4xl font-bold text-green-900 dark:text-green-100">{loading ? '...' : nftBalance}</p>
            <Link href="/my-deeds" className="inline-block mt-3 text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 font-semibold text-sm transition-smooth">
              View All →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-xl shadow-md p-6 hover:shadow-lg transition-smooth">
            <p className="text-blue-800 dark:text-blue-300 font-medium mb-1">Contract Address</p>
            <p className="text-sm font-mono text-blue-900 dark:text-blue-100 break-all">{CONTRACT_ADDRESS.substring(0, 20)}...</p>
            <a 
              href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 font-semibold text-sm transition-smooth"
            >
              View on Etherscan →
            </a>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/admin"
              className="flex items-center justify-between bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-4 rounded-lg transition-smooth hover:scale-105 hover:shadow-xl"
            >
              <span>⭐ Review Pending Requests</span>
              <span className="bg-white text-primary px-3 py-1 rounded-full text-sm">{pendingCount}</span>
            </Link>
            <Link
              href="/mint"
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold px-6 py-4 rounded-lg transition-smooth text-center hover:scale-105"
            >
              🎨 Direct Mint (Legacy)
            </Link>
          </div>
        </div>

        {/* Contract Info */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contract Information</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Network:</span>
              <span className="text-gray-900 dark:text-white font-mono">{NETWORK_NAME}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Your Role:</span>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-semibold">Contract Owner</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Token Standard:</span>
              <span className="text-gray-900 dark:text-white font-mono">ERC-721</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User Dashboard
  if (account && !isOwner) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to ChainDeed
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Request and manage your blockchain certificates
          </p>
        </div>

        {/* User Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 rounded-xl shadow-md p-6 hover:shadow-lg transition-smooth">
            <p className="text-purple-800 dark:text-purple-300 font-medium mb-1">My Requests</p>
            <p className="text-4xl font-bold text-purple-900 dark:text-purple-100">{loading ? '...' : userRequestsCount}</p>
            <Link href="/my-requests" className="inline-block mt-3 text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-200 font-semibold text-sm transition-smooth">
              View All →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-xl shadow-md p-6 hover:shadow-lg transition-smooth">
            <p className="text-green-800 dark:text-green-300 font-medium mb-1">My Certificates</p>
            <p className="text-4xl font-bold text-green-900 dark:text-green-100">{loading ? '...' : nftBalance}</p>
            <Link href="/my-deeds" className="inline-block mt-3 text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 font-semibold text-sm transition-smooth">
              View All →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get Started</h2>
          <Link
            href="/request"
            className="block bg-gradient-to-r from-primary to-secondary text-white font-semibold px-8 py-6 rounded-lg transition-smooth text-center text-xl hover:scale-105 hover:shadow-xl"
          >
            📄 Request New Certificate
          </Link>
          <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
            Upload your document and submit a request for blockchain verification
          </p>
        </div>

        {/* How It Works */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:scale-105 transition-smooth">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Upload Document</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Upload your certificate, diploma, or document to IPFS storage</p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:scale-105 transition-smooth">
            <div className="w-12 h-12 bg-gradient-to-r from-secondary to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Submit Request</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Owner reviews your request and approves or rejects it</p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:scale-105 transition-smooth">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Get NFT</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Once approved, NFT certificate is minted to your wallet</p>
          </div>
        </div>
      </div>
    );
  }

  // Not Connected - Landing Page
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
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-yellow-800 font-medium">
            Connect your MetaMask wallet to get started →
          </p>
        </div>
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Processing</h3>
          <p className="text-gray-600">
            Submit requests and get approved certificates minted to your wallet quickly.
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
