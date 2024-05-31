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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"; // Import the Tabs components
import { Tooltip } from "./ui/tooltip"; // Import the Tooltip component

type DataProps = { address: string; chainId: string };

export const Data: React.FC<DataProps> = ({ address, chainId }) => {
  const [result, setResult] = useState<any>();
  const [chainDetails, setChainDetails] = useState<any>();
  const [tokenDetails, setTokenDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        <div className="flex-1 grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">Account Overview</CardTitle>
          <CardDescription>
            <span className="font-light"> Data retrieved from Adamik Read API</span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="userMode">
          <TabsList>
            <TabsTrigger value="userMode">User Mode</TabsTrigger>
            <TabsTrigger value="developerMode">Developer Mode</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <Loading />
          ) : (
            <>
              <TabsContent value="userMode">
                {result && chainDetails && (
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
                    <Button onClick={fetchData} className="mt-4">
                      Refresh Data
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="developerMode">
                <div className="mt-4">
                  <div className="flex items-center">
                    <Label htmlFor="name">Chain Details JSON</Label>
                    <Tooltip text="Click to view the API documentation for retrieving chain details">
                      <a href="https://docs.adamik.io/api-reference/endpoint/get-apichains-chainid" target="_blank" rel="noopener noreferrer">
                        <svg className="w-4 h-4 ml-2 text-gray-500 cursor-pointer" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a7 7 0 100 14A7 7 0 009 2zM8 10V7h2v3H8zm0 4v-2h2v2H8z" />
                        </svg>
                      </a>
                    </Tooltip>
                  </div>
                  <Textarea
                    className="border text-xs p-2 rounded-md h-fit"
                    value={JSON.stringify(chainDetails, null, 2)}
                    readOnly={true}
                  />
                  <div className="flex items-center mt-4">
                    <Label htmlFor="name">Data State JSON</Label>
                    <Tooltip text="Click to view the API documentation for data state endpoint">
                      <a href="https://docs.adamik.io/api-reference/endpoint/post-apidatastate" target="_blank" rel="noopener noreferrer">
                        <svg className="w-4 h-4 ml-2 text-gray-500 cursor-pointer" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a7 7 0 100 14A7 7 0 009 2zM8 10V7h2v3H8zm0 4v-2h2v2H8z" />
                        </svg>
                      </a>
                    </Tooltip>
                  </div>
                  <Textarea
                    className="border text-xs p-2 rounded-md h-fit"
                    value={JSON.stringify(result, null, 2)}
                    readOnly={true}
                  />
                  <div className="flex items-center mt-4">
                    <Label htmlFor="name">Token Details JSON</Label>
                    <Tooltip text="Click to view the API documentation for token information endpoint">
                      <a href="https://docs.adamik.io/api-reference/endpoint/get-apichains-chainid-token-tokenid" target="_blank" rel="noopener noreferrer">
                        <svg className="w-4 h-4 ml-2 text-gray-500 cursor-pointer" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a7 7 0 100 14A7 7 0 009 2zM8 10V7h2v3H8zm0 4v-2h2v2H8z" />
                        </svg>
                      </a>
                    </Tooltip>
                  </div>
                  <Textarea
                    className="border text-xs p-2 rounded-md h-fit"
                    value={JSON.stringify(tokenDetails, null, 2)}
                    readOnly={true}
                  />
                  <Button onClick={fetchData} className="mt-4">
                    Refresh Data
                  </Button>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};
