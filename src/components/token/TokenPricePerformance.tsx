import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { TokenInfo } from "@/hooks/useTokenInfo";

interface TokenPricePerformanceProps {
  tokenInfo?: TokenInfo;
  marketData?: any;
  isLoading?: boolean;
}

export const TokenPricePerformance: React.FC<TokenPricePerformanceProps> = ({
  tokenInfo,
  marketData,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Price Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-muted/20 animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const performancePeriods = [
    {
      label: "1 Hour",
      value: tokenInfo?.market_data?.price_change_percentage_1h_in_currency?.usd,
      period: "1h"
    },
    {
      label: "24 Hours",
      value: marketData?.price_change_percentage_24h || tokenInfo?.price_change_percentage_24h,
      period: "24h"
    },
    {
      label: "7 Days",
      value: marketData?.price_change_percentage_7d_in_currency,
      period: "7d"
    },
    {
      label: "14 Days",
      value: tokenInfo?.market_data?.price_change_percentage_14d_in_currency?.usd,
      period: "14d"
    },
    {
      label: "30 Days",
      value: marketData?.price_change_percentage_30d_in_currency,
      period: "30d"
    },
    {
      label: "60 Days",
      value: tokenInfo?.market_data?.price_change_percentage_60d_in_currency?.usd,
      period: "60d"
    },
    {
      label: "200 Days",
      value: tokenInfo?.market_data?.price_change_percentage_200d_in_currency?.usd,
      period: "200d"
    },
    {
      label: "1 Year",
      value: tokenInfo?.market_data?.price_change_percentage_1y_in_currency?.usd,
      period: "1y"
    }
  ];

  const getPerformanceColor = (value: number | undefined) => {
    if (value === undefined || value === null) return "text-muted-foreground";
    if (value > 0) return "text-green-500";
    if (value < 0) return "text-red-500";
    return "text-muted-foreground";
  };

  const getBackgroundColor = (value: number | undefined) => {
    if (value === undefined || value === null) return "bg-muted/10";
    if (value > 0) return "bg-green-500/10";
    if (value < 0) return "bg-red-500/10";
    return "bg-muted/10";
  };

  const formatPercentage = (value: number | undefined) => {
    if (value === undefined || value === null) return "N/A";
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Price Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {performancePeriods.map((period, index) => {
            const hasValue = period.value !== undefined && period.value !== null;
            return (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border border-border transition-all hover:border-primary/50 ${getBackgroundColor(period.value)}`}
              >
                <div className="flex items-center gap-2">
                  {hasValue && period.value! > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : hasValue && period.value! < 0 ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <div className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium text-foreground">{period.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${getPerformanceColor(period.value)}`}>
                    {formatPercentage(period.value)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
