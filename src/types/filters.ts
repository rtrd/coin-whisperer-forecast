/**
 * Consolidated filter types and utilities
 */

export type FilterType = "market_cap" | "volume" | "gainers" | "losers" | "trending";

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