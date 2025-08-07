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
    <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/40 backdrop-blur-sm">
      <h3 className="text-white font-medium flex items-center gap-2 mb-4">
        <BarChart3 className="h-4 w-4 text-blue-400" />
        AI Trading Signals
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {recommendations.map((rec, index) => {
          const ActionIcon = getActionIcon(rec.action);
          return (
            <div key={index} className="bg-gray-700/40 rounded-lg p-3 space-y-2 border border-gray-600/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ActionIcon className="h-3 w-3 text-green-400" />
                  <span className="text-white font-medium text-sm">{rec.asset}</span>
                </div>
                <Badge variant="outline" className={`text-xs ${getActionColor(rec.action)} border-current uppercase`}>
                  {rec.action}
                </Badge>
              </div>
              <div className="text-xs text-gray-300 leading-relaxed">
                {rec.reason}
              </div>
              <div className="flex justify-between items-center">
                {rec.targetPrice && (
                  <span className="text-xs text-blue-400">
                    Target: ${rec.targetPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-blue-400">
                  {Math.round(rec.confidence)}% confident
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};