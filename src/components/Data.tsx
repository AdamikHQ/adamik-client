"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { getData } from "~/api/data";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { Loading } from "./ui/loading";
import { Textarea } from "./ui/textarea";

type DataProps = { address: string; chainId: string };

export const Data: React.FC<DataProps> = ({ address, chainId }) => {
  const [result, setResult] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getDataForm = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (address) {
        setIsLoading(true);
        const data = await getData(chainId, address);
        setResult(data);
        setIsLoading(false);
      }
    },
    [address, chainId]
  );

  useEffect(() => {
    setIsLoading(false);
    setResult(undefined);
  }, [address]);

  return (
    <Card className="w-full">
      <form onSubmit={getDataForm}>
        <CardHeader className="flex flex-row items-start bg-muted/80">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">Adamik - Get Data</CardTitle>
            <CardDescription>
              <span className="font-light">/data/state</span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Address</Label>
              <Input id="address" placeholder="Address" value={address} disabled={true} readOnly={true} />
              <Label htmlFor="name">ChainId</Label>
              <Input id="chainId" placeholder="chainId" disabled={true} readOnly={true} value={chainId} />
            </div>
            {isLoading ? (
              <Loading />
            ) : (
              result && (
                <div>
                  <Label htmlFor="name">Result</Label>
                  <Textarea
                    className="border text-xs p-2 rounded-md h-fit"
                    value={JSON.stringify(result, null, 2)}
                    readOnly={true}
                  />
                </div>
              )
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Fetch Data</Button>
        </CardFooter>
      </form>
    </Card>
  );
};
