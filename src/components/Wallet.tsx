import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Chain, IWallet, Transaction } from "~/types";
import { cn } from "~/utils/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Data } from "./Data";
import { Encode } from "./encode/Encode";
import { Sign } from "./Sign";
import { Modal } from "./ui/modal";
import { Broadcast } from "./Broadcast";
import { Result } from "./Result";

export const Wallet: React.FC<{ wallet: IWallet }> = ({ wallet }) => {
  const [transactionToSign, setTransactionToSign] = useState<Transaction>({
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
  const [tokenDetails, setTokenDetails] = useState<any[]>([]);

  useEffect(() => {
    const fetchAddress = async () => {
      setEncodedTransaction(undefined);
      setSignedTransaction(undefined);
      setHash(undefined);
      const walletAddress = await wallet.getAddress(wallet.supportedChains[0]);
      setAddress(walletAddress);
      setTransactionToSign({
        ...transactionToSign,
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
  }, [transactionToSign.chainId]);

  const changeTargetChain = async (chainId: Chain) => {
    try {
      await wallet.connect(chainId);
      const walletAddress = await wallet.getAddress(chainId);
      setTransactionToSign({
        ...transactionToSign,
        chainId,
        mode: "transfer",
        senders: [walletAddress],
        recipients: [],
        amount: "",
        memo: "",
      });

      setAddress(walletAddress);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8 lg:grid-cols-4 xl:grid-cols-4">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-4">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
          <Card className="col-span-2 md:col-span-4 py-4">
            <CardHeader className="pb-3">
              <CardTitle>
                <Image src={wallet.icon} alt={wallet.name} width={24} height={24} className="inline-block" />{" "}
                - {wallet.name}
              </CardTitle>
              <CardDescription className="text-balance leading-relaxed">
                {wallet.supportedChains.map((chain) => {
                  return (
                    <Button
                      size="sm"
                      variant="outline"
                      className={cn(
                        chain === transactionToSign.chainId &&
                          "bg-teal-200 dark:bg-teal-600 border-primary text-primary"
                      )}
                      key={chain}
                      onClick={() => changeTargetChain(chain)}
                    >
                      <span>{chain}</span>
                    </Button>
                  );
                })}
              </CardDescription>
            </CardHeader>
          </Card>
          <Separator orientation="horizontal" className="col-span-2 md:col-span-4" />
          {address && (
            <>
              <div className="col-span-2 md:col-span-2">
                <Data
                  address={address}
                  chainId={transactionToSign.chainId}
                  tokenDetails={tokenDetails}
                  setTokenDetails={setTokenDetails}
                />
              </div>
              <div className="col-span-2 md:col-span-2">
                <Encode
                  transactionToSign={transactionToSign}
                  setEncodedTransaction={setEncodedTransaction}
                  setTransactionToSign={setTransactionToSign}
                  setOpen={setOpenSigner}
                  wallet={wallet}
                  tokenDetails={tokenDetails}
                />
              </div>
              {!wallet.withoutBroadcast && signedTransaction && (
                <div className="col-span-2 md:col-span-4">
                  <Broadcast
                    signedTransaction={signedTransaction}
                    transaction={transactionToSign}
                    encodedTransaction={encodedTransaction}
                    setHash={setHash}
                    wallet={wallet}
                  />
                </div>
              )}
              {hash && (
                <div className="col-span-2 md:col-span-4">
                  <Result hash={hash} wallet={wallet} transaction={transactionToSign} />
                </div>
              )}
              <Modal
                open={openSigner}
                setOpen={setOpenSigner}
                modalTitle="Sign with your wallet"
                modalContent={
                  <Sign
                    setSignedTransaction={setSignedTransaction}
                    transaction={transactionToSign}
                    wallet={wallet}
                    encodedTransaction={encodedTransaction}
                    tokenDetails={tokenDetails}
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
