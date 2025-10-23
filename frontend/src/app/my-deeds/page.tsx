'use client';

import { useEffect, useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { getUserNFTs, getChainDeedContract } from '@/utils/contract';
import { fetchMetadataFromIPFS, getIPFSGatewayUrl } from '@/utils/ipfs';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{ trait_type: string; value: string | number }>;
}

interface UserNFT {
  tokenId: number;
  tokenURI: string;
  metadata?: NFTMetadata;
}

export default function MyDeedsPage() {
  const { account, provider } = useWeb3();
  const [nfts, setNfts] = useState<UserNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<UserNFT | null>(null);

  const handleShareCertificate = (nft: UserNFT) => {
    const shareUrl = `${window.location.origin}/certificate/${nft.tokenId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Certificate link copied to clipboard!');
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const fetchNFTs = async () => {
    if (account && provider) {
      setLoading(true);
      try {
        const userNFTs = await getUserNFTs(provider, account);
        console.log('Fetched NFTs:', userNFTs);
        
        // Fetch metadata for each NFT with retry logic
        const nftsWithMetadata: UserNFT[] = await Promise.all(
          userNFTs.map(async (nft): Promise<UserNFT> => {
            try {
              console.log(`Fetching metadata for token ${nft.tokenId} from:`, nft.tokenURI);
              const metadata = await fetchMetadataFromIPFS(nft.tokenURI);
              
              if (!metadata) {
                console.warn(`No metadata returned for token ${nft.tokenId}, retrying...`);
                // Retry once after 2 seconds
                await new Promise(resolve => setTimeout(resolve, 2000));
                const retryMetadata = await fetchMetadataFromIPFS(nft.tokenURI);
                
                if (retryMetadata) {
                  console.log(`Retry successful for token ${nft.tokenId}:`, retryMetadata);
                  return { ...nft, metadata: retryMetadata };
                } else {
                  console.error(`Retry failed for token ${nft.tokenId}`);
                  return { ...nft, metadata: undefined };
                }
              }
              
              console.log(`Successfully fetched metadata for token ${nft.tokenId}:`, metadata);
              return { ...nft, metadata: metadata || undefined };
            } catch (error) {
              console.error(`Error fetching metadata for token ${nft.tokenId}:`, error);
              return { ...nft, metadata: undefined };
            }
          })
        );

        console.log('NFTs with metadata:', nftsWithMetadata);
        setNfts(nftsWithMetadata);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (account && provider) {
      fetchNFTs();
      
      // Set up event listener for new NFT mints
      const contract = getChainDeedContract(provider);
      
      const handleTransfer = (from: string, to: string, tokenId: any) => {
        // If a new token is transferred to this user, refresh the list
        if (to.toLowerCase() === account.toLowerCase()) {
          toast.success('🎉 New certificate received!');
          fetchNFTs();
        }
      };
      
      contract.on('Transfer', handleTransfer);
      
      // Poll every 20 seconds for updates
      const pollInterval = setInterval(() => {
        fetchNFTs();
      }, 20000);
      
      return () => {
        contract.off('Transfer', handleTransfer);
        clearInterval(pollInterval);
      };
    }
  }, [account, provider]);

  if (!account) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-effect bg-yellow-50/90 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-yellow-900 dark:text-yellow-200 mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-yellow-800 dark:text-yellow-300">
            Please connect your MetaMask wallet to view your ChainDeed certificates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Certificates
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            View all your ChainDeed NFT certificates
          </p>
        </div>
        <button
          onClick={() => fetchNFTs()}
          disabled={loading}
          className="bg-primary dark:bg-blue-600 hover:bg-primary-dark dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-smooth shadow-md disabled:opacity-50 flex items-center gap-2"
          title="Refresh certificates"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="glass-effect bg-white/90 dark:bg-gray-800/80 rounded-xl shadow-md hover:shadow-xl p-8 mb-8 transition-smooth border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">Your Address</p>
            <p className="text-gray-900 dark:text-gray-100 font-mono text-sm break-all">{account}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">Total Certificates</p>
            {loading ? (
              <p className="text-2xl font-bold text-primary dark:text-blue-400">Loading...</p>
            ) : (
              <p className="text-4xl font-bold text-primary dark:text-blue-400">
                {nfts.length}
              </p>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="glass-effect bg-white/90 dark:bg-gray-800/80 rounded-xl shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your certificates...</p>
        </div>
      ) : nfts.length > 0 ? (
        <div className="glass-effect bg-white/90 dark:bg-gray-800/80 rounded-xl shadow-md hover:shadow-xl p-8 transition-smooth border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">🎖️</span>
            Your Certificates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => (
              <div
                key={nft.tokenId}
                className="glass-effect bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:scale-105"
              >
                {/* Certificate Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
                  {nft.metadata?.image ? (
                    <img
                      src={getIPFSGatewayUrl(nft.metadata.image)}
                      alt={nft.metadata.name || `Certificate #${nft.tokenId}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-2">📜</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Certificate</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold">
                    #{nft.tokenId}
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {nft.metadata?.name || `Certificate #${nft.tokenId}`}
                  </h3>
                  {nft.metadata?.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {nft.metadata.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedNFT(nft)}
                      className="flex-1 bg-primary dark:bg-blue-600 hover:bg-primary-dark dark:hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors"
                    >
                      View Details
                    </button>
                    {nft.metadata?.image && (
                      <a
                        href={getIPFSGatewayUrl(nft.metadata.image)}
                        download={`certificate-${nft.tokenId}.png`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors"
                        title="Download Certificate"
                      >
                        ⬇️
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-effect bg-gray-50/90 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4"
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
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Certificates Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have any ChainDeed certificates in your wallet yet.
          </p>
          <Link
            href="/request"
            className="inline-block bg-primary dark:bg-blue-600 hover:bg-primary-dark dark:hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Request Your First Certificate
          </Link>
        </div>
      )}

      {/* Detail Modal */}
      {selectedNFT && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedNFT(null)}
        >
          <div
            className="glass-effect bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Certificate #{selectedNFT.tokenId}
              </h2>
              <button
                onClick={() => setSelectedNFT(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Certificate Image */}
              {selectedNFT.metadata?.image ? (
                <div className="mb-6">
                  <img
                    src={getIPFSGatewayUrl(selectedNFT.metadata.image)}
                    alt={selectedNFT.metadata.name || `Certificate #${selectedNFT.tokenId}`}
                    className="w-full rounded-lg shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%236b7280" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="20"%3EImage not available%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              ) : (
                <div className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-3">📜</div>
                  <p className="text-gray-500 dark:text-gray-400">Certificate Image</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Loading from IPFS...</p>
                </div>
              )}

              {/* Certificate Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedNFT.metadata?.name || `Certificate #${selectedNFT.tokenId}`}
                  </h3>
                  {selectedNFT.metadata?.description ? (
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedNFT.metadata.description}
                    </p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-500 italic">
                      Description not available
                    </p>
                  )}
                </div>

                {/* Attributes */}
                {selectedNFT.metadata?.attributes && selectedNFT.metadata.attributes.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Attributes</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedNFT.metadata.attributes.map((attr, idx) => (
                        <div
                          key={idx}
                          className="glass-effect bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {attr.trait_type}
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {attr.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Token URI */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Token URI</h4>
                  <a
                    href={getIPFSGatewayUrl(selectedNFT.tokenURI)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {selectedNFT.tokenURI}
                  </a>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4">
                  {/* Retry button if metadata is missing */}
                  {!selectedNFT.metadata && (
                    <button
                      onClick={() => {
                        setSelectedNFT(null);
                        fetchNFTs();
                      }}
                      className="w-full bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                    >
                      <span>🔄</span>
                      <span>Retry Loading Metadata</span>
                    </button>
                  )}
                  
                  {/* Row 1: Download and Share */}
                  <div className="flex gap-3">
                    {selectedNFT.metadata?.image ? (
                      <a
                        href={getIPFSGatewayUrl(selectedNFT.metadata.image)}
                        download={`certificate-${selectedNFT.tokenId}.png`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-primary dark:bg-blue-600 hover:bg-primary-dark dark:hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                      >
                        <span>⬇️</span>
                        <span>Download</span>
                      </a>
                    ) : (
                      <a
                        href={getIPFSGatewayUrl(selectedNFT.tokenURI)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                      >
                        <span>📄</span>
                        <span>View Metadata</span>
                      </a>
                    )}
                    <button
                      onClick={() => handleShareCertificate(selectedNFT)}
                      className="flex-1 bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                    >
                      <span>🔗</span>
                      <span>Share Link</span>
                    </button>
                  </div>

                  {/* Row 2: Etherscan */}
                  <a
                    href={`https://sepolia.etherscan.io/token/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}?a=${selectedNFT.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-3 px-6 rounded-lg text-center transition-colors"
                  >
                    View on Etherscan →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
