import { env } from "~/env";

export const getData = async (chainId: string, address: string) => {
  const response = await fetch(`${env.NEXT_PUBLIC_ADAMIK_API_URL}/data/state`, {
    headers: {
      Authorization: env.NEXT_PUBLIC_ADAMIK_API_KEY,
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
  }
};
