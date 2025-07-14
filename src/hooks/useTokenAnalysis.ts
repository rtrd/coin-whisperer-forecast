import { useState, useEffect, useCallback, useRef } from "react";
import { TokenAnalysis, SelectedTokenInfo } from "@/types/tokenAnalysis";
import { fetchCryptoData } from "@/utils/tokenAnaylysis";

export const useTokenAnalysis = (
  selectedToken: SelectedTokenInfo | undefined,
  currentPrice: number,
  priceChange: number,
  tokenInfoPrice?: number,
  tokenInfoPriceChange?: number,
  timeframe: string = "1m",
  cryptoData?: any[]
) => {
  const [analysis, setAnalysis] = useState<TokenAnalysis>({
    momentum: 0,
    volatility: 0,
    marketSentiment: "neutral",
    supportLevel: 0,
    resistanceLevel: 0,
  });
  const prices = cryptoData?.map((d) => d.price) || [];

  const recentWindow = Math.min(20, prices.length);
  const recentPrices = prices.slice(-recentWindow);
  const supportLevel = Math.min(...recentPrices);
  const resistanceLevel = Math.max(...recentPrices);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const mean =
    recentPrices.reduce((sum, val) => sum + val, 0) / recentPrices.length;

  const squaredDiffs = recentPrices.map((price) => Math.pow(price - mean, 2));

  const stdDev = Math.sqrt(
    squaredDiffs.reduce((a, b) => a + b, 0) / recentPrices.length
  );

  const volatility = stdDev; // Optional: scale if needed

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
      momentum:
        ((recentPrices[recentPrices.length - 1] - recentPrices[0]) /
          recentPrices[0]) *
        100,
      volatility: volatility,
      marketSentiment:
        baseScore > 7 ? "bullish" : baseScore < 4 ? "bearish" : "neutral",
      supportLevel: supportLevel,
      resistanceLevel: resistanceLevel,
    });
  }, [
    selectedToken,
    tokenInfoPrice,
    tokenInfoPriceChange,
    currentPrice,
    priceChange,
  ]);

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
