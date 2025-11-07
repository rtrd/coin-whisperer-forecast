import React from "react";

interface PriceChannelChartProps {
  support: number;
  resistance: number;
  currentPrice: number;
  symbol?: string;
  height?: number;
}

export const PriceChannelChart: React.FC<PriceChannelChartProps> = ({
  support,
  resistance,
  currentPrice,
  symbol = "$",
  height = 200,
}) => {
  const range = resistance - support;
  const currentPosition = ((currentPrice - support) / range) * 100;
  
  const distanceFromSupport = ((currentPrice - support) / support) * 100;
  const distanceFromResistance = ((resistance - currentPrice) / currentPrice) * 100;

  const isNearResistance = distanceFromResistance < 5;
  const isNearSupport = distanceFromSupport < 5;

  return (
    <div className="relative w-full overflow-hidden" style={{ height: height + 60 }}>
      {/* Price channel container */}
      <div className="absolute inset-x-0 top-6 bottom-6 flex flex-col justify-between">
        {/* Resistance level */}
        <div className="relative pr-24">
          <div className="h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent rounded-full" />
          <div className="absolute -top-5 right-0 text-xs font-semibold text-red-400 truncate">
            {symbol}{resistance.toFixed(2)}
          </div>
          <div className="absolute -top-5 left-0 text-xs text-red-400/60">
            Resistance
          </div>
        </div>

        {/* Price channel area */}
        <div className="flex-1 relative mx-2 min-h-0">
          {/* Gradient fill */}
          <div 
            className="absolute inset-0 rounded-lg"
            style={{
              background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)'
            }}
          />

          {/* Current price marker */}
          <div
            className="absolute w-full flex items-center transition-all duration-500 pr-20"
            style={{ top: `${100 - currentPosition}%` }}
          >
            {/* Animated dot */}
            <div className="relative shrink-0">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary/50 animate-ping" />
            </div>
            
            {/* Price line */}
            <div className="flex-1 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-transparent min-w-0" />
            
            {/* Price label */}
            <div className="absolute right-0 -top-2 text-xs font-bold text-primary whitespace-nowrap">
              {symbol}{currentPrice.toFixed(2)}
            </div>
          </div>

          {/* Distance indicators */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 space-y-1 text-center max-w-[140px]">
            <div className="text-[10px] text-emerald-400 bg-emerald-900/30 px-1.5 py-0.5 rounded truncate">
              ↑ {distanceFromSupport.toFixed(1)}% support
            </div>
            <div className="text-[10px] text-red-400 bg-red-900/30 px-1.5 py-0.5 rounded truncate">
              ↑ {distanceFromResistance.toFixed(1)}% resist
            </div>
          </div>
        </div>

        {/* Support level */}
        <div className="relative pr-24">
          <div className="h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent rounded-full" />
          <div className="absolute -bottom-5 right-0 text-xs font-semibold text-emerald-400 truncate">
            {symbol}{support.toFixed(2)}
          </div>
          <div className="absolute -bottom-5 left-0 text-xs text-emerald-400/60">
            Support
          </div>
        </div>
      </div>

      {/* Breakout alerts */}
      {isNearResistance && (
        <div className="absolute top-0 right-0 text-[10px] font-semibold text-red-400 bg-red-900/30 px-2 py-1 rounded animate-pulse">
          Near Resistance!
        </div>
      )}
      {isNearSupport && (
        <div className="absolute bottom-0 right-0 text-[10px] font-semibold text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded animate-pulse">
          Near Support!
        </div>
      )}
    </div>
  );
};
