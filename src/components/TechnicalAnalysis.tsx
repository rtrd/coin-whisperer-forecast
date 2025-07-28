import React from "react";
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
  isLoading: boolean; // Adjust type as needed based on your data structure
}

export const TechnicalAnalysis: React.FC<TechnicalAnalysisProps> = ({
  data,
  isLoading,
}) => {
  const prices = data.map((d) => d.price);

  const currentPrice = prices[prices.length - 1];

  // Scale normalized values to 0.2 to 0.8 (20% to 80%)
  const scaleStrength = (raw: number): number => {
    const clamped = Math.min(Math.max(raw, 0), 1); // 0 to 1
    return 0.2 + clamped * 0.6; // maps 0 to 0.2, 1 to 0.8
  };

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

  const calculateRSIStrength = (rsi: number): number => {
    let raw = 0;

    if (rsi < 50) {
      // Closer to 30 or below → stronger buy signal
      raw = (30 - rsi) / 30;
    } else {
      // Closer to 70 or above → stronger sell signal
      raw = (rsi - 70) / 30;
    }

    // Only keep positive values, cap at 1
    raw = Math.max(0, Math.min(raw, 1));

    return scaleStrength(raw); // Scale to 20%–80%
  };

  const calculateSMA = (prices: number[], period: number): number => {
    if (prices.length < period)
      return prices.reduce((a, b) => a + b, 0) / prices.length;
    const recent = prices.slice(-period);
    return recent.reduce((a, b) => a + b, 0) / period;
  };

  const calculateSMA20Strength = (prices: number[]) => {
    const sma20 = calculateSMA(prices, 20);
    const currentPrice = prices.at(-1) ?? 0;
    const deviation = Math.abs(currentPrice - sma20) / Math.max(sma20, 1);

    return { sma20, strength: scaleStrength(deviation) }; // scale to 20-80%
  };

  const calculateSMA50Strength = (prices: number[]) => {
    const sma50 = calculateSMA(prices, 50);
    const currentPrice = prices.at(-1) ?? 0;
    const deviation = Math.abs(currentPrice - sma50) / Math.max(sma50, 1);

    return { sma50, strength: scaleStrength(deviation) }; // scale to 20-80%
  };

  const recentWindow = Math.min(20, prices.length);
  const recentPrices = prices.slice(-recentWindow);
  const supportLevel = Math.min(...recentPrices);
  const resistanceLevel = Math.max(...recentPrices);
  const calculateEMAList = (prices: number[], period: number): number[] => {
    const multiplier = 2 / (period + 1);
    const emaArray: number[] = [];
    let ema = prices[0];

    prices.forEach((price, i) => {
      if (i === 0) {
        emaArray.push(ema);
      } else {
        ema = price * multiplier + ema * (1 - multiplier);
        emaArray.push(ema);
      }
    });

    return emaArray;
  };
  // Strength normalization helper
  const normalizeStrength = (val: number, range: number = 100) =>
    Math.min(Math.abs(val) / range, 1);

  const normalizeRelative = (diff: number, base: number) =>
    Math.min(Math.abs(diff) / Math.max(base, 1), 1);

  // Updated MACD (with series)
  const calculateMACD = (prices: number[]) => {
    const ema12 = calculateEMAList(prices, 12);
    const ema26 = calculateEMAList(prices, 26);
    const macdLine = ema12.map((val, idx) => val - (ema26[idx] ?? 0));
    const signalLine = calculateEMAList(macdLine, 9);

    const latestMACD = macdLine.at(-1) ?? 0;
    const latestSignal = signalLine.at(-1) ?? 0;

    const diff = latestMACD - latestSignal;

    // Normalize using signal crossover momentum
    const rawStrength = Math.abs(diff) / Math.max(Math.abs(latestSignal), 1);
    const scaled = scaleStrength(rawStrength);

    return { macd: latestMACD, signal: latestSignal, strength: scaled };
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

  // Calculate technical indicators
  const rsi = calculateRSI(prices);
  const { sma20, strength: sma20Strength } = calculateSMA20Strength(prices);
  const { sma50, strength: sma50Strength } = calculateSMA50Strength(prices);

  const { macd, signal, strength: macdStrength } = calculateMACD(prices);

  const indicators: TechnicalIndicator[] = [
    {
      name: "RSI (14)",
      value: rsi,
      signal: rsi > 70 ? "sell" : rsi < 30 ? "buy" : "neutral",
      strength: calculateRSIStrength(rsi), // max deviation from neutral
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
      strength: sma20Strength,
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
      strength: sma50Strength,
    },
    {
      name: "MACD",
      value: macd,
      signal: macd > signal ? "buy" : macd < signal ? "sell" : "neutral",
      strength: macdStrength,
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

  const totalStrength = indicators.reduce((sum, ind) => sum + ind.strength, 0);

  const overallSignal =
    indicators.reduce((acc, ind) => {
      if (ind.signal === "buy") return acc + ind.strength;
      if (ind.signal === "sell") return acc - ind.strength;
      return acc;
    }, 0) / Math.max(totalStrength, 1); // normalized between -1 and 1

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
            <span>
              Strength:{" "}
              {(Math.min(Math.abs(overallSignal), 1) * 100).toFixed(0)}%
            </span>
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
                    ? `$${
                        indicator.value >= 1000
                          ? indicator.value.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : indicator.value.toFixed(2)
                      }`
                    : indicator.value.toFixed(2)}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {indicator.name.includes("MACD")
                    ? (indicator.strength * 100).toFixed(2)
                    : (indicator.strength * 100).toFixed(2)}
                  % strength
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
                $
                {supportLevel >= 1000
                  ? supportLevel.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : supportLevel.toFixed(2)}
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
                $
                {resistanceLevel >= 1000
                  ? resistanceLevel.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : resistanceLevel.toFixed(2)}
              </p>
              <p className="text-xs text-red-300/80">Selling pressure zone</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
