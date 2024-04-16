type ChainConfig = {
  adamikChainId: string;
  chainId: string;
  chainName: string;
  rpcUrls: string[];
};

const chainConfig: Record<string, ChainConfig> = {
  sepolia: {
    adamikChainId: "ethereum",
    chainId: "0xaa36a7",
    chainName: "Sepolia",
    rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
  },
  holesky: {
    adamikChainId: "holesky",
    chainId: "0x4268",
    chainName: "Holesky",
    rpcUrls: ["https://ethereum-holesky-rpc.publicnode.com"],
  },
  ethereum: {
    adamikChainId: "ethereum",
    chainId: "0x1",
    chainName: "Ethereum",
    rpcUrls: ["https://eth.llamarpc.com"],
  },
};

export const getAdamikChainId = (chainId: string): string | undefined => {
  if (chainConfig[chainId]) {
    return chainConfig[chainId].adamikChainId;
  }
  return undefined;
};

export const getMetamaskConfig = (
  chainId: string
): Omit<ChainConfig, "adamikChainId"> | undefined => {
  if (chainConfig[chainId]) {
    return {
      chainId: chainConfig[chainId].chainId,
      chainName: chainConfig[chainId].chainName,
      rpcUrls: chainConfig[chainId].rpcUrls,
    };
  }
  return undefined;
};
