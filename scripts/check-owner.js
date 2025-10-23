const { ethers } = require('hardhat');

async function main() {
  const contractAddress = '0x08298a5DfED325Bb9b254Cb87B919Aa1f7A8d26f';
  
  const contract = await ethers.getContractAt('ChainDeed', contractAddress);
  const owner = await contract.owner();
  
  console.log('=====================================');
  console.log('CONTRACT OWNER INFO');
  console.log('=====================================');
  console.log('Contract Address:', contractAddress);
  console.log('Owner Address:', owner);
  console.log('=====================================');
  
  // Get the deployer address from .env
  const [deployer] = await ethers.getSigners();
  console.log('Your Wallet Address:', deployer.address);
  console.log('Are you the owner?', owner.toLowerCase() === deployer.address.toLowerCase());
  console.log('=====================================');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
