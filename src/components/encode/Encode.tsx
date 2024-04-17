"use client";

import { getEncode } from "@/api/getEncode";
import { IWallet, Transaction } from "@/lib/types";
import { amountToSmallestUnit } from "@/lib/utils";
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
  transaction: Transaction;
  setTransaction: React.Dispatch<React.SetStateAction<Transaction>>;
  setEncodedTransaction: (encodedTransaction: string) => void;
  wallet: IWallet;
  setOpen: (open: boolean) => void;
};

export const Encode: React.FC<EncodeProps> = ({
  transaction,
  setTransaction,
  setEncodedTransaction,
  wallet,
  setOpen,
}) => {
  const [result, setResult] = useState<any>();
  const [resultJSON, setResultJSON] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getDataForm = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (transaction) {
        setIsLoading(true);
        const data = await getEncode({
          ...transaction,
          pubKey: (wallet.getPubkey && (await wallet.getPubkey())) || undefined,
          amount: amountToSmallestUnit(
            transaction.amount as string,
            wallet.unit
          ), //FIXME: Need to put logic in backend see with Hakim
        });
        setResult(data);
        if (!(data.status.errors.length > 0)) {
          const dataJSON = await getEncode({
            ...transaction,
            format: "json",
            pubKey:
              (wallet.getPubkey && (await wallet.getPubkey())) || undefined,
            amount: amountToSmallestUnit(
              transaction.amount as string,
              wallet.unit
            ), //FIXME: Need to put logic in backend see with Hakim
          });
          setResultJSON(dataJSON);
          if (data) {
            setEncodedTransaction(
              wallet.signFormat === "hex" ? data.encoded : dataJSON.encoded
            );
            const fees =
              typeof data?.plain?.fees === "string"
                ? data?.plain?.fees
                : transaction.fees;
            const gas =
              typeof data?.plain?.gas === "string"
                ? data?.plain?.gas
                : transaction.gas;
            setTransaction({
              ...transaction,
              fees,
              gas,
            });
          }
          setOpen(true);
        }
        setIsLoading(false);
      }
    },
    [transaction, wallet, setEncodedTransaction, setTransaction, setOpen]
  );

  useEffect(() => {
    setResult(undefined);
    setResultJSON(undefined);
    setIsLoading(false);
  }, [wallet, transaction.chainId]);

  return (
    transaction && (
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
                setTransaction={setTransaction}
                transaction={transaction}
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
                  <>
                    <div>
                      <Label htmlFor="name">Result hex</Label>
                      <Textarea
                        className="border text-xs p-2 rounded-md"
                        value={JSON.stringify(result.encoded)}
                        readOnly={true}
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Result JSON</Label>
                      <Textarea
                        className="border text-xs p-2 rounded-md"
                        value={JSON.stringify(resultJSON.encoded)}
                        readOnly={true}
                      />
                    </div>
                  </>
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
