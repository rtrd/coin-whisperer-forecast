import React from 'react';
import { BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getActionIcon, getActionColor } from '@/utils/tradingSignalsHelpers';
import { TradingRecommendation } from '@/types/tradingSignals';

interface TradingRecommendationsProps {
  recommendations: TradingRecommendation[];
}

export const TradingRecommendations: React.FC<TradingRecommendationsProps> = ({ recommendations }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <h3 className="text-white font-medium flex items-center gap-2 mb-4">
        <BarChart3 className="h-4 w-4 text-purple-400" />
        AI Trading Signals
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-2">
        {recommendations.map((rec, index) => {
          const ActionIcon = getActionIcon(rec.action);
          return (
            <div key={index} className="bg-gray-700/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ActionIcon className="h-3 w-3 text-green-300" />
                  <span className="text-white font-medium text-sm">{rec.asset}</span>
                </div>
                <Badge variant="outline" className={`text-xs ${getActionColor(rec.action)} uppercase`}>
                  {rec.action}
                </Badge>
              </div>
              <div className="text-xs text-gray-200">
                {rec.reason}
              </div>
              <div className="flex justify-between items-center">
                {rec.targetPrice && (
                  <span className="text-xs text-blue-300">
                    Target: ${rec.targetPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-blue-300">
                  {rec.confidence}% confident
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};