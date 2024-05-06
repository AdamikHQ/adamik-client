import { env } from "~/env";

export const getSupportedChainsIds = async () => {
  const response = await fetch(`${env.NEXT_PUBLIC_ADAMIK_API_URL}/chains`, {
    headers: {
      "X-API-KEY": env.NEXT_PUBLIC_ADAMIK_API_KEY,
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
