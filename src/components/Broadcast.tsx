import { Link as LinkIcon, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { broadcast } from "~/api/broadcast";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { IWallet, Transaction } from "~/types";
import { Loading } from "./ui/loading";

type BroadcastProps = {
  signedTransaction: string;
  transaction: Transaction;
  encodedTransaction?: string;
  wallet: IWallet;
  setHash: (hash: string) => void;
};

export const Broadcast: React.FC<BroadcastProps> = ({
  signedTransaction,
  transaction,
  encodedTransaction,
  wallet,
  setHash,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string | undefined>();
  const [disableBroadcast, setDisableBroadcast] = useState<boolean>(false);

  const broadcastOnClick = async () => {
    setIsLoading(true);
    try {
      const broadcastResult = await broadcast({
        transaction: {
          ...transaction,
          pubKey: (wallet.getPubkey && (await wallet.getPubkey())) || undefined,
          amount: transaction.amount as string,
        },
        signature: wallet.extractSignature(signedTransaction),
        encodedTransaction,
      });
      if (broadcastResult.error) {
        throw new Error(JSON.stringify(broadcastResult.error));
      }
      setHash(wallet.getHashFromBroadcast(broadcastResult));
      setDisableBroadcast(true);
    } catch (error: any) {
      setErrors(String(error.message));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(false);
    setDisableBroadcast(false);
    setErrors(undefined);
  }, [wallet, encodedTransaction]);

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
        <div className="flex gap-4 flex-col">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loading />
            </div>
          ) : (
            <>
              <Label>Signed Transaction</Label>
              <Textarea value={JSON.stringify(signedTransaction, null, 2)} readOnly={true} />

              <Label>Signature</Label>
              <Textarea value={wallet.extractSignature(signedTransaction)} readOnly={true} />

              <Label>Encoded Transaction</Label>
              <Textarea value={JSON.stringify(encodedTransaction, null, 2)} readOnly={true} />
            </>
          )}
          {errors && (
            <>
              <Label>Errors</Label>
              <div className="text-red-500">{errors}</div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center justify-end border-t bg-muted/50 px-6 py-3">
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1"
          onClick={() => broadcastOnClick()}
          disabled={isLoading || !signedTransaction || !encodedTransaction || disableBroadcast}
        >
          <Send className="h-3.5 w-3.5" />
          <span>Broadcast with Adamik</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
