export type Chain = "cosmoshub" | "algorand" | "ethereum";

type TransactionCommon = {
  mode: "transfer" | "stake";
  useMaxAmount: boolean;
  chainId: Chain;
  fees?: string;
  gas?: string;
  amount?: string;
};

export type TransferTransaction = {
  mode: "transfer";
  chainId: Chain;
  senders: string[];
  recipients: string[];
};

export type Transaction = TransactionCommon & TransferTransaction;
