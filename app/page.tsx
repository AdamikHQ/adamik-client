"use client";
import { cn } from "@/lib/utils";
import { getSupportedChainsIds } from "@/api/getChains";
import { useEffect } from "react";
import { Data } from "@/components/Data";
import { ConnectWallet } from "@/components/ConnectWallet";

export default function Home() {
  useEffect(() => {
    const chains = getSupportedChainsIds();
    console.log(chains);
  }, []);

  return (
    <div className="p-12">
      <div className={cn("flex md:flex-row flex-col gap-8 bg-secondary")}>
        <div className="flex flex-col gap-4">
          <ConnectWallet />
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <Data />
        </div>
      </div>
    </div>
  );
}
