import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TrendingUp, TrendingDown, Brain, Target, AlertTriangle, Zap, BarChart3, Activity, Volume2, Clock, ChevronDown, ChevronUp, Rocket, ExternalLink } from "lucide-react";

interface MarketSignal {
  type: 'bullish' | 'bearish' | 'neutral';
  strength: number;
  timeframe: string;
  description: string;
  asset: string;
}

interface LiveSignal {
  type: 'price_alert' | 'volume_spike' | 'breakout' | 'support_test' | 'momentum_shift';
  asset: string;
  message: string;
  timestamp: string;
  strength: 'high' | 'medium' | 'low';
}

interface TradingRecommendation {
  action: 'buy' | 'sell' | 'hold';
  asset: string;
  confidence: number;
  reason: string;
  targetPrice?: number;
}

interface PumpToken {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  icon: string;
  pumpScore: number;
}

export const AITradingSignals = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [marketSentiment, setMarketSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('bullish');
  const [sentimentScore, setSentimentScore] = useState(72);
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [liveSignals, setLiveSignals] = useState<LiveSignal[]>([]);
  const [recommendations, setRecommendations] = useState<TradingRecommendation[]>([]);
  const [trendingTokens, setTrendingTokens] = useState<PumpToken[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const marketAnalysis = {
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
            description: 'Golden cross forming with volume confirmation',
            asset: 'BTC'
          },
          {
            type: 'neutral',
            strength: 60,
            timeframe: '1D',
            description: 'Consolidating near key resistance levels',
            asset: 'ETH'
          },
          {
            type: 'bearish',
            strength: 75,
            timeframe: '1H',
            description: 'Showing weakness against BTC dominance',
            asset: 'ALTS'
          },
          {
            type: 'bullish',
            strength: 78,
            timeframe: '6H',
            description: 'Breaking above moving average resistance',
            asset: 'SOL'
          },
          {
            type: 'bullish',
            strength: 68,
            timeframe: '2H',
            description: 'RSI bounce from oversold levels',
            asset: 'ADA'
          },
          {
            type: 'neutral',
            strength: 55,
            timeframe: '12H',
            description: 'Testing support at key Fibonacci level',
            asset: 'MATIC'
          }
        ];

        // Generate live signals with real-time market events
        const newLiveSignals: LiveSignal[] = [
          {
            type: 'volume_spike',
            asset: 'BTC',
            message: '250% volume increase detected',
            timestamp: new Date(Date.now() - Math.random() * 300000).toLocaleTimeString(),
            strength: 'high'
          },
          {
            type: 'breakout',
            asset: 'ETH',
            message: 'Breaking resistance at $3,280',
            timestamp: new Date(Date.now() - Math.random() * 600000).toLocaleTimeString(),
            strength: 'medium'
          },
          {
            type: 'price_alert',
            asset: 'SOL',
            message: '+8.5% price surge in 15 minutes',
            timestamp: new Date(Date.now() - Math.random() * 900000).toLocaleTimeString(),
            strength: 'high'
          },
          {
            type: 'support_test',
            asset: 'ADA',
            message: 'Testing $0.42 support level',
            timestamp: new Date(Date.now() - Math.random() * 1200000).toLocaleTimeString(),
            strength: 'medium'
          },
          {
            type: 'momentum_shift',
            asset: 'MATIC',
            message: 'RSI entering oversold territory',
            timestamp: new Date(Date.now() - Math.random() * 1500000).toLocaleTimeString(),
            strength: 'low'
          },
          {
            type: 'volume_spike',
            asset: 'LINK',
            message: 'Unusual options activity detected',
            timestamp: new Date(Date.now() - Math.random() * 1800000).toLocaleTimeString(),
            strength: 'medium'
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

        // Add Pump.fun trending tokens
        const mockTokens: PumpToken[] = [
          { name: 'MoonShot', symbol: 'MOON', price: 0.0012, change24h: 1250, volume: 890000, marketCap: 2400000, icon: '🌙', pumpScore: 9.8 },
          { name: 'RocketCoin', symbol: 'ROCK', price: 0.00089, change24h: 890, volume: 650000, marketCap: 1800000, icon: '🚀', pumpScore: 9.5 },
          { name: 'LaserEyes', symbol: 'LASER', price: 0.0034, change24h: 650, volume: 1200000, marketCap: 5600000, icon: '👁️', pumpScore: 9.2 },
          { name: 'DiamondHands', symbol: 'DIAM', price: 0.0067, change24h: 450, volume: 980000, marketCap: 8900000, icon: '💎', pumpScore: 8.9 },
          { name: 'ToTheMoon', symbol: 'TTM', price: 0.0023, change24h: 320, volume: 750000, marketCap: 3400000, icon: '🌕', pumpScore: 8.7 }
        ];

        setSignals(newSignals);
        setLiveSignals(newLiveSignals);
        setRecommendations(newRecommendations);
        setTrendingTokens(mockTokens);
        
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
      case 'buy': return <TrendingUp className="h-3 w-3 text-green-300" />;
      case 'sell': return <TrendingDown className="h-3 w-3 text-red-300" />;
      default: return <Target className="h-3 w-3 text-yellow-300" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy': return 'text-green-300 border-green-300';
      case 'sell': return 'text-red-300 border-red-300';
      default: return 'text-yellow-300 border-yellow-300';
    }
  };

  const getSignalTypeIcon = (type: string) => {
    switch (type) {
      case 'bullish': return <TrendingUp className="h-3 w-3 text-green-300" />;
      case 'bearish': return <TrendingDown className="h-3 w-3 text-red-300" />;
      default: return <Activity className="h-3 w-3 text-yellow-300" />;
    }
  };

  const getSignalTypeColor = (type: string) => {
    switch (type) {
      case 'bullish': return 'text-green-300 border-green-300';
      case 'bearish': return 'text-red-300 border-red-300';
      default: return 'text-yellow-300 border-yellow-300';
    }
  };

  const getLiveSignalIcon = (type: string) => {
    switch (type) {
      case 'volume_spike': return <Volume2 className="h-3 w-3 text-blue-300" />;
      case 'breakout': return <TrendingUp className="h-3 w-3 text-green-300" />;
      case 'price_alert': return <AlertTriangle className="h-3 w-3 text-orange-300" />;
      case 'support_test': return <Target className="h-3 w-3 text-purple-300" />;
      case 'momentum_shift': return <Activity className="h-3 w-3 text-red-300" />;
      default: return <Zap className="h-3 w-3 text-gray-300" />;
    }
  };

  const getLiveSignalColor = (strength: string) => {
    switch (strength) {
      case 'high': return 'border-red-300 bg-red-900/20';
      case 'medium': return 'border-yellow-300 bg-yellow-900/20';
      case 'low': return 'border-gray-300 bg-gray-900/20';
      default: return 'border-gray-300 bg-gray-900/20';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const currentAnalysis = marketAnalysis[marketSentiment];

  return (
    <div className="mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className={`bg-gradient-to-br ${currentAnalysis.bgColor} ${currentAnalysis.borderColor} border`}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-4 cursor-pointer hover:bg-white/5 transition-colors">
              <CardTitle className="text-white flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI Trading Signals & Pump.fun Integration
                  {isAnalyzing && <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>}
                  <Badge className="bg-orange-600">LIVE</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-purple-300 border-purple-300">
                    {isOpen ? 'Collapse' : 'Expand'}
                  </Badge>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-purple-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-purple-400" />
                  )}
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
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
                    <p className="text-gray-200 text-sm">
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
                    Live Market Alerts
                    <Clock className="h-3 w-3 text-gray-400" />
                  </h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {liveSignals.map((signal, index) => (
                      <div key={index} className={`flex items-start gap-2 text-xs rounded p-2 border ${getLiveSignalColor(signal.strength)}`}>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {getLiveSignalIcon(signal.type)}
                          <span className="text-blue-300 font-medium">{signal.asset}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-gray-200 truncate">{signal.message}</div>
                          <div className="text-gray-400 text-xs">{signal.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pump.fun Trending Tokens Section */}
              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-lg border border-orange-700/50 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Rocket className="h-5 w-5 text-orange-400" />
                  <h3 className="text-white font-bold text-lg">Trending Pump Tokens</h3>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {trendingTokens.map((token, index) => (
                    <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{token.icon}</span>
                          <div>
                            <div className="text-white font-bold">{token.symbol}</div>
                            <div className="text-gray-400 text-xs">{token.name}</div>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                          {token.pumpScore}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm mb-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Price:</span>
                          <span className="text-white">${token.price.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">24h:</span>
                          <span className="text-green-400 font-bold">+{token.change24h}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Volume:</span>
                          <span className="text-white">${formatNumber(token.volume)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Market Cap:</span>
                          <span className="text-white">${formatNumber(token.marketCap)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                          size="sm"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Pump.fun
                        </Button>
                        <Button 
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          size="sm"
                          onClick={() => window.open('https://andmilo.com', '_blank')}
                        >
                          Buy
                        </Button>
                      </div>
                    </div>
                  ))}
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
                      <div className="text-xs text-gray-200">
                        {rec.reason}
                      </div>
                      <div className="flex justify-between items-center">
                        {rec.targetPrice && (
                          <span className="text-xs text-blue-300">
                            Target: ${rec.targetPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-xs text-gray-300">
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
                        <span className="text-gray-200">{signal.asset}: {signal.description}</span>
                        <div className="text-xs text-gray-400 mt-1">
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
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};
