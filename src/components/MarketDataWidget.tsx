
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { MarketDataFilters, FilterType } from "./MarketDataFilters";
import { MarketDataTable } from "./MarketDataTable";
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
  const [isUnlocked] = useState(() => {
    return localStorage.getItem("ai-content-unlocked") === "true";
  });

  const marketData = generateMarketData(cryptoOptions, activeFilter);

  console.log("Market data", marketData);

  return (
    <TooltipProvider>
      <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            {getFilterTitle(activeFilter)}
            <Badge className="bg-green-600">Live Data</Badge>
          </CardTitle>

          <MarketDataFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onMarketDataFilter={onMarketDataFilter}
          />
        </CardHeader>

        <CardContent>
          <MarketDataTable
            marketData={marketData}
            isUnlocked={isUnlocked}
            activeFilter={activeFilter}
          />

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
