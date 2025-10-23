'use client';

import React from 'react';
import { useWeb3 } from '@/context/Web3Context';

export const WalletConnect: React.FC = () => {
  const { account, isConnecting, error, connectWallet, disconnectWallet } = useWeb3();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="flex flex-col items-end gap-2">
      {error && (
        <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded">
          {error}
        </div>
      )}
      
      {account ? (
        <div className="flex items-center gap-3">
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-mono text-sm">
            {formatAddress(account)}
          </div>
          <button
            onClick={disconnectWallet}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
        </button>
      )}
    </div>
  );
};
