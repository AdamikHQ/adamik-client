"use client";

import {
  DelegateTransaction,
  Mode,
  Transaction,
  TransferTransaction,
} from "@/lib/types";
import React, {
  ChangeEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
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
import { Checkbox } from "../ui/checkbox";

type FormInputCommon = {
  id: string;
  label: string;
  value: any;
  disabled?: boolean;
};

type FormInputText = FormInputCommon & {
  type: "text";
  onCheck?: undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

type FormInputCheckbox = FormInputCommon & {
  type: "checkbox";
  onChange?: undefined;
  onCheck: (value: boolean) => void;
};

type FormInputValidator = FormInputCommon & {
  type: "validator";
  onCheck?: undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

type FormInput = FormInputText | FormInputCheckbox | FormInputValidator;

export const getForm = (
  mode: Mode[],
  transaction: Transaction,
  setTransaction: React.Dispatch<React.SetStateAction<Transaction>>
): Record<Mode, FormInput[]> => {
  const form: Record<Mode, FormInput[]> = {
    transfer: [
      {
        id: "senders",
        label: "Sender",
        type: "text",
        value: transaction.senders[0] ?? "",
        onChange: (e) => {
          setTransaction({
            ...transaction,
            senders: [e.target.value],
          });
        },
      },
      {
        id: "recipients",
        label: "Recipient",
        type: "text",
        value: (transaction as TransferTransaction).recipients[0] ?? "",
        onChange: (e) => {
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
        type: "text",
        value: transaction.amount ?? "0",
        disabled: transaction.useMaxAmount === true,
        onChange: (e) => {
          setTransaction({
            ...transaction,
            amount: e.target.value,
          });
        },
      },
      {
        id: "sendMax",
        label: "Send Max",
        type: "checkbox",
        value: transaction.useMaxAmount,
        onCheck: (value) => {
          console.log(value);
          setTransaction({
            ...transaction,
            useMaxAmount: !value,
          });
        },
      },
      {
        id: "memo",
        label: "Memo",
        type: "text",
        value: transaction.memo ?? "",
        onChange: (e) => {
          setTransaction({
            ...transaction,
            memo: e.target.value,
          });
        },
      },
    ],
    delegate: [
      {
        id: "senders",
        label: "Delegator",
        type: "text",
        value: transaction.senders[0] ?? "",
        onChange: (e) => {
          setTransaction({
            ...transaction,
            senders: [e.target.value],
          });
        },
      },
      {
        id: "validator",
        label: "Validator",
        type: "validator",
        value: (transaction as DelegateTransaction).validator ?? "",
        onChange: (e) => {
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
        type: "text",
        value: transaction.amount ?? "0",
        disabled: transaction.useMaxAmount === true,
        onChange: (e) => {
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
  }, [transaction.chainId]);

  const renderSwitch = ({
    type,
    id,
    label,
    value,
    onChange,
    onCheck,
    disabled,
  }: FormInput) => {
    switch (type) {
      case "validator":
        if (transaction.mode === "delegate") {
          return (
            <Validators
              key={id}
              chainId={transaction.chainId}
              setTransaction={setTransaction}
              validatorAddress={transaction.validator}
            />
          );
        }
      case "checkbox":
        return (
          <Checkbox
            className="ml-4"
            id={id}
            key={`${id}-${mode}-checkbox`}
            checked={value}
            onCheckedChange={(checked) => {
              onCheck && onCheck(!checked as boolean);
            }}
          />
        );
      case "text":
      default:
        return (
          <Input
            id={id}
            key={`${id}-${mode}-input`}
            placeholder={label}
            disabled={disabled}
            value={value}
            onChange={onChange}
          />
        );
    }
  };

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
        form[mode].map((input) => {
          const { id, label } = input;
          return (
            <div key={`${id}-${mode}`}>
              <Label htmlFor={id} key={`${id}-${mode}-label`}>
                {label}
              </Label>
              {renderSwitch(input)}
            </div>
          );
        })}
    </div>
  );
};
