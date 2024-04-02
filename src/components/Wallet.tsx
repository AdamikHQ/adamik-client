import { IWallet, Transaction } from "@/lib/types";
import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Data } from "./Data";
import Image from "next/image";
import { Encode } from "./Encode";
import { Textarea } from "./ui/textarea";
import { SquarePen } from "lucide-react";
import { Sign } from "./Sign";
import { cn } from "@/lib/utils";

export const Wallet: React.FC<{ wallet: IWallet }> = ({ wallet }) => {
  const [transaction, setTransaction] = useState<Transaction>({
    chainId: wallet.supportedChains[0],
    senders: [],
    mode: "transfer",
    recipients: [],
    useMaxAmount: false,
  });

  const [address, setAddress] = useState<string>();
  const [encodedTransaction, setEncodedTransaction] = useState<string>();

  useEffect(() => {
    const fetchAddress = async () => {
      const walletAddress = await wallet.getAddress();
      setAddress(walletAddress);
      setTransaction({ ...transaction, senders: [walletAddress] });
    };

    if (wallet && !address) fetchAddress();
  }, [wallet, transaction, address]);

  const changeTargetChain = async (chainId: string) => {
    wallet.setTargetedChain(chainId);
    await wallet.connect();
    const walletAddress = await wallet.getAddress();
    setTransaction({ ...transaction, chainId, senders: [walletAddress] });
    setAddress(walletAddress);
  }

  return (
    <div className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="col-span-2 md:col-span-4 py-4">
            <CardHeader className="pb-3">
              <CardTitle>
                <Image
                  src={wallet.icon}
                  alt={wallet.name}
                  width={24}
                  height={24}
                  className="inline-block"
                />
                {" "} - Keplr
              </CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                
                <div className="flex flex-row gap-2 items-center">
                Supported chains :
                  {wallet.supportedChains.map((chain) => {
                    return (
                      <Button
                        size="sm"
                        variant="outline"
                        className={cn(
                          "h-8 gap-1",
                          chain === transaction.chainId &&
                            "bg-teal-200 dark:bg-teal-600 border-primary text-primary",
                        )}
                        key={chain}
                        onClick={() => changeTargetChain(chain)}
                      >
                        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                          {chain}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
          <Separator
            orientation="horizontal"
            className="col-span-2 md:col-span-4"
          />
          {address && (
            <>
              <div className="col-span-2 md:col-span-4">
                <Data address={address} chainId={transaction.chainId} />
              </div>
              <div className="col-span-2 md:col-span-4">
                <Encode
                  transaction={transaction}
                  setEncodedTransaction={setEncodedTransaction}
                  setTransaction={setTransaction}
                  wallet={wallet}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <div>
        <Sign encodedTransaction={encodedTransaction} wallet={wallet} />
      </div>
    </div>
  );
};
