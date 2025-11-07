import React, { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

interface MiniRadialGaugeProps {
  value: number; // 0-100
  color: string;
  label?: string;
  size?: number;
}

export const MiniRadialGauge: React.FC<MiniRadialGaugeProps> = ({
  value,
  color,
  label,
  size = 120,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Animate count-up
    const timer = setTimeout(() => setDisplayValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const data = [{ name: label || "Score", value: displayValue, fill: color }];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="90%"
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            background={{ fill: "rgba(255,255,255,0.1)" }}
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-white">
          {Math.round(displayValue)}
        </div>
        {label && <div className="text-xs text-gray-400">{label}</div>}
      </div>
    </div>
  );
};
