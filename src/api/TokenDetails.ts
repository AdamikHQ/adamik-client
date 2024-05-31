"use server";

import { env, ADAMIK_API_URL } from "~/env";

export const getTokenInfo = async (chainId: string, tokenId: string) => {
  const response = await fetch(`${ADAMIK_API_URL}/chains/${chainId}/token/${tokenId}`, {
    headers: {
      Authorization: env.ADAMIK_API_KEY,
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  if (response.status === 200) {
    return await response.json();
  } else {
    throw new Error(`Failed to fetch token info: ${response.statusText}`);
  }
};