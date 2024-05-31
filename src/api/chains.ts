"use server";

import { env, ADAMIK_API_URL } from "~/env";

// TODO Missing return type
export const getSupportedChainsIds = async () => {
  const response = await fetch(`${ADAMIK_API_URL}/chains`, {
    headers: {
      Authorization: env.ADAMIK_API_KEY,
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  if (response.status === 200) {
    const data = await response.json();

    return data;
  }

  return null;
};
