"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/utils/utils";

import { getValidators } from "~/api/validators";
import { useEffect, useState } from "react";
import { Transaction } from "~/types";

type ValidatorsProps = {
  chainId: string;
  setTransactionInputs: React.Dispatch<React.SetStateAction<Transaction>>;
  validatorAddress: string;
};

type Validator = {
  name: string;
  address: string;
  logo: string;
  comission: string;
  votingPower: string;
};

export const Validators: React.FC<ValidatorsProps> = ({
  chainId,
  setTransactionInputs,
  validatorAddress,
}) => {
  const [validators, setValidators] = useState<Validator[]>([]);
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    const fetchValidators = async () => {
      const data = await getValidators(chainId);
      setValidators(data.validators);
    };

    fetchValidators();
  }, [chainId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between flex"
        >
          {validatorAddress && validators
            ? validators.find((validator) => validator.address === validatorAddress)?.name
            : "Select a validator..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search validator..." />
          <CommandList>
            <CommandEmpty>No validator found.</CommandEmpty>
            <CommandGroup>
              {validators &&
                validators.map((validator: Validator) => (
                  <CommandItem
                    key={validator.address}
                    value={validator.name}
                    onSelect={() => {
                      setTransactionInputs((transaction: Transaction) => ({
                        ...transaction,
                        validator: validator.address,
                      }));
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        validatorAddress === validator.address ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {validator.name}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
