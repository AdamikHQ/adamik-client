import { env } from "@/env";
import { Chain } from "@/lib/types";

export const broadcast = async (
  chainId: Chain,
  signature: string,
  encodedTransaction: string
) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_ADAMIK_API_URL}/transaction/broadcast`,
    {
      headers: {
        "X-API-KEY": env.NEXT_PUBLIC_ADAMIK_API_KEY,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        transaction: {
          plain: { chainId },
          encoded: encodedTransaction,
          signature,
        },
      }),
    }
  );

  if (response.status === 200) {
    return await response.json();
  }
};
