import { SquarePen } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";
import { IWallet } from "@/lib/types";
import { useCallback } from "react";

type SignProps = {
  encodedTransaction?: string;
  wallet: IWallet;
  setSignedTransaction: (signedTransaction: string) => void;
  chainId: string;
  setOpen: (open: boolean) => void;
  setHash: (hash: string) => void;
};

export const Sign: React.FC<SignProps> = ({
  chainId,
  encodedTransaction,
  wallet,
  setSignedTransaction,
  setOpen,
  setHash,
}) => {
  const signWithWallet = useCallback(async () => {
    const result = await wallet.signMessage(chainId, encodedTransaction);
    if (wallet.withoutBroadcast === true) {
      setHash(wallet.getHashFromBroadcast(result));
    } else {
      setSignedTransaction(result);
    }
    setOpen(false);
  }, [
    wallet,
    encodedTransaction,
    setSignedTransaction,
    chainId,
    setOpen,
    setHash,
  ]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Information
          </CardTitle>
          <CardDescription>
            Your transaction is now ready to be signed.
            <br />
            The signature will be applied by your browser extension.
            <br />
            Make sure to review your transaction details before approving.
            <br />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          {encodedTransaction && (
            <Textarea
              value={
                wallet.signFormat === "hex"
                  ? encodedTransaction
                  : JSON.stringify(encodedTransaction, null, 2)
              }
              readOnly={true}
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center justify-end border-t bg-muted/50 px-6 py-3">
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1"
          onClick={() => signWithWallet()}
        >
          <SquarePen className="h-3.5 w-3.5" />
          <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
            {`Sign ${wallet.withoutBroadcast === true ? "and broadcast" : ""} with ${wallet.name}`}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};
