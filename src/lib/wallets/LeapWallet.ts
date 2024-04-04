import { AminoSignResponse, Keplr, OfflineAminoSigner, OfflineDirectSigner, StdSignDoc } from "@keplr-wallet/types";
import { IWallet } from "../types";
import { off } from "process";


export class LeapWallet implements IWallet {
  public name = "Leap";
  public supportedChains = ["cosmoshub", "osmosis"];
  public icon = "/icons/Leap.svg";
  public unit = 6; // TODO: Get from Adamik ? 
  public signFormat = "amino";

  private adamikNameConverted: { [k: string]: string } = {
    "cosmoshub": "cosmoshub-4",
    "osmosis": "osmosis-1",
  }

  private offlineSigner: OfflineAminoSigner & OfflineDirectSigner | null = null;

  private checkConnectivity(): Keplr {
    const { leap } = window
    if (!leap) {
      throw new Error("Leap extension not installed");
    }

    return leap;
  }


  async connect(chainId: string): Promise<void> {
    const leap = this.checkConnectivity();

    await leap.enable(this.adamikNameConverted[chainId]);
  }

  async getAddress(chainId: string): Promise<string> {
    const leap = this.checkConnectivity();

    this.offlineSigner = leap.getOfflineSigner((this.adamikNameConverted[chainId]));
    const accounts = await this.offlineSigner.getAccounts();

    return accounts[0].address;
  }

  async signMessage(chainId: string, message: StdSignDoc): Promise<AminoSignResponse> {
    const leap = this.checkConnectivity();

    if (this.offlineSigner === null) {
      this.offlineSigner = leap.getOfflineSigner((this.adamikNameConverted[chainId]));
    }
    const accounts = await this.offlineSigner.getAccounts();
    const signature = await this.offlineSigner.signAmino(accounts[0].address, message);

    return signature;
  }

  extractSignature(signature: AminoSignResponse): string {
    return signature.signature.signature;
  }

  async getPubkey(): Promise<string> {
    const accounts = await this.offlineSigner!.getAccounts();

    return Buffer.from(accounts[0].pubkey).toString('base64');
  }


  getExplorerUrl(chainId: string, hash: string): string {
    return `https://www.mintscan.io/${chainId}/txs/${hash}`;
  }
}