'use client';

import React, { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { mintNFT, getContractOwner } from '@/utils/contract';
import toast from 'react-hot-toast';

export const MintForm: React.FC = () => {
  const { account, signer, provider } = useWeb3();
  const [recipient, setRecipient] = useState('');
  const [tokenURI, setTokenURI] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  React.useEffect(() => {
    const checkOwner = async () => {
      if (account && provider) {
        try {
          const owner = await getContractOwner(provider);
          setIsOwner(owner.toLowerCase() === account.toLowerCase());
        } catch (error) {
          console.error('Error checking owner:', error);
        }
      }
    };
    checkOwner();
  }, [account, provider]);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signer) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!isOwner) {
      toast.error('Only the contract owner can mint NFTs');
      return;
    }

    if (!recipient || !tokenURI) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsMinting(true);
    const toastId = toast.loading('Minting NFT...');

    try {
      const tx = await mintNFT(signer, recipient, tokenURI);
      toast.loading('Waiting for confirmation...', { id: toastId });
      
      await tx.wait();
      
      toast.success('NFT minted successfully!', { id: toastId });
      setRecipient('');
      setTokenURI('');
    } catch (error: any) {
      console.error('Minting error:', error);
      toast.error(error.message || 'Failed to mint NFT', { id: toastId });
    } finally {
      setIsMinting(false);
    }
  };

  if (!account) {
    return (
      <div className="glass-effect bg-yellow-50/90 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 text-center max-w-2xl mx-auto">
        <p className="text-yellow-800 dark:text-yellow-200">Please connect your wallet to mint NFTs</p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="glass-effect bg-red-50/90 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center max-w-2xl mx-auto">
        <p className="text-red-800 dark:text-red-200">Only the contract owner can mint new ChainDeed certificates</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleMint} className="glass-effect bg-white/90 dark:bg-gray-800/80 rounded-xl shadow-lg hover:shadow-xl p-8 max-w-2xl mx-auto transition-smooth border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
        <span className="text-2xl">🎨</span>
        Mint ChainDeed Certificate
      </h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Recipient Address
          </label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-smooth"
            disabled={isMinting}
          />
        </div>

        <div>
          <label htmlFor="tokenURI" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Token URI (IPFS or metadata URL)
          </label>
          <input
            id="tokenURI"
            type="text"
            value={tokenURI}
            onChange={(e) => setTokenURI(e.target.value)}
            placeholder="ipfs://..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-smooth"
            disabled={isMinting}
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Example: ipfs://bafkreihdwdcefgh4daa797ed6e38ed64bf6a1f0100000000000000008310
          </p>
        </div>

        <button
          type="submit"
          disabled={isMinting}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:scale-105 text-white font-semibold py-4 px-6 rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isMinting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Minting...
            </span>
          ) : 'Mint NFT'}
        </button>
      </div>
    </form>
  );
};
