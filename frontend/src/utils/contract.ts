import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '@/config/contract';
import { CHAINDEED_ABI } from '@/config/abi';

export interface MintRequest {
  requestId: bigint;
  requester: string;
  tokenURI: string;
  description: string;
  timestamp: bigint;
  status: number; // 0: Pending, 1: Approved, 2: Rejected
}

export const getChainDeedContract = (signerOrProvider: ethers.Signer | ethers.Provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CHAINDEED_ABI, signerOrProvider);
};

// Submit a mint request (users call this)
export const submitMintRequest = async (
  tokenURI: string,
  description: string
): Promise<bigint> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = getChainDeedContract(signer);

  const tx = await contract.requestMint(tokenURI, description);
  const receipt = await tx.wait();

  // Extract request ID from event
  const event = receipt?.logs.find((log: any) => {
    try {
      const parsed = contract.interface.parseLog(log);
      return parsed?.name === 'MintRequestSubmitted';
    } catch {
      return false;
    }
  });

  if (event) {
    const parsed = contract.interface.parseLog(event);
    return parsed?.args[0]; // requestId
  }

  throw new Error('Request ID not found in transaction');
};

// Get all requests for a user
export const getUserRequests = async (
  provider: ethers.Provider,
  userAddress: string
): Promise<bigint[]> => {
  const contract = getChainDeedContract(provider);
  return await contract.getUserRequests(userAddress);
};

// Get request details
export const getRequest = async (
  provider: ethers.Provider,
  requestId: bigint
): Promise<MintRequest> => {
  const contract = getChainDeedContract(provider);
  return await contract.getRequest(requestId);
};

// Get all pending requests (owner only)
export const getPendingRequests = async (
  provider: ethers.Provider
): Promise<MintRequest[]> => {
  const contract = getChainDeedContract(provider);
  return await contract.getPendingRequests();
};

// Approve a request (owner only)
export const approveMintRequest = async (
  signer: ethers.Signer,
  requestId: bigint
): Promise<ethers.ContractTransactionResponse> => {
  const contract = getChainDeedContract(signer);
  const tx = await contract.approveMintRequest(requestId);
  return tx;
};

// Reject a request (owner only)
export const rejectMintRequest = async (
  signer: ethers.Signer,
  requestId: bigint,
  reason: string
): Promise<ethers.ContractTransactionResponse> => {
  const contract = getChainDeedContract(signer);
  const tx = await contract.rejectMintRequest(requestId, reason);
  return tx;
};

// Direct mint (owner only, backward compatibility)
export const mintNFT = async (
  signer: ethers.Signer,
  recipient: string,
  tokenURI: string
): Promise<ethers.ContractTransactionResponse> => {
  const contract = getChainDeedContract(signer);
  const tx = await contract.safeMint(recipient, tokenURI);
  return tx;
};

export const getTokenBalance = async (
  provider: ethers.Provider,
  address: string
): Promise<bigint> => {
  const contract = getChainDeedContract(provider);
  return await contract.balanceOf(address);
};

export const getTokenURI = async (
  provider: ethers.Provider,
  tokenId: number
): Promise<string> => {
  const contract = getChainDeedContract(provider);
  return await contract.tokenURI(tokenId);
};

export const getTokenOwner = async (
  provider: ethers.Provider,
  tokenId: number
): Promise<string> => {
  const contract = getChainDeedContract(provider);
  return await contract.ownerOf(tokenId);
};

export const getContractOwner = async (
  provider: ethers.Provider
): Promise<string> => {
  const contract = getChainDeedContract(provider);
  return await contract.owner();
};

export const getContractInfo = async (
  provider: ethers.Provider
): Promise<{ name: string; symbol: string }> => {
  const contract = getChainDeedContract(provider);
  const [name, symbol] = await Promise.all([
    contract.name(),
    contract.symbol(),
  ]);
  return { name, symbol };
};
