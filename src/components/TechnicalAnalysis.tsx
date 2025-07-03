import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Target,
  Zap,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PriceData {
  [x: string]: any;
  timestamp: number;
  price: number;
  volume?: number;
}

interface TechnicalIndicator {
  name: string;
  value: number;
  signal: "buy" | "sell" | "neutral";
  strength: number;
}

interface TechnicalAnalysisProps {
  data: PriceData[] | null;
  isLoading: boolean;
}

export const TechnicalAnalysis: React.FC<TechnicalAnalysisProps> = ({
  data,
  isLoading,
}) => {
  console.log("data", data);
  const calculateRSI = (prices: number[], period: number = 14): number => {
    if (prices.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;

    return 100 - 100 / (1 + rs);
  };

  const calculateSMA = (prices: number[], period: number): number => {
    if (prices.length < period) return prices[prices.length - 1] || 0;
    const slice = prices.slice(-period);
    return slice.reduce((sum, price) => sum + price, 0) / period;
  };

  const calculateMACD = (
    prices: number[]
  ): { macd: number; signal: number } => {
    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);
    const macd = ema12 - ema26;
    const signal = calculateEMA([macd], 9);

    return { macd, signal };
  };

  const calculateEMA = (prices: number[], period: number): number => {
    if (prices.length === 0) return 0;
    if (prices.length === 1) return prices[0];

    const multiplier = 2 / (period + 1);
    let ema = prices[0];

    for (let i = 1; i < prices.length; i++) {
      ema = prices[i] * multiplier + ema * (1 - multiplier);
    }

    return ema;
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm">
        <CardHeader className="bg-gray-700/30 border-b border-gray-600/30">
          <Skeleton className="h-6 w-32 bg-gray-700" />
          <Skeleton className="h-4 w-48 bg-gray-700" />
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full bg-gray-700" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm">
        <CardHeader className="bg-gray-700/30 border-b border-gray-600/30">
          <CardTitle className="text-white flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-500/20">
              <BarChart3 className="h-6 w-6 text-blue-400" />
            </div>
            Technical Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-400">No data available for analysis</p>
        </CardContent>
      </Card>
    );
  }
  const prices =
    Array.isArray(data) && typeof data[0] === "object" && "close" in data[0]
      ? data.map((d: any) => d.close)
      : data;

  const currentPrice = prices[prices.length - 1];

  // Calculate technical indicators
  const rsi = calculateRSI(prices);
  const sma20 = calculateSMA(prices, 20);
  const sma50 = calculateSMA(prices, 50);
  const { macd, signal } = calculateMACD(prices);

  const indicators: TechnicalIndicator[] = [
    {
      name: "RSI (14)",
      value: rsi,
      signal: rsi > 70 ? "sell" : rsi < 30 ? "buy" : "neutral",
      strength: Math.abs(rsi - 50) / 50,
    },
    {
      name: "SMA 20",
      value: sma20,
      signal:
        currentPrice > sma20
          ? "buy"
          : currentPrice < sma20
          ? "sell"
          : "neutral",
      strength: Math.abs(currentPrice - sma20) / sma20,
    },
    {
      name: "SMA 50",
      value: sma50,
      signal:
        currentPrice > sma50
          ? "buy"
          : currentPrice < sma50
          ? "sell"
          : "neutral",
      strength: Math.abs(currentPrice - sma50) / sma50,
    },
    {
      name: "MACD",
      value: macd,
      signal: macd > signal ? "buy" : macd < signal ? "sell" : "neutral",
      strength:
        Math.abs(macd - signal) / Math.max(Math.abs(macd), Math.abs(signal), 1),
    },
  ];

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "buy":
        return "text-emerald-400 border-emerald-400 bg-emerald-400/10";
      case "sell":
        return "text-red-400 border-red-400 bg-red-400/10";
      default:
        return "text-amber-400 border-amber-400 bg-amber-400/10";
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case "buy":
        return <TrendingUp className="h-3 w-3" />;
      case "sell":
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  const overallSignal = indicators.reduce((acc, ind) => {
    if (ind.signal === "buy") return acc + ind.strength;
    if (ind.signal === "sell") return acc - ind.strength;
    return acc;
  }, 0);

  const overallTrend =
    overallSignal > 0.1 ? "buy" : overallSignal < -0.1 ? "sell" : "neutral";

  return (
    <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gray-700/30 border-b border-gray-600/30">
        <CardTitle className="text-white flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-500/20">
            <BarChart3 className="h-6 w-6 text-blue-400" />
          </div>
          Technical Analysis
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse ml-auto"></div>
        </CardTitle>
        <CardDescription className="text-gray-300">
          AI-powered technical indicators and trading signals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Overall Signal - Enhanced */}
        <div className="p-4 bg-gray-700/40 rounded-xl border border-gray-600/30 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/20">
                <Target className="h-4 w-4 text-blue-400" />
              </div>
              <span className="text-sm font-semibold text-gray-200">
                Overall Signal
              </span>
            </div>
            <Badge
              variant="outline"
              className={`${getSignalColor(
                overallTrend
              )} font-semibold backdrop-blur-sm`}
            >
              {getSignalIcon(overallTrend)}
              <span className="ml-2 capitalize">{overallTrend}</span>
            </Badge>
          </div>
          <Progress
            value={Math.abs(overallSignal) * 50}
            className={`h-3 ${
              overallTrend === "buy"
                ? "[&>div]:bg-emerald-400"
                : overallTrend === "sell"
                ? "[&>div]:bg-red-400"
                : "[&>div]:bg-amber-400"
            }`}
          />
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Strength: {(Math.abs(overallSignal) * 100).toFixed(0)}%</span>
            <span>Confidence: High</span>
          </div>
        </div>

        {/* Individual Indicators - Enhanced */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-yellow-400" />
            <h4 className="text-sm font-semibold text-gray-200">
              Technical Indicators
            </h4>
          </div>
          {indicators.map((indicator, index) => (
            <div
              key={index}
              className="group p-4 bg-gray-700/30 rounded-xl border border-gray-600/20 hover:border-gray-500/40 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-200">
                  {indicator.name}
                </span>
                <Badge
                  variant="outline"
                  className={`${getSignalColor(
                    indicator.signal
                  )} text-xs font-medium backdrop-blur-sm`}
                >
                  {getSignalIcon(indicator.signal)}
                  <span className="ml-1 capitalize">{indicator.signal}</span>
                </Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-medium">
                  {indicator.name.includes("SMA") ||
                  indicator.name.includes("MACD")
                    ? `$${indicator.value.toFixed(2)}`
                    : indicator.value.toFixed(2)}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {(indicator.strength * 100).toFixed(0)}% strength
                </span>
              </div>
              <Progress
                value={indicator.strength * 100}
                className={`h-2 ${
                  indicator.signal === "buy"
                    ? "[&>div]:bg-emerald-400"
                    : indicator.signal === "sell"
                    ? "[&>div]:bg-red-400"
                    : "[&>div]:bg-amber-400"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Support and Resistance - Enhanced */}
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
                ${(currentPrice * 0.95).toFixed(0)}
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
                ${(currentPrice * 1.05).toFixed(0)}
              </p>
              <p className="text-xs text-red-300/80">Selling pressure zone</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
