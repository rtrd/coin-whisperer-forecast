
import React, { useState } from 'react';
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

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
  onSelectCrypto: (value: string) => void;
}

export const CryptoSearchSelector = ({ 
  cryptoOptions, 
  selectedCrypto, 
  onSelectCrypto 
}: CryptoSearchSelectorProps) => {
  const [open, setOpen] = useState(false);

  const selectedOption = cryptoOptions.find(option => option.value === selectedCrypto);

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
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">{selectedOption.icon}</span>
              <span className="truncate">{selectedOption.label}</span>
            </div>
          ) : (
            "Search cryptocurrency..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-gray-700 border-gray-600" style={{ width: 'var(--radix-popover-trigger-width)' }}>
        <Command className="bg-gray-700">
          <CommandInput 
            placeholder="Search cryptocurrency..." 
            className="text-white bg-gray-700"
          />
          <CommandList className="max-h-96 overflow-y-auto">
            <CommandEmpty className="text-gray-400 py-6 text-center">
              No cryptocurrency found.
            </CommandEmpty>
            {['Major', 'DeFi', 'Meme', 'L2', 'Gaming', 'AI', 'Privacy', 'Stable', 'New', 'Enterprise'].map(category => {
              const categoryOptions = cryptoOptions.filter(option => option.category === category);
              if (categoryOptions.length === 0) return null;
              
              return (
                <CommandGroup key={category} heading={`${category} Coins`} className="text-gray-300">
                  {categoryOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={`${option.label} ${option.value}`}
                      onSelect={() => {
                        onSelectCrypto(option.value);
                        setOpen(false);
                      }}
                      className="text-white hover:bg-gray-600 cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCrypto === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-center justify-between w-full">
                        <span className="flex items-center gap-2">
                          <span className="text-yellow-400">{option.icon}</span>
                          <span className="truncate">{option.label}</span>
                        </span>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                            {option.prediction}
                          </Badge>
                          <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                            {option.score}
                          </Badge>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
