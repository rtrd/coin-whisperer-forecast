
import { useState, useEffect, useRef } from 'react';
import { TokenDataService } from '@/services/tokenDataService';

interface MarketData {
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number;
  allTimeHigh: number;
  allTimeLow: number;
  priceChange7d: number;
  priceChange30d: number;
}

export const useMarketData = (currentPrice: number, category: string, tokenId: string) => {
  const marketDataRef = useRef<MarketData>({
    marketCap: 0,
    volume24h: 0,
    circulatingSupply: 0,
    totalSupply: 0,
    allTimeHigh: 0,
    allTimeLow: 0,
    priceChange7d: 0,
    priceChange30d: 0
  });
  
  const [marketData, setMarketData] = useState(marketDataRef.current);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (currentPrice > 0 && !isInitialized) {
      const newMarketData = TokenDataService.generateMarketData(currentPrice, category);
      marketDataRef.current = newMarketData;
      setMarketData(newMarketData);
      setIsInitialized(true);
    }
  }, [currentPrice, category, isInitialized]);

  // Reset when token changes
  useEffect(() => {
    setIsInitialized(false);
  }, [tokenId]);

  return { marketData, isInitialized };
};
