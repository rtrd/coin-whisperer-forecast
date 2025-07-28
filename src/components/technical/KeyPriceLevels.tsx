import React from "react";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

interface KeyPriceLevelsProps {
  supportLevel: number;
  resistanceLevel: number;
}

export const KeyPriceLevels: React.FC<KeyPriceLevelsProps> = ({
  supportLevel,
  resistanceLevel,
}) => {
  const formatPrice = (price: number) => {
    return price >= 1000
      ? price.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : price.toFixed(2);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-4 w-4 text-cyan-400" />
        <h4 className="text-sm font-semibold text-gray-200">
          Key Price Levels
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-emerald-900/20 rounded-xl border border-emerald-700/30 hover:border-emerald-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded-full bg-emerald-500/20">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
            </div>
            <p className="text-xs text-emerald-400 font-semibold">
              Support Level
            </p>
          </div>
          <p className="text-lg font-bold text-white">
            ${formatPrice(supportLevel)}
          </p>
          <p className="text-xs text-emerald-300/80">
            Strong buying interest
          </p>
        </div>
        <div className="p-4 bg-red-900/20 rounded-xl border border-red-700/30 hover:border-red-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded-full bg-red-500/20">
              <TrendingDown className="h-3 w-3 text-red-400" />
            </div>
            <p className="text-xs text-red-400 font-semibold">
              Resistance Level
            </p>
          </div>
          <p className="text-lg font-bold text-white">
            ${formatPrice(resistanceLevel)}
          </p>
          <p className="text-xs text-red-300/80">Selling pressure zone</p>
        </div>
      </div>
    </div>
  );
};