"use client";

import { getEncode } from "@/api/getEncode";
import { IWallet, Transaction } from "@/lib/types";
import { amountToSmallestUnit } from "@/lib/utils";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loading } from "./ui/loading";
import { Textarea } from "./ui/textarea";

type EncodeProps = {
  transaction: Transaction;
  setTransaction: (transaction: Transaction) => void;
  setEncodedTransaction: (encodedTransaction: string) => void;
  wallet: IWallet;
};

export const Encode: React.FC<EncodeProps> = ({
  transaction,
  setTransaction,
  setEncodedTransaction,
  wallet,
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
            wallet.unit,
          ), //FIXME: Need to put logic in backend see with Hakim
        });
        setResult(data);

        const dataJSON = await getEncode({
          ...transaction,
          format: "json",
          pubKey: (wallet.getPubkey && (await wallet.getPubkey())) || undefined,
          amount: amountToSmallestUnit(
            transaction.amount as string,
            wallet.unit,
          ), //FIXME: Need to put logic in backend see with Hakim
        });
        setResultJSON(dataJSON);
        if (data) {
          setEncodedTransaction(
            wallet.signFormat === "hex" ? data.encoded : dataJSON.encoded,
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
        setIsLoading(false);
      }
    },
    [transaction, wallet, setEncodedTransaction, setTransaction],
  );

  useEffect(() => {
    setResult(undefined);
    setResultJSON(undefined);
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
            <div className="grid py-4 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="senders">Sender</Label>
                <Input
                  id="senders"
                  placeholder="Sender"
                  value={transaction?.senders[0] || ""}
                  onChange={(e) => {
                    setTransaction({
                      ...transaction,
                      senders: [e.target.value],
                    });
                  }}
                />
                <Label htmlFor="recipients">Recipient</Label>
                <Input
                  id="recipients"
                  placeholder="Recipient"
                  value={transaction?.recipients[0] || ""}
                  onChange={(e) => {
                    setTransaction({
                      ...transaction,
                      recipients: [e.target.value],
                    });
                  }}
                />
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  placeholder="Amount"
                  value={transaction?.amount || ""}
                  onChange={(e) => {
                    setTransaction({
                      ...transaction,
                      amount: e.target.value,
                    });
                  }}
                />
              </div>
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
