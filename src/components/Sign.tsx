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

export const Sign = () => {
  const { walletConnector } = useDynamicContext();
  const [encodedTransaction, setEncodedTransaction] = useState<string>("");
  const [result, setResult] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getDataForm = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (encodedTransaction && walletConnector) {
        setIsLoading(true);
        const signer = await walletConnector.getSigner();
        console.log({ signer });
        const data = await walletConnector.signMessage(encodedTransaction);
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
            <CardTitle>Sign</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="senders">Encoded transaction</Label>
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
            <Button type="submit">Sign Message</Button>
          </CardFooter>
        </form>
      </Card>
    )
  );
};
