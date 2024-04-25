"use client";

import { getEncode } from "@/api/getEncode";
import { Chain, IWallet, Transaction } from "@/lib/types";
import { amountToMainUnit, amountToSmallestUnit } from "@/lib/utils";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Loading } from "../ui/loading";
import { Textarea } from "../ui/textarea";
import { EncodeForm } from "./EncodeForm";

type EncodeProps = {
  transactionToSign: Transaction;
  setTransactionToSign: React.Dispatch<React.SetStateAction<Transaction>>;
  setEncodedTransaction: (encodedTransaction: string) => void;
  wallet: IWallet;
  setOpen: (open: boolean) => void;
};

export const Encode: React.FC<EncodeProps> = ({
  transactionToSign,
  setTransactionToSign,
  setEncodedTransaction,
  wallet,
  setOpen,
}) => {
  const [transactionInputs, setTransactionInputs] =
    useState<Transaction>(transactionToSign);
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
          amount: transactionInputs.useMaxAmount
            ? undefined
            : amountToSmallestUnit(transactionInputs.amount as string, wallet.unit), //FIXME: Need to put logic in backend see with Hakim
        });
        setResult(data);
        if (!(data.status.errors.length > 0)) {
          setEncodedTransaction(data.encoded);
          const fees =
            typeof data?.plain?.fees === "string"
              ? data?.plain?.fees
              : transactionInputs.fees;
          const gas =
            typeof data?.plain?.gas === "string"
              ? data?.plain?.gas
              : transactionInputs.gas;
          const amount =
            typeof data?.plain?.amount === "string"
              ? data?.plain?.amount
              : transactionInputs.amount;
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
      transactionToSign.chainId
    ]
  );

  useEffect(() => {
    setTransactionInputs({
      ...transactionToSign,
      amount: transactionToSign.amount
        ? amountToMainUnit(transactionToSign.amount, wallet.unit) || ""
        : "",
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
              <CardTitle className="group flex items-center gap-2 text-lg">
                Adamik - Transaction Encoder
              </CardTitle>
              <CardDescription>
                <span className="font-light">/transaction/encode</span>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid py-4">
              <EncodeForm
                setTransaction={setTransactionInputs}
                transaction={transactionInputs}
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
