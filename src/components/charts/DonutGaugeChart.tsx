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
    <div className="relative w-full max-w-xs mx-auto" style={{ height: size }}>
      <div className="absolute inset-0" style={{ width: size, height: size, margin: '0 auto' }}>
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
          {emoji && <div className="text-3xl mb-1 animate-bounce">{emoji}</div>}
          <div className="text-2xl font-bold truncate" style={{ color }}>
            {Math.round(displayValue)}
          </div>
          <div className="text-xs text-gray-400 mt-1 truncate max-w-[140px] text-center">{label}</div>
          {innerValue && (
            <div className="text-[10px] text-gray-500 mt-1 truncate">
              F&G: {Math.round(displayInnerValue)}
            </div>
          )}
        </div>

        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full opacity-30 blur-2xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
        />
      </div>
    </div>
  );
};
