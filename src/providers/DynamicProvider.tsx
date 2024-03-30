"use client";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";

import { AlgorandWalletConnectors } from "@dynamic-labs/algorand";
import { CosmosWalletConnectors } from "@dynamic-labs/cosmos";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { env } from "@/env";
import React from "react";

export const DynamicProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: env.NEXT_PUBLIC_DYNAMIC_ENV_KEY,
        walletConnectors: [
          AlgorandWalletConnectors,
          CosmosWalletConnectors,
          EthereumWalletConnectors,
        ],
      }}
    >
      {children}
    </DynamicContextProvider>
  );
};
