
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Brain, Target, AlertTriangle, Zap, BarChart3, Activity } from "lucide-react";

interface MarketSignal {
  type: 'bullish' | 'bearish' | 'neutral';
  strength: number;
  timeframe: string;
  description: string;
}

interface TradingRecommendation {
  action: 'buy' | 'sell' | 'hold';
  asset: string;
  confidence: number;
  reason: string;
  targetPrice?: number;
}

export const AITradingSignals = () => {
  const [marketSentiment, setMarketSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('bullish');
  const [sentimentScore, setSentimentScore] = useState(72);
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [recommendations, setRecommendations] = useState<TradingRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const marketAnalysis = {
    bullish: {
      title: "Bulls in Control",
      description: "Strong buying pressure across major cryptocurrencies with institutional interest growing.",
      color: "text-green-400",
      bgColor: "from-green-900/20 to-emerald-900/20",
      borderColor: "border-green-700/50"
    },
    bearish: {
      title: "Bears Dominating",
      description: "Selling pressure increasing with risk-off sentiment affecting crypto markets.",
      color: "text-red-400",
      bgColor: "from-red-900/20 to-rose-900/20",
      borderColor: "border-red-700/50"
    },
    neutral: {
      title: "Market Consolidation",
      description: "Sideways movement as markets await key catalysts and price discovery.",
      color: "text-yellow-400",
      bgColor: "from-yellow-900/20 to-orange-900/20",
      borderColor: "border-yellow-700/50"
    }
  };

  useEffect(() => {
    const generateSignals = () => {
      setIsAnalyzing(true);
      
      // Simulate AI analysis
      setTimeout(() => {
        const newSignals: MarketSignal[] = [
          {
            type: 'bullish',
            strength: 85,
            timeframe: '4H',
            description: 'Golden cross forming on Bitcoin with volume confirmation'
          },
          {
            type: 'neutral',
            strength: 60,
            timeframe: '1D',
            description: 'Ethereum consolidating near key resistance levels'
          },
          {
            type: 'bearish',
            strength: 75,
            timeframe: '1H',
            description: 'Altcoins showing weakness against BTC dominance rise'
          }
        ];

        const newRecommendations: TradingRecommendation[] = [
          {
            action: 'buy',
            asset: 'BTC',
            confidence: 88,
            reason: 'Technical breakout + institutional accumulation',
            targetPrice: 105000
          },
          {
            action: 'hold',
            asset: 'ETH',
            confidence: 65,
            reason: 'Awaiting ETF decision catalyst',
            targetPrice: 4200
          },
          {
            action: 'sell',
            asset: 'ALTCOINS',
            confidence: 72,
            reason: 'Rotation into Bitcoin expected'
          }
        ];

        setSignals(newSignals);
        setRecommendations(newRecommendations);
        
        // Randomize sentiment
        const sentiments: ('bullish' | 'bearish' | 'neutral')[] = ['bullish', 'bearish', 'neutral'];
        setMarketSentiment(sentiments[Math.floor(Math.random() * sentiments.length)]);
        setSentimentScore(Math.floor(Math.random() * 40) + 50);
        
        setIsAnalyzing(false);
      }, 2000);
    };

    generateSignals();
    const interval = setInterval(generateSignals, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getSentimentIcon = () => {
    switch (marketSentiment) {
      case 'bullish': return <TrendingUp className="h-4 w-4" />;
      case 'bearish': return <TrendingDown className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'buy': return <TrendingUp className="h-3 w-3 text-green-400" />;
      case 'sell': return <TrendingDown className="h-3 w-3 text-red-400" />;
      default: return <Target className="h-3 w-3 text-yellow-400" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy': return 'text-green-400 border-green-400';
      case 'sell': return 'text-red-400 border-red-400';
      default: return 'text-yellow-400 border-yellow-400';
    }
  };

  const currentAnalysis = marketAnalysis[marketSentiment];

  return (
    <div className="mb-6">
      <Card className={`bg-gradient-to-br ${currentAnalysis.bgColor} ${currentAnalysis.borderColor} border`}>
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-purple-400" />
            AI Trading Signals
            {isAnalyzing && <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Market Sentiment Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium flex items-center gap-2">
                  {getSentimentIcon()}
                  Market Sentiment
                </h3>
                <Badge variant="outline" className={`${currentAnalysis.color} border-current`}>
                  {sentimentScore}%
                </Badge>
              </div>
              <div className="space-y-2">
                <div className={`font-semibold ${currentAnalysis.color}`}>
                  {currentAnalysis.title}
                </div>
                <p className="text-gray-300 text-sm">
                  {currentAnalysis.description}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      marketSentiment === 'bullish' ? 'bg-green-400' : 
                      marketSentiment === 'bearish' ? 'bg-red-400' : 'bg-yellow-400'
                    }`}
                    style={{ width: `${sentimentScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-white font-medium flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-blue-400" />
                Live Signals
              </h3>
              <div className="space-y-2">
                {signals.slice(0, 2).map((signal, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {signal.type === 'bullish' ? (
                        <TrendingUp className="h-3 w-3 text-green-400" />
                      ) : signal.type === 'bearish' ? (
                        <TrendingDown className="h-3 w-3 text-red-400" />
                      ) : (
                        <Activity className="h-3 w-3 text-yellow-400" />
                      )}
                      <span className="text-gray-300">{signal.timeframe}</span>
                    </div>
                    <Badge variant="outline" className="text-xs h-5">
                      {signal.strength}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trading Recommendations */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-white font-medium flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-purple-400" />
              AI Trading Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getActionIcon(rec.action)}
                      <span className="text-white font-medium text-sm">{rec.asset}</span>
                    </div>
                    <Badge variant="outline" className={`text-xs ${getActionColor(rec.action)} uppercase`}>
                      {rec.action}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-300">
                    {rec.reason}
                  </div>
                  <div className="flex justify-between items-center">
                    {rec.targetPrice && (
                      <span className="text-xs text-blue-400">
                        Target: ${rec.targetPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {rec.confidence}% confident
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-white font-medium flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              Key Market Insights
            </h3>
            <div className="space-y-2">
              {signals.map((signal, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <div className={`mt-1 w-2 h-2 rounded-full ${
                    signal.type === 'bullish' ? 'bg-green-400' : 
                    signal.type === 'bearish' ? 'bg-red-400' : 'bg-yellow-400'
                  }`}></div>
                  <div>
                    <span className="text-gray-300">{signal.description}</span>
                    <div className="text-xs text-gray-500 mt-1">
                      Strength: {signal.strength}% • Timeframe: {signal.timeframe}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
            <p className="text-xs text-yellow-200 flex items-start gap-2">
              <AlertTriangle className="h-3 w-3 mt-0.5 text-yellow-400" />
              AI-generated signals are for educational purposes only. Always conduct your own research and consider risk management before trading.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
