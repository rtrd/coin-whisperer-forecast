import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SentimentHeatmapProps {
  dailyValues: number[]; // 7 values, 0-100 sentiment scores
}

export const SentimentHeatmap: React.FC<SentimentHeatmapProps> = ({
  dailyValues,
}) => {
  const getColorForValue = (value: number): string => {
    if (value >= 70) return "bg-emerald-500";
    if (value >= 50) return "bg-emerald-400";
    if (value >= 40) return "bg-amber-400";
    if (value >= 20) return "bg-red-400";
    return "bg-red-500";
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <TooltipProvider>
      <div className="flex gap-2 justify-center">
        {dailyValues.map((value, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div
                className={`w-8 h-8 rounded transition-all duration-300 hover:scale-110 cursor-pointer ${getColorForValue(
                  value
                )} flex items-center justify-center`}
              >
                <span className="text-[10px] font-semibold text-white drop-shadow-md">
                  {Math.round(value)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                {days[index]}: {Math.round(value)}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
