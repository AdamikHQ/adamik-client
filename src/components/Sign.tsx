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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "./ui/textarea";
import { IWallet, Transaction } from "@/lib/types";
import { useCallback } from "react";
import { getForm } from "./encode/EncodeForm";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

type SignProps = {
  encodedTransaction?: string;
  wallet: IWallet;
  transaction: Transaction;
  setSignedTransaction: (signedTransaction: string) => void;
  setOpen: (open: boolean) => void;
  setHash: (hash: string) => void;
};

export const Sign: React.FC<SignProps> = ({
  encodedTransaction,
  wallet,
  transaction,
  setSignedTransaction,
  setOpen,
  setHash,
}) => {
  const signWithWallet = useCallback(async () => {
    const result = await wallet.signMessage(transaction.chainId, encodedTransaction);
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
    setOpen,
    setHash,
    transaction,
  ]);

  const form = getForm([transaction.mode], transaction, () => {});

  return (
    <Tabs defaultValue="account">
      <TabsList className="grid w-full grid-cols-2 mt-2 mb-6">
        <TabsTrigger value="simple">Intent</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
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
        <TabsContent value="simple">
          <CardContent className="p-6 text-sm">
            <div className="grid gap-3">
              {Object.keys(form).length > 0 &&
                form[transaction.mode].map(({ id, label, value }) => {
                  return (
                    <div key={`${id}-${transaction.mode}`}>
                      <Label
                        htmlFor={id}
                        key={`${id}-${transaction.mode}-label`}
                      >
                        {label}
                      </Label>
                      <Input
                        disabled={true}
                        id={id}
                        key={`${id}-${transaction.mode}-input`}
                        readOnly={true}
                        placeholder={label}
                        value={value}
                      />
                    </div>
                  );
                })}
              <Label htmlFor="fees" key={`fees-label`}>
                Fees
              </Label>
              <Input
                disabled={true}
                id="gees"
                key={`fees-input`}
                readOnly={true}
                placeholder={"Fees"}
                value={transaction.fees}
              />
              <Label htmlFor="gas" key={`gas-label`}>
                Gas
              </Label>
              <Input
                disabled={true}
                id={"gas"}
                key={`gas-input`}
                readOnly={true}
                placeholder={"Gas"}
                value={transaction.gas}
              />
            </div>
          </CardContent>
        </TabsContent>
        <TabsContent value="advanced">
          <CardContent className="p-6 text-sm">
            <div className="grid gap-3">
              {encodedTransaction && (
                <Textarea
                  value={
                    wallet.signFormat === "json"
                      ? JSON.stringify(encodedTransaction, null, 2)
                      : encodedTransaction
                  }
                  readOnly={true}
                />
              )}
            </div>
          </CardContent>
        </TabsContent>
        <CardFooter className="flex flex-row items-center justify-end border-t bg-muted/50 px-6 py-3">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1"
            onClick={() => signWithWallet()}
          >
            <SquarePen className="h-3.5 w-3.5" />
            <span className="">
              {`Sign ${wallet.withoutBroadcast === true ? "and broadcast" : ""} with ${wallet.name}`}
            </span>
          </Button>
        </CardFooter>
      </Card>
    </Tabs>
  );
};
