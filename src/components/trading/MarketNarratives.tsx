import React from 'react';
import { Target, Eye, TrendingUp as TrendUp, Shield, RotateCcw, Globe, Radar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    <div className="bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 rounded-2xl p-8 border border-slate-600/40 backdrop-blur-md shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold flex items-center gap-3 text-xl">
          <div className="relative">
            <Target className="h-6 w-6 text-cyan-400" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
          AI-Powered Market Narratives
        </h3>
        <Badge variant="outline" className="text-cyan-400 border-cyan-400/50 bg-cyan-900/20 px-3 py-1">
          <Eye className="h-3 w-3 mr-1" />
          Live Intelligence
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Market Analysis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Trend Analysis - Real Data */}
          <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-lg p-4 border border-blue-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendUp className="h-5 w-5 text-blue-400" />
                <span className="text-blue-200 font-semibold">Multi-Source Trend Analysis</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">{Math.max(60, fearGreedValue)}% Confidence</span>
              </div>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed mb-3">
              Fear & Greed Index at {fearGreedValue} shows {fearGreedClassification.toLowerCase()} sentiment. 
              Volatility is {volatilityTrend} ({volatility}%) and DeFi TVL {defiTVLChange > 0 ? 'growing' : defiTVLChange < 0 ? 'declining' : 'stable'}.
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className={`border rounded px-2 py-1 text-center ${
                fearGreedValue > 60 ? 'bg-green-900/40 border-green-500/30' : 
                fearGreedValue < 40 ? 'bg-red-900/40 border-red-500/30' : 
                'bg-yellow-900/40 border-yellow-500/30'
              }`}>
                <div className={fearGreedValue > 60 ? 'text-green-400' : fearGreedValue < 40 ? 'text-red-400' : 'text-yellow-400'}>Sentiment</div>
                <div className={fearGreedValue > 60 ? 'text-green-300' : fearGreedValue < 40 ? 'text-red-300' : 'text-yellow-300'}>{fearGreedClassification}</div>
              </div>
              <div className={`border rounded px-2 py-1 text-center ${
                volatilityTrend === 'low' ? 'bg-green-900/40 border-green-500/30' : 
                volatilityTrend === 'high' ? 'bg-red-900/40 border-red-500/30' : 
                'bg-blue-900/40 border-blue-500/30'
              }`}>
                <div className={volatilityTrend === 'low' ? 'text-green-400' : volatilityTrend === 'high' ? 'text-red-400' : 'text-blue-400'}>Volatility</div>
                <div className={volatilityTrend === 'low' ? 'text-green-300' : volatilityTrend === 'high' ? 'text-red-300' : 'text-blue-300'}>{volatilityTrend}</div>
              </div>
              <div className={`border rounded px-2 py-1 text-center ${
                defiTVLChange > 2 ? 'bg-green-900/40 border-green-500/30' : 
                defiTVLChange < -2 ? 'bg-red-900/40 border-red-500/30' : 
                'bg-purple-900/40 border-purple-500/30'
              }`}>
                <div className={defiTVLChange > 2 ? 'text-green-400' : defiTVLChange < -2 ? 'text-red-400' : 'text-purple-400'}>DeFi TVL</div>
                <div className={defiTVLChange > 2 ? 'text-green-300' : defiTVLChange < -2 ? 'text-red-300' : 'text-purple-300'}>
                  {defiTVLChange > 0 ? '+' : ''}{defiTVLChange.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Risk Assessment - Real Data */}
          <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-lg p-4 border border-orange-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-400" />
                <span className="text-orange-200 font-semibold">Current Risk Assessment</span>
              </div>
              <Badge variant="outline" className={`border-opacity-50 ${riskAssessment.color} ${riskAssessment.color.replace('text-', 'bg-').replace('-400', '-900/20')} border-current`}>
                {riskAssessment.level}
              </Badge>
            </div>
            <p className="text-gray-200 text-sm mb-3">
              {volatilityTrend === 'high' 
                ? `High volatility (${volatility}%) suggests increased market uncertainty. Risk management is crucial.`
                : volatilityTrend === 'low' 
                ? `Low volatility (${volatility}%) indicates stable market conditions with lower risk.`
                : `Moderate volatility (${volatility}%) suggests balanced market conditions.`
              }
            </p>
            <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full ${
                  riskAssessment.level === 'High Risk' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                  riskAssessment.level === 'Low Risk' ? 'bg-gradient-to-r from-green-500 to-blue-500' :
                  'bg-gradient-to-r from-orange-500 to-yellow-500'
                }`}
                style={{ width: `${riskAssessment.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Low</span>
              <span className={`font-medium ${riskAssessment.color}`}>{riskAssessment.percentage}% Risk Level</span>
              <span>High</span>
            </div>
          </div>

          {/* Market Cycle Positioning - Real Data */}
          <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg p-4 border border-purple-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-purple-400" />
                <span className="text-purple-200 font-semibold">Market Cycle Positioning</span>
              </div>
              <Badge variant="outline" className={`border-opacity-50 ${cyclePhase.color} border-current ${cyclePhase.bgColor}`}>
                {cyclePhase.phase}
              </Badge>
            </div>
            <p className="text-gray-200 text-sm mb-3">
              {fearGreedValue < 30 
                ? "Extreme fear creating potential accumulation opportunities. Market participants showing pessimism."
                : fearGreedValue < 50 
                ? "Fear-driven selling may be creating value opportunities for patient investors."
                : fearGreedValue < 70 
                ? "Balanced market sentiment with growing optimism but not yet euphoric."
                : fearGreedValue < 90 
                ? "Strong bullish sentiment driving expansion. Watch for signs of overheating."
                : "Extreme greed suggests caution. Market may be overextended and due for correction."
              }
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full animate-pulse ${cyclePhase.color.replace('text-', 'bg-')}`}></div>
                <span className={`text-xs font-medium ${cyclePhase.color}`}>{cyclePhase.phase}</span>
              </div>
              <span className="text-xs text-purple-300">{cyclePhase.confidence}% Confidence</span>
            </div>
          </div>
        </div>

        {/* Market Insights Summary */}
        <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-pink-900/40 rounded-xl p-6 border border-indigo-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <Globe className="h-6 w-6 text-indigo-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-indigo-200 font-bold text-lg">AI Market Summary</span>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                Current Market State
              </h4>
              <p className="text-gray-200 text-sm leading-relaxed">
                {fearGreedValue < 30 
                  ? "Extreme fear dominates with potential accumulation opportunities emerging. Smart money positioning for recovery."
                  : fearGreedValue < 50 
                  ? "Fear-driven conditions creating selective value opportunities. Market consolidation expected."
                  : fearGreedValue < 70 
                  ? "Balanced sentiment with growing optimism. Trend continuation likely with healthy corrections."
                  : fearGreedValue < 90 
                  ? "Strong bullish momentum driving expansion. Monitor for overheating signals."
                  : "Extreme greed suggests caution. Distribution phase may be approaching."
                }
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/20 rounded-lg p-3 border border-gray-600/30">
                <div className="text-xs text-gray-400 mb-1">Market Sentiment</div>
                <div className={`text-sm font-semibold ${
                  fearGreedValue > 60 ? 'text-green-400' : 
                  fearGreedValue < 40 ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {fearGreedClassification}
                </div>
                <div className="text-xs text-gray-500">{fearGreedValue}/100</div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-3 border border-gray-600/30">
                <div className="text-xs text-gray-400 mb-1">Risk Level</div>
                <div className={`text-sm font-semibold ${riskAssessment.color}`}>
                  {riskAssessment.level.replace(' Risk', '')}
                </div>
                <div className="text-xs text-gray-500">{volatility}% Vol</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg p-3 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-purple-300 mb-1">Cycle Phase</div>
                  <div className={`text-sm font-semibold ${cyclePhase.color}`}>
                    {cyclePhase.phase}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Confidence</div>
                  <div className="text-sm font-semibold text-purple-300">
                    {cyclePhase.confidence}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Status Bar */}
      <div className="mt-8 pt-6 border-t border-slate-600/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-30"></div>
              </div>
              <span className="text-sm text-slate-300 font-medium">Live Data Stream Active</span>
            </div>
            <div className="text-sm text-slate-400">
              Last Updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Radar className="h-5 w-5 text-cyan-400 animate-spin" />
            <span className="text-sm text-cyan-400 font-medium">AI Processing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};