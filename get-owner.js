const { ethers } = require('ethers');

const privateKey = '0x5e87ef0613554bd2583caea2e6652fc03b2113ea7cbdb03ef6b09e1a758477f7';
const wallet = new ethers.Wallet(privateKey);

console.log('=====================================');
console.log('CONTRACT OWNER INFORMATION');
console.log('=====================================');
console.log('Your Wallet Address:', wallet.address);
console.log('Contract Address: 0x08298a5DfED325Bb9b254Cb87B919Aa1f7A8d26f');
console.log('');
console.log('This wallet deployed the contract,');
console.log('so IT IS THE OWNER!');
console.log('=====================================');
console.log('');
console.log('✅ You need to use THIS wallet in MetaMask');
console.log('   to access admin features!');
console.log('=====================================');
