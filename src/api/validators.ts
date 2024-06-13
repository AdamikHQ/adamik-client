"use server";

import { env, ADAMIK_API_URL } from "~/env";
import { cache } from "~/utils/cache";

const getValidatorsCall = async (chainId: string, offset?: number, limit?: number) => {
  const url = new URL(`${ADAMIK_API_URL}/chains/${chainId}/validators`);
  const body: {
    chainId: string;
    offset?: string;
    limit?: string;
  } = {
    chainId,
  };
  if (offset) {
    body.offset = offset.toString();
  }
  if (limit) {
    body.limit = limit.toString();
  }
  const response = await fetch(url, {
    headers: {
      Authorization: env.ADAMIK_API_KEY,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  });

  if (response.status !== 200) {
    console.error("validators - backend error:", response.statusText);
  }

  return response.json();
};

// TODO Missing return type
export const getValidators = async (chainId: string, offset?: number, limit?: number) => {
  const cacheValidators = cache.get(`validators-${chainId}-${offset}-${limit}`);

  if (!cacheValidators) {
    const validators = await getValidatorsCall(chainId, offset, limit);
    cache.set(`validators-${chainId}-${offset}-${limit}`, validators);
    return validators;
  }

  return cacheValidators;
};
