"use server";

import { env, ADAMIK_API_URL } from "~/env";
import { Transaction } from "~/types";

type BroadcastArgs = {
  transaction: Transaction;
  signature: string;
  encodedTransaction?: string;
};
// TODO Missing return type
export const broadcast = async ({ transaction, signature, encodedTransaction }: BroadcastArgs) => {
  const response = await fetch(`${ADAMIK_API_URL}/transaction/broadcast`, {
    headers: {
      Authorization: env.ADAMIK_API_KEY,
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
  });

  if (response.status === 200) {
    return await response.json();
  }
};
