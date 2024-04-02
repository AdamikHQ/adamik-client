import { IWallet } from "../types";
import { CosmosSignAminoDoc, CosmosSignAminoResponse, cosmos } from '@cosmostation/extension';


export class CosmostationWallet implements IWallet {
  public name = "Cosmostation";
  public supportedChains = ["cosmoshub", "osmosis"];
  public icon = "/icons/Cosmostation.svg";
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

  setTargetedChain(chain: string): void {
    this.targetedChain = chain;
  }

  async connect(): Promise<void> {
    await cosmos(this.adamikNameConverted[this.targetedChain]);
  }

  async getAddress(): Promise<string> {
    const provider = await cosmos(this.adamikNameConverted[this.targetedChain]);
    return (await provider.requestAccount()).address;
  }

  async signMessage(message: CosmosSignAminoDoc): Promise<CosmosSignAminoResponse> {
    const provider = await cosmos(this.adamikNameConverted[this.targetedChain]);
    const signature = await provider.signAmino(message);

    return signature;
  }
}