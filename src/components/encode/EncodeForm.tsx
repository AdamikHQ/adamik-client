"use client";

import {
  DelegateTransaction,
  Mode,
  TokenTransferTransaction,
  Transaction,
  TransferTransaction,
} from "~/types";
import React, { ChangeEvent, FormEventHandler, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getChainModes } from "~/utils/utils";
import { Validators } from "../Validators";
import { Checkbox } from "../ui/checkbox";
import { Tokens } from "../Tokens";
import { getData } from "~/api/data";

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

type FormInputToken = FormInputCommon & {
  type: "token";
  onCheck?: undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

type FormInput = FormInputText | FormInputCheckbox | FormInputValidator | FormInputToken;

export const getForm = (
  mode: Mode[],
  transactionInputs: Transaction,
  setTransactionInputs: React.Dispatch<React.SetStateAction<Transaction>>
): Record<Mode, FormInput[]> => {
  const form: Record<Mode, FormInput[]> = {
    transfer: [
      {
        id: "senders",
        label: "Sender",
        type: "text",
        value: transactionInputs.senders[0] ?? "",
        onChange: (e) => {
          setTransactionInputs({
            ...transactionInputs,
            senders: [e.target.value],
          });
        },
      },
      {
        id: "recipients",
        label: "Recipient",
        type: "text",
        value: (transactionInputs as TransferTransaction).recipients[0] ?? "",
        onChange: (e) => {
          setTransactionInputs({
            ...transactionInputs,
            mode: "transfer",
            recipients: [e.target.value],
          });
        },
      },
      {
        id: "amount",
        label: "Amount",
        type: "text",
        value: transactionInputs.amount ?? "0",
        disabled: transactionInputs.useMaxAmount === true,
        onChange: (e) => {
          setTransactionInputs({
            ...transactionInputs,
            amount: e.target.value,
          });
        },
      },
      {
        id: "sendMax",
        label: "Send Max",
        type: "checkbox",
        value: transactionInputs.useMaxAmount,
        onCheck: (value) => {
          setTransactionInputs({
            ...transactionInputs,
            useMaxAmount: !value,
          });
        },
      },
      {
        id: "memo",
        label: "Memo",
        type: "text",
        value: transactionInputs.memo ?? "",
        onChange: (e) => {
          setTransactionInputs({
            ...transactionInputs,
            memo: e.target.value,
          });
        },
      },
    ],
    transferToken: [
      {
        id: "token",
        label: "Token",
        type: "token",
        value: (transactionInputs as TokenTransferTransaction).tokenId ?? "",
        onChange: (e) => {
          setTransactionInputs({
            ...transactionInputs,
            mode: "transferToken",
            tokenId: e.target.value,
          } as TokenTransferTransaction);
        },
      },
      {
        id: "senders",
        label: "Sender",
        type: "text",
        value: transactionInputs.senders[0] ?? "",
        onChange: (e) => {
          setTransactionInputs({
            ...transactionInputs,
            senders: [e.target.value],
          });
        },
      },
      {
        id: "recipients",
        label: "Recipient",
        type: "text",
        value: (transactionInputs as TokenTransferTransaction).recipients[0] ?? "",
        onChange: (e) => {
          setTransactionInputs({
            ...transactionInputs,
            mode: "transferToken",
            tokenId: (transactionInputs as TokenTransferTransaction).tokenId,
            recipients: [e.target.value],
          });
        },
      },
      {
        id: "amount",
        label: "Amount",
        type: "text",
        value: transactionInputs.amount ?? "0",
        disabled: transactionInputs.useMaxAmount === true,
        onChange: (e) => {
          setTransactionInputs({
            ...transactionInputs,
            amount: e.target.value,
          });
        },
      },
      {
        id: "sendMax",
        label: "Send Max",
        type: "checkbox",
        value: transactionInputs.useMaxAmount,
        onCheck: (value) => {
          setTransactionInputs({
            ...transactionInputs,
            useMaxAmount: !value,
          });
        },
      },
      {
        id: "memo",
        label: "Memo",
        type: "text",
        value: transactionInputs.memo ?? "",
        onChange: (e) => {
          setTransactionInputs({
            ...transactionInputs,
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
        value: transactionInputs.senders[0] ?? "",
        onChange: (e) => {
          setTransactionInputs({
            ...transactionInputs,
            senders: [e.target.value],
          });
        },
      },
      {
        id: "validator",
        label: "Validator",
        type: "validator",
        value: (transactionInputs as DelegateTransaction).validator ?? "",
        onChange: (e) => {
          setTransactionInputs({
            ...transactionInputs,
            mode: "delegate",
            validator: e.target.value,
          });
        },
      },
      {
        id: "amount",
        label: "Amount",
        type: "text",
        value: transactionInputs.amount ?? "0",
        disabled: transactionInputs.useMaxAmount === true,
        onChange: (e) => {
          setTransactionInputs({
            ...transactionInputs,
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
  transactionInputs: Transaction;
  setTransactionInputs: React.Dispatch<React.SetStateAction<Transaction>>;
};

export const EncodeForm: React.FC<EncodeFormProps> = ({ transactionInputs, setTransactionInputs }) => {
  // FIXME: Chain Details need to contains mode. atm do it manually
  const form = getForm(getChainModes(transactionInputs.chainId), transactionInputs, setTransactionInputs);
  const [mode, setMode] = useState<Mode>("transfer");
  const [tokenIds, setTokenIds] = useState<string[]>([]);

  useEffect(() => {
    const getTokenIds = async () => {
      const state = await getData(transactionInputs.chainId, transactionInputs.senders[0]);

      const tokenIds = state?.balances?.tokens?.map((tokenAmount: any) => tokenAmount.tokenId);
      setTokenIds(tokenIds || []);
    };

    setMode("transfer");
    getTokenIds();
  }, [transactionInputs.chainId, transactionInputs.senders]);

  const renderSwitch = ({ type, id, label, value, onChange, onCheck, disabled }: FormInput) => {
    switch (type) {
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
      case "token":
        if (transactionInputs.mode === "transferToken") {
          return (
            <Tokens
              key={id}
              chainId={transactionInputs.chainId}
              tokenIds={tokenIds}
              selectedTokenId={transactionInputs.tokenId}
              setTransactionInputs={setTransactionInputs}
            />
          );
        }
      case "validator":
        if (transactionInputs.mode === "delegate") {
          return (
            <Validators
              key={id}
              chainId={transactionInputs.chainId}
              setTransactionInputs={setTransactionInputs}
              validatorAddress={transactionInputs.validator}
            />
          );
        }
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
            setTransactionInputs({
              ...transactionInputs,
              mode: "transfer",
              recipients: [],
            });
          } else if (value === "transferToken") {
            setTransactionInputs({
              ...transactionInputs,
              mode: "transferToken",
              tokenId: "",
              recipients: [],
            });
          } else if (value === "delegate") {
            setTransactionInputs({
              ...transactionInputs,
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
