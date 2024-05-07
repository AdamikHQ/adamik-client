import { Chain, IWallet } from "~/types";
import { Keyring } from "./ledger/shared";
import { LedgerAlgorand } from "./ledger/Algorand";
import { LedgerCosmos } from "./ledger/Cosmos";
import { LedgerEthereum } from "./ledger/Ethereum";

// FIXME Redundant definition of supported chains
const KEYRINGS: Record<string, Keyring> = {
  algorand: LedgerAlgorand,
  ethereum: LedgerEthereum,
  sepolia: LedgerEthereum,
  holesky: LedgerEthereum,
  cosmoshub: LedgerCosmos,
  osmosis: LedgerCosmos,
};

export class LedgerWallet implements IWallet {
  public name = "Ledger";
  public supportedChains: Chain[] = ["ethereum", "sepolia", "holesky", "cosmoshub", "osmosis", "algorand"]; // TODO Complete this list
  public icon = "/icons/Ledger.svg";
  public unit = 6; // TODO: Get from Adamik ?
  public signFormat = "hex";
  public withoutBroadcast: boolean = false;

  private pubkey: string | undefined;
  private address: string | undefined;

  connect = () => Promise.resolve();

  async getAddress(chainId: string): Promise<string> {
    await this.getAddressAndPubkey(chainId);
    return this.address!;
  }

  async getPubkey(chainId: string): Promise<string> {
    await this.getAddressAndPubkey(chainId);
    return this.pubkey!;
  }

  async signMessage(chainId: string, payload: string) {
    if (!Object.keys(KEYRINGS).includes(chainId)) {
      throw new Error(`Unsupported chainId for LedgerWallet: ${chainId}`);
    }

    // FIXME DEBUG TBR
    console.log("signMessage - payload:", payload);
    const { signature } = await KEYRINGS[chainId].signTransaction({
      chainId,
      transaction: payload,
    });

    // FIXME DEBUG TBR
    console.log("signMessage - signature:", signature);

    return signature;
  }

  extractSignature = (signature: unknown) => signature as string;

  getHashFromBroadcast = (broadcastResult: unknown) => broadcastResult as string;

  getExplorerUrl = (chainId: Chain, hash: string) => ""; // FIXME Handle explorer URL

  private async getAddressAndPubkey(chainId: string) {
    if (!Object.keys(KEYRINGS).includes(chainId)) {
      throw new Error(`Unsupported chainId for LedgerWallet: ${chainId}`);
    }

    const { publicKey, address } = await KEYRINGS[chainId].getAddress({ chainId });

    this.pubkey = publicKey;
    this.address = address;
  }
}
