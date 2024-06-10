"use client";

import { getEncode } from "~/api/encode";
import { IWallet, Token, Transaction } from "~/types";
import { amountToMainUnit } from "~/utils/utils";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Loading } from "../ui/loading";
import { Textarea } from "../ui/textarea";
import { EncodeForm } from "./EncodeForm";

type EncodeProps = {
  transactionToSign: Transaction;
  setTransactionToSign: React.Dispatch<React.SetStateAction<Transaction>>;
  setEncodedTransaction: (encodedTransaction: string) => void;
  wallet: IWallet;
  tokenDetails: Token[];
  setOpen: (open: boolean) => void;
};

export const Encode: React.FC<EncodeProps> = ({
  transactionToSign,
  setTransactionToSign,
  setEncodedTransaction,
  wallet,
  tokenDetails,
  setOpen,
}) => {
  const [transactionInputs, setTransactionInputs] = useState<Transaction>(transactionToSign);
  const [result, setResult] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getDataForm = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (transactionInputs) {
        setIsLoading(true);
        const data = await getEncode({
          ...transactionInputs,
          chainId: transactionToSign.chainId,
          format: wallet.signFormat,
          pubKey: (wallet.getPubkey && (await wallet.getPubkey())) || undefined,
          amount: transactionInputs.useMaxAmount ? undefined : transactionInputs.formattedAmount,
        });
        const result = data.transaction;
        setResult(result);
        if (!(result.status.errors.length > 0)) {
          setEncodedTransaction(result.encoded);
          const fees = typeof result?.plain?.fees === "string" ? result?.plain?.fees : transactionInputs.fees;
          const gas = typeof result?.plain?.gas === "string" ? result?.plain?.gas : transactionInputs.gas;
          const amount =
            typeof result?.plain?.amount === "string" ? result?.plain?.amount : transactionInputs.amount;
          setTransactionToSign({
            ...transactionInputs,
            amount,
            fees,
            gas,
          });
          setOpen(true);
        }
        setIsLoading(false);
      }
    },
    [
      transactionInputs,
      wallet,
      setEncodedTransaction,
      setTransactionToSign,
      setOpen,
      transactionToSign.chainId,
    ]
  );

  useEffect(() => {
    setTransactionInputs({
      ...transactionToSign,
      amount: transactionToSign.amount ? amountToMainUnit(transactionToSign.amount, wallet.unit) || "" : "",
    });
    setResult(undefined);
    setIsLoading(false);
  }, [wallet, transactionToSign]);

  return (
    transactionInputs && (
      <Card className="w-full">
        <form onSubmit={getDataForm}>
          <CardHeader className="flex flex-row items-start bg-muted/80">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">Perform a Transaction</CardTitle>
              <CardDescription>
                <span className="font-light">Transaction prepared using the Adamik Write API</span>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid py-4">
              <EncodeForm
                setTransactionInputs={setTransactionInputs}
                transactionInputs={transactionInputs}
                wallet={wallet}
                tokenDetails={tokenDetails}
              />
              {isLoading ? (
                <Loading />
              ) : result && result.status.errors.length > 0 ? (
                <>
                  <Label htmlFor="name">Result errors</Label>
                  <Textarea
                    className="border text-xs p-2 rounded-md"
                    value={JSON.stringify(result.status)}
                    readOnly={true}
                  />
                </>
              ) : (
                result && (
                  <div>
                    <Label htmlFor="name">Result</Label>
                    <Textarea
                      className="border text-xs p-2 rounded-md"
                      value={JSON.stringify(result.encoded)}
                      readOnly={true}
                    />
                  </div>
                )
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Encode</Button>
          </CardFooter>
        </form>
      </Card>
    )
  );
};
