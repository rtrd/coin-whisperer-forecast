import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { TechnicalIndicator } from "@/utils/technicalIndicators";

interface IndicatorsListProps {
  indicators: TechnicalIndicator[];
}

export const IndicatorsList: React.FC<IndicatorsListProps> = ({ indicators }) => {
  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "buy":
        return "text-emerald-400 border-emerald-400 bg-emerald-400/10";
      case "sell":
        return "text-red-400 border-red-400 bg-red-400/10";
      default:
        return "text-amber-400 border-amber-400 bg-amber-400/10";
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case "buy":
        return <TrendingUp className="h-3 w-3" />;
      case "sell":
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-4 w-4 text-yellow-400" />
        <h4 className="text-sm font-semibold text-gray-200">
          Technical Indicators
        </h4>
      </div>
      {indicators.map((indicator, index) => (
        <div
          key={index}
          className="group p-4 bg-gray-700/30 rounded-xl border border-gray-600/20 hover:border-gray-500/40 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-200">
              {indicator.name}
            </span>
            <Badge
              variant="outline"
              className={`${getSignalColor(
                indicator.signal
              )} text-xs font-medium backdrop-blur-sm`}
            >
              {getSignalIcon(indicator.signal)}
              <span className="ml-1 capitalize">{indicator.signal}</span>
            </Badge>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">
              {indicator.name.includes("SMA") ||
              indicator.name.includes("MACD")
                ? `$${
                    indicator.value >= 1000
                      ? indicator.value.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : indicator.value.toFixed(2)
                  }`
                : indicator.value.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400 font-medium">
              {indicator.name.includes("MACD")
                ? (indicator.strength * 100).toFixed(2)
                : (indicator.strength * 100).toFixed(2)}
              % strength
            </span>
          </div>
          <Progress
            value={indicator.strength * 100}
            className={`h-2 ${
              indicator.signal === "buy"
                ? "[&>div]:bg-emerald-400"
                : indicator.signal === "sell"
                ? "[&>div]:bg-red-400"
                : "[&>div]:bg-amber-400"
            }`}
          />
        </div>
      ))}
    </div>
  );
};