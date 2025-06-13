
import { MarketData } from '@/types/crypto';

export type FilterType = "market_cap" | "volume" | "gainers" | "losers" | "trending";

export const formatPrice = (price: number): string => {
  if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else {
    return price.toPrecision(3);
  }
};

export const formatVolume = (volume: number): string => {
  if (volume >= 1000000000) {
    return (volume / 1000000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "B";
  } else if (volume >= 1000000) {
    return (volume / 1000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "M";
  } else if (volume >= 1000) {
    return (volume / 1000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "K";
  } else {
    return volume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
};

export const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1000000000000) {
    return (marketCap / 1000000000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "T";
  } else if (marketCap >= 1000000000) {
    return (marketCap / 1000000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "B";
  } else if (marketCap >= 1000000) {
    return (marketCap / 1000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "M";
  } else {
    return marketCap.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
};

export const getFilterTitle = (filter: FilterType): string => {
  switch (filter) {
    case "gainers":
      return "Top Gainers";
    case "losers":
      return "Top Losers";
    case "volume":
      return "Top Volume";
    case "market_cap":
      return "Top Market Cap";
    case "trending":
      return "Trending";
    default:
      return "Market Data";
  }
};
