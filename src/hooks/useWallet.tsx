import { IWallet } from '@/lib/types';
import React from 'react';

type WallerContextType = {
    wallets: IWallet[];
    activeWallet: IWallet | null;
    addWallet: (wallet: IWallet) => void;
    switchWallet: (wallet: IWallet) => void;
}

export const WalletContext = React.createContext<WallerContextType>({
    wallets: [],
    activeWallet: null,
    addWallet: () => {},
    switchWallet: () => {},
});

export const useWallet = () => {
  const context = React.useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

