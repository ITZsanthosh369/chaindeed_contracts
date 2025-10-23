import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ChainDeedV2Module = buildModule("ChainDeedV2Module", (m) => {
  const chainDeed = m.contract("ChainDeed");

  return { chainDeed };
});

export default ChainDeedV2Module;
