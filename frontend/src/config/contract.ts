export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xc2C9B98c538764F353993906e0F1e9427B49f061';
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111');
export const NETWORK_NAME = process.env.NEXT_PUBLIC_NETWORK_NAME || 'Sepolia';

export const SEPOLIA_CHAIN = {
  chainId: `0x${CHAIN_ID.toString(16)}`,
  chainName: NETWORK_NAME,
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia.infura.io/v3/'],
  blockExplorerUrls: ['https://sepolia.etherscan.io/'],
};
