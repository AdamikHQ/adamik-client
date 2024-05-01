import { AminoSignResponse, Keplr, OfflineAminoSigner, StdSignDoc } from "@keplr-wallet/types";
import { Chain, IWallet } from "../types";
import { mintscanUrl } from "../utils/utils";

export class KeplrWallet implements IWallet {
  public name = "Keplr";
  public supportedChains: Chain[] = ["cosmoshub"];
  public icon = "/icons/Keplr.svg";
  public unit = 6; // TODO: Get from Adamik ?
  public signFormat = "json";
  private offlineSigner: OfflineAminoSigner | null = null;
  private adamikNameConverted: { [k: string]: string } = {
    cosmoshub: "cosmoshub-4",
    osmosis: "osmosis-1",
  };
  public withoutBroadcast: boolean = false;

  private checkConnectivity(chainId: string): Keplr {
    const { keplr } = window;
    if (!keplr) {
      throw new Error("Keplr extension not installed");
    }

    return keplr;
  }

  async connect(chainId: string): Promise<void> {
    const keplr = this.checkConnectivity(chainId);

    await keplr.enable(this.adamikNameConverted[chainId]);
    const chains = await keplr.getChainInfosWithoutEndpoints();
    const chain = chains.find((chain) => {
      return chain.chainId === this.adamikNameConverted[chainId];
    });
    this.unit = chain?.currencies[0].coinDecimals as number;
  }

  async getAddress(chainId: string): Promise<string> {
    const keplr = this.checkConnectivity(chainId);

    this.offlineSigner = keplr.getOfflineSignerOnlyAmino(this.adamikNameConverted[chainId]);
    const accounts = await this.offlineSigner.getAccounts();

    return accounts[0].address;
  }

  async signMessage(chainId: string, message: StdSignDoc): Promise<AminoSignResponse> {
    const accounts = await this.offlineSigner!.getAccounts();
    const signature = await this.offlineSigner!.signAmino(accounts[0].address, message);

    return signature;
  }

  extractSignature(signature: AminoSignResponse): string {
    return signature.signature.signature;
  }

  async getPubkey(): Promise<string> {
    const accounts = await this.offlineSigner!.getAccounts();

    return Buffer.from(accounts[0].pubkey).toString("base64");
  }

  getExplorerUrl(chainId: string, hash: string): string {
    return mintscanUrl(chainId, hash);
  }

  getHashFromBroadcast(broadcast: { hash: string }): string {
    return broadcast.hash;
  }
}
