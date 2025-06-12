
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter, TrendingUp, TrendingDown, X, ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  category: string;
  priceRange: [number, number];
  scoreRange: [number, number];
  aiScoreRange: [number, number];
  predictionRange: [number, number];
  volumeRange: [number, number];
  marketCapRange: [number, number];
  change24hRange: [number, number];
  sortBy: string;
  searchTerm: string;
}

export const CryptoFilters = ({ onFilterChange }: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: [0, 1000000],
    scoreRange: [0, 10],
    aiScoreRange: [0, 100],
    predictionRange: [-50, 100],
    volumeRange: [0, 100000000000],
    marketCapRange: [0, 100000000000000],
    change24hRange: [-50, 50],
    sortBy: "score",
    searchTerm: "",
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      category: "all",
      priceRange: [0, 1000000],
      scoreRange: [0, 10],
      aiScoreRange: [0, 100],
      predictionRange: [-50, 100],
      volumeRange: [0, 100000000000],
      marketCapRange: [0, 100000000000000],
      change24hRange: [-50, 50],
      sortBy: "score",
      searchTerm: "",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "category" && value !== "all") return true;
    if (key === "priceRange" && (value[0] !== 0 || value[1] !== 1000000))
      return true;
    if (key === "scoreRange" && (value[0] !== 0 || value[1] !== 10))
      return true;
    if (key === "aiScoreRange" && (value[0] !== 0 || value[1] !== 100))
      return true;
    if (key === "predictionRange" && (value[0] !== -50 || value[1] !== 100))
      return true;
    if (key === "volumeRange" && (value[0] !== 0 || value[1] !== 100000000000))
      return true;
    if (
      key === "marketCapRange" &&
      (value[0] !== 0 || value[1] !== 100000000000000)
    )
      return true;
    if (key === "change24hRange" && (value[0] !== -50 || value[1] !== 50))
      return true;
    if (key === "sortBy" && value !== "score") return true;
    if (key === "searchTerm" && value !== "") return true;
    return false;
  }).length;

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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mb-6 bg-gray-800/50 border-gray-700 shadow-2xl">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-gray-700/50 transition-colors">
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-400" />
                Smart Crypto Filters
                {activeFiltersCount > 0 && (
                  <Badge className="bg-blue-600">{activeFiltersCount}</Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 flex items-center gap-1">
                {isOpen ? "Hide Filters" : "Show Filters"}
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Search */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Search
                </label>
                <Input
                  placeholder="Search by name or symbol..."
                  value={filters.searchTerm}
                  onChange={(e) =>
                    updateFilters({ searchTerm: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Category
                </label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => updateFilters({ category: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all" className="text-white">
                      All Categories
                    </SelectItem>
                    <SelectItem value="Layer 1" className="text-white">
                      Layer 1
                    </SelectItem>
                    <SelectItem value="DeFi" className="text-white">
                      DeFi
                    </SelectItem>
                    <SelectItem value="Meme" className="text-white">
                      Meme
                    </SelectItem>
                    <SelectItem value="Layer 2" className="text-white">
                      Layer 2
                    </SelectItem>
                    <SelectItem value="Gaming" className="text-white">
                      Gaming
                    </SelectItem>
                    <SelectItem value="AI" className="text-white">
                      AI
                    </SelectItem>
                    <SelectItem value="Privacy" className="text-white">
                      Privacy
                    </SelectItem>
                    <SelectItem value="New" className="text-white">
                      New & Trending
                    </SelectItem>
                    <SelectItem value="Enterprise" className="text-white">
                      Enterprise
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Sort By
                </label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => updateFilters({ sortBy: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="score" className="text-white">
                      AI Score
                    </SelectItem>
                    <SelectItem value="prediction" className="text-white">
                      Prediction %
                    </SelectItem>
                    <SelectItem value="name" className="text-white">
                      Name (A-Z)
                    </SelectItem>  
                    <SelectItem value="category" className="text-white">
                      Category
                    </SelectItem>   
                    <SelectItem value="price" className="text-white">
                      Price
                    </SelectItem>
                    <SelectItem value="change24h" className="text-white">
                      24h Change
                    </SelectItem>
                    <SelectItem value="volume" className="text-white">  
                      Volume
                    </SelectItem>
                    <SelectItem value="marketCap" className="text-white">
                      Market Cap
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
            </div>

            {/* Slider Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Score Range */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  AI Score: {filters.aiScoreRange[0]} -{" "}
                  {filters.aiScoreRange[1]}
                </label>
                <Slider
                  value={filters.aiScoreRange}
                  onValueChange={(value) =>
                    updateFilters({ aiScoreRange: value as [number, number] })
                  }
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Prediction Range */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Prediction %: {filters.predictionRange[0]}% -{" "}
                  {filters.predictionRange[1]}%
                </label>
                <Slider
                  value={filters.predictionRange}
                  onValueChange={(value) =>
                    updateFilters({
                      predictionRange: value as [number, number],
                    })
                  }
                  max={100}
                  min={-50}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    updateFilters({ priceRange: value as [number, number] })
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
                  24h Change: {filters.change24hRange[0]}% -{" "}
                  {filters.change24hRange[1]}%
                </label>
                <Slider
                  value={filters.change24hRange}
                  onValueChange={(value) =>
                    updateFilters({ change24hRange: value as [number, number] })
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
                  Volume: {formatVolume(filters.volumeRange[0])} -{" "}
                  {formatVolume(filters.volumeRange[1])}
                </label>
                <Slider
                  value={filters.volumeRange}
                  onValueChange={(value) =>
                    updateFilters({ volumeRange: value as [number, number] })
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
                  Market Cap: {formatMarketCap(filters.marketCapRange[0])} -{" "}
                  {formatMarketCap(filters.marketCapRange[1])}
                </label>
                <Slider
                  value={filters.marketCapRange}
                  onValueChange={(value) =>
                    updateFilters({ marketCapRange: value as [number, number] })
                  }
                  max={1000000000000}
                  min={0}
                  step={1000000000}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
