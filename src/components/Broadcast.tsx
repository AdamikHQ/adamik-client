import { Link as LinkIcon, Send } from "lucide-react";
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
import { broadcast } from "@/api/postBroadcast";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { IWallet, Transaction } from "@/lib/types";
import { amountToSmallestUnit } from "@/lib/utils";
import { Loading } from "./ui/loading";
import Link from "next/link";

type BroadcastProps = {
  signedTransaction: string;
  transaction: Transaction;
  encodedTransaction?: string;
  wallet: IWallet;
};

type BroadcastResult = {
  hash: string;
};

export const Broadcast: React.FC<BroadcastProps> = ({
  signedTransaction,
  transaction,
  encodedTransaction,
  wallet,
}) => {
  const [result, setResult] = useState<BroadcastResult>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const broadcastOnClick = async () => {
    setIsLoading(true);
    const broadcastResult: BroadcastResult = await broadcast({
      transaction: {
        ...transaction,
        pubKey: (wallet.getPubkey && (await wallet.getPubkey())) || undefined,
        amount: amountToSmallestUnit(transaction.amount as string, wallet.unit), //FIXME: Need to put logic in backend see with Hakim
      },
      signature: wallet.extractSignature(signedTransaction),
      encodedTransaction,
    });
    setResult(broadcastResult);
    setIsLoading(false);
  };

  useEffect(() => {
    setResult(undefined);
    setIsLoading(false);
  }, [wallet]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Adamik - Broadcast signed transaction
          </CardTitle>
          <CardDescription>/transaction/broadcast</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loading />
              </div>
            ) : (
              <>
                <Label>Signed Transaction</Label>
                <Textarea
                  value={JSON.stringify(signedTransaction, null, 2)}
                  readOnly={true}
                />

                <Label>Signature</Label>
                <Textarea
                  value={wallet.extractSignature(signedTransaction)}
                  readOnly={true}
                />

                <Label>Encoded Transaction</Label>
                <Textarea
                  value={JSON.stringify(encodedTransaction, null, 2)}
                  readOnly={true}
                />
              </>
            )}
            {result && (
              <>
                <Label>Result</Label>
                <Textarea
                  value={JSON.stringify(result, null, 2)}
                  readOnly={true}
                />

                <Button
                  size="sm"
                  className="h-8 gap-1 mt-4 w-full"
                  onClick={() => broadcastOnClick()}
                  disabled={
                    isLoading || !signedTransaction || !encodedTransaction
                  }
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  <Link
                    className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap"
                    href={wallet.getExplorerUrl(
                      transaction.chainId,
                      result.hash,
                    )}
                  >
                    Go to Explorer
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center justify-end border-t bg-muted/50 px-6 py-3">
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1"
          onClick={() => broadcastOnClick()}
          disabled={isLoading || !signedTransaction || !encodedTransaction}
        >
          <Send className="h-3.5 w-3.5" />
          <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
            Broadcast with Adamik
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};
