'use client';

import { useEffect, useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { getTokenBalance } from '@/utils/contract';

export default function MyDeedsPage() {
  const { account, provider } = useWeb3();
  const [balance, setBalance] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (account && provider) {
        setLoading(true);
        try {
          const bal = await getTokenBalance(provider, account);
          setBalance(bal);
        } catch (error) {
          console.error('Error fetching balance:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBalance();
  }, [account, provider]);

  if (!account) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-yellow-900 mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-yellow-800">
            Please connect your MetaMask wallet to view your ChainDeed certificates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          My Certificates
        </h1>
        <p className="text-gray-600 text-lg">
          View all your ChainDeed NFT certificates
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 font-medium mb-1">Your Address</p>
            <p className="text-gray-900 font-mono text-sm">{account}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600 font-medium mb-1">Total Certificates</p>
            {loading ? (
              <p className="text-2xl font-bold text-primary">Loading...</p>
            ) : (
              <p className="text-4xl font-bold text-primary">
                {balance !== null ? balance.toString() : '0'}
              </p>
            )}
          </div>
        </div>
      </div>

      {balance !== null && balance > 0n ? (
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Certificates</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for NFT cards - you can expand this to fetch actual token data */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">
                Certificate display coming soon...
              </p>
              <p className="text-sm text-gray-400 mt-2">
                You have {balance.toString()} certificate(s)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Certificates Yet
          </h3>
          <p className="text-gray-600 mb-6">
            You don't have any ChainDeed certificates in your wallet yet.
          </p>
        </div>
      )}
    </div>
  );
}
