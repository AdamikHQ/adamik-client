import { Keyring, getTransport } from "./shared";
import { CosmosApp as LedgerApp } from "@zondax/ledger-cosmos-js";

const DERIVATION_PATH = (accountNb: number) => `44'/118'/${accountNb}'/0/0`;

// Mapping from Adamik chain Id to Cosmos chain prefix
// FIXME This should be provided by the API
const COSMOS_CHAIN_PREFIX: Record<string, string> = {
  cosmoshub: "cosmos",
  osmosis: "osmo",
};

const splitPathNodes = (path: string): number[] => path.split("/").map((p) => parseInt(p.replace("'", "")));

const LedgerCosmos: Keyring = {
  async getAddress({ chainId, accountNb = 0 }: { chainId: string; accountNb?: number }) {
    if (!chainId || !Object.keys(COSMOS_CHAIN_PREFIX).includes(chainId)) {
      throw new Error(`Unsupported cosmos chainId: ${chainId}`);
    }

    const transport = await getTransport();
    const ledgerApp = new LedgerApp(transport);
    const derivationPath = DERIVATION_PATH(accountNb);

    const pathNodes = splitPathNodes(derivationPath);
    const { compressed_pk, bech32_address } = await ledgerApp.getAddressAndPubKey(
      pathNodes,
      COSMOS_CHAIN_PREFIX[chainId],
      false
    );

    return {
      publicKey: compressed_pk.toString("hex"), // FIXME Hex doesn't make sense for Cosmos pubkey, should be in relevant Cosmos format
      address: bech32_address,
    };
  },

  async signTransaction({ accountNb = 0, transaction }: { accountNb?: number; transaction: string }) {
    const transport = await getTransport();
    const ledgerApp = new LedgerApp(transport);
    const derivationPath = DERIVATION_PATH(accountNb);

    const pathNodes = splitPathNodes(derivationPath);
    const messageBuffer = Buffer.from(transaction, "hex");
    console.log("signTransaction - messageBuffer: ", messageBuffer);
    const { signature } = await ledgerApp.sign(pathNodes, messageBuffer);

    return {
      signature,
    };
  },

  getDefaultPath() {
    return DERIVATION_PATH(0);
  },
};

export { LedgerCosmos };
