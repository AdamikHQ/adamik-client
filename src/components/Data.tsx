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
import { getData } from "@/api/getData";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Loading } from "./ui/loading";
import { dynamicChainConvert } from "@/lib/dynamicChainConvert";
import { Textarea } from "./ui/textarea";

export const Data = () => {
  const { primaryWallet } = useDynamicContext();
  const [address, setAddress] = useState<string>("");
  const [result, setResult] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getDataForm = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (address && primaryWallet?.chain) {
        setIsLoading(true);
        const data = await getData(
          dynamicChainConvert(primaryWallet?.chain),
          address
        );
        setResult(data);
        setIsLoading(false);
      }
    },
    [address]
  );

  useEffect(() => {
    setAddress("");
    setResult("");
    if (primaryWallet?.address) {
      setAddress(primaryWallet?.address);
    }
  }, [primaryWallet?.address]);

  return (
    primaryWallet && (
      <Card className="w-full">
        <form onSubmit={getDataForm}>
          <CardHeader>
            <CardTitle>Get Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Address</Label>
                <Input
                  id="address"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
            <Button type="submit">Fetch Data</Button>
          </CardFooter>
        </form>
      </Card>
    )
  );
};
