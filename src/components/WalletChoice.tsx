"use client";

import { useState, useEffect } from "react";
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
import { useTheme } from "next-themes"; // Import useTheme
import { Tooltip } from "./ui/tooltip"; // Import the Tooltip component

export const WalletChoice = () => {
  const { setActiveWallet, activeWallet } = useWallet();
  const { theme, resolvedTheme } = useTheme(); // Get the current theme and resolved theme
  const [mounted, setMounted] = useState(false); // State to check if component is mounted
  const [tooltipVisible, setTooltipVisible] = useState(false); // State for tooltip visibility

  // Wait until the component is mounted to ensure the theme state is available
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use resolvedTheme instead of theme for more accurate theme detection
  const currentTheme = mounted ? (theme === "system" ? resolvedTheme : theme) : "light";

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
    {
      name: "Fireblocks",
      icon: currentTheme === "light" ? "/icons/Fireblocks_light.svg" : "/icons/Fireblocks_dark.svg", // Conditional icon based on theme
      connect: async () => {
        // Show tooltip when Fireblocks logo is clicked
        setTooltipVisible(true);
        setTimeout(() => setTooltipVisible(false), 3000); // Hide tooltip after 3 seconds
      },
    },
  ];

  if (!mounted) {
    // Don't render the component until it is mounted
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect your wallet</CardTitle>
        <CardDescription>Choose a wallet to connect to the Adamik API.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center">
        {wallets.map((wallet) => (
          <Tooltip
            key={wallet.name}
            text={wallet.name === "Fireblocks" && tooltipVisible ? "Please contact us to get access to Fireblocks connectivity <a href='https://adamik.io/contact' target='_blank' class='underline'>here</a>" : ""}
          >
            <Button
              variant="ghost"
              className={cn(
                "opacity-50 hover:opacity-100",
                activeWallet && wallet.name === activeWallet.name && "opacity-100"
              )}
              size="icon"
              onClick={wallet.connect ? wallet.connect.bind(null, setActiveWallet) : undefined}
            >
              <Image src={wallet.icon} alt={wallet.name} height={32} width={32} />
            </Button>
          </Tooltip>
        ))}
      </CardContent>
    </Card>
  );
};

export default WalletChoice;