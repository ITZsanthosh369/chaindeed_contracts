import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ChainDeedModule = buildModule("ChainDeedModule", (m) => {
  const chainDeed = m.contract("ChainDeed");

  return { chainDeed };
});

export default ChainDeedModule;
