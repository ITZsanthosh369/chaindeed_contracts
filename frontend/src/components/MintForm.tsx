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
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">Please connect your wallet to mint NFTs</p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">Only the contract owner can mint new ChainDeed certificates</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleMint} className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Mint ChainDeed Certificate</h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Address
          </label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            disabled={isMinting}
          />
        </div>

        <div>
          <label htmlFor="tokenURI" className="block text-sm font-medium text-gray-700 mb-2">
            Token URI (IPFS or metadata URL)
          </label>
          <input
            id="tokenURI"
            type="text"
            value={tokenURI}
            onChange={(e) => setTokenURI(e.target.value)}
            placeholder="ipfs://..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            disabled={isMinting}
          />
          <p className="mt-2 text-sm text-gray-500">
            Example: ipfs://bafkreihdwdcefgh4daa797ed6e38ed64bf6a1f0100000000000000008310
          </p>
        </div>

        <button
          type="submit"
          disabled={isMinting}
          className="w-full bg-primary hover:bg-secondary text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isMinting ? 'Minting...' : 'Mint NFT'}
        </button>
      </div>
    </form>
  );
};
