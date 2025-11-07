import React from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

interface SentimentGaugeProps {
  value: number; // 0-100
  size?: number;
}

export const SentimentGauge: React.FC<SentimentGaugeProps> = ({
  value,
  size = 60,
}) => {
  const getColor = (val: number): string => {
    if (val >= 70) return "#10B981"; // emerald-500
    if (val >= 50) return "#34D399"; // emerald-400
    if (val >= 40) return "#FBBF24"; // amber-400
    if (val >= 20) return "#F87171"; // red-400
    return "#EF4444"; // red-500
  };

  const data = [{ value, fill: getColor(value) }];

  return (
    <ResponsiveContainer width={size} height={size / 2}>
      <RadialBarChart
        cx="50%"
        cy="100%"
        innerRadius="70%"
        outerRadius="100%"
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar
          background={{ fill: "rgba(255,255,255,0.1)" }}
          dataKey="value"
          cornerRadius={4}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};
