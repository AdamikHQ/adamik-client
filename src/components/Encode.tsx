"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Loading } from "./ui/loading";
import { getEncode } from "@/api/getEncode";
import { Transaction } from "@/lib/types";
import { dynamicChainConvert } from "@/lib/dynamicChainConvert";
import { Textarea } from "./ui/textarea";
import { amountToSmallestUnit } from "@/lib/utils";

export const Encode = () => {
  const { primaryWallet } = useDynamicContext();
  const [transaction, setTransaction] = useState<Transaction>();
  const [result, setResult] = useState<any>();
  const [resultJSON, setResultJSON] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getDataForm = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      console.log(transaction);
      if (transaction) {
        setIsLoading(true);
        const data = await getEncode({
          ...transaction,
          amount: amountToSmallestUnit(transaction.amount as string, 6), //FIXME: Need to put logic in backend see with Hakim
        });
        setResult(data);

        const dataJSON = await getEncode({
          ...transaction,
          format: "json",
          amount: amountToSmallestUnit(transaction.amount as string, 6), //FIXME: Need to put logic in backend see with Hakim
        });
        setResultJSON(dataJSON);
        setIsLoading(false);
      }
    },
    [transaction]
  );

  useEffect(() => {
    setTransaction(undefined);
    setResult("");
    if (primaryWallet?.address) {
      setTransaction({
        ...transaction,
        chainId: dynamicChainConvert(primaryWallet.chain),
        senders: [primaryWallet.address],
        mode: "transfer",
        recipients: [],
        useMaxAmount: false,
      });
    }
  }, [primaryWallet?.address]);

  return (
    transaction && (
      <Card className="w-full">
        <form onSubmit={getDataForm}>
          <CardHeader>
            <CardTitle>Transaction Encoder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
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
          <CardFooter className="flex justify-between">
            <Button type="submit">Encode</Button>
          </CardFooter>
        </form>
      </Card>
    )
  );
};
