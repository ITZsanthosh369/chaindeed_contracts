import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '@/config/contract';
import { CHAINDEED_ABI } from '@/config/abi';

export const getChainDeedContract = (signerOrProvider: ethers.Signer | ethers.Provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CHAINDEED_ABI, signerOrProvider);
};

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
