
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FilterHeader } from "./filters/FilterHeader";
import { BasicFilters } from "./filters/BasicFilters";
import { SliderFilters } from "./filters/SliderFilters";

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

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mb-6 bg-gray-800/50 border-gray-700 shadow-2xl">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer transition-colors">
            <CardTitle>
              <FilterHeader
                isOpen={isOpen}
                activeFiltersCount={activeFiltersCount}
              />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <BasicFilters
              filters={filters}
              onUpdateFilters={updateFilters}
              onResetFilters={resetFilters}
            />
            <SliderFilters
              filters={filters}
              onUpdateFilters={updateFilters}
            />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
