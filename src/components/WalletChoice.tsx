"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWallet } from "@/hooks/useWallet";
import { KeplrWallet } from "@/lib/wallets/KeplrWallet";
import Image from "next/image";
import { Button } from "./ui/button";
import { IWallet } from "@/lib/types";
import { CosmostationWallet } from "@/lib/wallets/CosmostationWallet";
import { cn } from "@/lib/utils";
import { LeapWallet } from "@/lib/wallets/LeapWallet";

const wallets = [
  {
    name: "Keplr",
    icon: "/icons/Keplr.svg",
    connect: async (addWallet: (wallet: IWallet) => void) => {
      const keplrWallet = new KeplrWallet();
      await keplrWallet.connect();
      addWallet(keplrWallet);
    },
  },
  {
    name: "Cosmostation",
    icon: "/icons/Cosmostation.svg",
    connect: async (addWallet: (wallet: IWallet) => void) => {
      const cosmostationWallet = new CosmostationWallet();
      await cosmostationWallet.connect();
      addWallet(cosmostationWallet);
    },
  },
  {
    name: "Leap",
    icon: "/icons/Leap.svg",
    connect: async (addWallet: (wallet: IWallet) => void) => {
      const leapWallet = new LeapWallet();
      await leapWallet.connect();
      addWallet(leapWallet);
    },
  },
];

export const WalletChoice = () => {
  const { addWallet, activeWallet } = useWallet();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect your wallet</CardTitle>
        <CardDescription>
          Choose a wallet to connect to the Adamik API.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center">
        {wallets.map((wallet) => {
          return (
            <Button
              variant="ghost"
              className={cn(
                "opacity-50 hover:opacity-100",
                activeWallet &&
                  wallet.name === activeWallet.name &&
                  "opacity-100"
              )}
              size="icon"
              onClick={wallet.connect.bind(null, addWallet)}
              key={wallet.name}
            >
              <Image
                src={wallet.icon}
                alt={wallet.name}
                height={32}
                width={32}
              />
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};
