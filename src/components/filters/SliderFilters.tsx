import React from "react";
import { Slider } from "@/components/ui/slider";

interface FilterState {
  category: string;
  priceRange: [number, number];
  scoreRange: [number, number];
  volumeRange: [number, number];
  marketCapRange: [number, number];
  change24hRange: [number, number];
  sortBy: string;
  searchTerm: string;
}

interface SliderFiltersProps {
  filters: FilterState;
  onUpdateFilters: (newFilters: Partial<FilterState>) => void;
}

export const SliderFilters: React.FC<SliderFiltersProps> = ({
  filters,
  onUpdateFilters,
}) => {
  const formatVolume = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${(value / 1e3).toFixed(1)}K`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Price Range */}
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </label>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) =>
            onUpdateFilters({ priceRange: value as [number, number] })
          }
          max={1000000}
          min={0}
          step={100}
          className="w-full"
        />
      </div>

      {/* 24h Change Range */}
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          24h Change: {filters.change24hRange[0]}% - {filters.change24hRange[1]}%
        </label>
        <Slider
          value={filters.change24hRange}
          onValueChange={(value) =>
            onUpdateFilters({ change24hRange: value as [number, number] })
          }
          max={50}
          min={-50}
          step={1}
          className="w-full"
        />
      </div>

      {/* Volume Range */}
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          Volume: {formatVolume(filters.volumeRange[0])} - {formatVolume(filters.volumeRange[1])}
        </label>
        <Slider
          value={filters.volumeRange}
          onValueChange={(value) =>
            onUpdateFilters({ volumeRange: value as [number, number] })
          }
          max={1000000000}
          min={0}
          step={1000000}
          className="w-full"
        />
      </div>

      {/* Market Cap Range */}
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          Market Cap: {formatMarketCap(filters.marketCapRange[0])} - {formatMarketCap(filters.marketCapRange[1])}
        </label>
        <Slider
          value={filters.marketCapRange}
          onValueChange={(value) =>
            onUpdateFilters({ marketCapRange: value as [number, number] })
          }
          max={1000000000000}
          min={0}
          step={1000000000}
          className="w-full"
        />
      </div>
    </div>
  );
};