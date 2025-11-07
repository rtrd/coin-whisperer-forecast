import React from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

interface SpeedometerGaugeProps {
  value: number; // 0-100
  zones: { min: number; max: number; color: string; label: string }[];
  label?: string;
  size?: number;
}

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({
  value,
  zones,
  label,
  size = 180,
}) => {
  const getColor = (): string => {
    for (const zone of zones) {
      if (value >= zone.min && value <= zone.max) {
        return zone.color;
      }
    }
    return zones[0].color;
  };

  const getZoneLabel = (): string => {
    for (const zone of zones) {
      if (value >= zone.min && value <= zone.max) {
        return zone.label;
      }
    }
    return zones[0].label;
  };

  const data = [{ value, fill: getColor() }];

  return (
    <div className="relative" style={{ width: size, height: size * 0.6 }}>
      <ResponsiveContainer width="100%" height="100%">
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
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      
      {/* Zone labels */}
      <div className="absolute inset-0 flex items-end justify-between px-4 pb-2 text-xs text-gray-400">
        {zones.map((zone, index) => (
          <span key={index} style={{ color: zone.color }}>
            {zone.label}
          </span>
        ))}
      </div>
      
      {/* Center value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pb-8">
        <div className="text-3xl font-bold" style={{ color: getColor() }}>
          {Math.round(value)}
        </div>
        <div className="text-sm font-semibold mt-1" style={{ color: getColor() }}>
          {getZoneLabel()}
        </div>
        {label && <div className="text-xs text-gray-400 mt-1">{label}</div>}
      </div>

      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full opacity-50 blur-xl"
        style={{ 
          background: `radial-gradient(circle, ${getColor()}33 0%, transparent 70%)`,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};
