import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

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

interface BasicFiltersProps {
  filters: FilterState;
  onUpdateFilters: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
}

export const BasicFilters: React.FC<BasicFiltersProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Search */}
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          Search
        </label>
        <Input
          placeholder="Search by name or symbol..."
          value={filters.searchTerm}
          onChange={(e) => onUpdateFilters({ searchTerm: e.target.value })}
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
          onValueChange={(value) => onUpdateFilters({ category: value })}
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
          onValueChange={(value) => onUpdateFilters({ sortBy: value })}
        >
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
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
          onClick={onResetFilters}
          variant="outline"
          className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
        >
          <X className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
};