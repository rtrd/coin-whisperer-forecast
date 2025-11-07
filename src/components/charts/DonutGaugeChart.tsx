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
            innerRadius="70%"
            outerRadius="90%"
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
              innerRadius="50%"
              outerRadius="65%"
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
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {emoji && <div className="text-4xl mb-2 animate-bounce">{emoji}</div>}
        <div className="text-3xl font-bold" style={{ color }}>
          {Math.round(displayValue)}
        </div>
        <div className="text-sm text-gray-400 mt-1">{label}</div>
        {innerValue && (
          <div className="text-xs text-gray-500 mt-1">
            Secondary: {Math.round(displayInnerValue)}
          </div>
        )}
      </div>

      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full opacity-30 blur-2xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-50 animate-pulse"
            style={{
              backgroundColor: color,
              top: `${20 + i * 30}%`,
              left: `${10 + i * 30}%`,
              animationDelay: `${i * 400}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
