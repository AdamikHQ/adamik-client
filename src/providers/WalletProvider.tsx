import { WalletContext } from "@/hooks/useWallet";
import { IWallet } from "@/lib/types";
import React, { useState } from "react";

export const WalletProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [wallets, setWallets] = useState<IWallet[]>([]);
  const [activeWallet, setActiveWallet] = useState<IWallet | null>(null);

  const addWallet = (wallet: IWallet) => {
    const exist = wallets.find((w) => w.name === wallet.name);
    if (!exist) {
      setWallets([...wallets, wallet]);
    }
    setActiveWallet(wallet);
  };

  const switchWallet = (wallet: IWallet) => {
    setActiveWallet(wallet);
  };

  return (
    <WalletContext.Provider
      value={{ wallets, activeWallet, addWallet, switchWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};
