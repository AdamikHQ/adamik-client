import { AminoSignResponse, Keplr, StdSignDoc } from "@keplr-wallet/types";
import { IWallet } from "../types";


export class KeplrWallet implements IWallet {
  public name = "Keplr";
  public supportedChains = ["cosmoshub", "osmosis"];
  public icon = "/icons/Keplr.svg";
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
    const { keplr } = window
    if (!keplr) {
      throw new Error("Keplr extension not installed");
    }

    return keplr;
  }

  setTargetedChain(chain: string): void {
    this.targetedChain = chain;
  }

  async connect(): Promise<void> {
    const keplr = this.checkConnectivity();

    await keplr.enable(this.adamikNameConverted[this.targetedChain]);
    const chains = await keplr.getChainInfosWithoutEndpoints();
    const chain = chains.find((chain) => {
      return chain.chainId === this.adamikNameConverted[this.targetedChain];
    });
    this.unit = chain?.currencies[0].coinDecimals as number;
  }

  async getAddress(): Promise<string> {
    const keplr = this.checkConnectivity();

    const offlineSigner = keplr.getOfflineSigner((this.adamikNameConverted[this.targetedChain]));
    const accounts = await offlineSigner.getAccounts();

    return accounts[0].address;
  }

  async signMessage(message: StdSignDoc): Promise<AminoSignResponse> {
    const keplr = this.checkConnectivity();

    const offlineSigner = keplr.getOfflineSigner((this.adamikNameConverted[this.targetedChain]));
    const accounts = await offlineSigner.getAccounts();
    const signature = await offlineSigner.signAmino(accounts[0].address, message);

    return signature;
  }
}