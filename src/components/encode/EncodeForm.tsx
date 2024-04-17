"use client";

import {
  DelegateTransaction,
  Mode,
  Transaction,
  TransferTransaction,
} from "@/lib/types";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getChainMode } from "@/lib/utils";
import { Validators } from "../Validators";

type FormInput = {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const getForm = (
  mode: Mode[],
  transaction: Transaction,
  setTransaction: React.Dispatch<React.SetStateAction<Transaction>>
): Record<Mode, FormInput[]> => {
  const form: Record<Mode, FormInput[]> = {
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

  // FIXME: Refacto this part...
  return mode.reduce((acc, m) => {
    return { ...acc, [m]: form[m] };
  }, {}) as Record<Mode, FormInput[]>;
};

type EncodeFormProps = {
  transaction: Transaction;
  setTransaction: React.Dispatch<React.SetStateAction<Transaction>>;
};
export const EncodeForm: React.FC<EncodeFormProps> = ({
  transaction,
  setTransaction,
}) => {
  // FIXME: Chain Details need to contains mode. atm do it manually
  const form = getForm(
    getChainMode(transaction.chainId),
    transaction,
    setTransaction
  );
  const [mode, setMode] = useState<Mode>("transfer");

  useEffect(() => {
    setMode("transfer");
  }, [transaction.chainId])

  return (
    <div className="flex flex-col space-y-1.5 gap-2" key={"label"}>
      <Label htmlFor="name" key="label-mode">
        Mode
      </Label>
      <Select
        key="select-mode"
        defaultValue={"transfer"}
        value={mode}
        onValueChange={(value: Mode) => {
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
      {Object.keys(form).length > 0 &&
        form[mode].map(({ id, label, onChange, value }) => {
          return (
            <div key={`${id}-${mode}`}>
              <Label htmlFor={id} key={`${id}-${mode}-label`}>
                {label}
              </Label>
              {id === "validator" && transaction.mode === "delegate" ? (
                <Validators
                  key={id}
                  chainId={transaction.chainId}
                  setTransaction={setTransaction}
                  validatorAddress={transaction.validator}
                />
              ) : (
                <Input
                  id={id}
                  key={`${id}-${mode}-input`}
                  placeholder={label}
                  value={value}
                  onChange={onChange}
                />
              )}
            </div>
          );
        })}
    </div>
  );
};
