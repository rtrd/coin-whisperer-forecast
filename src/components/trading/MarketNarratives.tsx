import React from 'react';
import { Target, Eye, TrendingUp, Shield, RotateCcw, Globe, Radar, Activity, BarChart3, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MarketNarrative } from '@/types/tradingSignals';

interface MarketNarrativesProps {
  marketNarratives: MarketNarrative[];
  fearGreedValue?: number;
  fearGreedClassification?: string;
  volatility?: number;
  volatilityTrend?: 'high' | 'normal' | 'low';
  defiTVLChange?: number;
}

export const MarketNarratives: React.FC<MarketNarrativesProps> = ({ 
  marketNarratives, 
  fearGreedValue = 50, 
  fearGreedClassification = 'Neutral',
  volatility = 50,
  volatilityTrend = 'normal',
  defiTVLChange = 0
}) => {

  // Calculate market cycle phase from Fear & Greed
  const getMarketCyclePhase = (value: number) => {
    if (value >= 76) return { phase: 'Distribution Phase', confidence: 85, color: 'text-red-400', bgColor: 'bg-red-900/20' };
    if (value >= 56) return { phase: 'Expansion Phase', confidence: 78, color: 'text-green-400', bgColor: 'bg-green-900/20' };
    if (value >= 46) return { phase: 'Consolidation', confidence: 65, color: 'text-yellow-400', bgColor: 'bg-yellow-900/20' };
    if (value >= 26) return { phase: 'Early Recovery', confidence: 72, color: 'text-blue-400', bgColor: 'bg-blue-900/20' };
    return { phase: 'Accumulation Phase', confidence: 80, color: 'text-green-400', bgColor: 'bg-green-900/20' };
  };

  const cyclePhase = getMarketCyclePhase(fearGreedValue);

  // Calculate risk level from volatility
  const getRiskLevel = (vol: number, trend: string) => {
    if (trend === 'high') return { level: 'High Risk', percentage: Math.min(85, vol + 20), color: 'text-red-400' };
    if (trend === 'low') return { level: 'Low Risk', percentage: Math.max(15, vol - 10), color: 'text-green-400' };
    return { level: 'Medium Risk', percentage: vol, color: 'text-yellow-400' };
  };

  const riskAssessment = getRiskLevel(volatility, volatilityTrend);

  return (
    <div className="bg-gray-900/95 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-md shadow-2xl">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-400/10 flex items-center justify-center border border-blue-400/30">
              <Target className="h-6 w-6 text-blue-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Market Intelligence</h2>
            <p className="text-gray-300 text-sm">Real-time market analysis powered by artificial intelligence</p>
          </div>
        </div>
        <Badge variant="outline" className="text-blue-400 border-blue-400/50 bg-blue-400/10 px-4 py-2 text-sm font-medium">
          <Activity className="h-4 w-4 mr-2" />
          Live Data
        </Badge>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Fear & Greed Index */}
        <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/40 backdrop-blur-sm h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Fear & Greed</span>
            </div>
            {fearGreedValue > 50 ? <ArrowUp className="h-4 w-4 text-green-400" /> : <ArrowDown className="h-4 w-4 text-red-400" />}
          </div>
          <div className="text-2xl font-bold text-white mb-1">{fearGreedValue}</div>
          <div className={`text-xs font-medium mb-3 ${
            fearGreedValue > 60 ? 'text-green-400' : fearGreedValue < 40 ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {fearGreedClassification}
          </div>
          <Progress 
            value={fearGreedValue} 
            className="h-1.5" 
            style={{
              '--progress-foreground': fearGreedValue > 60 ? '#4ade80' : fearGreedValue < 40 ? '#f87171' : '#facc15'
            } as React.CSSProperties}
          />
        </div>

        {/* Market Volume */}
        <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/40 backdrop-blur-sm h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Volume</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">$2.4B</div>
          <div className="text-xs font-medium mb-3 text-blue-400">
            24h Trading
          </div>
          <Progress 
            value={75} 
            className="h-1.5"
            style={{
              '--progress-foreground': '#60a5fa'
            } as React.CSSProperties}
          />
        </div>

        {/* DeFi TVL */}
        <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/40 backdrop-blur-sm h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">DeFi TVL</span>
            </div>
            {defiTVLChange > 0 ? <ArrowUp className="h-4 w-4 text-green-400" /> : <ArrowDown className="h-4 w-4 text-red-400" />}
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {defiTVLChange > 0 ? '+' : ''}{defiTVLChange.toFixed(1)}%
          </div>
          <div className={`text-xs font-medium mb-3 ${
            defiTVLChange > 0 ? 'text-green-400' : defiTVLChange < 0 ? 'text-red-400' : 'text-gray-400'
          }`}>
            24h Change
          </div>
          <Progress 
            value={Math.abs(defiTVLChange) * 10} 
            className="h-1.5"
            style={{
              '--progress-foreground': defiTVLChange > 0 ? '#4ade80' : '#f87171'
            } as React.CSSProperties}
          />
        </div>

        {/* Market Cycle */}
        <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/40 backdrop-blur-sm h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Market Cycle</span>
            </div>
            <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${
              cyclePhase.color.includes('green') ? 'bg-green-400' : 
              cyclePhase.color.includes('red') ? 'bg-red-400' : 
              cyclePhase.color.includes('yellow') ? 'bg-yellow-400' : 'bg-blue-400'
            }`}></div>
          </div>
          <div className="text-sm font-bold text-white mb-1 leading-tight">{cyclePhase.phase}</div>
          <div className={`text-xs font-medium mb-3 ${
            cyclePhase.color.includes('green') ? 'text-green-400' : 
            cyclePhase.color.includes('red') ? 'text-red-400' : 
            cyclePhase.color.includes('yellow') ? 'text-yellow-400' : 'text-blue-400'
          }`}>
            {cyclePhase.confidence}% Confidence
          </div>
          <Progress 
            value={cyclePhase.confidence} 
            className="h-1.5"
            style={{
              '--progress-foreground': cyclePhase.color.includes('green') ? '#4ade80' : 
                                       cyclePhase.color.includes('red') ? '#f87171' : 
                                       cyclePhase.color.includes('yellow') ? '#facc15' : '#60a5fa'
            } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Risk Assessment */}
        <div className="h-full">
          <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/40 backdrop-blur-sm h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <Shield className="h-4 w-4 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Risk Assessment</h3>
                <p className="text-xs text-gray-400">Current market risk analysis</p>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium text-sm">Risk Level</span>
                <Badge variant="outline" className={`${riskAssessment.color} border-current text-xs`}>
                  {riskAssessment.level}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Risk Percentage</span>
                  <span className={`font-medium ${riskAssessment.color}`}>{riskAssessment.percentage}%</span>
                </div>
                <Progress 
                  value={riskAssessment.percentage} 
                  className="h-2"
                  style={{
                    '--progress-foreground': riskAssessment.level === 'High Risk' ? '#f87171' :
                                            riskAssessment.level === 'Low Risk' ? '#4ade80' : '#facc15'
                  } as React.CSSProperties}
                />
              </div>

              <div className="p-3 bg-gray-700/40 rounded-lg border border-gray-600/30 flex-1">
                <p className="text-xs text-gray-300 leading-relaxed">
                  {volatilityTrend === 'high' 
                    ? `High volatility (${volatility}%) indicates increased market uncertainty. Risk management and position sizing are crucial in the current environment.`
                    : volatilityTrend === 'low' 
                    ? `Low volatility (${volatility}%) suggests stable market conditions with reduced risk. Favorable environment for position building.`
                    : `Moderate volatility (${volatility}%) indicates balanced market conditions with manageable risk levels.`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - AI Market Summary */}
        <div className="h-full">
          <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/40 backdrop-blur-sm h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Globe className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">AI Market Summary</h3>
                <p className="text-xs text-gray-400">Intelligent market analysis</p>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="p-3 bg-gray-700/40 rounded-lg border border-gray-600/30 flex-1">
                <h4 className="text-white font-medium mb-2 flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  Current Market State
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {fearGreedValue < 30 
                    ? "Extreme fear dominates market sentiment, creating potential accumulation opportunities. Smart money positioning for recovery while retail sentiment remains pessimistic."
                    : fearGreedValue < 50 
                    ? "Fear-driven conditions are creating selective value opportunities. Market consolidation expected as participants await clearer directional signals."
                    : fearGreedValue < 70 
                    ? "Balanced sentiment with growing optimism signals healthy market conditions. Trend continuation likely with normal corrections expected."
                    : fearGreedValue < 90 
                    ? "Strong bullish momentum driving market expansion. Monitor for overheating signals and potential distribution patterns."
                    : "Extreme greed suggests caution warranted. Market may be overextended and approaching a distribution phase."
                  }
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/20">
                  <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Sentiment</div>
                  <div className={`text-xs font-semibold ${
                    fearGreedValue > 60 ? 'text-green-400' : 
                    fearGreedValue < 40 ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {fearGreedClassification}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{fearGreedValue}/100</div>
                </div>
                
                <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/20">
                  <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Phase</div>
                  <div className={`text-xs font-semibold ${
                    cyclePhase.color.includes('green') ? 'text-green-400' : 
                    cyclePhase.color.includes('red') ? 'text-red-400' : 
                    cyclePhase.color.includes('yellow') ? 'text-yellow-400' : 'text-blue-400'
                  }`}>
                    {cyclePhase.phase.split(' ')[0]}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{cyclePhase.confidence}% Confidence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-30"></div>
              </div>
              <span className="text-xs text-white font-medium">Live Data Stream Active</span>
            </div>
            <div className="text-xs text-gray-400">
              Updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Radar className="h-4 w-4 text-blue-400 animate-spin" />
            <span className="text-xs text-blue-400 font-medium">AI Processing</span>
          </div>
        </div>
      </div>
    </div>
  );
};