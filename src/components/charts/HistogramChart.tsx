import React from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid, ReferenceLine } from "recharts";

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
        <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.4} />
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
          <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="4 4" />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0];
                return (
                  <div style={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: 'hsl(var(--popover-foreground))',
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{data.payload.label}</div>
                    <div>Volume: {typeof data.value === 'number' ? data.value.toLocaleString(undefined, { maximumFractionDigits: 0 }) : data.value}</div>
                  </div>
                );
              }
              return null;
            }}
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
