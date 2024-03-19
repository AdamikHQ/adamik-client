export const dynamicChainConvert = (chain: string): string => {
  switch (chain) {
    case "cosmos":
    case "COSMOS":
      return "cosmoshub";
    case "ALGO":
      return "algorand";
  }
  return chain;
};
