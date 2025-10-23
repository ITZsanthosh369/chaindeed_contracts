'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { getPendingRequests, approveMintRequest, rejectMintRequest, type MintRequest } from '@/utils/contract';
import { getIPFSGatewayUrl, fetchMetadataFromIPFS } from '@/utils/ipfs';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '@/config/contract';
import { CHAINDEED_ABI } from '@/config/abi';

export default function AdminDashboardPage() {
  const { account, signer, provider, isOwner } = useWeb3();
  const [requests, setRequests] = useState<MintRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<MintRequest | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Load pending requests on mount
  useEffect(() => {
    if (isOwner && provider) {
      loadPendingRequests();
    }
  }, [isOwner, provider]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!isOwner || !provider) return;

    const interval = setInterval(() => {
      loadPendingRequests(true); // Silent refresh (no loading state)
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isOwner, provider]);

  // Listen for new request events
  useEffect(() => {
    if (!provider || !isOwner) return;

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CHAINDEED_ABI, provider);

    // Listen for MintRequestSubmitted events
    const handleNewRequest = (requestId: bigint, requester: string) => {
      console.log('New request detected:', requestId.toString(), 'from', requester);
      loadPendingRequests(true); // Silent refresh
      toast.success(`New request #${requestId.toString()} received!`, { duration: 4000 });
    };

    contract.on('MintRequestSubmitted', handleNewRequest);

    return () => {
      contract.off('MintRequestSubmitted', handleNewRequest);
    };
  }, [provider, isOwner]);

  const loadPendingRequests = async (silent = false) => {
    if (!provider) return;

    try {
      if (!silent) setLoading(true);
      const pending = await getPendingRequests(provider);
      setRequests(pending);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading requests:', error);
      if (!silent) toast.error('Failed to load pending requests');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleViewDetails = async (request: MintRequest) => {
    setSelectedRequest(request);
    setMetadata(null);

    try {
      const meta = await fetchMetadataFromIPFS(request.tokenURI);
      setMetadata(meta);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  const handleApprove = async (requestId: bigint) => {
    if (!signer) return;

    setProcessing(requestId.toString());
    const toastId = toast.loading('Approving request...');

    try {
      const tx = await approveMintRequest(signer, requestId);
      toast.loading('Waiting for confirmation...', { id: toastId });
      await tx.wait();

      toast.success('Request approved! NFT minted successfully', { id: toastId });
      
      // Reload requests
      await loadPendingRequests();
      setSelectedRequest(null);
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast.error(error.message || 'Failed to approve request', { id: toastId });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (requestId: bigint) => {
    if (!signer || !rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setProcessing(requestId.toString());
    const toastId = toast.loading('Rejecting request...');

    try {
      const tx = await rejectMintRequest(signer, requestId, rejectReason);
      toast.loading('Waiting for confirmation...', { id: toastId });
      await tx.wait();

      toast.success('Request rejected', { id: toastId });
      
      // Reload requests
      await loadPendingRequests();
      setSelectedRequest(null);
      setRejectReason('');
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast.error(error.message || 'Failed to reject request', { id: toastId });
    } finally {
      setProcessing(null);
    }
  };

  if (!account) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-effect bg-yellow-50/90 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-8 text-center">
          <p className="text-yellow-800 dark:text-yellow-200 text-lg">
            Please connect your wallet
          </p>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-effect bg-red-50/90 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-900 dark:text-red-200 mb-4">Access Denied</h2>
          <p className="text-red-800 dark:text-red-300">
            Only the contract owner can access the admin dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="text-3xl">⭐</span>
            Admin Dashboard
          </h1>
          <button
            onClick={() => loadPendingRequests()}
            disabled={loading}
            className="flex items-center gap-2 bg-primary hover:bg-secondary dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-smooth shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg 
              className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Review and approve certificate requests
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastRefresh.toLocaleTimeString()} • Auto-refresh: 30s
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="glass-effect bg-white/90 dark:bg-gray-800/80 rounded-xl shadow-md hover:shadow-xl p-6 transition-smooth border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">Pending Requests</p>
          <p className="text-4xl font-bold text-primary dark:text-blue-400">{requests.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="glass-effect bg-gray-50/90 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Pending Requests
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            All requests have been processed
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Requests List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Pending Requests
            </h2>
            {requests.map((request) => (
              <div
                key={request.requestId.toString()}
                className={`glass-effect bg-white/90 dark:bg-gray-800/80 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-smooth border ${
                  selectedRequest?.requestId === request.requestId 
                    ? 'ring-2 ring-primary border-primary dark:border-blue-400' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => handleViewDetails(request)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Request #{request.requestId.toString()}
                  </h3>
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium border border-yellow-300 dark:border-yellow-700">
                    Pending
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">{request.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  From: {request.requester.substring(0, 10)}...{request.requester.substring(38)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  📅 {new Date(Number(request.timestamp) * 1000).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Request Details */}
          <div className="sticky top-4">
            {selectedRequest ? (
              <div className="glass-effect bg-white/90 dark:bg-gray-800/80 rounded-xl shadow-lg hover:shadow-xl p-6 transition-smooth border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Request Details
                </h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Request ID</p>
                    <p className="text-lg font-mono text-gray-900 dark:text-gray-100">{selectedRequest.requestId.toString()}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Description</p>
                    <p className="text-gray-900 dark:text-gray-200">{selectedRequest.description}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Requester Address</p>
                    <p className="text-gray-900 dark:text-gray-100 font-mono text-sm break-all">
                      {selectedRequest.requester}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Token URI</p>
                    <a
                      href={getIPFSGatewayUrl(selectedRequest.tokenURI)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-secondary dark:text-blue-400 dark:hover:text-blue-300 font-mono text-sm break-all hover:underline"
                    >
                      {selectedRequest.tokenURI}
                    </a>
                  </div>

                  {/* Metadata Preview */}
                  {metadata && (
                    <div className="border-t dark:border-gray-700 pt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">Metadata Preview</p>
                      {metadata.image && (
                        <img
                          src={getIPFSGatewayUrl(metadata.image)}
                          alt={metadata.name}
                          className="w-full rounded-lg mb-3 border border-gray-200 dark:border-gray-700 shadow-md"
                        />
                      )}
                      <p className="font-semibold text-gray-900 dark:text-white">{metadata.name}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{metadata.description}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleApprove(selectedRequest.requestId)}
                    disabled={processing !== null}
                    className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:scale-105"
                  >
                    {processing === selectedRequest.requestId.toString() ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : '✅ Approve & Mint'}
                  </button>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Reason for rejection..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-smooth"
                    />
                    <button
                      onClick={() => handleReject(selectedRequest.requestId)}
                      disabled={processing !== null || !rejectReason.trim()}
                      className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:scale-105"
                    >
                      {processing === selectedRequest.requestId.toString() ? 'Processing...' : '❌ Reject'}
                    </button>
                  </div>

                  <a
                    href={getIPFSGatewayUrl(selectedRequest.tokenURI)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-smooth shadow-md hover:scale-105"
                  >
                    View Full Details on IPFS →
                  </a>
                </div>
              </div>
            ) : (
              <div className="glass-effect bg-gray-50/90 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
                <div className="text-5xl mb-4">👈</div>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a request to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
