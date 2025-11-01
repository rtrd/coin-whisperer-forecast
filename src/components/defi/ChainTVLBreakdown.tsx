import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Link2 } from "lucide-react";
import { ChainTVL } from "@/hooks/useDefiData";

interface ChainTVLBreakdownProps {
  chains: ChainTVL[];
  totalTVL: number;
}

export const ChainTVLBreakdown: React.FC<ChainTVLBreakdownProps> = ({ chains, totalTVL }) => {
  const formatTVL = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const getChainPercentage = (chainTVL: number) => {
    return ((chainTVL / totalTVL) * 100).toFixed(2);
  };

  return (
    <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Link2 className="h-5 w-5 text-blue-400" />
          TVL Distribution by Blockchain
        </CardTitle>
        <p className="text-sm text-gray-400 mt-1">
          Total Value Locked across different blockchain networks
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {chains.map((chain, index) => {
          const percentage = parseFloat(getChainPercentage(chain.tvl));
          
          return (
            <div key={chain.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-400 w-6">
                    #{index + 1}
                  </span>
                  <div>
                    <div className="font-medium text-white">{chain.name}</div>
                    <div className="text-xs text-gray-400">
                      {chain.protocols} protocols
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white">
                    {formatTVL(chain.tvl)}
                  </div>
                  <div className={`flex items-center justify-end gap-1 text-xs ${
                    chain.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {chain.change24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>
                      {chain.change24h >= 0 ? '+' : ''}
                      {chain.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Progress 
                  value={percentage} 
                  className="flex-1 h-2 bg-gray-700"
                />
                <span className="text-xs font-medium text-gray-400 w-14 text-right">
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
