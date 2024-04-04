export type Chain = "cosmoshub" | "algorand" | "ethereum";

type TransactionCommon = {
  mode: "transfer" | "stake";
  useMaxAmount: boolean;
  chainId: string;
  fees?: string;
  gas?: string;
  amount?: string;
  format?: string;
  pubKey?: string;
};

export type TransferTransaction = {
  mode: "transfer";
  chainId: string;
  senders: string[];
  recipients: string[];
};

export type Transaction = TransactionCommon & TransferTransaction;

// TODO refactor this to be more generic without any
export interface IWallet<T = any, R = any> {
  name: string;
  supportedChains: string[];
  icon: string;
  unit: number;
  signFormat: string;
  connect: (chainId: string) => Promise<void>;
  getAddress: (chainId: string) => Promise<string>;
  signMessage: (chainId: string, payload: T) => Promise<R>;
  extractSignature: (signature: R) => string;
  getPubkey?: () => Promise<string>;
  getExplorerUrl: (chainId: string, hash: string) => string;
}
