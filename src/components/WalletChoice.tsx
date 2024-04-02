"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useWallet } from "@/hooks/useWallet";
import { KeplrWallet } from "@/lib/wallets/KeplrWallet";
import Image from "next/image";
import { useCallback } from "react";
import { Button } from "./ui/button";

const wallets = [
  {
    name: "Keplr",
    icon: "/icons/Keplr.svg",
    connect: async () => {
      const keplrWallet = new KeplrWallet();
      await keplrWallet.connect();
    },
  },
];

export const WalletChoice = () => {
  const { addWallet } = useWallet();

  const connectKeplr = useCallback(async () => {
    const keplrWallet = new KeplrWallet();
    addWallet(keplrWallet);
    await keplrWallet.connect();
  }, [addWallet]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect your wallet</CardTitle>
        <CardDescription>
          Choose a wallet to connect to the Adamik API.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center">
        <Button
          variant="ghost"
          className="opacity-80 hover:opacity-100"
          size="icon"
          onClick={() => connectKeplr()}
        >
          <Image src="/icons/Keplr.svg" alt="Keplr" height={32} width={32} />
        </Button>
        WIP : 
        <Button
          variant="ghost"
          className="opacity-10 hover:opacity-100"
          size="icon"
        >
          <Image
            src="/icons/Metamask.svg"
            alt="Metamask"
            height={32}
            width={32}
          />
        </Button>
      </CardContent>
    </Card>
  );
};
