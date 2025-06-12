
import React from "react";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Star,
} from "lucide-react";

export type FilterType =
  | "market_cap"
  | "volume"
  | "gainers"
  | "losers"
  | "trending";

interface MarketDataFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onMarketDataFilter?: (filter:any) => void;
}

export const MarketDataFilters: React.FC<MarketDataFiltersProps> = ({
  activeFilter,
  onFilterChange,
  onMarketDataFilter
}) => {
  const filters = [
    { key: "market_cap" as FilterType, label: "Market Cap", icon: BarChart3 },
    { key: "volume" as FilterType, label: "Volume", icon: Activity },
    { key: "gainers" as FilterType, label: "Top Gainers", icon: TrendingUp },
    { key: "losers" as FilterType, label: "Top Losers", icon: TrendingDown },
    { key: "trending" as FilterType, label: "Trending", icon: Star },
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {filters.map(({ key, label, icon: Icon }) => (
        <Button
          key={key}
          variant={activeFilter === key ? "default" : "outline"}
          size="sm"
          // onClick={() => onFilterChange(key)}
           onClick={() => {
               onFilterChange(key);           // Set the active filter
               onMarketDataFilter?.(key);     // Call the market data filter if provided
             }}
          className={`${
            activeFilter === key
              ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600"
          }`}
        >
          <Icon className="h-4 w-4 mr-2" />
          {label}
        </Button>
      ))}
    </div>
  );
};
