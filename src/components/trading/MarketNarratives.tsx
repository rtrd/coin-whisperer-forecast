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
    <div className="bg-gradient-to-br from-background/95 via-muted/50 to-background/95 rounded-2xl p-8 border border-border/50 backdrop-blur-md shadow-2xl">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
              <Target className="h-6 w-6 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">AI Market Intelligence</h2>
            <p className="text-muted-foreground text-sm">Real-time market analysis powered by artificial intelligence</p>
          </div>
        </div>
        <Badge variant="outline" className="text-primary border-primary/50 bg-primary/10 px-4 py-2 text-sm font-medium">
          <Activity className="h-4 w-4 mr-2" />
          Live Data
        </Badge>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Fear & Greed Index */}
        <div className="bg-card/50 rounded-xl p-6 border border-border/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Fear & Greed</span>
            </div>
            {fearGreedValue > 50 ? <ArrowUp className="h-4 w-4 text-green-500" /> : <ArrowDown className="h-4 w-4 text-red-500" />}
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">{fearGreedValue}</div>
          <div className={`text-sm font-medium mb-3 ${
            fearGreedValue > 60 ? 'text-green-500' : fearGreedValue < 40 ? 'text-red-500' : 'text-yellow-500'
          }`}>
            {fearGreedClassification}
          </div>
          <Progress 
            value={fearGreedValue} 
            className="h-2" 
            style={{
              '--progress-foreground': fearGreedValue > 60 ? '#10b981' : fearGreedValue < 40 ? '#ef4444' : '#eab308'
            } as React.CSSProperties}
          />
        </div>

        {/* Volatility */}
        <div className="bg-card/50 rounded-xl p-6 border border-border/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Volatility</span>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              volatilityTrend === 'high' ? 'bg-red-500' : 
              volatilityTrend === 'low' ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">{volatility}%</div>
          <div className={`text-sm font-medium mb-3 capitalize ${
            volatilityTrend === 'high' ? 'text-red-500' : 
            volatilityTrend === 'low' ? 'text-green-500' : 'text-yellow-500'
          }`}>
            {volatilityTrend} Risk
          </div>
          <Progress 
            value={volatility} 
            className="h-2"
            style={{
              '--progress-foreground': volatilityTrend === 'high' ? '#ef4444' : 
                                       volatilityTrend === 'low' ? '#10b981' : '#eab308'
            } as React.CSSProperties}
          />
        </div>

        {/* DeFi TVL */}
        <div className="bg-card/50 rounded-xl p-6 border border-border/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">DeFi TVL</span>
            </div>
            {defiTVLChange > 0 ? <ArrowUp className="h-4 w-4 text-green-500" /> : <ArrowDown className="h-4 w-4 text-red-500" />}
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">
            {defiTVLChange > 0 ? '+' : ''}{defiTVLChange.toFixed(1)}%
          </div>
          <div className={`text-sm font-medium mb-3 ${
            defiTVLChange > 0 ? 'text-green-500' : defiTVLChange < 0 ? 'text-red-500' : 'text-muted-foreground'
          }`}>
            24h Change
          </div>
          <Progress 
            value={Math.abs(defiTVLChange) * 10} 
            className="h-2"
            style={{
              '--progress-foreground': defiTVLChange > 0 ? '#10b981' : '#ef4444'
            } as React.CSSProperties}
          />
        </div>

        {/* Market Cycle */}
        <div className="bg-card/50 rounded-xl p-6 border border-border/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Market Cycle</span>
            </div>
            <div className={`w-3 h-3 rounded-full animate-pulse ${cyclePhase.color.replace('text-', 'bg-')}`}></div>
          </div>
          <div className="text-lg font-bold text-foreground mb-2 leading-tight">{cyclePhase.phase}</div>
          <div className={`text-sm font-medium mb-3 ${cyclePhase.color}`}>
            {cyclePhase.confidence}% Confidence
          </div>
          <Progress 
            value={cyclePhase.confidence} 
            className="h-2"
            style={{
              '--progress-foreground': cyclePhase.color.includes('green') ? '#10b981' : 
                                       cyclePhase.color.includes('red') ? '#ef4444' : 
                                       cyclePhase.color.includes('yellow') ? '#eab308' : '#3b82f6'
            } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Risk Assessment */}
        <div className="space-y-6">
          <div className="bg-card/50 rounded-xl p-6 border border-border/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Risk Assessment</h3>
                <p className="text-sm text-muted-foreground">Current market risk analysis</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground font-medium">Risk Level</span>
                <Badge variant="outline" className={`${riskAssessment.color} border-current`}>
                  {riskAssessment.level}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Risk Percentage</span>
                  <span className={`font-medium ${riskAssessment.color}`}>{riskAssessment.percentage}%</span>
                </div>
                <Progress 
                  value={riskAssessment.percentage} 
                  className="h-3"
                  style={{
                    '--progress-foreground': riskAssessment.level === 'High Risk' ? '#ef4444' :
                                            riskAssessment.level === 'Low Risk' ? '#10b981' : '#eab308'
                  } as React.CSSProperties}
                />
              </div>

              <div className="p-4 bg-muted/30 rounded-lg border border-border/30">
                <p className="text-sm text-foreground leading-relaxed">
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
        <div className="space-y-6">
          <div className="bg-card/50 rounded-xl p-6 border border-border/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">AI Market Summary</h3>
                <p className="text-sm text-muted-foreground">Intelligent market analysis</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-border/30">
                <h4 className="text-foreground font-medium mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Current Market State
                </h4>
                <p className="text-sm text-foreground leading-relaxed">
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
                <div className="p-3 bg-muted/20 rounded-lg border border-border/20">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Sentiment</div>
                  <div className={`text-sm font-semibold ${
                    fearGreedValue > 60 ? 'text-green-500' : 
                    fearGreedValue < 40 ? 'text-red-500' : 'text-yellow-500'
                  }`}>
                    {fearGreedClassification}
                  </div>
                  <div className="text-xs text-muted-foreground">{fearGreedValue}/100</div>
                </div>
                
                <div className="p-3 bg-muted/20 rounded-lg border border-border/20">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Phase</div>
                  <div className={`text-sm font-semibold ${cyclePhase.color}`}>
                    {cyclePhase.phase.split(' ')[0]}
                  </div>
                  <div className="text-xs text-muted-foreground">{cyclePhase.confidence}% Confidence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Footer */}
      <div className="mt-8 pt-6 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-30"></div>
              </div>
              <span className="text-sm text-foreground font-medium">Live Data Stream Active</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Radar className="h-5 w-5 text-primary animate-spin" />
            <span className="text-sm text-primary font-medium">AI Processing</span>
          </div>
        </div>
      </div>
    </div>
  );
};