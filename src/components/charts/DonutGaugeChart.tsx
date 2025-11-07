import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface DonutGaugeChartProps {
  value: number; // 0-100
  innerValue?: number; // Optional second ring
  label: string;
  size?: number;
  color: string;
  emoji?: string;
}

export const DonutGaugeChart: React.FC<DonutGaugeChartProps> = ({
  value,
  innerValue,
  label,
  size = 200,
  color,
  emoji,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [displayInnerValue, setDisplayInnerValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
      setDisplayInnerValue(innerValue || 0);
    }, 100);
    return () => clearTimeout(timer);
  }, [value, innerValue]);

  const outerData = [
    { value: displayValue, fill: color },
    { value: 100 - displayValue, fill: "rgba(255,255,255,0.1)" },
  ];

  const innerData = innerValue
    ? [
        { value: displayInnerValue, fill: `${color}80` },
        { value: 100 - displayInnerValue, fill: "rgba(255,255,255,0.05)" },
      ]
    : [];

  return (
    <div className="relative w-full flex justify-center py-4" style={{ minHeight: size + 40 }}>
      <div className="relative" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Outer ring */}
            <Pie
              data={outerData}
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              innerRadius="68%"
              outerRadius="92%"
              dataKey="value"
              animationDuration={1000}
              animationBegin={0}
            >
              {outerData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>

            {/* Inner ring (optional) */}
            {innerValue && (
              <Pie
                data={innerData}
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={-270}
                innerRadius="48%"
                outerRadius="63%"
                dataKey="value"
                animationDuration={1200}
                animationBegin={200}
              >
                {innerData.map((entry, index) => (
                  <Cell key={`cell-inner-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            )}
          </PieChart>
        </ResponsiveContainer>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          {emoji && <div className="text-4xl mb-2 animate-bounce">{emoji}</div>}
          <div className="text-3xl font-bold" style={{ color }}>
            {Math.round(displayValue)}
          </div>
          <div className="text-sm font-medium mt-2 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-center" style={{ color }}>
            {label}
          </div>
          {innerValue && (
            <div className="text-xs text-muted-foreground mt-2 px-2 py-0.5 rounded bg-muted/50">
              Fear & Greed: {Math.round(displayInnerValue)}
            </div>
          )}
        </div>

        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-2xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
        />
      </div>
    </div>
  );
};
