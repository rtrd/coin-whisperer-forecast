import React from "react";

interface ProgressGaugeProps {
  value: number; // 0-100
  zones: { min: number; max: number; color: string; label: string }[];
  label?: string;
}

export const ProgressGauge: React.FC<ProgressGaugeProps> = ({
  value,
  zones,
  label,
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

  return (
    <div className="w-full max-w-md mx-auto space-y-4 py-2">
      {/* Value and label */}
      <div className="text-center space-y-2">
        <div className="text-5xl font-bold" style={{ color: getColor() }}>
          {Math.round(value)}
        </div>
        <div className="text-lg font-semibold px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm inline-block" style={{ color: getColor() }}>
          {getZoneLabel()}
        </div>
        {label && (
          <div className="text-sm text-muted-foreground mt-2">
            {label}
          </div>
        )}
      </div>

      {/* Progress bar with zones */}
      <div className="relative">
        {/* Zone background */}
        <div className="h-8 rounded-full overflow-hidden bg-muted/30 relative flex">
          {zones.map((zone, index) => (
            <div
              key={index}
              className="h-full transition-all"
              style={{
                width: `${zone.max - zone.min}%`,
                backgroundColor: `${zone.color}20`,
                borderLeft: index > 0 ? `1px solid ${zone.color}30` : 'none',
              }}
            />
          ))}
        </div>

        {/* Value indicator */}
        <div
          className="absolute top-0 left-0 h-8 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${value}%`,
            background: `linear-gradient(to right, ${getColor()}, ${getColor()}CC)`,
            boxShadow: `0 0 20px ${getColor()}60`,
          }}
        />

        {/* Marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-1 h-10 transition-all duration-1000"
          style={{
            left: `${value}%`,
            backgroundColor: getColor(),
            boxShadow: `0 0 10px ${getColor()}`,
          }}
        />
      </div>

      {/* Zone labels */}
      <div className="flex justify-between text-xs font-medium px-1">
        {zones.map((zone, index) => (
          <div key={index} className="flex flex-col items-center" style={{ color: zone.color }}>
            <div className="w-1.5 h-1.5 rounded-full mb-1" style={{ backgroundColor: zone.color }} />
            <span>{zone.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
