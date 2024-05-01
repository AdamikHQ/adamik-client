import { env } from "~/env";

export const getChainDetails = async (chainId: string) => {
  const response = await fetch(`${env.NEXT_PUBLIC_ADAMIK_API_URL}/chains/${chainId}`, {
    headers: {
      "X-API-KEY": env.NEXT_PUBLIC_ADAMIK_API_KEY,
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  if (response.status === 200) {
    return await response.json();
  }
};
