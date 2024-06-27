import { Chain, EVMChain } from "../types";

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
  explorerUrl?: (hash: string) => string;
  isTestnet?: boolean;
};

const chainConfig: Record<EVMChain, ChainConfig> = {
  sepolia: {
    adamikChainId: "sepolia",
    chainId: "0xaa36a7",
    chainName: "Sepolia",
    rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
    explorerUrl: (hash: string) => `https://sepolia.etherscan.io/tx/${hash}`,
    isTestnet: true,
  },
  holesky: {
    adamikChainId: "holesky",
    chainId: "0x4268",
    chainName: "Holesky",
    rpcUrls: ["https://ethereum-holesky-rpc.publicnode.com"],
    explorerUrl: (hash: string) => `https://holesky.etherscan.io/tx/${hash}`,
    isTestnet: true,
  },
  ethereum: {
    adamikChainId: "ethereum",
    chainId: "0x1",
    chainName: "Ethereum",
    rpcUrls: ["https://eth.llamarpc.com"],
    explorerUrl: (hash: string) => `https://etherscan.io/tx/${hash}`,
  },
  zksync: {
    adamikChainId: "zksync",
    chainId: "0x144",
    chainName: "zkSync",
    rpcUrls: ["https://zksync.drpc.org"],
    explorerUrl: (hash: string) => `https://explorer.zksync.io/tx/${hash}`,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
  "zksync-sepolia": {
    adamikChainId: "zksync-sepolia",
    chainId: "0x12c",
    chainName: "zkSync Sepolia",
    rpcUrls: ["https://sepolia.era.zksync.dev"],
    explorerUrl: (hash: string) => `https://sepolia.explorer.zksync.io/tx/${hash}`,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    isTestnet: true,
  },
  "injective-testnet": {
    adamikChainId: "injective-testnet",
    chainId: "0x978",
    chainName: "zkSync Sepolia",
    rpcUrls: ["https://testnet.rpc.inevm.com/http"],
    explorerUrl: (hash: string) => `https://inevm-testnet.explorer.caldera.xyz/tx/${hash}`,
    nativeCurrency: {
      name: "Injective",
      symbol: "INJ",
      decimals: 18,
    },
    isTestnet: true,
  },
  base: {
    adamikChainId: "base",
    chainId: "0x2105",
    chainName: "Base",
    rpcUrls: ["https://mainnet.base.org"],
    explorerUrl: (hash: string) => `https://basescan.org/tx/${hash}`,
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
    explorerUrl: (hash: string) => `https://sepolia.basescan.org/tx/${hash}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    isTestnet: true,
  },
  optimism: {
    adamikChainId: "optimism",
    chainId: "0xA",
    chainName: "Optimism",
    rpcUrls: ["https://mainnet.optimism.io"],
    explorerUrl: (hash: string) => `https://optimistic.etherscan.io/tx/${hash}`,
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
    explorerUrl: (hash: string) => `https://sepolia-optimistic.etherscan.io/tx/${hash}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    isTestnet: true,
  },
  arbitrum: {
    adamikChainId: "arbitrum",
    chainId: "0xa4b1",
    chainName: "Arbitrum One",
    rpcUrls: ["https://arbitrum-mainnet.infura.io"],
    explorerUrl: (hash: string) => `https://arbiscan.io/tx/${hash}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  fantom: {
    adamikChainId: "fantom",
    chainId: "0xFA",
    chainName: "Fantom",
    rpcUrls: ["https://rpcapi.fantom.network"],
    explorerUrl: (hash: string) => `https://ftmscan.com/tx/${hash}`,
    nativeCurrency: {
      name: "Fantom",
      symbol: "FTM",
      decimals: 18,
    },
  },
  polygon: {
    adamikChainId: "polygon",
    chainId: "0x89",
    chainName: "Polygon",
    rpcUrls: ["https://polygon-rpc.com"],
    explorerUrl: (hash: string) => `https://polygonscan.com//tx/${hash}`,
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  "arbitrum-sepolia": {
    adamikChainId: "arbitrum-sepolia",
    chainId: "0x66eee",
    chainName: "Arbitrum Sepolia",
    rpcUrls: ["https://arbitrum-sepolia.blockpi.network/v1/rpc/public"],
    explorerUrl: (hash: string) => `https://sepolia.arbiscan.io/tx/${hash}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    isTestnet: true,
  },
};

export const getAdamikChainId = (chainId: EVMChain): string | undefined => {
  if (chainConfig[chainId]) {
    return chainConfig[chainId].adamikChainId;
  }
  return undefined;
};

const getMetamaskConfig = (chainId: EVMChain): Omit<ChainConfig, "adamikChainId"> | undefined => {
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

function getEtherscanUrl(chainId: EVMChain, hash: string): string {
  if (chainConfig[chainId].explorerUrl) {
    return chainConfig[chainId].explorerUrl?.(hash) as string;
  }
  throw new Error(`Chain ${chainId} not supported`);
}

function getEVMChains(withoutTestnet = false): Chain[] {
  const chains = Object.entries(chainConfig);

  if (withoutTestnet) {
    return chains.filter(([, config]) => !config.isTestnet).map(([chainId]) => chainId as Chain);
  }
  return chains
    .sort(([, aConfig], [, bConfig]) => {
      // Sort testnet at the end
      if (aConfig.isTestnet === bConfig.isTestnet) {
        return 0;
      } else if (aConfig.isTestnet) {
        return 1;
      } else {
        return -1;
      }
    })
    .map(([chainId]) => chainId as Chain);
}

export { getEtherscanUrl, getEVMChains, getMetamaskConfig };
