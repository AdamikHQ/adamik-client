export type Chain = "cosmoshub" | "algorand" | "osmosis" | "dydx" | "celestia" | "axelar" | EVMChain;

export type EVMChain =
  | "ethereum"
  | "sepolia"
  | "holesky"
  | "zksync"
  | "zksync-sepolia"
  | "injective-testnet"
  | "base"
  | "base-sepolia"
  | "optimism"
  | "optimism-sepolia"
  | "arbitrum"
  | "arbitrum-sepolia";

export type Token = {
  chainId: Chain;
  id: string;
  name: string;
  ticker: string;
  decimals: number;
  contractAddress?: string;
};

export type Mode = "transfer" | "transferToken" | "delegate";

type TransactionCommon = {
  mode: Mode;
  senders: string[];
  useMaxAmount: boolean;
  chainId: Chain;
  fees?: string;
  gas?: string;
  amount?: string;
  formattedAmount?: string; // amount converted to smallest unit
  format?: string;
  pubKey?: string;
  memo?: string;
};

export type TransferTransaction = TransactionCommon & {
  mode: "transfer";
  recipients: string[];
};

export type TokenTransferTransaction = TransactionCommon & {
  mode: "transferToken";
  tokenId: string;
  recipients: string[];
};

export type DelegateTransaction = TransactionCommon & {
  mode: "delegate";
  validator: string;
};

export type Transaction = TransferTransaction | TokenTransferTransaction | DelegateTransaction;

// TODO refactor this to be more generic without any
export interface IWallet<T = any, R = any, B = any> {
  name: string;
  supportedChains: Chain[];
  icon: string;
  unit: number;
  signFormat: string;
  withoutBroadcast: boolean;
  connect: (chainId: Chain) => Promise<void>;
  getAddress: (chainId: string) => Promise<string>;
  signMessage: (chainId: string, payload: T) => Promise<R>;
  extractSignature: (signature: R) => string;
  getPubkey?: () => Promise<string>;
  getExplorerUrl: (chainId: Chain, hash: string) => string;
  getHashFromBroadcast: (broadcast: B) => string;
}
