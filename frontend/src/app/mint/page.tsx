import { MintForm } from '@/components/MintForm';

export default function MintPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Mint New Certificate
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Create a new ChainDeed NFT certificate for a recipient
        </p>
      </div>

      <MintForm />

      <div className="mt-12 max-w-2xl mx-auto">
        <div className="glass-effect bg-blue-50/90 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
            <span className="text-xl">ℹ️</span>
            How to Mint
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-300">
            <li>Connect your MetaMask wallet (must be contract owner)</li>
            <li>Enter the recipient's Ethereum address</li>
            <li>Provide the token URI (IPFS link or metadata URL)</li>
            <li>Click "Mint NFT" and confirm the transaction</li>
            <li>Wait for blockchain confirmation</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
