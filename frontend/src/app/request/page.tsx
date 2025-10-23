'use client';

import { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { uploadNFTToIPFS } from '@/utils/ipfs';
import { submitMintRequest } from '@/utils/contract';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function RequestCertificatePage() {
  const { account, isOwner } = useWeb3();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [certificateType, setCertificateType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!file || !name || !description || !certificateType) {
      toast.error('Please fill all fields and select a file');
      return;
    }

    setIsUploading(true);
    const uploadToast = toast.loading('Uploading to IPFS...');

    try {
      // Step 1: Upload to IPFS
      const ipfsResult = await uploadNFTToIPFS(
        file,
        name,
        description,
        [{ trait_type: 'Type', value: certificateType }]
      );

      if (!ipfsResult.success || !ipfsResult.ipfsUrl) {
        throw new Error(ipfsResult.error || 'IPFS upload failed');
      }

      toast.loading('Submitting request to blockchain...', { id: uploadToast });

      // Step 2: Submit mint request to blockchain
      const requestId = await submitMintRequest(ipfsResult.ipfsUrl, `${certificateType}: ${name}`);

      toast.success(
        `Request submitted successfully! Request ID: ${requestId}`,
        { id: uploadToast, duration: 5000 }
      );

      // Reset form
      setFile(null);
      setName('');
      setDescription('');
      setCertificateType('');
      setPreview(null);
      (document.getElementById('file-input') as HTMLInputElement).value = '';

    } catch (error: any) {
      console.error('Error submitting request:', error);
      toast.error(error.message || 'Failed to submit request', { id: uploadToast });
    } finally {
      setIsUploading(false);
    }
  };

  if (!account) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-effect bg-yellow-50/90 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-8 text-center">
          <p className="text-yellow-800 dark:text-yellow-200 text-lg">
            Please connect your wallet to request a certificate
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Request Certificate
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Upload your document and request a blockchain certificate
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-effect bg-white/90 dark:bg-gray-800/80 rounded-xl shadow-lg hover:shadow-xl p-8 transition-smooth border border-gray-200 dark:border-gray-700">
        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload Document/Image *
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-primary dark:hover:border-primary transition-smooth bg-gray-50 dark:bg-gray-900/50">
            <div className="space-y-1 text-center">
              {preview ? (
                <div className="mb-4">
                  <img src={preview} alt="Preview" className="mx-auto h-32 w-auto rounded shadow-md" />
                </div>
              ) : (
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary hover:text-secondary dark:text-blue-400 dark:hover:text-blue-300">
                  <span>Upload a file</span>
                  <input
                    id="file-input"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.doc,.docx"
                    disabled={isUploading}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                PNG, JPG, PDF, DOC up to 10MB
              </p>
              {file && (
                <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-2">
                  ✓ Selected: {file.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Certificate Type */}
        <div className="mb-6">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Certificate Type *
          </label>
          <select
            id="type"
            value={certificateType}
            onChange={(e) => setCertificateType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-smooth"
            disabled={isUploading}
            required
          >
            <option value="">Select type...</option>
            <option value="Educational Certificate">Educational Certificate</option>
            <option value="Property Deed">Property Deed</option>
            <option value="Achievement Award">Achievement Award</option>
            <option value="License/Permit">License/Permit</option>
            <option value="Legal Document">Legal Document</option>
            <option value="Authenticity Certificate">Authenticity Certificate</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Name */}
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Certificate Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Bachelor's Degree in Computer Science"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-smooth"
            disabled={isUploading}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide details about this certificate..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-smooth"
            disabled={isUploading}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading || !file}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:scale-105 text-white font-semibold py-4 px-6 rounded-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isUploading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Uploading & Submitting...
            </span>
          ) : 'Submit Request'}
        </button>

        <div className="mt-6 text-center">
          <Link href="/my-requests" className="text-primary hover:text-secondary dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-smooth">
            View My Requests →
          </Link>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-8 glass-effect bg-blue-50/90 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
          <span className="text-xl">ℹ️</span>
          How it works
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-300">
          <li>Upload your document (image, PDF, etc.)</li>
          <li>Fill in certificate details</li>
          <li>Your file is uploaded to IPFS (decentralized storage)</li>
          <li>Request is submitted to blockchain</li>
          <li>Owner reviews and approves your request</li>
          <li>NFT certificate is minted to your wallet!</li>
        </ol>
      </div>
    </div>
  );
}
