import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Layers, Lock, DollarSign } from "lucide-react";

interface DefiOverviewMetricsProps {
  totalTVL: number;
  change24h: number;
  protocolsCount: number;
  chainsCount: number;
}

export const DefiOverviewMetrics: React.FC<DefiOverviewMetricsProps> = ({
  totalTVL,
  change24h,
  protocolsCount,
  chainsCount
}) => {
  const formatTVL = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const metrics = [
    {
      title: "Total Value Locked",
      value: formatTVL(totalTVL),
      icon: Lock,
      color: "text-blue-400",
      bgColor: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "24h Change",
      value: `${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%`,
      icon: change24h >= 0 ? TrendingUp : TrendingDown,
      color: change24h >= 0 ? "text-green-400" : "text-red-400",
      bgColor: change24h >= 0 ? "from-green-500/20 to-emerald-500/20" : "from-red-500/20 to-rose-500/20"
    },
    {
      title: "Active Protocols",
      value: protocolsCount.toLocaleString(),
      icon: Layers,
      color: "text-purple-400",
      bgColor: "from-purple-500/20 to-pink-500/20"
    },
    {
      title: "Supported Chains",
      value: chainsCount.toLocaleString(),
      icon: Activity,
      color: "text-orange-400",
      bgColor: "from-orange-500/20 to-yellow-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm overflow-hidden group hover:border-gray-600/50 transition-all duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <CardHeader className="pb-2 relative">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Icon className={`h-4 w-4 ${metric.color}`} />
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
