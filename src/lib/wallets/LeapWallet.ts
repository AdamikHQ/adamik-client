import { AminoSignResponse, Keplr, StdSignDoc } from "@keplr-wallet/types";
import { IWallet } from "../types";


export class LeapWallet implements IWallet {
  public name = "Leap";
  public supportedChains = ["cosmoshub", "osmosis"];
  public icon = "/icons/Leap.svg";
  public unit = 6; // TODO: Get from Adamik ? 
  public signFormat = "amino";
  private targetedChain: string;
  private adamikNameConverted: { [k: string]: string } = {
    "cosmoshub": "cosmoshub-4",
    "osmosis": "osmosis-1",
  }
  constructor() {
    this.targetedChain = this.supportedChains[0];
  }

  private checkConnectivity(): Keplr {
    const { leap } = window
    if (!leap) {
      throw new Error("Leap extension not installed");
    }

    return leap;
  }

  setTargetedChain(chain: string): void {
    this.targetedChain = chain;
  }

  async connect(): Promise<void> {
    const leap = this.checkConnectivity();

    await leap.enable(this.adamikNameConverted[this.targetedChain]);
  }

  async getAddress(): Promise<string> {
    const leap = this.checkConnectivity();

    const offlineSigner = leap.getOfflineSigner((this.adamikNameConverted[this.targetedChain]));
    const accounts = await offlineSigner.getAccounts();

    return accounts[0].address;
  }

  async signMessage(message: StdSignDoc): Promise<AminoSignResponse> {
    const leap = this.checkConnectivity();

    const offlineSigner = leap.getOfflineSigner((this.adamikNameConverted[this.targetedChain]));
    const accounts = await offlineSigner.getAccounts();
    const signature = await offlineSigner.signAmino(accounts[0].address, message);

    return signature;
  }
}