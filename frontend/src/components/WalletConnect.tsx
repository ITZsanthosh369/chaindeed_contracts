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
        <div className="text-xs sm:text-sm text-red-500 bg-red-50 dark:bg-red-900/30 px-2 sm:px-3 py-1 sm:py-2 rounded">
          {error}
        </div>
      )}
      
      {account ? (
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 sm:px-4 py-2 rounded-lg font-mono text-xs sm:text-sm border border-green-300 dark:border-green-700">
            {formatAddress(account)}
          </div>
          <button
            onClick={disconnectWallet}
            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium"
          >
            <span className="hidden sm:inline">Disconnect</span>
            <span className="sm:hidden">✕</span>
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-primary hover:bg-secondary dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          <span className="hidden sm:inline">{isConnecting ? 'Connecting...' : 'Connect MetaMask'}</span>
          <span className="sm:hidden">{isConnecting ? 'Connecting...' : 'Connect'}</span>
        </button>
      )}
    </div>
  );
};
