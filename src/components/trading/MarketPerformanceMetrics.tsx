import React from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react";

interface MarketPerformanceMetricsProps {
  volumeChange24h: number;
  totalVolume24h: number;
  totalTVL: number;
  defiTVLChange: number;
}

export const MarketPerformanceMetrics: React.FC<MarketPerformanceMetricsProps> = ({
  volumeChange24h,
  totalVolume24h,
  totalTVL,
  defiTVLChange
}) => {
  const formatLargeNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const metrics = [
    {
      icon: Activity,
      label: '24h Trading Volume',
      value: formatLargeNumber(totalVolume24h),
      change: volumeChange24h,
      iconColor: 'text-purple-400'
    },
    {
      icon: DollarSign,
      label: 'DeFi Total Value Locked',
      value: formatLargeNumber(totalTVL),
      change: defiTVLChange,
      iconColor: 'text-cyan-400'
    },
    {
      icon: volumeChange24h >= 0 ? TrendingUp : TrendingDown,
      label: 'Volume Momentum',
      value: `${volumeChange24h >= 0 ? '+' : ''}${volumeChange24h.toFixed(2)}%`,
      change: volumeChange24h,
      iconColor: volumeChange24h >= 0 ? 'text-green-400' : 'text-red-400'
    },
    {
      icon: defiTVLChange >= 0 ? TrendingUp : TrendingDown,
      label: 'DeFi Momentum',
      value: `${defiTVLChange >= 0 ? '+' : ''}${defiTVLChange.toFixed(2)}%`,
      change: defiTVLChange,
      iconColor: defiTVLChange >= 0 ? 'text-green-400' : 'text-red-400'
    }
  ];

  return (
    <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/40 backdrop-blur-sm">
      <h3 className="text-white font-medium flex items-center gap-2 mb-4">
        <Activity className="h-4 w-4 text-purple-400" />
        Market Performance Metrics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change >= 0;
          
          return (
            <div key={index} className="bg-gray-700/40 rounded-lg p-4 border border-gray-600/30">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${metric.iconColor}`} />
                <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? '↑' : '↓'}
                </span>
              </div>
              <div className="text-sm text-gray-400 mb-1">{metric.label}</div>
              <div className="text-lg font-semibold text-white">{metric.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
