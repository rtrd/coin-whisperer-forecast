
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PriceData {
  timestamp: number;
  price: number;
  volume?: number;
}

interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  strength: number;
}

interface TechnicalAnalysisProps {
  data: PriceData[] | null;
  isLoading: boolean;
}

export const TechnicalAnalysis: React.FC<TechnicalAnalysisProps> = ({ data, isLoading }) => {
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
    
    return 100 - (100 / (1 + rs));
  };

  const calculateSMA = (prices: number[], period: number): number => {
    if (prices.length < period) return prices[prices.length - 1] || 0;
    const slice = prices.slice(-period);
    return slice.reduce((sum, price) => sum + price, 0) / period;
  };

  const calculateMACD = (prices: number[]): { macd: number; signal: number } => {
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
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-gray-700" />
          <Skeleton className="h-4 w-48 bg-gray-700" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full bg-gray-700" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Technical Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No data available for analysis</p>
        </CardContent>
      </Card>
    );
  }

  const prices = data.map(d => d.price);
  const currentPrice = prices[prices.length - 1];
  
  // Calculate technical indicators
  const rsi = calculateRSI(prices);
  const sma20 = calculateSMA(prices, 20);
  const sma50 = calculateSMA(prices, 50);
  const { macd, signal } = calculateMACD(prices);
  
  const indicators: TechnicalIndicator[] = [
    {
      name: 'RSI (14)',
      value: rsi,
      signal: rsi > 70 ? 'sell' : rsi < 30 ? 'buy' : 'neutral',
      strength: Math.abs(rsi - 50) / 50
    },
    {
      name: 'SMA 20',
      value: sma20,
      signal: currentPrice > sma20 ? 'buy' : currentPrice < sma20 ? 'sell' : 'neutral',
      strength: Math.abs(currentPrice - sma20) / sma20
    },
    {
      name: 'SMA 50',
      value: sma50,
      signal: currentPrice > sma50 ? 'buy' : currentPrice < sma50 ? 'sell' : 'neutral',
      strength: Math.abs(currentPrice - sma50) / sma50
    },
    {
      name: 'MACD',
      value: macd,
      signal: macd > signal ? 'buy' : macd < signal ? 'sell' : 'neutral',
      strength: Math.abs(macd - signal) / Math.max(Math.abs(macd), Math.abs(signal), 1)
    }
  ];

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy': return 'text-green-400 border-green-400';
      case 'sell': return 'text-red-400 border-red-400';
      default: return 'text-yellow-400 border-yellow-400';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'buy': return <TrendingUp className="h-3 w-3" />;
      case 'sell': return <TrendingDown className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  const overallSignal = indicators.reduce((acc, ind) => {
    if (ind.signal === 'buy') return acc + ind.strength;
    if (ind.signal === 'sell') return acc - ind.strength;
    return acc;
  }, 0);

  const overallTrend = overallSignal > 0.1 ? 'buy' : overallSignal < -0.1 ? 'sell' : 'neutral';

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-400" />
          Technical Analysis
        </CardTitle>
        <CardDescription className="text-gray-300">
          Real-time technical indicators and signals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Signal */}
        <div className="p-3 bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Overall Signal</span>
            <Badge variant="outline" className={getSignalColor(overallTrend)}>
              {getSignalIcon(overallTrend)}
              <span className="ml-1 capitalize">{overallTrend}</span>
            </Badge>
          </div>
          <Progress 
            value={Math.abs(overallSignal) * 50} 
            className="h-2"
          />
        </div>

        {/* Individual Indicators */}
        <div className="space-y-3">
          {indicators.map((indicator, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-300">{indicator.name}</span>
                  <Badge variant="outline" className={`${getSignalColor(indicator.signal)} text-xs`}>
                    {getSignalIcon(indicator.signal)}
                    <span className="ml-1 capitalize">{indicator.signal}</span>
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {indicator.name.includes('SMA') || indicator.name.includes('MACD') 
                      ? `$${indicator.value.toFixed(2)}` 
                      : indicator.value.toFixed(2)
                    }
                  </span>
                  <span className="text-xs text-gray-400">
                    Strength: {(indicator.strength * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support and Resistance */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Key Levels</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-green-900/20 rounded border border-green-700">
              <p className="text-xs text-green-400">Support</p>
              <p className="text-sm font-medium text-white">${(currentPrice * 0.95).toFixed(2)}</p>
            </div>
            <div className="p-2 bg-red-900/20 rounded border border-red-700">
              <p className="text-xs text-red-400">Resistance</p>
              <p className="text-sm font-medium text-white">${(currentPrice * 1.05).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
