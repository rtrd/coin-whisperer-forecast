import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Percent } from "lucide-react";
import { TokenInfo } from "@/hooks/useTokenInfo";

interface TokenMarketMetricsProps {
  tokenInfo?: TokenInfo;
  marketData?: any;
  isLoading?: boolean;
}

export const TokenMarketMetrics: React.FC<TokenMarketMetricsProps> = ({
  tokenInfo,
  marketData,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Market Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted/20 animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num: number | undefined) => {
    if (!num) return "N/A";
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatSupply = (num: number | undefined) => {
    if (!num) return "N/A";
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(0);
  };

  const metrics = [
    {
      label: "Market Cap",
      value: formatNumber(marketData?.market_cap || tokenInfo?.market_cap),
      icon: DollarSign,
      change: tokenInfo?.market_data?.market_cap_change_24h,
      color: "text-primary"
    },
    {
      label: "24h Volume",
      value: formatNumber(marketData?.total_volume || tokenInfo?.total_volume),
      icon: BarChart3,
      subtext: marketData?.total_volume && marketData?.market_cap 
        ? `${((marketData.total_volume / marketData.market_cap) * 100).toFixed(2)}% of MCap`
        : undefined,
      color: "text-blue-400"
    },
    {
      label: "Fully Diluted Valuation",
      value: formatNumber(tokenInfo?.market_data?.fully_diluted_valuation?.usd),
      icon: TrendingUp,
      color: "text-green-400"
    },
    {
      label: "Circulating Supply",
      value: formatSupply(tokenInfo?.market_data?.circulating_supply || marketData?.circulating_supply),
      icon: Activity,
      subtext: tokenInfo?.market_data?.max_supply 
        ? `${((tokenInfo.market_data.circulating_supply! / tokenInfo.market_data.max_supply) * 100).toFixed(1)}% of max`
        : undefined,
      color: "text-purple-400"
    },
    {
      label: "Total Supply",
      value: formatSupply(tokenInfo?.market_data?.total_supply || marketData?.total_supply),
      icon: Percent,
      color: "text-orange-400"
    },
    {
      label: "Max Supply",
      value: tokenInfo?.market_data?.max_supply ? formatSupply(tokenInfo.market_data.max_supply) : "Unlimited",
      icon: TrendingDown,
      color: "text-red-400"
    }
  ];

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Market Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="bg-muted/20 border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`h-4 w-4 ${metric.color}`} />
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{metric.value}</p>
                    {metric.subtext && (
                      <p className="text-xs text-muted-foreground mt-1">{metric.subtext}</p>
                    )}
                    {metric.change && (
                      <p className={`text-xs mt-1 ${metric.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {metric.change > 0 ? '+' : ''}{formatNumber(metric.change)} (24h)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
