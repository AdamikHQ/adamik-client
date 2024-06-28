"use client";

import { Info } from "lucide-react"; // Import icon for tooltip
import React, { useCallback, useEffect, useState } from "react";
import { getChainDetails } from "~/api/chainDetails"; // Import the function
import { amountToMainUnit } from "~/utils/utils"; // Import amountToMainUnit function
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Loading } from "./ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"; // Import the Tabs components
import { Textarea } from "./ui/textarea";
import { Tooltip } from "./ui/tooltip"; // Import the Tooltip component
import { getAddressState } from "~/api/addressState";

type DataProps = {
  address: string;
  chainId: string;
  tokenDetails: any[];
  setTokenDetails: React.Dispatch<React.SetStateAction<any[]>>;
};

export const Data: React.FC<DataProps> = ({ address, chainId, tokenDetails, setTokenDetails }) => {
  const [addressData, setAddressData] = useState<any>();
  const [chainDetails, setChainDetails] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    if (address) {
      setIsLoading(true);
      const addressData = await getAddressState(chainId, address);
      setAddressData(addressData);
      const details = await getChainDetails(chainId);
      setChainDetails(details);

      const tokens = addressData.balances.tokens.map((tokenAmount: any) => {
        return { value: tokenAmount.amount, ...tokenAmount.token };
      });
      setTokenDetails(tokens);

      setIsLoading(false);
    }
  }, [address, chainId, setTokenDetails]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 30000); // Fetch data every 30 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [fetchData]);

  useEffect(() => {
    setIsLoading(false);
    setAddressData(undefined);
    setChainDetails(undefined);
  }, [address]);

  const formatBalance = (balance: string, decimals: number) => {
    return amountToMainUnit(balance, decimals);
  };

  const rewards = addressData?.balances?.staking?.rewards.native.reduce(
    (total: bigint, reward: any) => total + BigInt(reward.amount),
    0n
  );

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
        <Tabs className="mt-4" defaultValue="userMode">
          <TabsList>
            <TabsTrigger value="userMode">User Mode</TabsTrigger>
            <TabsTrigger value="developerMode">Developer Mode</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <Loading />
          ) : (
            <>
              <TabsContent value="userMode">
                {addressData && chainDetails && (
                  <div>
                    <div className="mt-4">
                      <div>
                        <strong>Balance:</strong>{" "}
                        {formatBalance(addressData.balances?.native?.available, chainDetails.decimals)}{" "}
                        {chainDetails.ticker}
                      </div>
                      <div>
                        <strong>Tokens:</strong>{" "}
                      </div>
                      <div className="ml-4">
                        {tokenDetails.map((token, index) => (
                          <div key={index}>
                            <strong>{token.name} Balance:</strong>{" "}
                            {formatBalance(token.value, token.decimals)} {token.ticker}
                          </div>
                        ))}
                      </div>
                      {addressData?.balances?.staking && (
                        <>
                          <div>
                            <strong>Staking:</strong>{" "}
                          </div>
                          <div className="ml-4">
                            <strong>Locked:</strong>{" "}
                            {formatBalance(addressData.balances?.staking?.locked, chainDetails.decimals)}{" "}
                            {chainDetails.ticker}
                          </div>
                          <div className="ml-4">
                            <strong>Unlocking:</strong>{" "}
                            {formatBalance(addressData.balances?.staking?.unlocking, chainDetails.decimals)}{" "}
                            {chainDetails.ticker}
                          </div>
                          <div className="ml-4">
                            <strong>Unlocked:</strong>{" "}
                            {formatBalance(addressData.balances?.staking?.unlocked, chainDetails.decimals)}{" "}
                            {chainDetails.ticker}
                          </div>
                          <div className="ml-4">
                            <strong>Rewards:</strong> {formatBalance(rewards, chainDetails.decimals)}{" "}
                            {chainDetails.ticker}
                          </div>
                        </>
                      )}
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
                      <a
                        href="https://docs.adamik.io/api-reference/endpoint/get-apichains-chainid"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Info className="w-4 h-4 ml-2 text-gray-500 cursor-pointer" />
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
                      <a
                        href="https://docs.adamik.io/api-reference/endpoint/post-apidatastate"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Info className="w-4 h-4 ml-2 text-gray-500 cursor-pointer" />
                      </a>
                    </Tooltip>
                  </div>
                  <Textarea
                    className="border text-xs p-2 rounded-md h-fit"
                    value={JSON.stringify(addressData, null, 2)}
                    readOnly={true}
                  />
                  <div className="flex items-center mt-4">
                    <Label htmlFor="name">Token Details JSON</Label>
                    <Tooltip text="Click to view the API documentation for token information endpoint">
                      <a
                        href="https://docs.adamik.io/api-reference/endpoint/get-apichains-chainid-token-tokenid"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Info className="w-4 h-4 ml-2 text-gray-500 cursor-pointer" />
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
