import { useState, useEffect } from 'react';
import { MarketSignal, LiveSignal, TradingRecommendation, MarketNarrative } from '@/types/tradingSignals';

export const useTradingSignalsData = () => {
  const [marketSentiment, setMarketSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('bullish');
  const [sentimentScore, setSentimentScore] = useState(72);
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [liveSignals, setLiveSignals] = useState<LiveSignal[]>([]);
  const [recommendations, setRecommendations] = useState<TradingRecommendation[]>([]);
  const [marketNarratives, setMarketNarratives] = useState<MarketNarrative[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const generateSignals = () => {
      setIsAnalyzing(true);
      
      setTimeout(() => {
        const newSignals: MarketSignal[] = [
          {
            type: 'bullish',
            strength: 82,
            timeframe: 'TREND',
            description: 'Institutional adoption accelerating with new ETF approvals driving long-term accumulation patterns',
            asset: 'INSTITUTIONAL'
          },
          {
            type: 'neutral',
            strength: 65,
            timeframe: 'MACRO',
            description: 'Federal Reserve policy uncertainty creating mixed signals across risk assets',
            asset: 'MACRO POLICY'
          },
          {
            type: 'bullish',
            strength: 76,
            timeframe: 'DEFI',
            description: 'DeFi protocols showing strong TVL growth with improved yield opportunities',
            asset: 'DEFI SECTOR'
          },
          {
            type: 'bearish',
            strength: 71,
            timeframe: 'REGULATION',
            description: 'Regulatory clarity concerns weighing on altcoin sentiment globally',
            asset: 'REGULATORY'
          },
          {
            type: 'bullish',
            strength: 79,
            timeframe: 'TECH',
            description: 'Layer 2 scaling solutions gaining traction with lower fees and faster transactions',
            asset: 'L2 SCALING'
          },
          {
            type: 'neutral',
            strength: 58,
            timeframe: 'SENTIMENT',
            description: 'Market correlation patterns suggest consolidation before next major move',
            asset: 'CORRELATION'
          }
        ];

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

        const newMarketNarratives: MarketNarrative[] = [
          {
            type: 'trend',
            title: 'Multi-Source Trend Confluence',
            content: 'Technical analysis, on-chain metrics, and sentiment indicators all pointing toward sustained accumulation phase',
            score: 87,
            source: 'AI Aggregated',
            timestamp: new Date(Date.now() - Math.random() * 300000).toLocaleTimeString(),
            impact: 'high',
            category: 'Trend Analysis'
          },
          {
            type: 'risk',
            title: 'Current Risk Assessment',
            content: 'Medium risk environment with elevated volatility expected due to macroeconomic uncertainties',
            score: 64,
            source: 'Risk Engine',
            timestamp: new Date(Date.now() - Math.random() * 600000).toLocaleTimeString(),
            impact: 'medium',
            category: 'Risk Metrics'
          },
          {
            type: 'cycle',
            title: 'Market Cycle: Early Accumulation',
            content: 'Smart money accumulation patterns detected across major assets with retail FOMO still absent',
            score: 78,
            source: 'Cycle Analytics',
            timestamp: new Date(Date.now() - Math.random() * 900000).toLocaleTimeString(),
            impact: 'high',
            category: 'Market Positioning'
          },
          {
            type: 'news',
            title: 'Major Bitcoin ETF Approval',
            content: 'SEC approves three additional spot Bitcoin ETFs, driving institutional adoption narrative',
            score: 92,
            source: 'CoinDesk',
            timestamp: new Date(Date.now() - Math.random() * 1200000).toLocaleTimeString(),
            impact: 'high',
            category: 'Breaking News'
          },
          {
            type: 'narrative',
            title: 'DeFi Renaissance Emerging',
            content: 'Layer 2 solutions driving DeFi TVL growth with improved user experience and lower fees',
            score: 75,
            source: 'DeFi Pulse',
            timestamp: new Date(Date.now() - Math.random() * 1500000).toLocaleTimeString(),
            impact: 'medium',
            category: 'Sector Narrative'
          },
          {
            type: 'news',
            title: 'Regulatory Framework Progress',
            content: 'EU Parliament advances comprehensive crypto regulation framework, providing clarity for institutional adoption',
            score: 83,
            source: 'Reuters',
            timestamp: new Date(Date.now() - Math.random() * 1800000).toLocaleTimeString(),
            impact: 'high',
            category: 'Regulatory Update'
          }
        ];

        setSignals(newSignals);
        setLiveSignals(newLiveSignals);
        setRecommendations(newRecommendations);
        setMarketNarratives(newMarketNarratives);
        
        const sentiments: ('bullish' | 'bearish' | 'neutral')[] = ['bullish', 'bearish', 'neutral'];
        setMarketSentiment(sentiments[Math.floor(Math.random() * sentiments.length)]);
        setSentimentScore(Math.floor(Math.random() * 40) + 50);
        
        setIsAnalyzing(false);
      }, 2000);
    };

    generateSignals();
    const interval = setInterval(generateSignals, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    marketSentiment,
    sentimentScore,
    signals,
    liveSignals,
    recommendations,
    marketNarratives,
    isAnalyzing
  };
};