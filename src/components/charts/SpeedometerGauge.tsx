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
    <div className="relative w-full max-w-sm mx-auto py-4" style={{ height: size * 0.8 }}>
      <div className="absolute inset-x-0 top-0" style={{ height: size * 0.7 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="90%"
            innerRadius="60%"
            outerRadius="95%"
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: "hsl(var(--muted))" }}
              dataKey="value"
              cornerRadius={8}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Center value - positioned above chart base */}
      <div className="absolute inset-x-0 top-[30%] flex flex-col items-center justify-start">
        <div className="text-4xl font-bold" style={{ color: getColor() }}>
          {Math.round(value)}
        </div>
        <div className="text-sm font-semibold mt-2 px-4 py-1 rounded-full bg-background/80 backdrop-blur-sm" style={{ color: getColor() }}>
          {getZoneLabel()}
        </div>
        {label && (
          <div className="text-xs text-muted-foreground mt-3 px-4 text-center max-w-[200px]">
            {label}
          </div>
        )}
      </div>
      
      {/* Zone labels at bottom */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-2 text-xs font-medium">
        {zones.map((zone, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-1.5 h-1.5 rounded-full mb-1" style={{ backgroundColor: zone.color }} />
            <span className="text-[10px]" style={{ color: zone.color }}>
              {zone.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
