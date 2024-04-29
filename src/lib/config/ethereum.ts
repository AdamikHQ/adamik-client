type ChainConfig = {
  adamikChainId: string;
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

const chainConfig: Record<string, ChainConfig> = {
  sepolia: {
    adamikChainId: "sepolia",
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
  zksync: {
    adamikChainId: "zksync",
    chainId: "0x144",
    chainName: "zkSync",
    rpcUrls: ["https://zksync.drpc.org"],
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
  "zksync-testnet": {
    adamikChainId: "zksync-testnet",
    chainId: "0x12c",
    chainName: "zkSync Sepolia",
    rpcUrls: ["https://sepolia.era.zksync.dev"],
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
  "injective-testnet": {
    adamikChainId: "injective-testnet",
    chainId: "0x978",
    chainName: "zkSync Sepolia",
    rpcUrls: ["https://testnet.rpc.inevm.com/http"],
    nativeCurrency: {
      name: "Injective",
      symbol: "INJ",
      decimals: 18,
    },
  },
  "base": {
    adamikChainId: "base",
    chainId: "0x2105",
    chainName: "Base",
    rpcUrls: ["https://mainnet.base.org"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  "base-sepolia": {
    adamikChainId: "base-sepolia",
    chainId: "0x14A34",
    chainName: "Base Sepolia",
    rpcUrls: ["https://sepolia.base.org"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  "optimism": {
    adamikChainId: "optimism",
    chainId: "0xA",
    chainName: "Optimism",
    rpcUrls: ["https://mainnet.optimism.io"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  "optimism-sepolia": {
    adamikChainId: "optimism-sepolia",
    chainId: "0xAA37DC",
    chainName: "Optimism Sepolia",
    rpcUrls: ["https://sepolia.optimism.io"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  }
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
      nativeCurrency: chainConfig[chainId].nativeCurrency,
    };
  }
  return undefined;
};

export function getEtherscanUrl(chainId: string, hash: string): string {
  switch (chainId) {
    case "sepolia":
      return `https://sepolia.etherscan.io/tx/${hash}`;
    case "ethereum":
      return `https://etherscan.io/tx/${hash}`;
    case "holesky:":
      return `https://holesky.etherscan.io/tx/${hash}`;
    case "zksync":
      return `https://explorer.zksync.io/tx/${hash}`;
    case "zksync-testnet":
      return `https://sepolia.explorer.zksync.io/tx/${hash}`;
    case "injective-testnet":
      return `https://inevm-testnet.explorer.caldera.xyz/tx/${hash}`;
    case "base":
      return `https://basescan.org/tx/${hash}`;
    case "base-sepolia":
      return `https://sepolia.basescan.org/tx/${hash}`;
    case "optimism":
      return `https://optimistic.etherscan.io/tx/${hash}`;
    case "optimism-sepolia":
      return `https://sepolia-optimistic.etherscan.io/tx/${hash}`
  }
  throw new Error(`Chain ${chainId} not supported`);
}