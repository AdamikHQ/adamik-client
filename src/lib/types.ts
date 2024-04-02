export type Chain = "cosmoshub" | "algorand" | "ethereum";

type TransactionCommon = {
  mode: "transfer" | "stake";
  useMaxAmount: boolean;
  chainId: string;
  fees?: string;
  gas?: string;
  amount?: string;
  format?: string;
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
  connect: () => Promise<void>;
  getAddress: () => Promise<string>;
  signMessage: (payload: T) => Promise<R>;
  setTargetedChain: (chain: string) => void;
}
