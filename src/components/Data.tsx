"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { getData } from "~/api/data";
import { getChainDetails } from "~/api/chainDetails"; // Import the function
import { getTokenInfo } from "~/api/TokenDetails"; // Import the TokenInfo function
import React, { useEffect, useState, useCallback } from "react";
import { Loading } from "./ui/loading";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

type DataProps = { address: string; chainId: string };

export const Data: React.FC<DataProps> = ({ address, chainId }) => {
  const [result, setResult] = useState<any>();
  const [chainDetails, setChainDetails] = useState<any>();
  const [tokenDetails, setTokenDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showJson, setShowJson] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    if (address) {
      setIsLoading(true);
      const data = await getData(chainId, address);
      setResult(data);
      const details = await getChainDetails(chainId);
      setChainDetails(details);

      // Fetch token details
      if (data.balances.tokens) {
        const tokenDetailsPromises = data.balances.tokens.map(async (token: any) => {
          const tokenInfo = await getTokenInfo(chainId, token.tokenId);
          return { ...token, ...tokenInfo };
        });
        const tokens = await Promise.all(tokenDetailsPromises);
        setTokenDetails(tokens);
      } else {
        setTokenDetails([]);
      }

      setIsLoading(false);
    }
  }, [address, chainId]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 30000); // Fetch data every 30 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [fetchData]);

  useEffect(() => {
    setIsLoading(false);
    setResult(undefined);
    setChainDetails(undefined);
    setTokenDetails([]);
  }, [address]);

  const formatBalance = (balance: string, decimals: number) => {
    const balanceInUnits = parseFloat(balance) / Math.pow(10, decimals);
    return balanceInUnits.toFixed(decimals).replace(/\.?0+$/, '');
  };

  return (
    <Card className="w-full">
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
            result && chainDetails && (
              <div>
                <div className="mt-4">
                  <div>
                    <strong>Balance:</strong> {formatBalance(result.balances?.native?.available, chainDetails.decimals)} {chainDetails.ticker}
                  </div>
                  <div className="ml-4">
                    {tokenDetails.map((token, index) => (
                      <div key={index}>
                        <strong>{token.name} Balance:</strong> {formatBalance(token.value, token.decimals)} {token.ticker}
                      </div>
                    ))}
                  </div>
                </div>
                <Button onClick={() => setShowJson(!showJson)} className="mt-4">
                  {showJson ? "Hide Advanced Information" : "Show Advanced Information"}
                </Button>
                {showJson && (
                  <div className="mt-4">
                    <Label htmlFor="name">Chain Details JSON</Label>
                    <Textarea
                      className="border text-xs p-2 rounded-md h-fit"
                      value={JSON.stringify(chainDetails, null, 2)}
                      readOnly={true}
                    />
                    <Label htmlFor="name" className="mt-4">Data State JSON</Label>
                    <Textarea
                      className="border text-xs p-2 rounded-md h-fit"
                      value={JSON.stringify(result, null, 2)}
                      readOnly={true}
                    />
                    <Label htmlFor="name" className="mt-4">Token Details JSON</Label>
                    <Textarea
                      className="border text-xs p-2 rounded-md h-fit"
                      value={JSON.stringify(tokenDetails, null, 2)}
                      readOnly={true}
                    />
                <Button onClick={fetchData} className="mt-4">
                  Refresh Data
                </Button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};