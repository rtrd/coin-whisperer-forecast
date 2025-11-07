import React from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

interface HistogramChartProps {
  data: { value: number; label: string }[];
  height?: number;
  positiveColor?: string;
  negativeColor?: string;
}

export const HistogramChart: React.FC<HistogramChartProps> = ({
  data,
  height = 150,
  positiveColor = "#10B981",
  negativeColor = "#EF4444",
}) => {
  return (
    <div className="w-full overflow-hidden px-2">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <XAxis 
            dataKey="label" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'hsl(var(--popover-foreground))',
            }}
            labelStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: 'bold' }}
            itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={800}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.value >= 0 ? positiveColor : negativeColor}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
