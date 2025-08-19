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
    volumeRange: [0, 100000000000],
    marketCapRange: [0, 100000000000000],
    change24hRange: [-50, 50],
    sortBy: "name",
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
      volumeRange: [0, 100000000000],
      marketCapRange: [0, 100000000000000],
      change24hRange: [-50, 50],
      sortBy: "name",
      searchTerm: "",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = () => {
    const defaultState = {
      category: "all",
      priceRange: [0, 1000000],
      scoreRange: [0, 10],
      volumeRange: [0, 100000000000],
      marketCapRange: [0, 100000000000000],
      change24hRange: [-50, 50],
      sortBy: "name",
      searchTerm: "",
    };

    return Object.entries(filters).some(([key, value]) => {
      const defaultValue = defaultState[key as keyof FilterState];
      if (Array.isArray(value) && Array.isArray(defaultValue)) {
        return value[0] !== defaultValue[0] || value[1] !== defaultValue[1];
      }
      return value !== defaultValue;
    });
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer">
            <FilterHeader isOpen={isOpen} activeFiltersCount={hasActiveFilters() ? 1 : 0} />
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            <BasicFilters
              filters={filters}
              onUpdateFilters={updateFilters}
              onResetFilters={resetFilters}
            />
            <SliderFilters filters={filters} onUpdateFilters={updateFilters} />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};