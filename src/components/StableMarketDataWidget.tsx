import React, { useState, memo, useMemo, useCallback, useRef, useEffect } from "react";
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
import { useAppContext } from "@/contexts/ConsolidatedAppProvider";
import { Skeleton } from "@/components/ui/skeleton";

interface StableMarketDataWidgetProps {
  cryptoOptions: CryptoToken[];
  AllCryptosData: CryptoToken[];
  onMarketDataFilter: (filter: any) => void;
}

type SortField = 'rank' | 'name' | 'price' | 'change24h' | 'predictionPercentage' | 'aiScore' | 'volume24h' | 'marketCap' | 'category';
type SortDirection = 'asc' | 'desc';

const MarketDataSkeleton = () => (
  <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl">
    <CardHeader>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-400" />
          <Skeleton className="h-6 w-32" />
          <Badge className="bg-green-600">Live Data</Badge>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24" />
        ))}
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-700/30 rounded">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const StableMarketDataWidget: React.FC<StableMarketDataWidgetProps> = memo(
  ({ cryptoOptions, AllCryptosData, onMarketDataFilter }) => {
    const { reportError } = useAppContext();
    const [activeFilter, setActiveFilter] = useState<FilterType>("market_cap");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [sortField, setSortField] = useState<SortField>('rank');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const mountedRef = useRef(true);

    useEffect(() => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
      };
    }, []);

    const isUnlocked = useMemo(() => {
      try {
        return localStorage.getItem("ai-content-unlocked") === "true";
      } catch (error) {
        reportError(error as Error, 'localStorage access in MarketDataWidget');
        return false;
      }
    }, [reportError]);

    const getFieldValue = useCallback((item: any, field: SortField) => {
      try {
        switch (field) {
          case 'rank': return cryptoOptions.findIndex(c => c.value === item.value) + 1;
          case 'name': return item.name?.toLowerCase() || '';
          case 'price': return item.price || 0;
          case 'change24h': return item.change24h || 0;
          case 'predictionPercentage': return item.predictionPercentage || 0;
          case 'aiScore': return item.aiScore || 0;
          case 'volume24h': return item.volume24h || 0;
          case 'marketCap': return item.marketCap || 0;
          case 'category': return item.category?.toLowerCase() || '';
          default: return 0;
        }
      } catch (error) {
        reportError(error as Error, `getFieldValue for ${field}`);
        return 0;
      }
    }, [cryptoOptions, reportError]);

    const handleSort = useCallback((field: SortField) => {
      try {
        if (sortField === field) {
          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
          setSortField(field);
          setSortDirection('asc');
        }
      } catch (error) {
        reportError(error as Error, `handleSort for ${field}`);
      }
    }, [sortField, sortDirection, reportError]);

    const marketData = useMemo(() => {
      try {
        setError(null);
        setIsLoading(true);

        if (!cryptoOptions || !Array.isArray(cryptoOptions)) {
          console.error("StableMarketDataWidget: Invalid cryptoOptions", cryptoOptions);
          setError("Invalid market data provided");
          return [];
        }

        const data = generateMarketData(cryptoOptions, activeFilter);
        
        if (!data || !Array.isArray(data)) {
          console.error("StableMarketDataWidget: generateMarketData returned invalid data", data);
          setError("Failed to generate market data");
          return [];
        }
        
        const sortedData = [...data].sort((a, b) => {
          try {
            const aValue = getFieldValue(a, sortField);
            const bValue = getFieldValue(b, sortField);
            
            if (aValue === bValue) return 0;
            
            const comparison = aValue < bValue ? -1 : 1;
            return sortDirection === 'asc' ? comparison : -comparison;
          } catch (error) {
            reportError(error as Error, 'marketData sorting');
            return 0;
          }
        });

        if (mountedRef.current) {
          setIsLoading(false);
        }

        return sortedData;
      } catch (error) {
        reportError(error as Error, 'marketData generation');
        if (mountedRef.current) {
          setIsLoading(false);
          setError("Failed to process market data");
        }
        return [];
      }
    }, [cryptoOptions, activeFilter, sortField, sortDirection, getFieldValue, reportError]);

    const filterTitle = useMemo(() => {
      try {
        return getFilterTitle(activeFilter);
      } catch (error) {
        reportError(error as Error, 'getFilterTitle');
        return "Market Data";
      }
    }, [activeFilter, reportError]);

    // Show loading skeleton while processing
    if (isLoading && marketData.length === 0) {
      return <MarketDataSkeleton />;
    }

    // Show error state
    if (error) {
      return (
        <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl">
          <CardContent className="py-8 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button 
              onClick={() => {
                setError(null);
                setActiveFilter("market_cap");
              }}
              variant="outline"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      );
    }

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

            <ErrorBoundary>
              <MarketDataFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                onMarketDataFilter={onMarketDataFilter}
              />
            </ErrorBoundary>
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

StableMarketDataWidget.displayName = "StableMarketDataWidget";