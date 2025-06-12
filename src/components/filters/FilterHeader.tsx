
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

interface FilterHeaderProps {
  isOpen: boolean;
  activeFiltersCount: number;
}

export const FilterHeader: React.FC<FilterHeaderProps> = ({
  isOpen,
  activeFiltersCount,
}) => {
  return (
    <div className="text-white flex items-center justify-between">
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
    </div>
  );
};
