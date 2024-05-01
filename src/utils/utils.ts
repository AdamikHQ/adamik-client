import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Chain, Mode } from "~/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helpers to convert from/to user-convenient format in main unit, and smallest unit of the chain
// FIXME Magnitude could be a server-side concern (+1)
export function amountToSmallestUnit(amount: string, decimals: number): string {
  const computedAmount = parseFloat(amount) * Math.pow(10, decimals);
  return computedAmount.toString();
}

export function amountToMainUnit(amount: string, decimals: number): string | null {
  const parsedAmount = parseInt(amount);
  return Number.isNaN(parsedAmount) ? null : (parsedAmount / Math.pow(10, decimals)).toString();
}

export function mintscanUrl(chainId: string, hash: string): string {
  if (chainId === "cosmoshub") {
    return `https://www.mintscan.io/cosmos/txs/${hash}`;
  }

  return `https://www.mintscan.io/${chainId}/txs/${hash}`;
}

export function getChainMode(chainId: Chain): Mode[] {
  switch (chainId) {
    case "cosmoshub":
    case "osmosis":
      return ["transfer", "delegate"];
  }
  return ["transfer"];
}
