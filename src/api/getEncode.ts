import { env } from "@/env";
import { Transaction } from "@/lib/types";

export const getEncode = async (plainTransaction: Transaction) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_ADAMIK_API_URL}/transaction/encode`,
    {
      headers: {
        "X-API-KEY": env.NEXT_PUBLIC_ADAMIK_API_KEY,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ transaction: plainTransaction }),
    }
  );

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    console.error("encode - backend error:", response.statusText);
  }
};
