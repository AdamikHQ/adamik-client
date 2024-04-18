import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Chain, IWallet, Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { Data } from "./Data";
import { Encode } from "./encode/Encode";
import { Sign } from "./Sign";
import { Modal } from "./ui/modal";
import { Broadcast } from "./Broadcast";
import { Result } from "./Result";

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
  const [signedTransaction, setSignedTransaction] = useState<string>();
  const [hash, setHash] = useState<string>();
  const [openSigner, setOpenSigner] = useState<boolean>(false);

  useEffect(() => {
    const fetchAddress = async () => {
      setEncodedTransaction(undefined);
      setSignedTransaction(undefined);
      setHash(undefined);
      const walletAddress = await wallet.getAddress(wallet.supportedChains[0]);
      setAddress(walletAddress);
      setTransaction({
        ...transaction,
        mode: "transfer",
        senders: [walletAddress],
        chainId: wallet.supportedChains[0],
        recipients: [],
        amount: "",
        memo: "",
      });
    };

    fetchAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  useEffect(() => {
    setHash(undefined);
  }, [signedTransaction, encodedTransaction]);
  
  useEffect(() => {
    setEncodedTransaction(undefined);
    setSignedTransaction(undefined);
  }, [transaction.chainId])

  const changeTargetChain = async (chainId: Chain) => {
    try {
      await wallet.connect(chainId);
      const walletAddress = await wallet.getAddress(chainId);
      setTransaction({
        ...transaction,
        chainId,
        mode: "transfer",
        senders: [walletAddress],
        recipients: [],
        amount: "",
        memo: "",
      });

      setAddress(walletAddress);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8 lg:grid-cols-4 xl:grid-cols-4">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-4">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
          <Card className="col-span-2 md:col-span-4 py-4">
            <CardHeader className="pb-3">
              <CardTitle>
                <Image
                  src={wallet.icon}
                  alt={wallet.name}
                  width={24}
                  height={24}
                  className="inline-block"
                />{" "}
                - {wallet.name}
              </CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                <span className="flex flex-row gap-2 items-center">
                  Supported chains :
                  {wallet.supportedChains.map((chain) => {
                    return (
                      <Button
                        size="sm"
                        variant="outline"
                        className={cn(
                          "h-8 gap-1",
                          chain === transaction.chainId &&
                            "bg-teal-200 dark:bg-teal-600 border-primary text-primary"
                        )}
                        key={chain}
                        onClick={() => changeTargetChain(chain)}
                      >
                        <span>
                          {chain}
                        </span>
                      </Button>
                    );
                  })}
                </span>
              </CardDescription>
            </CardHeader>
          </Card>
          <Separator
            orientation="horizontal"
            className="col-span-2 md:col-span-4"
          />
          {address && (
            <>
              <div className="col-span-2 md:col-span-2">
                <Data address={address} chainId={transaction.chainId} />
              </div>
              <div className="col-span-2 md:col-span-2">
                <Encode
                  transaction={transaction}
                  setEncodedTransaction={setEncodedTransaction}
                  setTransaction={setTransaction}
                  setOpen={setOpenSigner}
                  wallet={wallet}
                />
              </div>
              {!wallet.withoutBroadcast && signedTransaction && (
                <div className="col-span-2 md:col-span-4">
                  <Broadcast
                    signedTransaction={signedTransaction}
                    transaction={transaction}
                    encodedTransaction={encodedTransaction}
                    setHash={setHash}
                    wallet={wallet}
                  />
                </div>
              )}
              {hash && (
                <div className="col-span-2 md:col-span-4">
                  <Result
                    hash={hash}
                    wallet={wallet}
                    transaction={transaction}
                  />
                </div>
              )}
              <Modal
                open={openSigner}
                setOpen={setOpenSigner}
                modalTitle="Sign with your wallet"
                modalContent={
                  <Sign
                    chainId={transaction.chainId}
                    setSignedTransaction={setSignedTransaction}
                    transaction={transaction}
                    wallet={wallet}
                    encodedTransaction={encodedTransaction}
                    setOpen={setOpenSigner}
                    setHash={setHash}
                  />
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
