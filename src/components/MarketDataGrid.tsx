import React from "react";
import { MarketDataGridCard } from "./MarketDataGridCard";
import { getTokenUrlId } from "@/utils/tokenMapping";

interface MarketDataGridProps {
  marketData: any[];
  isUnlocked: boolean;
  activeFilter: string;
  AllCryptosData?: any[]; // Optional, used for additional data display
}

export const MarketDataGrid: React.FC<MarketDataGridProps> = ({
  marketData,
  isUnlocked,
  activeFilter,
  AllCryptosData = [],
}) => {
  // Add safety check for marketData
  if (!marketData || !Array.isArray(marketData)) {
    console.error("MarketDataGrid: Invalid marketData prop", marketData);
    return (
      <div className="text-center text-gray-400 py-8">
        <p>No market data available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {marketData.map((token, index) => {
        // Add safety checks
        if (!token || !token.value) {
          console.error("MarketDataGrid: Invalid token data", token, index);
          return null;
        }

        const tokenUrlId = getTokenUrlId(token.value);

        return (
          <MarketDataGridCard
            key={`${token.value}-${index}`}
            token={token}
            index={index}
            isUnlocked={isUnlocked}
            tokenUrlId={tokenUrlId}
            AllCryptosData={AllCryptosData}
          />
        );
      }).filter(Boolean)}
    </div>
  );
};
