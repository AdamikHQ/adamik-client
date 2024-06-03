import { Keyring, getTransport } from "./shared";
import LedgerApp from "@ledgerhq/hw-app-algorand";

const DERIVATION_PATH = (accountNb: number) => `44'/283'/${accountNb}'/0/0`;

const LedgerAlgorand: Keyring = {
  async getAddress({ accountNb = 0 }) {
    const transport = await getTransport();
    const ledgerApp = new LedgerApp(transport);
    const derivationPath = DERIVATION_PATH(accountNb);

    const { publicKey, address } = await ledgerApp.getAddress(derivationPath, false);

    return {
      publicKey,
      address,
    };
  },

  async signTransaction({ accountNb = 0, transaction }) {
    const transport = await getTransport();
    const ledgerApp = new LedgerApp(transport);
    const derivationPath = DERIVATION_PATH(accountNb);

    const { signature: signatureBuffer } = await ledgerApp.sign(derivationPath, transaction);

    return {
      signature: signatureBuffer?.toString("hex"),
    };
  },

  getDefaultPath() {
    return DERIVATION_PATH(0);
  },
};

export { LedgerAlgorand };
