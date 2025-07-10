import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Brain, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { MarketSentimentOverview } from "@/components/trading/MarketSentimentOverview";
import { LiveMarketAlerts } from "@/components/trading/LiveMarketAlerts";
import { TradingRecommendations } from "@/components/trading/TradingRecommendations";
import { MarketNarratives } from "@/components/trading/MarketNarratives";
import { useTradingSignalsData } from "@/hooks/useTradingSignalsData";
import { MarketAnalysis } from '@/types/tradingSignals';

export const AITradingSignals = () => {
  const [isOpen, setIsOpen] = useState(true);
  const {
    marketSentiment,
    sentimentScore,
    signals,
    liveSignals,
    recommendations,
    marketNarratives,
    isAnalyzing
  } = useTradingSignalsData();

  const marketAnalysis: MarketAnalysis = {
    bullish: {
      title: "Bulls in Control",
      description: "Strong buying pressure across major cryptocurrencies with institutional interest growing.",
      color: "text-green-300",
      bgColor: "from-green-900/20 to-emerald-900/20",
      borderColor: "border-green-700/50"
    },
    bearish: {
      title: "Bears Dominating",
      description: "Selling pressure increasing with risk-off sentiment affecting crypto markets.",
      color: "text-red-300",
      bgColor: "from-red-900/20 to-rose-900/20",
      borderColor: "border-red-700/50"
    },
    neutral: {
      title: "Market Consolidation",
      description: "Sideways movement as markets await key catalysts and price discovery.",
      color: "text-yellow-300",
      bgColor: "from-yellow-900/20 to-orange-900/20",
      borderColor: "border-yellow-700/50"
    }
  };

  const currentAnalysis = marketAnalysis[marketSentiment];

  return (
    <div className="mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className={`bg-gradient-to-br ${currentAnalysis.bgColor} ${currentAnalysis.borderColor} border`}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-4 cursor-pointer hover:bg-white/5 transition-colors">
              <CardTitle className="text-slate-600 flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI Trading Insights
                  {isAnalyzing && <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>}
                </div>
                <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-gray-700/50 hover:text-white flex items-center gap-1">
                  {isOpen ? 'Hide Insights' : 'Show Insights'}
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {/* Market Sentiment Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MarketSentimentOverview
                  marketSentiment={marketSentiment}
                  sentimentScore={sentimentScore}
                  marketAnalysis={marketAnalysis}
                />
                <LiveMarketAlerts liveSignals={liveSignals} />
              </div>

              {/* Trading Recommendations */}
              <TradingRecommendations recommendations={recommendations} />

              {/* AI-Powered Market Narratives */}
              <MarketNarratives marketNarratives={marketNarratives} />

              {/* Disclaimer */}
              <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                <p className="text-xs text-white flex items-start gap-2 px-2">
                  <AlertTriangle className="h-3 w-3 mt-0.5 text-red-400" />
                  AI-generated signals are for educational purposes only. Always conduct your own research and consider risk management before trading.
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};