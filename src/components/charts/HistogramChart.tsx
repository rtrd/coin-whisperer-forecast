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
    <div className="w-full overflow-hidden">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <XAxis 
            dataKey="label" 
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(31, 41, 55, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#F3F4F6' }}
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
