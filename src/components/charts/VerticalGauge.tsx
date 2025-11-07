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
    <div className="flex flex-col items-center gap-3 w-full max-w-[120px] mx-auto">
      <div className="relative" style={{ width: 60, height }}>
        {/* Background zones */}
        <div className="absolute inset-0 rounded-full bg-gray-800/50 overflow-hidden">
          {zones.map((zone, index) => (
            <div
              key={index}
              className="absolute w-full transition-all duration-500"
              style={{
                bottom: `${zone.min}%`,
                height: `${zone.max - zone.min}%`,
                backgroundColor: `${zone.color}20`,
                borderTop: `1px solid ${zone.color}40`,
              }}
            />
          ))}
        </div>

        {/* Filled mercury */}
        <div
          className="absolute bottom-0 w-full rounded-full transition-all duration-1000 ease-out"
          style={{
            height: `${displayValue}%`,
            background: `linear-gradient(to top, ${getColor()}, ${getColor()}80)`,
            boxShadow: `0 0 20px ${getColor()}60`,
          }}
        />

        {/* Scale markers */}
        <div className="absolute -right-8 inset-y-0 flex flex-col justify-between text-xs text-gray-500">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>
      </div>

      {/* Value display */}
      <div className="text-center w-full">
        <div className="text-xl font-bold truncate" style={{ color: getColor() }}>
          {Math.round(displayValue)}
        </div>
        <div className="text-xs font-semibold mt-1 truncate" style={{ color: getColor() }}>
          {getZoneLabel()}
        </div>
        {label && <div className="text-xs text-gray-400 mt-1 truncate">{label}</div>}
      </div>
    </div>
  );
};
