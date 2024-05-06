"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { useWallet } from "~/hooks/useWallet";
import { KeplrWallet } from "~/wallets/KeplrWallet";
import Image from "next/image";
import { Button } from "./ui/button";
import { IWallet } from "~/types";
import { CosmostationWallet } from "~/wallets/CosmostationWallet";
import { cn } from "~/utils/utils";
import { LeapWallet } from "~/wallets/LeapWallet";
import { PeraWallet } from "~/wallets/PeraWallet";
import { Metamask } from "~/wallets/MetamaskWallet";

const wallets = [
  {
    name: "Metamask",
    icon: "/icons/Metamask.svg",
    connect: async (setActiveWallet: (wallet: IWallet) => void) => {
      const metamaskWallet = new Metamask();
      await metamaskWallet.connect(metamaskWallet.supportedChains[0]);
      setActiveWallet(metamaskWallet);
    },
  },
  {
    name: "Cosmostation",
    icon: "/icons/Cosmostation.svg",
    connect: async (setActiveWallet: (wallet: IWallet) => void) => {
      const cosmostationWallet = new CosmostationWallet();
      await cosmostationWallet.connect(cosmostationWallet.supportedChains[0]);
      setActiveWallet(cosmostationWallet);
    },
  },
  {
    name: "Keplr",
    icon: "/icons/Keplr.svg",
    connect: async (setActiveWallet: (wallet: IWallet) => void) => {
      const keplrWallet = new KeplrWallet();
      await keplrWallet.connect(keplrWallet.supportedChains[0]);
      setActiveWallet(keplrWallet);
    },
  },
  {
    name: "Leap",
    icon: "/icons/Leap.svg",
    connect: async (setActiveWallet: (wallet: IWallet) => void) => {
      const leapWallet = new LeapWallet();
      await leapWallet.connect(leapWallet.supportedChains[0]);
      setActiveWallet(leapWallet);
    },
  },
  {
    name: "Pera",
    icon: "/icons/Pera.svg",
    connect: async (setActiveWallet: (wallet: IWallet) => void) => {
      const peraWallet = new PeraWallet();
      await peraWallet.connect();
      setActiveWallet(peraWallet);
    },
  },
];

export const WalletChoice = () => {
  const { setActiveWallet, activeWallet } = useWallet();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect your wallet</CardTitle>
        <CardDescription>Choose a wallet to connect to the Adamik API.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center">
        {wallets.map((wallet) => {
          return (
            <Button
              variant="ghost"
              className={cn(
                "opacity-50 hover:opacity-100",
                activeWallet && wallet.name === activeWallet.name && "opacity-100"
              )}
              size="icon"
              onClick={wallet.connect.bind(null, setActiveWallet)}
              key={wallet.name}
            >
              <Image src={wallet.icon} alt={wallet.name} height={32} width={32} />
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};
