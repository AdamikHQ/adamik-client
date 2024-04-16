import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { IWallet, Transaction } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

type ResultProps = {
  hash: string | undefined;
  wallet: IWallet;
  transaction: Transaction;
};

export const Result: React.FC<ResultProps> = ({
  hash,
  wallet,
  transaction,
}) => {
  return (
    hash && (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Hash
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <Label>Result</Label>
          <Textarea value={hash} readOnly={true} />
        </CardContent>
        <CardFooter className="flex flex-row items-center justify-end border-t bg-muted/50 px-6 py-3">
          <Button size="sm" className="h-8 gap-1 mt-4 w-full">
            <LinkIcon className="h-3.5 w-3.5" />
            <a
              target="_blank"
              href={wallet.getExplorerUrl(transaction.chainId, hash)}
            >
              Go to Explorer
            </a>
          </Button>
        </CardFooter>
      </Card>
    )
  );
};
