import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Percent, Activity, Calendar } from 'lucide-react';
import { PortfolioMetrics } from '@/types/portfolio';
import { formatPrice, formatPercentage } from '@/utils/formatters';

interface PortfolioOverviewProps {
  metrics: PortfolioMetrics;
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ metrics }) => {
  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return formatPrice(num);
  };

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    changePercentage, 
    icon: Icon, 
    period 
  }: {
    title: string;
    value: string;
    change: number;
    changePercentage: number;
    icon: any;
    period: string;
  }) => {
    const isPositive = change >= 0;
    
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold mb-1">{value}</div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span className="text-xs font-medium">
                {formatPrice(Math.abs(change))} ({formatPercentage(Math.abs(changePercentage))})
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              {period}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Portfolio Value */}
      <Card className="relative overflow-hidden border-2 bg-gray-800/50 border-gray-700 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-gray-300">Total Portfolio Value</CardTitle>
              <div className="text-4xl font-bold mt-2 text-white">
                {formatLargeNumber(metrics.totalValue)}
              </div>
            </div>
            <div className="text-right">
              <div className={`flex items-center gap-2 text-lg font-semibold ${
                metrics.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.totalPnL >= 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                {formatPrice(Math.abs(metrics.totalPnL))}
              </div>
              <div className={`text-sm ${
                metrics.totalPnLPercentage >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(Math.abs(metrics.totalPnLPercentage))} total return
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="24h Change"
          value={formatLargeNumber(metrics.totalValue + metrics.dayChange)}
          change={metrics.dayChange}
          changePercentage={metrics.dayChangePercentage}
          icon={Activity}
          period="1D"
        />
        <MetricCard
          title="7d Change"
          value={formatLargeNumber(metrics.totalValue + metrics.weekChange)}
          change={metrics.weekChange}
          changePercentage={metrics.weekChangePercentage}
          icon={Calendar}
          period="7D"
        />
        <MetricCard
          title="30d Change"
          value={formatLargeNumber(metrics.totalValue + metrics.monthChange)}
          change={metrics.monthChange}
          changePercentage={metrics.monthChangePercentage}
          icon={TrendingUp}
          period="30D"
        />
      </div>

      {/* Best/Worst Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Best Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{metrics.bestPerformer.icon}</div>
                <div>
                  <p className="font-semibold">{metrics.bestPerformer.symbol}</p>
                  <p className="text-sm text-muted-foreground">{metrics.bestPerformer.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">
                  +{formatPercentage(metrics.bestPerformer.pnlPercentage)}
                </p>
                <p className="text-sm text-green-600">
                  +{formatPrice(metrics.bestPerformer.pnl)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Worst Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{metrics.worstPerformer.icon}</div>
                <div>
                  <p className="font-semibold">{metrics.worstPerformer.symbol}</p>
                  <p className="text-sm text-muted-foreground">{metrics.worstPerformer.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-red-600">
                  {formatPercentage(metrics.worstPerformer.pnlPercentage)}
                </p>
                <p className="text-sm text-red-600">
                  {formatPrice(metrics.worstPerformer.pnl)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};