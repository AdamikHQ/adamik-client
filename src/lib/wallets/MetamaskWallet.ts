import { getEtherscanUrl, getMetamaskConfig } from "../config/ethereum";
import { Chain, IWallet } from "../types";
import detectEthereumProvider from "@metamask/detect-provider";

export class Metamask implements IWallet {
  public name = "Metamask";
  public supportedChains: Chain[] = [
    "sepolia",
    "holesky",
    "ethereum",
    "zksync",
    "zksync-testnet",
    "injective-testnet",
    "base",
    "base-sepolia",
    "optimism",
    "optimism-sepolia",
  ];
  public icon = "/icons/Metamask.svg";
  public unit = 18; // TODO: Get from Adamik ?
  public signFormat = "json";
  public withoutBroadcast: boolean = true;
  private provider: any = undefined;

  constructor() {
    this.checkConnectivity();
  }

  private async checkConnectivity(): Promise<void> {
    this.provider = await detectEthereumProvider();
    if (!Boolean(this.provider)) {
      throw new Error("Metamask extension not installed");
    }
  }

  async connect(chainId: string): Promise<void> {
    const ethChainConfig = getMetamaskConfig(chainId);

    if (!ethChainConfig) {
      throw new Error("Chain not configured in @lib/ethereum/config.ts");
    }

    try {
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethChainConfig.chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await this.provider.request({
            method: "wallet_addEthereumChain",
            params: [ethChainConfig],
          });
        } catch (addError) {
          throw addError;
        }
      }
      throw switchError;
    }
  }

  async getAddress(chainId: string): Promise<string> {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    return accounts[0];
  }

  async signMessage(chainId: any, message: any): Promise<any> {
    const request = await this.provider.request({
      method: "eth_sendTransaction",
      params: [message],
    });

    return request;
  }

  extractSignature(signature: any): string {
    throw new Error("Metamask does not support signing messages");
  }

  getExplorerUrl(chainId: string, hash: string): string {
    return getEtherscanUrl(chainId, hash);
  }

  getHashFromBroadcast(broadcast: string): string {
    console.log({ broadcast });
    return broadcast;
  }
}
