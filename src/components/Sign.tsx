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
import { useCallback, useState } from "react";

type SignProps = {
  encodedTransaction?: string;
  wallet: IWallet;
  setSignedTransaction: (signedTransaction: string) => void;
  chainId: string;
};

export const Sign: React.FC<SignProps> = ({
  chainId,
  encodedTransaction,
  wallet,
  setSignedTransaction,
}) => {
  const signWithWallet = useCallback(async () => {
    if (!encodedTransaction) {
      alert("Please encode first before signing");
    } else {
      const result = await wallet.signMessage(chainId, encodedTransaction);
      setSignedTransaction(result);
    }
  }, [wallet, encodedTransaction, setSignedTransaction, chainId]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Wallet Signer
          </CardTitle>
          <CardDescription>
            Once you do your encode try to sign with {wallet.name}
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
            Sign with {wallet.name}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};
