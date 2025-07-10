import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Gauge,
  Rocket,
  Satellite,
  Star,
  Globe
} from "lucide-react";
import { MarketPulseService, MarketPulseData, TrendingMover } from '@/services/marketPulseService';
import { CryptoToken } from '@/types/crypto';
import { SpacePulseGauge } from './SpacePulseGauge';
import { CosmicTrendingTicker } from './CosmicTrendingTicker';
import { MissionControlStats } from './MissionControlStats';

interface MarketPulseWidgetProps {
  cryptoData: CryptoToken[];
  isLoading?: boolean;
}

export const MarketPulseWidget: React.FC<MarketPulseWidgetProps> = ({
  cryptoData,
  isLoading = false
}) => {
  const [pulseData, setPulseData] = useState<MarketPulseData | null>(null);
  const [trendingMovers, setTrendingMovers] = useState<TrendingMover[]>([]);
  const [activeView, setActiveView] = useState<'overview' | 'metrics' | 'trends'>('overview');

  // Calculate market pulse data
  useEffect(() => {
    if (cryptoData && cryptoData.length > 0) {
      const pulse = MarketPulseService.calculateMarketPulse(cryptoData);
      const movers = MarketPulseService.getTrendingMovers(cryptoData);
      setPulseData(pulse);
      setTrendingMovers(movers);
    }
  }, [cryptoData]);

  const getMarketPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'markup': return <Rocket className="h-4 w-4" />;
      case 'accumulation': return <Satellite className="h-4 w-4" />;
      case 'distribution': return <Globe className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getMarketPhaseColor = (phase: string) => {
    switch (phase) {
      case 'markup': return 'text-green-400 bg-green-400/10';
      case 'accumulation': return 'text-blue-400 bg-blue-400/10';
      case 'distribution': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-red-400 bg-red-400/10';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400 bg-green-400/10';
      case 'bearish': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (isLoading || !pulseData) {
    return (
      <Card className="mb-8 bg-gradient-to-br from-slate-900 via-purple-900/20 to-blue-900/20 border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(88,28,135,0.1),transparent)] pointer-events-none" />
        
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity className="h-6 w-6 text-purple-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-ping" />
            </div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Mission Control - Market Pulse
            </CardTitle>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              Scanning Cosmos...
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-800/30 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 bg-gradient-to-br from-slate-900 via-purple-900/20 to-blue-900/20 border-purple-500/30 shadow-2xl relative overflow-hidden">
      {/* Space Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(88,28,135,0.1),transparent)] pointer-events-none" />
      
      {/* Animated Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity className="h-6 w-6 text-purple-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-ping" />
            </div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Mission Control - Market Pulse
            </CardTitle>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              Live Feed
            </Badge>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={activeView === 'overview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('overview')}
              className={`${
                activeView === 'overview' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-purple-300 hover:bg-purple-800/30'
              }`}
            >
              <Globe className="h-4 w-4 mr-1" />
              Overview
            </Button>
            <Button
              variant={activeView === 'metrics' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('metrics')}
              className={`${
                activeView === 'metrics' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-purple-300 hover:bg-purple-800/30'
              }`}
            >
              <Gauge className="h-4 w-4 mr-1" />
              Metrics
            </Button>
            <Button
              variant={activeView === 'trends' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('trends')}
              className={`${
                activeView === 'trends' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-purple-300 hover:bg-purple-800/30'
              }`}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Trends
            </Button>
          </div>
        </div>

        {/* Market Status Bar */}
        <div className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2">
            {getMarketPhaseIcon(pulseData.marketPhase)}
            <span className="text-sm text-gray-300">Phase:</span>
            <Badge className={getMarketPhaseColor(pulseData.marketPhase)}>
              {pulseData.marketPhase.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Sentiment:</span>
            <Badge className={getSentimentColor(pulseData.dominantSentiment)}>
              {pulseData.dominantSentiment.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-red-400" />
            <span className="text-sm text-gray-300">Risk:</span>
            <Badge className={`text-${pulseData.riskLevel === 'low' ? 'green' : pulseData.riskLevel === 'medium' ? 'yellow' : 'red'}-400 bg-${pulseData.riskLevel === 'low' ? 'green' : pulseData.riskLevel === 'medium' ? 'yellow' : 'red'}-400/10`}>
              {pulseData.riskLevel.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        {activeView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Pulse Gauge */}
            <SpacePulseGauge 
              value={pulseData.marketHealth}
              label="Market Health"
              maxValue={100}
              color="purple"
            />
            
            {/* Quick Stats */}
            <MissionControlStats pulseData={pulseData} />
          </div>
        )}

        {activeView === 'metrics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SpacePulseGauge 
              value={pulseData.fearGreedIndex}
              label="Fear & Greed"
              maxValue={100}
              color="blue"
              size="small"
            />
            <SpacePulseGauge 
              value={pulseData.volatilityIndex}
              label="Volatility"
              maxValue={100}
              color="red"
              size="small"
            />
            <SpacePulseGauge 
              value={pulseData.volumeActivity}
              label="Volume Activity"
              maxValue={100}
              color="green"
              size="small"
            />
            <SpacePulseGauge 
              value={pulseData.trendStrength}
              label="Trend Strength"
              maxValue={100}
              color="yellow"
              size="small"
            />
          </div>
        )}

        {activeView === 'trends' && (
          <CosmicTrendingTicker movers={trendingMovers} />
        )}
      </CardContent>
    </Card>
  );
};