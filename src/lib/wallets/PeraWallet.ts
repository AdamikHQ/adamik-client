import { Chain, IWallet } from "../types";
import { PeraWalletConnect } from "@perawallet/connect";

export class PeraWallet implements IWallet {
  public name = "PeraWallet";
  public supportedChains: Chain[] = ["algorand"];
  public icon = "/icons/Pera.svg";
  public unit = 6; // TODO: Get from Adamik ?
  public signFormat = "hex";
  private addresses: string[] = [];
  public withoutBroadcast: boolean = false;

  private peraWallet: PeraWalletConnect | null = null;

  // Add missing properties
  async connect() {
    this.peraWallet = new PeraWalletConnect();
    try {
      this.addresses = await this.peraWallet.connect();
    } catch (e) {
      this.disconnect();
      throw e;
    }
  }

  async disconnect() {
    this.peraWallet?.disconnect();
    this.peraWallet = null;
  }

  async getAddress(): Promise<string> {
    if (this.peraWallet) {
      return this.addresses[0];
    }
    throw new Error("PeraWallet not connected");
  }

  async signMessage(payload: string): Promise<Uint8Array[]> {
    if (this.peraWallet) {
      return await this.peraWallet.signData(
        [
          {
            data: Uint8Array.from(Buffer.from(payload, "hex")),
            message: "",
          },
        ],
        this.addresses[0],
      );
      // return await this.peraWallet.signTransaction([payload], this.addresses[0]);
    }
    throw new Error("PeraWallet not connected");
  }

  extractSignature(signature: Uint8Array[]): string {
    return Buffer.from(signature[0]).toString("hex");
  }

  getExplorerUrl(chainId: string, hash: string): string {
    return `https://algoexplorer.io/tx/${hash}`;
  }

  getHashFromBroadcast(broadcast: { hash: string }): string {
    throw new Error("Method not implemented.");
  }
}
