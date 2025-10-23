import { ethers } from "hardhat";

async function main() {
  const CONTRACT_ADDRESS = "0xc2C9B98c538764F353993906e0F1e9427B49f061";
  const [signer] = await ethers.getSigners();
  const chainDeed = await ethers.getContractAt("ChainDeed", CONTRACT_ADDRESS, signer);

  console.log("Minting a new ChainDeed NFT...");
  const tx = await chainDeed.safeMint(signer.address, "ipfs://bafkreihdwdcefgh4");
  const receipt = await tx.wait();

  // Add a check to ensure receipt is not null
  if (receipt) {
    console.log(`Successfully minted NFT! Transaction hash: ${receipt.hash}`);
  } else {
    console.error("Failed to get transaction receipt.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});