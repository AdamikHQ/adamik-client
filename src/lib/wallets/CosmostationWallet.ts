import { IWallet } from "../types";
import {
  CosmosSignAminoDoc,
  CosmosSignAminoResponse,
  cosmos,
} from "@cosmostation/extension";
import { mintscanUrl } from "../utils";

export class CosmostationWallet implements IWallet {
  public name = "Cosmostation";
  public supportedChains = ["cosmoshub", "osmosis"];
  public icon = "/icons/Cosmostation.svg";
  public unit = 6; // TODO: Get from Adamik ?
  public signFormat = "amino";
  private adamikNameConverted: { [k: string]: string } = {
    cosmoshub: "cosmoshub-4",
    osmosis: "osmosis-1",
  };

  private provider: Awaited<ReturnType<typeof cosmos>> | null = null;

  async connect(chainId: string): Promise<void> {
    await cosmos(this.adamikNameConverted[chainId]);
  }

  async getAddress(chainId: string): Promise<string> {
    this.provider = await cosmos(this.adamikNameConverted[chainId]);
    return (await this.provider.requestAccount()).address;
  }

  async signMessage(
    chainId: string,
    message: CosmosSignAminoDoc,
  ): Promise<CosmosSignAminoResponse> {
    const provider = await cosmos(this.adamikNameConverted[chainId]);
    const signature = await provider.signAmino(message);

    return signature;
  }

  extractSignature(signature: CosmosSignAminoResponse): string {
    return signature.signature;
  }

  async getPubkey(): Promise<string> {
    return (await this.provider!.requestAccount()).public_key.value;
  }

  getExplorerUrl(chainId: string, hash: string): string {
    return mintscanUrl(chainId, hash);
  }
}
