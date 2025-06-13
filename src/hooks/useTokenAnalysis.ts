
import { useState, useEffect, useCallback, useRef } from 'react';
import { TokenAnalysis, SelectedTokenInfo } from '@/types/tokenAnalysis';

export const useTokenAnalysis = (
  selectedToken: SelectedTokenInfo | undefined,
  currentPrice: number,
  priceChange: number,
  tokenInfoPrice?: number,
  tokenInfoPriceChange?: number
) => {
  const [analysis, setAnalysis] = useState<TokenAnalysis>({
    momentum: 0,
    volatility: 0,
    marketSentiment: 'neutral',
    supportLevel: 0,
    resistanceLevel: 0
  });

  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const updateAnalysis = useCallback(() => {
    if (!selectedToken) return;
    
    // Use API price if available, otherwise use prop
    const effectivePrice = tokenInfoPrice || currentPrice;
    const effectivePriceChange = tokenInfoPriceChange || priceChange;
    
    if (effectivePrice <= 0) return;
    
    // Prevent too frequent updates
    const now = Date.now();
    if (now - lastUpdateRef.current < 5000) return;
    
    lastUpdateRef.current = now;
    const baseScore = selectedToken?.score || 5;
    
    setAnalysis({
      momentum: (Math.random() * 200 - 100),
      volatility: Math.random() * 100,
      marketSentiment: baseScore > 7 ? 'bullish' : baseScore < 4 ? 'bearish' : 'neutral',
      supportLevel: effectivePrice * (0.92 + Math.random() * 0.06),
      resistanceLevel: effectivePrice * (1.02 + Math.random() * 0.06)
    });
  }, [selectedToken, tokenInfoPrice, tokenInfoPriceChange, currentPrice, priceChange]);

  useEffect(() => {
    // Clear existing interval
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }

    // Initial update with delay to prevent rapid firing
    const timeoutId = setTimeout(() => {
      updateAnalysis();
    }, 1000);

    // Set up interval for periodic updates
    updateIntervalRef.current = setInterval(updateAnalysis, 30000);

    return () => {
      clearTimeout(timeoutId);
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [selectedToken, updateAnalysis]);

  return analysis;
};
