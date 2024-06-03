import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

type Reader = {
  getAddress({
    chainId,
    accountNb,
    chainPrefix,
  }: {
    chainId: string;
    accountNb?: number;
    chainPrefix?: string;
  }): Promise<{
    publicKey: string;
    address: string;
  }>;
};

type Writer = {
  signTransaction({
    chainId,
    accountNb,
    transaction,
  }: {
    chainId: string;
    accountNb?: number;
    transaction: string;
  }): Promise<{
    signature: string | undefined;
    returnCode?: number | string;
  }>;
};

type Keyring = Reader & Writer & { getDefaultPath(): string };

async function getTransport() {
  return await TransportWebUSB.create();
}

export type { Keyring };
export { getTransport };
