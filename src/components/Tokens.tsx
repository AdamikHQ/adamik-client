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

import { getToken } from "~/api/token";
import { useEffect, useState } from "react";
import { Transaction } from "~/types";

type TokenProps = {
  chainId: string;
  tokenIds: string[];
  selectedTokenId: string;
  setTransactionInputs: React.Dispatch<React.SetStateAction<Transaction>>;
};

type Token = {
  id: string;
  name: string;
};

export const Tokens: React.FC<TokenProps> = ({
  chainId,
  tokenIds,
  selectedTokenId,
  setTransactionInputs,
}) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const fetchTokens = async () => {
      const tokensData: Token[] = [];
      await Promise.all(
        tokenIds.map(async (tokenId) => {
          const data = await getToken(chainId, tokenId);
          if (data) {
            tokensData.push(data);
          }
        })
      );

      if (tokensData.length) {
        setTokens(tokensData);
      }
    };

    fetchTokens();
  }, [chainId, tokenIds]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between flex"
        >
          {selectedTokenId && tokens
            ? tokens.find((token) => token.id === selectedTokenId)?.name
            : "Select a token..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search token..." />
          <CommandList>
            <CommandEmpty>No token found.</CommandEmpty>
            <CommandGroup>
              {tokens &&
                tokens.map((token: Token) => (
                  <CommandItem
                    key={token.id}
                    value={token.name}
                    onSelect={() => {
                      setTransactionInputs((transaction: Transaction) => ({
                        ...transaction,
                        tokenId: token.id,
                      }));
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTokenId === token.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {token.name}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
