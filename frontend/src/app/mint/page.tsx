import { MintForm } from '@/components/MintForm';

export default function MintPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Mint New Certificate
        </h1>
        <p className="text-gray-600 text-lg">
          Create a new ChainDeed NFT certificate for a recipient
        </p>
      </div>

      <MintForm />

      <div className="mt-12 max-w-2xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Mint</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
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
