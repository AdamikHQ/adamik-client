import {
  AminoSignResponse,
  ChainInfo,
  Keplr,
  OfflineAminoSigner,
  OfflineDirectSigner,
  StdSignDoc,
} from "@keplr-wallet/types";
import { IWallet } from "../types";
import { mintscanUrl } from "../utils";

export class KeplrWallet implements IWallet {
  public name = "Keplr";
  public supportedChains = ["cosmoshub", "osmosis", "cosmoshub-testnet"];
  public icon = "/icons/Keplr.svg";
  public unit = 6; // TODO: Get from Adamik ?
  public signFormat = "amino";
  private offlineSigner: (OfflineAminoSigner & OfflineDirectSigner) | null =
    null;
  private adamikNameConverted: { [k: string]: string } = {
    cosmoshub: "cosmoshub-4",
    osmosis: "osmosis-1",
    "cosmoshub-testnet": "theta-testnet-001",
  };

  private getTestnetChainInfo = (): ChainInfo => ({
    chainId: "theta-testnet-001",
    chainName: "theta-testnet-001",
    rpc: "https://rpc.sentry-01.theta-testnet.polypore.xyz/",
    rest: "https://rest.sentry-01.theta-testnet.polypore.xyz/",
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "cosmos",
      bech32PrefixAccPub: "cosmos" + "pub",
      bech32PrefixValAddr: "cosmos" + "valoper",
      bech32PrefixValPub: "cosmos" + "valoperpub",
      bech32PrefixConsAddr: "cosmos" + "valcons",
      bech32PrefixConsPub: "cosmos" + "valconspub",
    },
    currencies: [
      {
        coinDenom: "ATOM",
        coinMinimalDenom: "uatom",
        coinDecimals: 6,
        coinGeckoId: "cosmos",
      },
      {
        coinDenom: "THETA",
        coinMinimalDenom: "theta",
        coinDecimals: 0,
      },
      {
        coinDenom: "LAMBDA",
        coinMinimalDenom: "lambda",
        coinDecimals: 0,
      },
      {
        coinDenom: "RHO",
        coinMinimalDenom: "rho",
        coinDecimals: 0,
      },
      {
        coinDenom: "EPSILON",
        coinMinimalDenom: "epsilon",
        coinDecimals: 0,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "ATOM",
        coinMinimalDenom: "uatom",
        coinDecimals: 6,
        coinGeckoId: "cosmos",
        gasPriceStep: {
          low: 1,
          average: 1,
          high: 1,
        },
      },
    ],
    stakeCurrency: {
      coinDenom: "ATOM",
      coinMinimalDenom: "uatom",
      coinDecimals: 6,
      coinGeckoId: "cosmos",
    },
    features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
  });

  private checkConnectivity(chainId: string): Keplr {
    const { keplr } = window;
    if (!keplr) {
      throw new Error("Keplr extension not installed");
    }

    if (chainId === "cosmoshub-testnet") {
      keplr.experimentalSuggestChain(this.getTestnetChainInfo());
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

    this.offlineSigner = keplr.getOfflineSigner(
      this.adamikNameConverted[chainId]
    );
    const accounts = await this.offlineSigner.getAccounts();

    return accounts[0].address;
  }

  async signMessage(
    chainId: string,
    message: StdSignDoc
  ): Promise<AminoSignResponse> {
    const accounts = await this.offlineSigner!.getAccounts();
    const signature = await this.offlineSigner!.signAmino(
      accounts[0].address,
      message
    );

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
}
