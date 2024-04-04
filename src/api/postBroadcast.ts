import { env } from "@/env";
import { Transaction } from "@/lib/types";

type BroadcastArgs = {
  transaction: Transaction;
  signature: string;
  encodedTransaction?: string;
};
export const broadcast = async ({
  transaction,
  signature,
  encodedTransaction,
}: BroadcastArgs) => {
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
          plain: transaction,
          encoded: encodedTransaction,
          signature,
        },
      }),
    },
  );

  if (response.status === 200) {
    return await response.json();
  }
};
