"use client";
import { cn } from "@/lib/utils";
import { Data } from "@/components/Data";
import { ConnectWallet } from "@/components/ConnectWallet";
import { Encode } from "@/components/Encode";
import { Sign } from "@/components/Sign";
import { Broadcast } from "@/components/Broadcast";

export default function Home() {
  return (
    <div className="p-12">
      <div className={cn("flex lg:flex-row flex-col gap-8 bg-secondary")}>
        <div className="flex flex-col gap-4">
          <ConnectWallet />
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <Data />
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <Encode />
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <Sign />
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <Broadcast />
        </div>
      </div>
    </div>
  );
}
