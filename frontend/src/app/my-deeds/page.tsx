'use client';

import { useEffect, useState, useCallback } from 'react';
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
  metadataError?: boolean;
}

export default function MyDeedsPage() {
  const { account, provider } = useWeb3();
  const [nfts, setNfts] = useState<UserNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<UserNFT | null>(null);
  const [retryingMetadata, setRetryingMetadata] = useState<number | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [imageGatewayIndex, setImageGatewayIndex] = useState<Record<number, number>>({});

  const handleShareCertificate = (nft: UserNFT) => {
    const shareUrl = `${window.location.origin}/certificate/${nft.tokenId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Certificate link copied to clipboard! 🔗');
  };

  const handleDownloadCertificate = async (nft: UserNFT) => {
    if (!nft.metadata?.image) {
      toast.error('No image available for download');
      return;
    }

    try {
      const imageUrl = getIPFSGatewayUrl(nft.metadata.image);
      toast.loading('Downloading certificate...', { id: 'download' });
      
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ChainDeed-Certificate-${nft.tokenId}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Certificate downloaded! 📥', { id: 'download' });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download certificate', { id: 'download' });
    }
  };

  const retryMetadataForNFT = async (tokenId: number, tokenURI: string) => {
    setRetryingMetadata(tokenId);
    try {
      console.log(`🔄 Retrying metadata fetch for token ${tokenId}...`);
      const metadata = await fetchMetadataFromIPFS(tokenURI);
      
      if (metadata) {
        console.log(`✅ Successfully fetched metadata for token ${tokenId}:`, metadata);
        
        // Update the NFT in the list
        setNfts(prevNfts => 
          prevNfts.map(nft => 
            nft.tokenId === tokenId 
              ? { ...nft, metadata, metadataError: false } 
              : nft
          )
        );
        
        // Update selected NFT if it's the one being retried
        if (selectedNFT?.tokenId === tokenId) {
          setSelectedNFT({ ...selectedNFT, metadata, metadataError: false });
        }
        
        toast.success('Metadata loaded successfully! ✅');
      } else {
        console.error(`❌ Failed to fetch metadata for token ${tokenId}`);
        toast.error('Failed to load metadata. Please try again.');
      }
    } catch (error) {
      console.error(`❌ Error retrying metadata for token ${tokenId}:`, error);
      toast.error('Error loading metadata');
    } finally {
      setRetryingMetadata(null);
    }
  };

  const fetchNFTs = useCallback(async (silent = false) => {
    if (!account || !provider) return;

    if (!silent) setLoading(true);
    
    try {
      console.log('🔍 Fetching NFTs for account:', account);
      const userNFTs = await getUserNFTs(provider, account);
      console.log(`📦 Found ${userNFTs.length} NFTs:`, userNFTs);
      
      if (userNFTs.length === 0) {
        setNfts([]);
        setLastRefresh(new Date());
        return;
      }
      
      // Fetch metadata for each NFT with enhanced retry logic
      const nftsWithMetadata: UserNFT[] = await Promise.all(
        userNFTs.map(async (nft): Promise<UserNFT> => {
          try {
            console.log(`📄 Fetching metadata for token #${nft.tokenId}`);
            console.log(`   Token URI: ${nft.tokenURI}`);
            
            const metadata = await fetchMetadataFromIPFS(nft.tokenURI);
            
            if (!metadata) {
              console.warn(`⚠️ No metadata returned for token ${nft.tokenId}, attempting retry...`);
              
              // Single retry after 1.5 seconds
              await new Promise(resolve => setTimeout(resolve, 1500));
              const retryMetadata = await fetchMetadataFromIPFS(nft.tokenURI);
              
              if (retryMetadata) {
                console.log(`✅ Retry successful for token ${nft.tokenId}`);
                console.log(`   Metadata:`, retryMetadata);
                if (retryMetadata.image) {
                  console.log(`   Image URL: ${getIPFSGatewayUrl(retryMetadata.image)}`);
                }
                return { ...nft, metadata: retryMetadata, metadataError: false };
              } else {
                console.error(`❌ Retry failed for token ${nft.tokenId}`);
                return { ...nft, metadata: undefined, metadataError: true };
              }
            }
            
            console.log(`✅ Successfully fetched metadata for token ${nft.tokenId}`);
            console.log(`   Name: ${metadata.name}`);
            console.log(`   Description: ${metadata.description}`);
            if (metadata.image) {
              console.log(`   Image IPFS: ${metadata.image}`);
              console.log(`   Image Gateway: ${getIPFSGatewayUrl(metadata.image)}`);
            }
            
            return { ...nft, metadata, metadataError: false };
          } catch (error) {
            console.error(`❌ Error fetching metadata for token ${nft.tokenId}:`, error);
            return { ...nft, metadata: undefined, metadataError: true };
          }
        })
      );

      console.log('✨ All NFTs with metadata loaded:', nftsWithMetadata);
      setNfts(nftsWithMetadata);
      setLastRefresh(new Date());
      
      if (!silent) {
        const successCount = nftsWithMetadata.filter(n => n.metadata).length;
        const totalCount = nftsWithMetadata.length;
        if (successCount === totalCount) {
          toast.success(`Loaded ${totalCount} certificate${totalCount > 1 ? 's' : ''} successfully! 🎉`);
        } else {
          toast.success(`Loaded ${successCount}/${totalCount} certificates`);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching NFTs:', error);
      toast.error('Failed to load certificates. Please try again.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [account, provider]);

  useEffect(() => {
    if (account && provider) {
      // Initial fetch
      fetchNFTs();
      
      // Set up event listener for new NFT mints/transfers
      const contract = getChainDeedContract(provider);
      
      const handleTransfer = (from: string, to: string, tokenId: any) => {
        const toAddress = to.toLowerCase();
        const fromAddress = from.toLowerCase();
        const userAddress = account.toLowerCase();
        
        // If a new token is transferred TO this user
        if (toAddress === userAddress) {
          console.log(`🎉 New NFT received! Token #${tokenId}`);
          toast.success('🎉 New certificate received!', { duration: 5000 });
          fetchNFTs(true); // Silent refresh
        }
        
        // If a token is transferred FROM this user
        if (fromAddress === userAddress && toAddress !== userAddress) {
          console.log(`📤 NFT transferred away. Token #${tokenId}`);
          toast('Certificate transferred', { icon: '📤' });
          fetchNFTs(true); // Silent refresh
        }
      };
      
      contract.on('Transfer', handleTransfer);
      
      // Auto-refresh every 60 seconds
      const autoRefreshInterval = setInterval(() => {
        console.log('🔄 Auto-refreshing certificates...');
        fetchNFTs(true); // Silent refresh
      }, 60000); // 60 seconds
      
      return () => {
        contract.off('Transfer', handleTransfer);
        clearInterval(autoRefreshInterval);
      };
    }
  }, [account, provider, fetchNFTs]);

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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Certificates
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            View all your ChainDeed NFT certificates
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Last updated: {lastRefresh.toLocaleTimeString()} • Auto-refresh every 60s
          </p>
        </div>
        <button
          onClick={() => fetchNFTs()}
          disabled={loading}
          className="bg-primary dark:bg-blue-600 hover:bg-primary-dark dark:hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-smooth shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          title="Refresh certificates"
        >
          <svg 
            className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="glass-effect bg-white/90 dark:bg-gray-800/80 rounded-xl shadow-md hover:shadow-xl p-6 mb-8 transition-smooth border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">Your Address</p>
            <p className="text-gray-900 dark:text-gray-100 font-mono text-sm break-all">{account}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">Total Certificates</p>
            {loading ? (
              <p className="text-2xl font-bold text-primary dark:text-blue-400">Loading...</p>
            ) : (
              <p className="text-5xl font-bold text-primary dark:text-blue-400">
                {nfts.length}
              </p>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="glass-effect bg-white/90 dark:bg-gray-800/80 rounded-xl shadow-md p-16 text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary dark:border-blue-400 mx-auto mb-6"></div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Loading your certificates...</p>
          <p className="text-gray-500 dark:text-gray-500">This may take a few moments</p>
        </div>
      ) : nfts.length > 0 ? (
        <div className="glass-effect bg-white/90 dark:bg-gray-800/80 rounded-xl shadow-md hover:shadow-xl p-8 transition-smooth border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🎖️</span>
            <span>Your Certificate Collection</span>
            <span className="text-lg font-normal text-gray-500 dark:text-gray-400">
              ({nfts.length} {nfts.length === 1 ? 'certificate' : 'certificates'})
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => {
              const imageUrl = nft.metadata?.image ? getIPFSGatewayUrl(nft.metadata.image) : null;
              const hasMetadata = !!nft.metadata;
              const hasError = nft.metadataError;
              
              return (
                <div
                  key={nft.tokenId}
                  className="glass-effect bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all hover:scale-[1.02] hover:border-primary dark:hover:border-blue-500"
                >
                  {/* Certificate Image */}
                  <div className="relative h-56 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 overflow-hidden">
                    {imageUrl ? (
                      <>
                        <img
                          src={getIPFSGatewayUrl(nft.metadata!.image, imageGatewayIndex[nft.tokenId] || 0)}
                          alt={nft.metadata?.name || `Certificate #${nft.tokenId}`}
                          className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                          onError={(e) => {
                            const currentGatewayIndex = imageGatewayIndex[nft.tokenId] || 0;
                            console.error(`❌ Gateway ${currentGatewayIndex} failed for token ${nft.tokenId}:`, getIPFSGatewayUrl(nft.metadata!.image, currentGatewayIndex));
                            
                            // Try next gateway (max 3 gateways)
                            if (currentGatewayIndex < 2) {
                              console.log(`🔄 Trying gateway ${currentGatewayIndex + 1} for token ${nft.tokenId}...`);
                              setImageGatewayIndex(prev => ({
                                ...prev,
                                [nft.tokenId]: currentGatewayIndex + 1
                              }));
                              // Force image reload with new gateway
                              (e.target as HTMLImageElement).src = getIPFSGatewayUrl(nft.metadata!.image, currentGatewayIndex + 1);
                            } else {
                              console.error(`❌ All gateways failed for token ${nft.tokenId}`);
                              (e.target as HTMLImageElement).style.display = 'none';
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent) {
                                const fallback = parent.querySelector('.fallback-icon');
                                if (fallback) {
                                  (fallback as HTMLElement).style.display = 'flex';
                                }
                              }
                            }
                          }}
                          onLoad={() => {
                            const gatewayIndex = imageGatewayIndex[nft.tokenId] || 0;
                            const gatewayNames = ['dweb.link', 'Pinata', 'ipfs.io'];
                            console.log(`✅ Successfully loaded image for token ${nft.tokenId} via ${gatewayNames[gatewayIndex]} gateway`);
                          }}
                        />
                        <div className="fallback-icon hidden w-full h-full items-center justify-center flex-col">
                          <div className="text-6xl mb-3">🖼️</div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">All gateways failed</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Reset gateway index and retry
                              setImageGatewayIndex(prev => ({ ...prev, [nft.tokenId]: 0 }));
                              retryMetadataForNFT(nft.tokenId, nft.tokenURI);
                            }}
                            className="mt-3 text-xs bg-primary/80 dark:bg-blue-600/80 text-white px-3 py-1 rounded-full hover:bg-primary"
                          >
                            Retry All
                          </button>
                        </div>
                      </>
                    ) : hasError ? (
                      <div className="w-full h-full flex items-center justify-center flex-col p-4">
                        <div className="text-5xl mb-3">⚠️</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium text-center mb-3">
                          Failed to load metadata
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            retryMetadataForNFT(nft.tokenId, nft.tokenURI);
                          }}
                          disabled={retryingMetadata === nft.tokenId}
                          className="text-xs bg-yellow-500 dark:bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {retryingMetadata === nft.tokenId ? (
                            <>
                              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              <span>Retrying...</span>
                            </>
                          ) : (
                            <>
                              <span>🔄</span>
                              <span>Retry</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center flex-col">
                        <div className="text-6xl mb-3 animate-pulse">📜</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Certificate</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Loading metadata...</p>
                      </div>
                    )}
                    {/* Token ID Badge */}
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      #{nft.tokenId}
                    </div>
                    {/* Status Badge */}
                    {hasMetadata && (
                      <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <span>✓</span>
                        <span>Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Certificate Details */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {nft.metadata?.name || `Certificate #${nft.tokenId}`}
                    </h3>
                    {nft.metadata?.description ? (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 min-h-[2.5rem]">
                        {nft.metadata.description}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 dark:text-gray-500 italic mb-4 min-h-[2.5rem]">
                        {hasError ? 'Metadata unavailable' : 'Loading description...'}
                      </p>
                    )}

                    {/* Attributes Preview */}
                    {nft.metadata?.attributes && nft.metadata.attributes.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {nft.metadata.attributes.slice(0, 2).map((attr, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700"
                          >
                            {attr.trait_type}: {attr.value}
                          </span>
                        ))}
                        {nft.metadata.attributes.length > 2 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                            +{nft.metadata.attributes.length - 2} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedNFT(nft)}
                        className="flex-1 bg-primary dark:bg-blue-600 hover:bg-primary-dark dark:hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors shadow-md hover:shadow-lg"
                      >
                        View Details
                      </button>
                      {imageUrl && (
                        <button
                          onClick={() => handleDownloadCertificate(nft)}
                          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors shadow-md hover:shadow-lg"
                          title="Download Certificate"
                        >
                          ⬇️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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

      {/* Enhanced Detail Modal */}
      {selectedNFT && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedNFT(null)}
        >
          <div
            className="glass-effect bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center z-10 rounded-t-2xl">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <span>🎓</span>
                  <span>Certificate #{selectedNFT.tokenId}</span>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  On-chain verified certificate
                </p>
              </div>
              <button
                onClick={() => setSelectedNFT(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Certificate Image */}
              {selectedNFT.metadata?.image ? (
                <div className="mb-6 rounded-xl overflow-hidden shadow-2xl border-4 border-gray-200 dark:border-gray-700">
                  <img
                    src={getIPFSGatewayUrl(selectedNFT.metadata.image)}
                    alt={selectedNFT.metadata.name || `Certificate #${selectedNFT.tokenId}`}
                    className="w-full h-auto max-h-[500px] object-contain bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
                    onError={(e) => {
                      console.error('❌ Image failed to load in modal');
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                            <div class="text-center">
                              <div class="text-6xl mb-3">🖼️</div>
                              <p class="text-gray-600 dark:text-gray-400 font-medium">Image unavailable</p>
                              <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">The image failed to load from IPFS</p>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              ) : selectedNFT.metadataError ? (
                <div className="mb-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-12 text-center border-2 border-yellow-200 dark:border-yellow-800">
                  <div className="text-7xl mb-4">⚠️</div>
                  <p className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                    Metadata Unavailable
                  </p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-4">
                    The certificate metadata couldn't be loaded from IPFS
                  </p>
                  <button
                    onClick={() => retryMetadataForNFT(selectedNFT.tokenId, selectedNFT.tokenURI)}
                    disabled={retryingMetadata === selectedNFT.tokenId}
                    className="bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                  >
                    {retryingMetadata === selectedNFT.tokenId ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Retrying...</span>
                      </>
                    ) : (
                      <>
                        <span>🔄</span>
                        <span>Retry Loading Metadata</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-16 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <div className="text-7xl mb-4 animate-pulse">📜</div>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Certificate Image</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Loading from IPFS...</p>
                </div>
              )}

              {/* Certificate Info */}
              <div className="space-y-6">
                {/* Title & Description */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    {selectedNFT.metadata?.name || `Certificate #${selectedNFT.tokenId}`}
                  </h3>
                  {selectedNFT.metadata?.description ? (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selectedNFT.metadata.description}
                    </p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-500 italic">
                      {selectedNFT.metadataError ? 'Description not available' : 'Loading description...'}
                    </p>
                  )}
                </div>

                {/* Attributes */}
                {selectedNFT.metadata?.attributes && selectedNFT.metadata.attributes.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg flex items-center gap-2">
                      <span>🏷️</span>
                      <span>Certificate Attributes</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedNFT.metadata.attributes.map((attr, idx) => (
                        <div
                          key={idx}
                          className="glass-effect bg-white dark:bg-gray-900 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-blue-500 transition-colors"
                        >
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                            {attr.trait_type}
                          </p>
                          <p className="font-bold text-gray-900 dark:text-white text-lg">
                            {attr.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Token URI */}
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg flex items-center gap-2">
                    <span>🔗</span>
                    <span>Token Metadata URI</span>
                  </h4>
                  <div className="glass-effect bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <a
                      href={getIPFSGatewayUrl(selectedNFT.tokenURI)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all font-mono flex items-center gap-2"
                    >
                      <span className="flex-1">{selectedNFT.tokenURI}</span>
                      <span className="text-lg">↗️</span>
                    </a>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                  {/* Row 1: Download and Share */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleDownloadCertificate(selectedNFT)}
                      disabled={!selectedNFT.metadata?.image}
                      className="bg-primary dark:bg-blue-600 hover:bg-primary-dark dark:hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <span className="text-xl">⬇️</span>
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => handleShareCertificate(selectedNFT)}
                      className="bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl text-center transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <span className="text-xl">🔗</span>
                      <span>Share Link</span>
                    </button>
                  </div>

                  {/* Row 2: View Raw Metadata */}
                  {selectedNFT.metadata && (
                    <a
                      href={getIPFSGatewayUrl(selectedNFT.tokenURI)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-purple-500 dark:bg-purple-600 hover:bg-purple-600 dark:hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl text-center transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className="text-xl">📄</span>
                        <span>View Raw Metadata JSON</span>
                        <span>↗️</span>
                      </span>
                    </a>
                  )}

                  {/* Row 3: Etherscan */}
                  <a
                    href={`https://sepolia.etherscan.io/token/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}?a=${selectedNFT.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-500 text-white font-bold py-4 px-6 rounded-xl text-center transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-xl">🔍</span>
                      <span>View on Etherscan</span>
                      <span>↗️</span>
                    </span>
                  </a>

                  {/* Retry Button for Failed Metadata */}
                  {selectedNFT.metadataError && (
                    <button
                      onClick={() => retryMetadataForNFT(selectedNFT.tokenId, selectedNFT.tokenURI)}
                      disabled={retryingMetadata === selectedNFT.tokenId}
                      className="w-full bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-xl text-center transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      {retryingMetadata === selectedNFT.tokenId ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span>Retrying...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xl">🔄</span>
                          <span>Retry Loading Metadata</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
