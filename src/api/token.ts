"use server";

import { env, ADAMIK_API_URL } from "~/env";
import { cache } from "~/utils/cache";

const getTokenCall = async (chainId: string, tokenId: string) => {
  const url = new URL(`${ADAMIK_API_URL}/chains/${chainId}/token/${tokenId}`);

  const response = await fetch(url, {
    headers: {
      Authorization: env.ADAMIK_API_KEY,
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  if (response.status !== 200) {
    console.error("token - backend error:", response.statusText);
  }

  return response.json();
};

// TODO Missing return type
export const getToken = async (chainId: string, tokenId: string) => {
  const cacheToken = cache.get(`token-${chainId}-${tokenId}`);

  if (!cacheToken) {
    const token = await getTokenCall(chainId, tokenId);
    cache.set(`token-${chainId}-${tokenId}`, token);
    return token;
  }

  return cacheToken;
};
