import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, TrendingDown, Activity } from "lucide-react";

interface OverallSignalCardProps {
  overallTrend: "buy" | "sell" | "neutral";
  overallSignal: number;
}

export const OverallSignalCard: React.FC<OverallSignalCardProps> = ({
  overallTrend,
  overallSignal,
}) => {
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
    <div className="p-4 bg-gray-700/40 rounded-xl border border-gray-600/30 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20">
            <Target className="h-4 w-4 text-blue-400" />
          </div>
          <span className="text-sm font-semibold text-gray-200">
            Overall Signal
          </span>
        </div>
        <Badge
          variant="outline"
          className={`${getSignalColor(
            overallTrend
          )} font-semibold backdrop-blur-sm`}
        >
          {getSignalIcon(overallTrend)}
          <span className="ml-2 capitalize">{overallTrend}</span>
        </Badge>
      </div>
      <Progress
        value={Math.abs(overallSignal) * 50}
        className={`h-3 ${
          overallTrend === "buy"
            ? "[&>div]:bg-emerald-400"
            : overallTrend === "sell"
            ? "[&>div]:bg-red-400"
            : "[&>div]:bg-amber-400"
        }`}
      />
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>
          Strength:{" "}
          {(Math.min(Math.abs(overallSignal), 1) * 100).toFixed(0)}%
        </span>
        <span>Confidence: High</span>
      </div>
    </div>
  );
};