
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BarChart3, LayoutList, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import { MarketDataFilters, FilterType } from "./MarketDataFilters";
import { MarketDataTable } from "./MarketDataTable";
import { MarketDataGrid } from "./MarketDataGrid";
import { generateMarketData, getFilterTitle } from "./MarketDataUtils";

interface MarketDataWidgetProps {
  cryptoOptions: any[];
  AllCryptosData: any;
  onMarketDataFilter: (filter: any) => void;
}

export const MarketDataWidget: React.FC<MarketDataWidgetProps> = ({
  cryptoOptions,
  AllCryptosData,
  onMarketDataFilter,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("market_cap");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isUnlocked] = useState(() => {
    return localStorage.getItem("ai-content-unlocked") === "true";
  });

  const marketData = generateMarketData(cryptoOptions, activeFilter);

  console.log("Market data", marketData);

  return (
    <TooltipProvider>
      <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-white">
                {getFilterTitle(activeFilter)}
              </CardTitle>
              <Badge className="bg-green-600">Live Data</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`${
                  viewMode === "list" 
                    ? "text-white" 
                    : "text-gray-300 border-gray-600 bg-gray-700/50 hover:bg-gray-600/50 hover:text-white"
                }`}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`${
                  viewMode === "grid" 
                    ? "text-white" 
                    : "text-gray-300 border-gray-600 bg-gray-700/50 hover:bg-gray-600/50 hover:text-white"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <MarketDataFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onMarketDataFilter={onMarketDataFilter}
          />
        </CardHeader>

        <CardContent>
          {viewMode === "list" ? (
            <MarketDataTable
              marketData={marketData}
              isUnlocked={isUnlocked}
              activeFilter={activeFilter}
            />
          ) : (
            <MarketDataGrid
              marketData={marketData}
              isUnlocked={isUnlocked}
              activeFilter={activeFilter}
            />
          )}

          <div className="mt-6 text-center">
            <Link to="/tokens" state={{ AllCryptosData }}>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                View All {cryptoOptions.length}+ Tokens
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
