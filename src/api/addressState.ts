"use server";

import { env, ADAMIK_API_URL } from "~/env";

export const getAddressState = async (chainId: string, address: string) => {
  const response = await fetch(`${ADAMIK_API_URL}/address/state`, {
    headers: {
      Authorization: env.ADAMIK_API_KEY,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ chainId, address }),
  });

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    console.error("state - backend error:", response.statusText);
    return null;
  }
};
