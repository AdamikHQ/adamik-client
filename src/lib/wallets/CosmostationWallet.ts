import { Chain, IWallet } from "../types";
import {
  CosmosSignAminoDoc,
  CosmosSignAminoResponse,
  CosmosSignDirectDoc,
  CosmosSignDirectResponse,
  cosmos,
} from "@cosmostation/extension";
import { mintscanUrl } from "../utils";

export class CosmostationWallet implements IWallet {
  public name = "Cosmostation";
  public supportedChains: Chain[] = ["cosmoshub", "osmosis", "celestia"];
  public icon = "/icons/Cosmostation.svg";
  public unit = 6; // TODO: Get from Adamik ?
  public signFormat = "json";
  private adamikNameConverted: { [k: string]: string } = {
    cosmoshub: "cosmoshub-4",
    osmosis: "osmosis-1",
    celestia: "celestia",
  };
  public withoutBroadcast: boolean = false;

  private provider: Awaited<ReturnType<typeof cosmos>> | null = null;

  async connect(chainId: Chain): Promise<void> {
    await cosmos(this.adamikNameConverted[chainId]);
  }

  async getAddress(chainId: string): Promise<string> {
    this.provider = await cosmos(this.adamikNameConverted[chainId]);
    return (await this.provider.requestAccount()).address;
  }

  async signMessage(
    chainId: string,
    message: any
  ): Promise<CosmosSignDirectResponse> {
    const provider = await cosmos(this.adamikNameConverted[chainId]);
    const protoMessage = {
      chain_id: message.chainId,
      account_number: message.accountNumber,
      body_bytes: new Uint8Array(Object.values(message.bodyBytes)),
      auth_info_bytes: new Uint8Array(Object.values(message.authInfoBytes)),
    };
    console.log({ protoMessage });
    const signature = await provider.signDirect(protoMessage);

    return signature;
  }

  extractSignature(signature: CosmosSignAminoResponse): string {
    return signature.signature;
  }

  async getPubkey(): Promise<string> {
    return (await this.provider!.requestAccount()).public_key.value;
  }

  getExplorerUrl(chainId: Chain, hash: string): string {
    return mintscanUrl(chainId, hash);
  }

  getHashFromBroadcast(broadcast: { hash: string }): string {
    return broadcast.hash;
  }
}
