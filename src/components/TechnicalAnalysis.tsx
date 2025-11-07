import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Target,
  Shield,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SpeedometerGauge } from "@/components/charts/SpeedometerGauge";
import { VerticalGauge } from "@/components/charts/VerticalGauge";
import { PriceChannelChart } from "@/components/charts/PriceChannelChart";
import { HistogramChart } from "@/components/charts/HistogramChart";

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
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full bg-gray-700" />
          ))}
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm p-6">
        <p className="text-gray-400">No data available for analysis</p>
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
    }, 0) / Math.max(totalStrength, 1);

  const overallTrend =
    overallSignal > 0.1 ? "BUY" : overallSignal < -0.1 ? "SELL" : "HOLD";
    
  const overallSignalStrength = Math.abs(overallSignal) * 100;
  const overallSignalColor = overallSignal > 0.1 ? "#10B981" : overallSignal < -0.1 ? "#EF4444" : "#F59E0B";

  const analysis = {
    momentum: ((recentPrices[recentPrices.length - 1] - recentPrices[0]) / recentPrices[0]) * 100,
    volatility: 0,
    marketSentiment: "neutral" as const,
    supportLevel,
    resistanceLevel,
  };

  return (
    <div className="space-y-6">
      {/* Overall Signal - Speedometer */}
      <Card className="p-6 bg-gradient-to-br from-background/95 to-background/80 border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="relative z-10">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Overall Technical Signal
          </h3>
          <div className="flex flex-col items-center gap-4">
            <SpeedometerGauge
              value={overallSignalStrength}
              zones={[
                { min: 0, max: 33, color: "#EF4444", label: "SELL" },
                { min: 33, max: 66, color: "#F59E0B", label: "NEUTRAL" },
                { min: 66, max: 100, color: "#10B981", label: "BUY" },
              ]}
              label={`Based on ${indicators.length} indicators`}
            />
            
            {/* Recommendation Badge */}
            <div className={`px-6 py-3 rounded-lg font-bold text-lg border-2 animate-pulse`}
              style={{ 
                backgroundColor: `${overallSignalColor}20`,
                borderColor: overallSignalColor,
                color: overallSignalColor 
              }}
            >
              {overallTrend}
            </div>

            {/* Confidence Meter */}
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Confidence</span>
                <span>{Math.round(overallSignalStrength)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-1000"
                  style={{ width: `${overallSignalStrength}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Individual Indicators - Unique Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RSI - Vertical Thermometer */}
        {indicators[0] && (
          <Card className="p-6 bg-gradient-to-br from-background/95 to-background/80 border-border/50">
            <h4 className="text-sm font-semibold mb-4 flex items-center justify-between">
              <span>{indicators[0].name}</span>
              <span className="text-xs text-muted-foreground">{indicators[0].value.toFixed(2)}</span>
            </h4>
            <div className="flex justify-center">
              <VerticalGauge
                value={indicators[0].value}
                zones={[
                  { min: 0, max: 30, color: "#10B981", label: "Oversold" },
                  { min: 30, max: 70, color: "#FBBF24", label: "Normal" },
                  { min: 70, max: 100, color: "#EF4444", label: "Overbought" },
                ]}
                label="RSI Index"
                height={180}
              />
            </div>
            <div className={`mt-4 px-3 py-2 rounded-lg text-sm font-semibold text-center uppercase`}
              style={{ 
                backgroundColor: `${getSignalColor(indicators[0].signal).split(' ')[0].replace('text-', '')}20`,
                color: getSignalColor(indicators[0].signal).split(' ')[0].replace('text-', '')
              }}
            >
              {indicators[0].signal}
            </div>
          </Card>
        )}

        {/* SMA 20/50 - Price Channel */}
        <Card className="p-6 bg-gradient-to-br from-background/95 to-background/80 border-border/50">
          <h4 className="text-sm font-semibold mb-4">
            Moving Averages (SMA 20/50)
          </h4>
          <PriceChannelChart
            support={supportLevel}
            resistance={resistanceLevel}
            currentPrice={currentPrice}
            symbol="$"
            height={180}
          />
          <div className="mt-4 flex justify-between gap-2">
            {indicators[1] && (
              <div className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold text-center uppercase`}
                style={{ 
                  backgroundColor: `${getSignalColor(indicators[1].signal).split(' ')[0].replace('text-', '')}20`,
                  color: getSignalColor(indicators[1].signal).split(' ')[0].replace('text-', '')
                }}
              >
                SMA 20: {indicators[1].signal}
              </div>
            )}
            {indicators[2] && (
              <div className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold text-center uppercase`}
                style={{ 
                  backgroundColor: `${getSignalColor(indicators[2].signal).split(' ')[0].replace('text-', '')}20`,
                  color: getSignalColor(indicators[2].signal).split(' ')[0].replace('text-', '')
                }}
              >
                SMA 50: {indicators[2].signal}
              </div>
            )}
          </div>
        </Card>

        {/* MACD - Histogram */}
        {indicators[3] && (
          <Card className="p-6 bg-gradient-to-br from-background/95 to-background/80 border-border/50">
            <h4 className="text-sm font-semibold mb-4 flex items-center justify-between">
              <span>{indicators[3].name}</span>
              <span className="text-xs text-muted-foreground">{indicators[3].value.toFixed(2)}</span>
            </h4>
            <HistogramChart
              data={[
                { label: "1", value: -2.3 },
                { label: "2", value: -1.8 },
                { label: "3", value: -0.5 },
                { label: "4", value: 0.2 },
                { label: "5", value: 1.1 },
                { label: "6", value: 2.4 },
                { label: "7", value: 3.2 },
                { label: "8", value: 2.8 },
                { label: "9", value: 1.9 },
                { label: "10", value: 2.5 },
                { label: "11", value: 3.1 },
                { label: "12", value: 2.9 },
                { label: "13", value: 3.5 },
                { label: "14", value: 4.2 },
              ]}
              height={140}
            />
            <div className={`mt-4 px-3 py-2 rounded-lg text-sm font-semibold text-center uppercase`}
              style={{ 
                backgroundColor: `${getSignalColor(indicators[3].signal).split(' ')[0].replace('text-', '')}20`,
                color: getSignalColor(indicators[3].signal).split(' ')[0].replace('text-', '')
              }}
            >
              {indicators[3].signal}
            </div>
          </Card>
        )}

        {/* Volume Analysis */}
        <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30">
          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            Volume Profile (14 Days)
          </h4>
          <HistogramChart
            data={[
              { label: "1", value: 850 },
              { label: "2", value: -620 },
              { label: "3", value: 940 },
              { label: "4", value: 1100 },
              { label: "5", value: -780 },
              { label: "6", value: 1250 },
              { label: "7", value: 1420 },
              { label: "8", value: -890 },
              { label: "9", value: 1180 },
              { label: "10", value: 1350 },
              { label: "11", value: -1020 },
              { label: "12", value: 1480 },
              { label: "13", value: 1620 },
              { label: "14", value: 1780 },
            ]}
            height={140}
          />
          <div className="mt-4 px-3 py-2 rounded-lg text-sm font-semibold text-center bg-purple-500/20 text-purple-400">
            Volume Increasing ↑
          </div>
        </Card>
      </div>

      {/* Support & Resistance - Combined Price Channel */}
      <Card className="p-6 bg-gradient-to-br from-background/95 to-background/80 border-border/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Support & Resistance Levels
        </h3>
        <PriceChannelChart
          support={analysis.supportLevel}
          resistance={analysis.resistanceLevel}
          currentPrice={(analysis.supportLevel + analysis.resistanceLevel) / 2}
          symbol="$"
          height={220}
        />
      </Card>
    </div>
  );
};
