import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Chain, Mode } from "~/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helpers to convert from/to user-convenient format in main unit, and smallest unit of the chain
// FIXME Magnitude could be a server-side concern (+1)
// https://adamik.atlassian.net/browse/ADV-131
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

// FIXME: API could provide supported modes for a given chain
// https://adamik.atlassian.net/browse/ADV-151
export function getChainModes(chainId: Chain): Mode[] {
  switch (chainId) {
    case "cosmoshub":
    case "osmosis":
    case "celestia":
    //case "cosmoshub-testnet":
    case "dydx":
    case "axelar":
      return ["transfer", "delegate"];
    case "algorand":
    case "ethereum":
    case "sepolia":
    case "holesky":
    case "zksync":
    case "zksync-sepolia":
    case "injective-testnet":
    case "polygon":
    case "fantom":
    case "base":
    case "base-sepolia":
    case "optimism": //case "optimism-sepolia":
    case "arbitrum": //case "arbitrum-sepolia":
      return ["transfer", "transferToken"];
    default:
      return ["transfer"];
  }
}
