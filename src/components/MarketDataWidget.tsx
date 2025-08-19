import React, { useState, memo, useMemo } from "react";
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
import { CryptoToken } from "@/types/crypto";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface MarketDataWidgetProps {
  cryptoOptions: CryptoToken[];
  AllCryptosData: CryptoToken[];
  onMarketDataFilter: (filter: any) => void;
}

type SortField = 'rank' | 'name' | 'price' | 'change24h' | 'predictionPercentage' | 'aiScore' | 'volume24h' | 'marketCap' | 'category';
type SortDirection = 'asc' | 'desc';

export const MarketDataWidget: React.FC<MarketDataWidgetProps> = memo(
  ({ cryptoOptions, AllCryptosData, onMarketDataFilter }) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>("market_cap");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [sortField, setSortField] = useState<SortField>('rank');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const isUnlocked = useMemo(() => {
      return localStorage.getItem("ai-content-unlocked") === "true";
    }, []);

    const getFieldValue = (item: any, field: SortField) => {
      switch (field) {
        case 'rank': return cryptoOptions.findIndex(c => c.value === item.value) + 1;
        case 'name': return item.name.toLowerCase();
        case 'price': return item.price || 0;
        case 'change24h': return item.change24h || 0;
        case 'predictionPercentage': return item.predictionPercentage || 0;
        case 'aiScore': return item.aiScore || 0;
        case 'volume24h': return item.volume24h || 0;
        case 'marketCap': return item.marketCap || 0;
        case 'category': return item.category?.toLowerCase() || '';
        default: return 0;
      }
    };

    const handleSort = (field: SortField) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    };

    const marketData = useMemo(() => {
      try {
        if (!cryptoOptions || !Array.isArray(cryptoOptions)) {
          console.error("MarketDataWidget: Invalid cryptoOptions", cryptoOptions);
          return [];
        }

        const data = generateMarketData(cryptoOptions, activeFilter);
        
        if (!data || !Array.isArray(data)) {
          console.error("MarketDataWidget: generateMarketData returned invalid data", data);
          return [];
        }
        
        return [...data].sort((a, b) => {
          const aValue = getFieldValue(a, sortField);
          const bValue = getFieldValue(b, sortField);
          
          if (aValue === bValue) return 0;
          
          const comparison = aValue < bValue ? -1 : 1;
          return sortDirection === 'asc' ? comparison : -comparison;
        });
      } catch (error) {
        console.error("MarketDataWidget: Error generating market data", error);
        return [];
      }
    }, [cryptoOptions, activeFilter, sortField, sortDirection]);

    const filterTitle = useMemo(
      () => getFilterTitle(activeFilter),
      [activeFilter]
    );

    return (
      <TooltipProvider>
        <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl">
            <CardHeader>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-white">{filterTitle}</CardTitle>
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
            <ErrorBoundary>
              {viewMode === "list" ? (
                <MarketDataTable
                  marketData={marketData}
                  isUnlocked={isUnlocked}
                  activeFilter={activeFilter}
                  AllCryptosData={AllCryptosData}
                  onSort={handleSort}
                  sortField={sortField}
                  sortDirection={sortDirection}
                />
              ) : (
                <MarketDataGrid
                  marketData={marketData}
                  isUnlocked={isUnlocked}
                  activeFilter={activeFilter}
                  AllCryptosData={AllCryptosData}
                />
              )}
            </ErrorBoundary>

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
  }
);

MarketDataWidget.displayName = "MarketDataWidget";
