import { Chain } from "./types";

export const dynamicChainConvert = (chain: string): Chain => {
  switch (chain) {
    case "cosmos":
    case "COSMOS":
      return "cosmoshub";
    case "ALGO":
      return "algorand";
  }
  return chain as Chain;
};
