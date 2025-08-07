import React, { useState, useEffect } from 'react';
import { Target, Eye, TrendingUp as TrendUp, Shield, RotateCcw, Newspaper, Globe, Radar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MarketNarrative } from '@/types/tradingSignals';
import { apiService } from '@/services/apiService';

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
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const posts = await apiService.getWordPressPost();
        setBlogPosts(posts.slice(0, 2));
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      }
    };
    fetchBlogPosts();
  }, []);

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
    <div className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Trend & Risk Analysis */}
        <div className="lg:col-span-2 space-y-4">
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

        {/* Right Column - News & Narratives */}
        <div className="space-y-4">
          {/* Breaking News - Real Data */}
          <div className="bg-gradient-to-b from-green-900/30 to-emerald-900/30 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Newspaper className="h-5 w-5 text-green-400" />
              <span className="text-green-200 font-semibold">Latest News</span>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {blogPosts.length > 0 ? (
                blogPosts.map((post, index) => (
                  <div key={post.id} className={`border-l-2 pl-3 ${index === 0 ? 'border-green-400' : 'border-blue-400'}`}>
                    <h4 className="text-white font-medium text-sm mb-1" dangerouslySetInnerHTML={{ 
                      __html: post.title?.rendered || 'Untitled Post' 
                    }}></h4>
                    <p className="text-gray-300 text-xs mb-1" dangerouslySetInnerHTML={{ 
                      __html: post.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' || 'No excerpt available'
                    }}></p>
                    <div className="flex justify-between text-xs">
                      <span className={index === 0 ? 'text-green-400' : 'text-blue-400'}>Pump Parade</span>
                      <span className="text-gray-500">
                        {new Date(post.date).toLocaleDateString()} {new Date(post.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border-l-2 border-yellow-400 pl-3">
                  <h4 className="text-white font-medium text-sm mb-1">Market Update</h4>
                  <p className="text-gray-300 text-xs mb-1">
                    Fear & Greed Index at {fearGreedValue} indicates {fearGreedClassification.toLowerCase()} market sentiment
                  </p>
                  <div className="flex justify-between text-xs">
                    <span className="text-yellow-400">Alternative.me</span>
                    <span className="text-gray-500">Live</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Market Narratives - Real Data */}
          <div className="bg-gradient-to-b from-cyan-900/30 to-teal-900/30 rounded-lg p-4 border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-5 w-5 text-cyan-400" />
              <span className="text-cyan-200 font-semibold">Live Narratives</span>
            </div>
            <div className="space-y-3">
              {marketNarratives.length > 0 ? (
                marketNarratives.slice(0, 2).map((narrative, index) => (
                  <div key={index} className="bg-cyan-900/20 rounded p-3 border border-cyan-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-cyan-400 text-sm font-medium">{narrative.title}</span>
                      <div className={`w-4 h-4 ${narrative.impact === 'high' ? 'text-red-400' : narrative.impact === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                        {narrative.impact === 'high' ? '⚠' : narrative.impact === 'medium' ? '→' : '↗'}
                      </div>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      {narrative.content}
                    </p>
                    <div className="flex justify-between text-xs mt-2">
                      <span className="text-cyan-300">{narrative.source}</span>
                      <span className={`${narrative.impact === 'high' ? 'text-red-400' : narrative.impact === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                        {narrative.impact.charAt(0).toUpperCase() + narrative.impact.slice(1)} Impact
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-cyan-900/20 rounded p-3 border border-cyan-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cyan-400 text-sm font-medium">Market Analysis</span>
                    <div className="w-4 h-4 text-yellow-400">→</div>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Real-time market analysis based on current sentiment and volatility data. 
                    {volatilityTrend === 'high' ? ' High volatility environment requires careful risk management.' : ' Stable conditions support current trends.'}
                  </p>
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-cyan-300">AI Analysis</span>
                    <span className="text-yellow-400">Medium Impact</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="mt-6 pt-4 border-t border-gray-600/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-300">Live Data Stream Active</span>
            </div>
            <div className="text-xs text-gray-400">
              Last Updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Radar className="h-4 w-4 text-cyan-400 animate-spin" />
            <span className="text-xs text-cyan-400">AI Processing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};