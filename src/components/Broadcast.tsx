"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { FormEvent, useCallback, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Loading } from "./ui/loading";
import { Textarea } from "./ui/textarea";
import { broadcast } from "@/api/postBroadcast";
import { dynamicChainConvert } from "@/lib/dynamicChainConvert";

export const Broadcast = () => {
  const { walletConnector, primaryWallet } = useDynamicContext();
  const [signature, setSignature] = useState<string>("");
  const [encodedTransaction, setEncodedTransaction] = useState<string>("");
  const [result, setResult] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getDataForm = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (encodedTransaction && signature && primaryWallet) {
        setIsLoading(true);
        const data = await broadcast(
          dynamicChainConvert(primaryWallet?.chain),
          signature,
          encodedTransaction
        );
        setResult(data);
        setIsLoading(false);
      }
    },
    [encodedTransaction]
  );

  return (
    walletConnector && (
      <Card className="w-full">
        <form onSubmit={getDataForm}>
          <CardHeader>
            <CardTitle>Broadcast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="signature">Signature</Label>
                <Textarea
                  className="border text-xs p-2 rounded-md"
                  onChange={(e) => setSignature(e.target.value)}
                  value={signature}
                />
                <Label htmlFor="encodedtransactions">Encoded Transaction</Label>
                <Textarea
                  className="border text-xs p-2 rounded-md"
                  onChange={(e) => setEncodedTransaction(e.target.value)}
                  value={encodedTransaction}
                />
              </div>
              {isLoading ? (
                <Loading />
              ) : (
                result && (
                  <div>
                    <Label htmlFor="name">Result</Label>
                    <Textarea
                      className="border text-xs p-2 rounded-md"
                      value={JSON.stringify(result)}
                      readOnly={true}
                    />
                  </div>
                )
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit">Broadcast</Button>
          </CardFooter>
        </form>
      </Card>
    )
  );
};
