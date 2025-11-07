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
import { ProgressGauge } from "@/components/charts/ProgressGauge";
import { VerticalGauge } from "@/components/charts/VerticalGauge";
import { PriceChannelChart } from "@/components/charts/PriceChannelChart";
import { HistogramChart } from "@/components/charts/HistogramChart";
import { SparklineChart } from "@/components/charts/SparklineChart";

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
      {/* Overall Signal - Progress Gauge */}
      <Card className="p-6 bg-gradient-to-br from-background/95 to-background/80 border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="relative z-10">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Overall Technical Signal
          </h3>
          <div className="space-y-6">
            <ProgressGauge
              value={overallSignalStrength}
              zones={[
                { min: 0, max: 33, color: "#EF4444", label: "SELL" },
                { min: 33, max: 66, color: "#F59E0B", label: "NEUTRAL" },
                { min: 66, max: 100, color: "#10B981", label: "BUY" },
              ]}
              label={`Based on ${indicators.length} indicators`}
            />
            
            {/* Recommendation Badge */}
            <div className="text-center">
              <div className={`inline-block px-8 py-3 rounded-lg font-bold text-xl border-2`}
                style={{ 
                  backgroundColor: `${overallSignalColor}20`,
                  borderColor: overallSignalColor,
                  color: overallSignalColor 
                }}
              >
                {overallTrend}
              </div>
            </div>

            {/* Confidence Meter */}
            <div className="w-full max-w-md mx-auto">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Confidence Level</span>
                <span className="font-semibold">{Math.round(overallSignalStrength)}%</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-1000 rounded-full"
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

        {/* Moving Averages - Complete Redesign */}
        <Card className="p-6 bg-gradient-to-br from-blue-900/20 via-cyan-900/10 to-background/80 border-blue-500/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="relative">
            <h4 className="text-sm font-semibold mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Moving Averages Analysis
            </h4>
            
            {/* Visual Price Position */}
            <div className="mb-6 space-y-4">
              <div className="text-center space-y-2">
                <div className="text-xs text-muted-foreground">Current Price Position</div>
                <div className="relative h-32 bg-gradient-to-b from-red-500/10 via-yellow-500/10 to-emerald-500/10 rounded-lg border border-border/50 overflow-hidden">
                  {/* SMA 50 Line */}
                  <div 
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent z-10"
                    style={{ top: '25%' }}
                  >
                    <div className="absolute -left-2 -top-2 text-[10px] font-semibold text-orange-400 bg-background/80 px-2 py-0.5 rounded whitespace-nowrap">
                      SMA 50: ${sma50.toFixed(2)}
                    </div>
                  </div>
                  
                  {/* SMA 20 Line */}
                  <div 
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent z-10"
                    style={{ top: '50%' }}
                  >
                    <div className="absolute -left-2 -top-2 text-[10px] font-semibold text-cyan-400 bg-background/80 px-2 py-0.5 rounded whitespace-nowrap">
                      SMA 20: ${sma20.toFixed(2)}
                    </div>
                  </div>
                  
                  {/* Current Price Marker */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary/50 via-primary to-primary/50 z-20"
                    style={{ 
                      top: 0,
                      boxShadow: '0 0 20px hsl(var(--primary))' 
                    }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 left-2 text-xs font-bold text-primary bg-background/90 px-3 py-1 rounded-lg border border-primary/30 whitespace-nowrap shadow-lg">
                      ${currentPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Interpretation Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500" />
                      <span className="text-xs font-semibold text-cyan-400">SMA 20</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${currentPrice > sma20 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                      {currentPrice > sma20 ? 'Bullish' : 'Bearish'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">${sma20.toFixed(2)}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Distance</span>
                    <span className={currentPrice > sma20 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                      {currentPrice > sma20 ? '+' : ''}{((currentPrice - sma20) / sma20 * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${currentPrice > sma20 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                      style={{ width: `${Math.min(Math.abs((currentPrice - sma20) / sma20 * 100) * 10, 100)}%` }} 
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="text-xs font-semibold text-orange-400">SMA 50</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${currentPrice > sma50 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                      {currentPrice > sma50 ? 'Bullish' : 'Bearish'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">${sma50.toFixed(2)}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Distance</span>
                    <span className={currentPrice > sma50 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                      {currentPrice > sma50 ? '+' : ''}{((currentPrice - sma50) / sma50 * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${currentPrice > sma50 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                      style={{ width: `${Math.min(Math.abs((currentPrice - sma50) / sma50 * 100) * 10, 100)}%` }} 
                    />
                  </div>
                </div>
              </div>
              
              {/* Overall Signal */}
              <div className="text-center py-3 px-4 rounded-xl bg-gradient-to-r from-background/50 to-background/30 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">Moving Average Signal</div>
                <div className={`text-lg font-bold ${(currentPrice > sma20 && currentPrice > sma50) ? 'text-emerald-400' : (currentPrice < sma20 && currentPrice < sma50) ? 'text-red-400' : 'text-yellow-400'}`}>
                  {(currentPrice > sma20 && currentPrice > sma50) ? 'Strong Bullish' : (currentPrice < sma20 && currentPrice < sma50) ? 'Strong Bearish' : 'Mixed Signal'}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* MACD - Histogram with zero line and legend */}
        {indicators[3] && (
          <Card className="p-6 bg-gradient-to-br from-background/95 to-background/80 border-border/50 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <span className="truncate">{indicators[3].name}</span>
                <span className="text-xs text-muted-foreground">{indicators[3].value.toFixed(2)}</span>
              </h4>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Bullish</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Bearish</span>
              </div>
            </div>
            <div className="overflow-hidden">
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
            </div>
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

        {/* Volume Analysis with legend */}
        <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold flex items-center gap-2 truncate">
              <BarChart3 className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="truncate">Volume Profile (14 Days)</span>
            </h4>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Buy Volume</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Sell Volume</span>
            </div>
          </div>
          <div className="overflow-hidden">
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
          </div>
          <div className="mt-4 px-3 py-2 rounded-lg text-sm font-semibold text-center bg-purple-500/20 text-purple-400 truncate">
            Volume Increasing ↑
          </div>
        </Card>
      </div>

      {/* Support & Resistance - Complete Redesign */}
      <Card className="p-6 bg-gradient-to-br from-emerald-900/20 via-red-900/10 to-background/80 border-emerald-500/20 overflow-hidden relative">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
        <div className="relative">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Support & Resistance Levels
          </h3>
          
          {/* Visual Price Ladder */}
          <div className="space-y-6">
            <div className="relative">
              {/* Resistance Level */}
              <div className="mb-8 p-4 rounded-xl border-2 border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-500/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-semibold text-red-400">Resistance</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    Sell Pressure
                  </span>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">${analysis.resistanceLevel.toFixed(2)}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Distance from current</span>
                  <span className="text-red-400 font-semibold">
                    +{(((analysis.resistanceLevel - currentPrice) / currentPrice) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="mt-3 h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500/50 to-red-500" 
                    style={{ width: `${Math.min(((analysis.resistanceLevel - currentPrice) / currentPrice) * 100, 100)}%` }} 
                  />
                </div>
              </div>
              
              {/* Price Range Visualization */}
              <div className="relative h-48 mb-8 rounded-xl bg-gradient-to-b from-red-500/5 via-background/50 to-emerald-500/5 border border-border/50 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-8 flex items-center justify-center border-b border-red-500/20 bg-red-500/5">
                  <span className="text-xs font-medium text-red-400">Resistance Zone</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-8 flex items-center justify-center border-t border-emerald-500/20 bg-emerald-500/5">
                  <span className="text-xs font-medium text-emerald-400">Support Zone</span>
                </div>
                
                {/* Current Price Indicator */}
                <div 
                  className="absolute left-0 right-0 h-0.5 bg-primary z-10 flex items-center justify-center"
                  style={{ 
                    top: `${((analysis.resistanceLevel - currentPrice) / (analysis.resistanceLevel - analysis.supportLevel)) * 100}%`,
                  }}
                >
                  <div className="absolute left-1/2 -translate-x-1/2 -top-6 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold shadow-lg whitespace-nowrap">
                    Current: ${currentPrice.toFixed(2)}
                  </div>
                  <div className="absolute left-0 w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="absolute right-0 w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
                
                {/* Distance Labels */}
                <div className="absolute left-4 top-1/4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                  {(((analysis.resistanceLevel - currentPrice) / currentPrice) * 100).toFixed(1)}% to resist
                </div>
                <div className="absolute left-4 bottom-1/4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                  {(((currentPrice - analysis.supportLevel) / currentPrice) * 100).toFixed(1)}% to support
                </div>
              </div>
              
              {/* Support Level */}
              <div className="p-4 rounded-xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-400">Support</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Buy Pressure
                  </span>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">${analysis.supportLevel.toFixed(2)}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Distance from current</span>
                  <span className="text-emerald-400 font-semibold">
                    -{(((currentPrice - analysis.supportLevel) / currentPrice) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="mt-3 h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-500/50" 
                    style={{ width: `${Math.min(((currentPrice - analysis.supportLevel) / currentPrice) * 100, 100)}%` }} 
                  />
                </div>
              </div>
            </div>
            
            {/* Trading Range Info */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
              <div className="text-center p-3 rounded-lg bg-muted/20">
                <div className="text-xs text-muted-foreground mb-1">Range Width</div>
                <div className="text-lg font-bold text-foreground">
                  ${(analysis.resistanceLevel - analysis.supportLevel).toFixed(2)}
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/20">
                <div className="text-xs text-muted-foreground mb-1">Price Position</div>
                <div className="text-lg font-bold text-foreground">
                  {(((currentPrice - analysis.supportLevel) / (analysis.resistanceLevel - analysis.supportLevel)) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
