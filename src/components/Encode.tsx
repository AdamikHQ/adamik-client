"use client";

import { getEncode } from "@/api/getEncode";
import {
  DelegateTransaction,
  IWallet,
  Transaction,
  TransferTransaction,
} from "@/lib/types";
import { amountToSmallestUnit } from "@/lib/utils";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loading } from "./ui/loading";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type EncodeProps = {
  transaction: Transaction;
  setTransaction: (transaction: Transaction) => void;
  setEncodedTransaction: (encodedTransaction: string) => void;
  wallet: IWallet;
  setOpen: (open: boolean) => void;
};

export const Encode: React.FC<EncodeProps> = ({
  transaction,
  setTransaction,
  setEncodedTransaction,
  wallet,
  setOpen,
}) => {
  const [result, setResult] = useState<any>();
  const [resultJSON, setResultJSON] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<string>("transfer");
  const getDataForm = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (transaction) {
        setIsLoading(true);
        const data = await getEncode({
          ...transaction,
          pubKey: (wallet.getPubkey && (await wallet.getPubkey())) || undefined,
          amount: amountToSmallestUnit(
            transaction.amount as string,
            wallet.unit
          ), //FIXME: Need to put logic in backend see with Hakim
        });
        setResult(data);

        const dataJSON = await getEncode({
          ...transaction,
          format: "json",
          pubKey: (wallet.getPubkey && (await wallet.getPubkey())) || undefined,
          amount: amountToSmallestUnit(
            transaction.amount as string,
            wallet.unit
          ), //FIXME: Need to put logic in backend see with Hakim
        });
        setResultJSON(dataJSON);
        if (data) {
          setEncodedTransaction(
            wallet.signFormat === "hex" ? data.encoded : dataJSON.encoded
          );
          const fees =
            typeof data?.plain?.fees === "string"
              ? data?.plain?.fees
              : transaction.fees;
          const gas =
            typeof data?.plain?.gas === "string"
              ? data?.plain?.gas
              : transaction.gas;
          setTransaction({
            ...transaction,
            fees,
            gas,
          });
        }
        setIsLoading(false);
        setOpen(true);
      }
    },
    [transaction, wallet, setEncodedTransaction, setTransaction, setOpen]
  );

  useEffect(() => {
    setResult(undefined);
    setResultJSON(undefined);
  }, [wallet, transaction.chainId]);

  const form: Record<
    string,
    {
      id: string;
      label: string;
      value: string;
      onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    }[]
  > = {
    transfer: [
      {
        id: "senders",
        label: "Sender",
        value: transaction.senders[0] ?? "",
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          setTransaction({
            ...transaction,
            senders: [e.target.value],
          });
        },
      },
      {
        id: "recipients",
        label: "Recipient",
        value: (transaction as TransferTransaction).recipients[0] ?? "",
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          setTransaction({
            ...transaction,
            mode: "transfer",
            recipients: [e.target.value],
          });
        },
      },
      {
        id: "amount",
        label: "Amount",
        value: transaction.amount ?? "0",
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          setTransaction({
            ...transaction,
            amount: e.target.value,
          });
        },
      },
    ],
    delegate: [
      {
        id: "senders",
        label: "Delegator",
        value: transaction.senders[0] ?? "",
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          setTransaction({
            ...transaction,
            senders: [e.target.value],
          });
        },
      },
      {
        id: "validator",
        label: "Validator",
        value: (transaction as DelegateTransaction).validator ?? "",
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          setTransaction({
            ...transaction,
            mode: "delegate",
            validator: e.target.value,
          });
        },
      },
      {
        id: "amount",
        label: "Amount",
        value: transaction.amount ?? "0",
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          setTransaction({
            ...transaction,
            amount: e.target.value,
          });
        },
      },
    ],
  };

  return (
    transaction && (
      <Card className="w-full">
        <form onSubmit={getDataForm}>
          <CardHeader className="flex flex-row items-start bg-muted/80">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                Adamik - Transaction Encoder
              </CardTitle>
              <CardDescription>
                <span className="font-light">/transaction/encode</span>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid py-4">
              <div className="flex flex-col space-y-1.5 gap-2" key={"label"}>
                <Label htmlFor="name" key="label-mode">
                  Mode
                </Label>
                <Select
                  key="select-mod"
                  defaultValue={mode}
                  onValueChange={(value) => {
                    setMode(value);
                    if (value === "transfer") {
                      setTransaction({
                        ...transaction,
                        mode: "transfer",
                        recipients: [],
                      });
                    } else if (value === "delegate") {
                      setTransaction({
                        ...transaction,
                        mode: "delegate",
                        validator: "",
                      });
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={mode} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(form).map((mode) => {
                      return (
                        <SelectItem key={mode} value={mode}>
                          {mode}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {form[mode].map(({ id, label, onChange, value }) => {
                  return (
                    <div key={`${id}-${mode}`}>
                      <Label htmlFor={id} key={`${id}-${mode}-label`}>
                        {label}
                      </Label>
                      <Input
                        id={id}
                        key={`${id}-${mode}-input`}
                        placeholder={label}
                        value={value}
                        onChange={onChange}
                      />
                    </div>
                  );
                })}
              </div>
              {isLoading ? (
                <Loading />
              ) : result && result.status.errors.length > 0 ? (
                <>
                  <Label htmlFor="name">Result errors</Label>
                  <Textarea
                    className="border text-xs p-2 rounded-md"
                    value={JSON.stringify(result.status)}
                    readOnly={true}
                  />
                </>
              ) : (
                result && (
                  <>
                    <div>
                      <Label htmlFor="name">Result hex</Label>
                      <Textarea
                        className="border text-xs p-2 rounded-md"
                        value={JSON.stringify(result.encoded)}
                        readOnly={true}
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Result JSON</Label>
                      <Textarea
                        className="border text-xs p-2 rounded-md"
                        value={JSON.stringify(resultJSON.encoded)}
                        readOnly={true}
                      />
                    </div>
                  </>
                )
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Encode</Button>
          </CardFooter>
        </form>
      </Card>
    )
  );
};
