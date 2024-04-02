"use client";
import { Wallet } from "@/components/Wallet";
import { WalletChoice } from "@/components/WalletChoice";
import { Separator } from "@/components/ui/separator";
import { useWallet } from "@/hooks/useWallet";
import { cn } from "@/lib/utils";

export default function Home() {
  const { wallets } = useWallet();
  return (
    <div className={cn("flex flex-col gap-4")}>
      <WalletChoice />
      <Separator orientation="vertical" className={cn("h-[1px]")} />
      {wallets.map((wallet) => {
        return <Wallet key={wallet.name} wallet={wallet} />;
      })}
    </div>
  );
}
