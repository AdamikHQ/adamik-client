import { SignerTransaction } from "@perawallet/connect/dist/util/model/peraWalletModels";
import { IWallet } from "../types";
import { PeraWalletConnect } from "@perawallet/connect"

export class PeraWallet implements IWallet {
    public name = "PeraWallet";
    public supportedChains = ["algorand"];
    public icon = "/icons/Pera.svg";
    public unit = 6; // TODO: Get from Adamik ? 
    public signFormat = "hex";
    private addresses: string[] = [];

    private peraWallet: PeraWalletConnect | null = null;


    // Add missing properties
    async connect() {
        this.peraWallet = new PeraWalletConnect();
        try {
            this.addresses = await this.peraWallet.connect();
        } catch (e) {
            this.disconnect();
            throw e;
        }
    }

    async disconnect() {
        this.peraWallet?.disconnect();
        this.peraWallet = null;
    }

    async getAddress(): Promise<string> {
        if (this.peraWallet) {
            return this.addresses[0];
        }
        throw new Error("PeraWallet not connected");
    }

    async signMessage(payload: string) {
        if (this.peraWallet) {
            return await this.peraWallet.signData([{ data: Uint8Array.from(Buffer.from(payload, "hex")), message: "encoded with Adamik !" }], this.addresses[0]);
            // return await this.peraWallet.signTransaction([payload], this.addresses[0]);
        }
        throw new Error("PeraWallet not connected");
    }

    public setTargetedChain(chainId: string) {
    }
}