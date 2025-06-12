
import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CryptoOption {
  value: string;
  label: string;
  icon: string;
  category: string;
  score: number;
  prediction: string;
}

interface CryptoSearchSelectorProps {
  cryptoOptions: CryptoOption[];
  selectedCrypto: string;
  onSelectCrypto: (crypto: string) => void;
}

export const CryptoSearchSelector: React.FC<CryptoSearchSelectorProps> = ({
  cryptoOptions,
  selectedCrypto,
  onSelectCrypto
}) => {
  const [open, setOpen] = useState(false);

  const selectedOption = cryptoOptions.find(option => option.value === selectedCrypto);

  // Extract name and ticker from label
  const formatLabel = (label: string) => {
    // Assuming format is "Name (TICKER)"
    return label;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
        >
          {selectedOption ? (
            <span className="truncate text-blue-200">{formatLabel(selectedOption.label)}</span>
          ) : (
            "Select cryptocurrency..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-gray-800 border-gray-600" style={{ width: 'var(--radix-popover-trigger-width)' }}>
        <Command className="bg-gray-800">
          <div className="px-3 py-3 border-b border-gray-600">
            <CommandInput 
              placeholder="Search cryptocurrencies..." 
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm text-white placeholder:text-gray-400 outline-none disabled:cursor-not-allowed disabled:opacity-50 [&_.lucide-search]:text-blue-300"
            />
          </div>
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty className="text-gray-400">No cryptocurrency found.</CommandEmpty>
            <CommandGroup>
              {cryptoOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onSelectCrypto(currentValue);
                    setOpen(false);
                  }}
                  className="text-white hover:bg-gray-700 cursor-pointer px-3 py-2 aria-selected:bg-gray-700"
                >
                  <div className="flex items-center w-full">
                    <Check
                      className={cn(
                        "h-4 w-4 mr-3 text-blue-400",
                        selectedCrypto === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className={cn(
                      "font-medium text-left transition-colors",
                      selectedCrypto === option.value ? "text-blue-200" : "text-gray-300 hover:text-blue-200"
                    )}>
                      {formatLabel(option.label)}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
