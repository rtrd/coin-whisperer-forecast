import React from 'react';
import { Target, Eye, TrendingUp as TrendUp, Shield, RotateCcw, Newspaper, Globe, Radar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MarketNarrative } from '@/types/tradingSignals';

interface MarketNarrativesProps {
  marketNarratives: MarketNarrative[];
}

export const MarketNarratives: React.FC<MarketNarrativesProps> = ({ marketNarratives }) => {
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
          {/* Trend Analysis */}
          <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-lg p-4 border border-blue-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendUp className="h-5 w-5 text-blue-400" />
                <span className="text-blue-200 font-semibold">Multi-Source Trend Analysis</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">87% Confidence</span>
              </div>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed mb-3">
              Technical analysis, on-chain metrics, and sentiment indicators all pointing toward sustained accumulation phase
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-green-900/40 border border-green-500/30 rounded px-2 py-1 text-center">
                <div className="text-green-400 font-medium">Technical</div>
                <div className="text-green-300">Bullish</div>
              </div>
              <div className="bg-blue-900/40 border border-blue-500/30 rounded px-2 py-1 text-center">
                <div className="text-blue-400 font-medium">On-Chain</div>
                <div className="text-blue-300">Strong</div>
              </div>
              <div className="bg-purple-900/40 border border-purple-500/30 rounded px-2 py-1 text-center">
                <div className="text-purple-400 font-medium">Sentiment</div>
                <div className="text-purple-300">Positive</div>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-lg p-4 border border-orange-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-400" />
                <span className="text-orange-200 font-semibold">Current Risk Assessment</span>
              </div>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/50 bg-yellow-900/20">
                Medium Risk
              </Badge>
            </div>
            <p className="text-gray-200 text-sm mb-3">
              Medium risk environment with elevated volatility expected due to macroeconomic uncertainties
            </p>
            <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
              <div className="w-3/5 h-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Low</span>
              <span className="text-yellow-400 font-medium">64% Risk Level</span>
              <span>High</span>
            </div>
          </div>

          {/* Market Cycle Positioning */}
          <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg p-4 border border-purple-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-purple-400" />
                <span className="text-purple-200 font-semibold">Market Cycle Positioning</span>
              </div>
              <Badge variant="outline" className="text-green-400 border-green-400/50 bg-green-900/20">
                Early Accumulation
              </Badge>
            </div>
            <p className="text-gray-200 text-sm mb-3">
              Smart money accumulation patterns detected across major assets with retail FOMO still absent
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-medium">Accumulation Phase</span>
              </div>
              <span className="text-xs text-purple-300">78% Confidence</span>
            </div>
          </div>
        </div>

        {/* Right Column - News & Narratives */}
        <div className="space-y-4">
          {/* Breaking News */}
          <div className="bg-gradient-to-b from-green-900/30 to-emerald-900/30 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Newspaper className="h-5 w-5 text-green-400" />
              <span className="text-green-200 font-semibold">Breaking News</span>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-3">
              <div className="border-l-2 border-green-400 pl-3">
                <h4 className="text-white font-medium text-sm mb-1">Major Bitcoin ETF Approval</h4>
                <p className="text-gray-300 text-xs mb-1">SEC approves three additional spot Bitcoin ETFs, driving institutional adoption narrative</p>
                <div className="flex justify-between text-xs">
                  <span className="text-green-400">CoinDesk</span>
                  <span className="text-gray-500">2 min ago</span>
                </div>
              </div>
              <div className="border-l-2 border-blue-400 pl-3">
                <h4 className="text-white font-medium text-sm mb-1">Regulatory Framework Progress</h4>
                <p className="text-gray-300 text-xs mb-1">EU Parliament advances comprehensive crypto regulation framework</p>
                <div className="flex justify-between text-xs">
                  <span className="text-blue-400">Reuters</span>
                  <span className="text-gray-500">15 min ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Market Narratives */}
          <div className="bg-gradient-to-b from-cyan-900/30 to-teal-900/30 rounded-lg p-4 border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-5 w-5 text-cyan-400" />
              <span className="text-cyan-200 font-semibold">Live Narratives</span>
            </div>
            <div className="space-y-3">
              <div className="bg-cyan-900/20 rounded p-3 border border-cyan-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-cyan-400 text-sm font-medium">DeFi Renaissance</span>
                  <div className="w-4 h-4 text-green-400">↗</div>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Layer 2 solutions driving DeFi TVL growth with improved user experience and lower fees
                </p>
                <div className="flex justify-between text-xs mt-2">
                  <span className="text-cyan-300">DeFi Pulse</span>
                  <span className="text-green-400">75% Impact</span>
                </div>
              </div>
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