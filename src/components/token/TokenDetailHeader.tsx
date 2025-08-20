import React from "react";
import { IndexHeader } from "@/components/IndexHeader";

interface TokenDetailHeaderProps {
  cryptoOptions: any[];
}

export const TokenDetailHeader: React.FC<TokenDetailHeaderProps> = ({
  cryptoOptions,
}) => {
  return (
    <>
      <IndexHeader
        selectedCrypto="bitcoin"
        cryptoOptions={cryptoOptions}
        currentPrice={50000}
        priceChange={2.5}
      />
    </>
  );
};
