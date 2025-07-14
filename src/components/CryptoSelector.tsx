
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trackTokenClick } from "@/utils/analytics";

interface CryptoOption {
  value: string;
  label: string;
  icon: string;
  category: string;
  score: number;
  prediction: string;
}

interface CryptoSelectorProps {
  cryptoOptions: CryptoOption[];
  selectedCrypto: string;
  onSelectCrypto: (crypto: string) => void;
}

export const CryptoSelector: React.FC<CryptoSelectorProps> = ({
  cryptoOptions,
  selectedCrypto,
  onSelectCrypto
}) => {
  const selectedOption = cryptoOptions.find(option => option.value === selectedCrypto);
  
  const handleCryptoSelect = (value: string) => {
    const selected = cryptoOptions.find(option => option.value === value);
    if (selected) {
      trackTokenClick(selected.label, 'crypto_selector');
    }
    onSelectCrypto(value);
  };

  return (
    <Select value={selectedCrypto} onValueChange={handleCryptoSelect}>
      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
        <SelectValue>
          {selectedOption ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedOption.icon}</span>
              <span className="truncate">{selectedOption.label}</span>
            </div>
          ) : (
            "Select cryptocurrency..."
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-gray-700 border-gray-600 max-h-[300px]">
        {cryptoOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-white hover:bg-gray-600 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{option.icon}</span>
              <span>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
