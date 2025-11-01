import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Grid3x3 } from "lucide-react";
import { DefiCategory } from "@/hooks/useDefiData";

interface DefiCategoriesGridProps {
  categories: DefiCategory[];
}

export const DefiCategoriesGrid: React.FC<DefiCategoriesGridProps> = ({ categories }) => {
  const formatTVL = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Grid3x3 className="h-5 w-5 text-blue-400" />
          DeFi Categories
        </CardTitle>
        <p className="text-sm text-gray-400 mt-1">
          TVL breakdown by protocol category
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-gray-700/40 rounded-lg p-4 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {category.protocols} {category.protocols === 1 ? 'protocol' : 'protocols'}
                  </p>
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  category.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {category.change24h >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span className="font-medium">
                    {category.change24h >= 0 ? '+' : ''}
                    {category.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">
                {formatTVL(category.tvl)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
