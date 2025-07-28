// Price calculation utilities

export const calculatePriceChange = (currentPrice: number, previousPrice: number): number => {
  if (!currentPrice || !previousPrice) return 0;
  return ((currentPrice - previousPrice) / previousPrice) * 100;
};

export const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return price.toFixed(2);
};

export const formatVolume = (volume: number): string => {
  if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
  if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
  if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
  return `$${volume.toFixed(2)}`;
};

export const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
  return `$${marketCap.toFixed(2)}`;
};

export const getCurrentAndPreviousPrice = (cryptoData: any[] | null) => {
  const currentPrice = cryptoData?.length 
    ? cryptoData[cryptoData.length - 1]?.price || 0
    : 0;
    
  const previousPrice = cryptoData?.length > 1
    ? cryptoData[cryptoData.length - 2]?.price || 0
    : 0;
    
  const priceChange = calculatePriceChange(currentPrice, previousPrice);
  
  return { currentPrice, previousPrice, priceChange };
};