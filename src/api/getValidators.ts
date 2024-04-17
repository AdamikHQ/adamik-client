import { env } from "@/env";
import { cache } from "@/lib/cache";

const getValidatorsCall = async (
  chainId: string,
  offset?: number,
  limit?: number
) => {
  const url = new URL(`${env.NEXT_PUBLIC_ADAMIK_API_URL}/data/validators`)
  url.searchParams.append("chainId", chainId);
  url.searchParams.append("offset", offset?.toString() || "0");
  url.searchParams.append("limit", limit?.toString() || "50");
  const response = await fetch(
    url,
    {
      headers: {
        "X-API-KEY": env.NEXT_PUBLIC_ADAMIK_API_KEY,
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  );

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    console.error("state - backend error:", response.statusText);
  }
};

export const getValidators = async (
  chainId: string,
  offset?: number,
  limit?: number
) => {
  const cacheValidators = cache.get(`validators-${chainId}-${offset}-${limit}`);

  if (!cacheValidators) {
    const validators = await getValidatorsCall(chainId, offset, limit);
    cache.set(`validators-${chainId}-${offset}-${limit}`, validators);
    return validators;
  }

  return cacheValidators;
};
