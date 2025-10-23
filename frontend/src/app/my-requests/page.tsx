'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { getUserRequests, getRequest, type MintRequest, getChainDeedContract } from '@/utils/contract';
import { getIPFSGatewayUrl } from '@/utils/ipfs';
import Link from 'next/link';
import { SuccessConfetti } from '@/components/SuccessConfetti';
import toast from 'react-hot-toast';

export default function MyRequestsPage() {
  const { account, provider } = useWeb3();
  const [requests, setRequests] = useState<MintRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (account && provider) {
      loadRequests();
      
      // Set up event listeners for real-time updates
      const contract = getChainDeedContract(provider);
      
      const handleApproval = (requestId: any, requester: string) => {
        if (requester.toLowerCase() === account.toLowerCase()) {
          toast.success('🎉 Your certificate request has been approved!');
          setShowConfetti(true);
          loadRequests();
        }
      };
      
      const handleRejection = (requestId: any, requester: string) => {
        if (requester.toLowerCase() === account.toLowerCase()) {
          toast.error('Your certificate request was rejected');
          loadRequests();
        }
      };
      
      contract.on('MintRequestApproved', handleApproval);
      contract.on('MintRequestRejected', handleRejection);
      
      // Poll every 15 seconds for updates
      const pollInterval = setInterval(() => {
        loadRequests();
      }, 15000);
      
      return () => {
        contract.off('MintRequestApproved', handleApproval);
        contract.off('MintRequestRejected', handleRejection);
        clearInterval(pollInterval);
      };
    }
  }, [account, provider]);

  const loadRequests = async () => {
    if (!account || !provider) return;

    try {
      setLoading(true);
      const requestIds = await getUserRequests(provider, account);
      
      const requestDetails = await Promise.all(
        requestIds.map(id => getRequest(provider, id))
      );

      // Sort by timestamp (newest first)
      requestDetails.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
      
      setRequests(requestDetails);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-semibold flex items-center gap-1 border border-yellow-300 dark:border-yellow-700">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            Pending Review
          </span>
        );
      case 1:
        return (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold flex items-center gap-1 border border-green-300 dark:border-green-700">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Approved
          </span>
        );
      case 2:
        return (
          <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full text-sm font-semibold flex items-center gap-1 border border-red-300 dark:border-red-700">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusTimeline = (status: number) => {
    return (
      <div className="flex items-center gap-2 mt-4">
        {/* Step 1: Submitted */}
        <div className="flex flex-col items-center flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            status >= 0 ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}>
            1
          </div>
          <p className="text-xs mt-1 text-gray-600 dark:text-gray-400 font-medium">Submitted</p>
        </div>

        {/* Connector */}
        <div className={`flex-1 h-1 transition-all ${status >= 1 ? 'bg-primary shadow-md' : 'bg-gray-200 dark:bg-gray-700'}`}></div>

        {/* Step 2: Under Review */}
        <div className="flex flex-col items-center flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            status === 0 ? 'bg-yellow-500 text-white animate-pulse shadow-lg shadow-yellow-500/50' : 
            status >= 1 ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}>
            2
          </div>
          <p className="text-xs mt-1 text-gray-600 dark:text-gray-400 font-medium">Under Review</p>
        </div>

        {/* Connector */}
        <div className={`flex-1 h-1 transition-all ${
          status === 1 ? 'bg-green-500 shadow-md shadow-green-500/50' : 
          status === 2 ? 'bg-red-500 shadow-md shadow-red-500/50' : 
          'bg-gray-200 dark:bg-gray-700'
        }`}></div>

        {/* Step 3: Result */}
        <div className="flex flex-col items-center flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            status === 1 ? 'bg-green-500 text-white shadow-lg shadow-green-500/50 animate-pulse' : 
            status === 2 ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 animate-pulse' : 
            'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}>
            {status === 1 ? '✓' : status === 2 ? '✕' : '3'}
          </div>
          <p className={`text-xs mt-1 font-medium transition-all ${
            status === 1 ? 'text-green-600 dark:text-green-400 font-bold' :
            status === 2 ? 'text-red-600 dark:text-red-400 font-bold' :
            'text-gray-600 dark:text-gray-400'
          }`}>
            {status === 1 ? 'Minted ✓' : status === 2 ? 'Rejected' : 'Result'}
          </p>
        </div>
      </div>
    );
  };

  if (!account) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-effect bg-yellow-50/90 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-8 text-center">
          <p className="text-yellow-800 dark:text-yellow-200 text-lg">
            Please connect your wallet to view your requests
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SuccessConfetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">My Requests</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Track the status of your certificate requests
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => loadRequests()}
              disabled={loading}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-semibold transition-smooth shadow-md disabled:opacity-50 flex items-center gap-2"
              title="Refresh requests"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <Link
              href="/request"
              className="bg-gradient-to-r from-primary to-secondary hover:scale-105 text-white px-6 py-3 rounded-lg font-semibold transition-smooth shadow-lg"
            >
              + New Request
            </Link>
          </div>
        </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
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
            No Requests Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't submitted any certificate requests yet
          </p>
          <Link
            href="/request"
            className="inline-block bg-gradient-to-r from-primary to-secondary hover:scale-105 text-white px-6 py-3 rounded-lg font-semibold transition-smooth shadow-lg"
          >
            Submit Your First Request
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.requestId.toString()}
              className="glass-effect bg-white/90 dark:bg-gray-800/80 rounded-xl shadow-md hover:shadow-xl p-6 transition-smooth border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Request #{request.requestId.toString()}
                    </h3>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{request.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    📅 Submitted: {new Date(Number(request.timestamp) * 1000).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
                {getStatusTimeline(request.status)}
              </div>

              <div className="border-t dark:border-gray-700 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">📎 Certificate URI:</p>
                    <a
                      href={getIPFSGatewayUrl(request.tokenURI)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-secondary dark:text-blue-400 dark:hover:text-blue-300 font-mono text-sm break-all hover:underline"
                    >
                      {request.tokenURI.substring(0, 50)}...
                    </a>
                  </div>
                  {request.status === 1 && (
                    <a
                      href={getIPFSGatewayUrl(request.tokenURI)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 bg-gradient-to-r from-primary to-secondary hover:scale-105 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-smooth shadow-md"
                    >
                      View Certificate →
                    </a>
                  )}
                </div>
              </div>

              {request.status === 1 && (
                <div className="mt-4 glass-effect bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4">
                  <p className="text-green-800 dark:text-green-200 font-semibold flex items-center gap-2">
                    <span className="text-2xl">🎉</span>
                    Congratulations! Your certificate has been minted to your wallet!
                  </p>
                  <Link
                    href="/my-deeds"
                    className="inline-block mt-3 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-smooth shadow-md hover:scale-105"
                  >
                    View My Certificates →
                  </Link>
                </div>
              )}

              {request.status === 2 && (
                <div className="mt-4 glass-effect bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-200 font-semibold">
                    ⚠️ This request was rejected by the administrator.
                  </p>
                  <Link
                    href="/request"
                    className="inline-block mt-3 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-smooth shadow-md hover:scale-105"
                  >
                    Submit New Request →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
