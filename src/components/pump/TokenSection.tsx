
import React from "react";
import { TokenCard } from "./TokenCard";
import { TokenTable } from "./TokenTable";

interface PumpToken {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  icon: string;
  pumpScore: number;
}

interface TokenSectionProps {
  title: string;
  icon: React.ReactNode;
  tokens: PumpToken[];
  changeColorClass: string;
  viewMode: "list" | "grid";
}

export const TokenSection: React.FC<TokenSectionProps> = ({
  title,
  icon,
  tokens,
  changeColorClass,
  viewMode,
}) => {
  return (
    <div className="bg-gray-700/50 rounded-lg p-6">
      <h3 className="text-white font-medium flex items-center gap-2 mb-6">
        {icon}
        {title}
      </h3>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tokens.map((token, index) => (
            <TokenCard
              key={index}
              token={token}
              changeColorClass={changeColorClass}
            />
          ))}
        </div>
      ) : (
        <TokenTable tokens={tokens} changeColorClass={changeColorClass} />
      )}
    </div>
  );
};
