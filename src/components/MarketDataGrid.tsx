
import React from 'react';
import { MarketDataGridCard } from './MarketDataGridCard';
import { getTokenUrlId } from '@/utils/tokenMapping';

interface MarketDataGridProps {
  marketData: any[];
  isUnlocked: boolean;
  activeFilter: string;
}

export const MarketDataGrid: React.FC<MarketDataGridProps> = ({
  marketData,
  isUnlocked,
  activeFilter
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {marketData.map((token, index) => {
        const tokenUrlId = getTokenUrlId(token.value);
        
        return (
          <MarketDataGridCard
            key={token.value}
            token={token}
            index={index}
            isUnlocked={isUnlocked}
            tokenUrlId={tokenUrlId}
          />
        );
      })}
    </div>
  );
};
