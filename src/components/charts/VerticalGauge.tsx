import React, { useEffect, useState } from "react";

interface VerticalGaugeProps {
  value: number; // 0-100
  zones: { min: number; max: number; color: string; label: string }[];
  label?: string;
  height?: number;
}

export const VerticalGauge: React.FC<VerticalGaugeProps> = ({
  value,
  zones,
  label,
  height = 200,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

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

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[140px] mx-auto">
      <div className="relative flex gap-6" style={{ height }}>
        {/* Thermometer body */}
        <div className="relative" style={{ width: 50 }}>
          {/* Background zones */}
          <div className="absolute inset-0 rounded-full bg-muted/30 overflow-hidden border border-border/50">
            {zones.map((zone, index) => (
              <div
                key={index}
                className="absolute w-full transition-all duration-500"
                style={{
                  bottom: `${zone.min}%`,
                  height: `${zone.max - zone.min}%`,
                  backgroundColor: `${zone.color}15`,
                  borderTop: `1px solid ${zone.color}30`,
                }}
              />
            ))}
          </div>

          {/* Filled mercury */}
          <div
            className="absolute bottom-0 w-full rounded-full transition-all duration-1000 ease-out"
            style={{
              height: `${displayValue}%`,
              background: `linear-gradient(to top, ${getColor()}, ${getColor()}B0)`,
              boxShadow: `0 0 16px ${getColor()}70, inset 0 0 8px ${getColor()}40`,
            }}
          />
        </div>

        {/* Scale markers */}
        <div className="flex flex-col justify-between text-xs font-medium text-muted-foreground">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>
      </div>

      {/* Value display */}
      <div className="text-center w-full space-y-2">
        <div className="text-2xl font-bold" style={{ color: getColor() }}>
          {Math.round(displayValue)}
        </div>
        <div className="text-sm font-semibold px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm" style={{ color: getColor() }}>
          {getZoneLabel()}
        </div>
        {label && <div className="text-xs text-muted-foreground">{label}</div>}
      </div>
    </div>
  );
};
