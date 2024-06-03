import { signatureToHex } from "viem";
import LedgerApp from "@ledgerhq/hw-app-eth";
import { Keyring, getTransport } from "./shared";

const DERIVATION_PATH = (accountNb: number) => `44'/60'/${accountNb}'/0/0`;

// Mapping between Adamik chain IDs and ethereum chain Ids
// TODO Should be provided by API
const ETHEREUM_CHAIN_IDS: Record<string, number> = {
  ethereum: 1,
  sepolia: 11155111,
  holesky: 17000,
  // TODO Other chains...
};

/**
 * Transforms the ECDSA signature paremeter v hexadecimal string received
 * from the nano into an EIP155 compatible number.
 *
 * Reminder EIP155 transforms v this way:
 * v = chainId * 2 + 35
 * (+ parity 1 or 0)
 */
export const applyEIP155 = (vAsHex: string, chainId: number): bigint => {
  const v = parseInt(vAsHex, 16);

  if (v === 0 || v === 1) {
    // if v is 0 or 1, it's already representing parity
    return BigInt(chainId * 2 + 35 + v);
  } else if (v === 27 || v === 28) {
    const parity = v - 27; // transforming v into 0 or 1 to become the parity
    return BigInt(chainId * 2 + 35 + parity);
  }
  // When chainId is lower than 109, hw-app-eth *can* return a v with EIP155 already applied
  // e.g. bsc's chainId is 56 -> v then equals to 147/148
  //      optimism's chainId is 10 -> v equals to 55/56
  //      ethereum's chainId is 1 -> v equals to 0/1
  //      goerli's chainId is 5 -> v equals to 0/1
  return BigInt(v);
};

const LedgerEthereum: Keyring = {
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

  async signTransaction({ chainId, accountNb = 0, transaction }) {
    const transport = await getTransport();
    const ledgerApp = new LedgerApp(transport);
    const derivationPath = DERIVATION_PATH(accountNb);

    if (!chainId || !Object.keys(ETHEREUM_CHAIN_IDS).includes(chainId)) {
      throw new Error(`Unsupported ethereum chainId: ${chainId}`);
    }

    const rsv = await ledgerApp.signTransaction(derivationPath, transaction);

    const signature = signatureToHex({
      r: `0x${rsv.r}`,
      s: `0x${rsv.s}`,
      v: applyEIP155(rsv.v, ETHEREUM_CHAIN_IDS[chainId]),
    });

    return {
      signature,
    };
  },

  getDefaultPath() {
    return DERIVATION_PATH(0);
  },
};

export { LedgerEthereum };
