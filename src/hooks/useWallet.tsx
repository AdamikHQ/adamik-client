import { IWallet } from "~/types";
import React from "react";

type WallerContextType = {
  wallets: IWallet[];
  activeWallet: IWallet | null;
  addWallet: (wallet: IWallet) => void;
  setActiveWallet: (wallet: IWallet | null) => void;
};

export const WalletContext = React.createContext<WallerContextType>({
  wallets: [],
  activeWallet: null,
  addWallet: () => {},
  setActiveWallet: () => {},
});

export const useWallet = () => {
  const context = React.useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
