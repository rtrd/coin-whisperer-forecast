import React from "react";
import {
  BarChart3,
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface MarketData {
  marketCap: number;
  volume24h: number;
  priceChange7d: number;
  priceChange30d: number;
  allTimeHigh: number;
  allTimeLow: number;
  circulating_supply: number;
  total_supply: number;
  price_change_percentage_30d_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  AllTimeHigh: number;
  AllTimeLow: number;
  ath: number;
  atl: number;
  total_volume: number;
  market_cap: number;
}

interface TokenMarketStatsProps {
  marketData: MarketData;
}

export const TokenMarketStats: React.FC<TokenMarketStatsProps> = ({
  marketData,
}) => {
  console.log("Market Data:", marketData);
  const statsConfig = [
    {
      icon: BarChart3,
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/20",
      hoverColor: "hover:border-blue-500/30",
      label: "Market Cap",
      value:
        marketData.marketCap !== undefined && marketData.marketCap !== null
          ? `$${(marketData.marketCap / 1000000000).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}B`
          : `$${(marketData.market_cap / 1000000000).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}B`,
    },
    {
      icon: Activity,
      iconColor: "text-green-400",
      bgColor: "bg-green-500/20",
      hoverColor: "hover:border-green-500/30",
      label: "24h Volume",
      value:
        marketData.volume24h !== undefined && marketData.volume24h !== null
          ? `$${(marketData.volume24h / 1000000).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}M`
          : `$${(marketData.total_volume / 1000000).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}M`,
    },
    {
      icon: Clock,
      iconColor: "text-purple-400",
      bgColor: "bg-purple-500/20",
      hoverColor: "hover:border-purple-500/30",
      label: "7d Change",
      value: `${
        marketData.price_change_percentage_7d_in_currency >= 0 ? "+" : ""
      }${(marketData.price_change_percentage_7d_in_currency ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`,
      valueColor:
        marketData.price_change_percentage_7d_in_currency >= 0
          ? "text-green-400"
          : "text-red-400",
    },
    {
      icon: Clock,
      iconColor: "text-orange-400",
      bgColor: "bg-orange-500/20",
      hoverColor: "hover:border-orange-500/30",
      label: "30d Change",
      value: `${
        marketData.price_change_percentage_30d_in_currency >= 0 ? "+" : ""
      }${(marketData.price_change_percentage_30d_in_currency ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`,
      valueColor:
        marketData.price_change_percentage_30d_in_currency >= 0
          ? "text-green-400"
          : "text-red-400",
    },
    {
      icon: TrendingUp,
      iconColor: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      hoverColor: "hover:border-emerald-500/30",
      label: "All Time High",
      value:
        marketData.AllTimeHigh !== undefined && marketData.AllTimeHigh !== null
          ? `$${marketData.AllTimeHigh.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}`
          : `$${marketData.ath.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}`,
    },
    {
      icon: TrendingDown,
      iconColor: "text-red-400",
      bgColor: "bg-red-500/20",
      hoverColor: "hover:border-red-500/30",
      label: "All Time Low",
      value:
        marketData.AllTimeLow !== undefined && marketData.AllTimeLow !== null
          ? `$${marketData.AllTimeLow.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}`
          : `$${marketData.atl.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}`,
    },
    {
      icon: Activity,
      iconColor: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
      hoverColor: "hover:border-cyan-500/30",
      label: "Circulating",
      value: `${(marketData.circulating_supply / 1000000).toLocaleString(
        "en-US",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      )}M`,
    },
    {
      icon: BarChart3,
      iconColor: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      hoverColor: "hover:border-yellow-500/30",
      label: "Total Supply",
      value: `${(marketData.total_supply / 1000000).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}M`,
    },
  ];

  return (
    <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30 backdrop-blur-sm shadow-xl">
      <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-3">
        <div className="p-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20">
          <BarChart3 className="h-6 w-6 text-blue-400" />
        </div>
        Market Statistics
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statsConfig.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br from-gray-600/30 to-gray-700/30 rounded-xl p-4 border border-gray-500/20 ${stat.hoverColor} transition-all duration-200 hover:shadow-lg hover:scale-105`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
              <span className="text-gray-300 text-sm font-medium">
                {stat.label}
              </span>
            </div>
            <span
              className={`font-bold text-lg ${stat.valueColor || "text-white"}`}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
