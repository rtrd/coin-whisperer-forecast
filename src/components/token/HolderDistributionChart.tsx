import React from "react";
import { BarChart, Bar, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface HolderDistributionChartProps {
  distribution?: {
    whales: number;
    investors: number;
    retail: number;
  };
}

export const HolderDistributionChart: React.FC<HolderDistributionChartProps> = ({ distribution }) => {
  if (!distribution) return null;

  const data = [
    { name: "Whales (>1%)", value: distribution.whales, color: "hsl(var(--destructive))" },
    { name: "Investors (0.1-1%)", value: distribution.investors, color: "hsl(var(--primary))" },
    { name: "Retail (<0.1%)", value: distribution.retail, color: "hsl(var(--chart-2))" },
  ];

  const total = distribution.whales + distribution.investors + distribution.retail;
  
  if (total === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Holder Distribution</p>
        <p className="text-xs text-muted-foreground">By wallet size</p>
      </div>
      
      {/* Stacked horizontal bar */}
      <div className="h-8 w-full rounded-full overflow-hidden flex">
        {data.map((segment, idx) => {
          const percentage = (segment.value / total) * 100;
          if (percentage === 0) return null;
          return (
            <div
              key={idx}
              className="h-full transition-all duration-300 hover:opacity-80 flex items-center justify-center"
              style={{
                width: `${percentage}%`,
                backgroundColor: segment.color,
              }}
              title={`${segment.name}: ${percentage.toFixed(1)}%`}
            >
              {percentage > 10 && (
                <span className="text-xs font-semibold text-white">
                  {percentage.toFixed(0)}%
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        {data.map((segment, idx) => {
          const percentage = (segment.value / total) * 100;
          return (
            <div key={idx} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: segment.color }}
              />
              <div className="flex flex-col">
                <span className="text-muted-foreground">{segment.name.split(' ')[0]}</span>
                <span className="font-semibold text-foreground">{percentage.toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
