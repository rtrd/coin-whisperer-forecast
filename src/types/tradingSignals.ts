export interface MarketSignal {
  type: 'bullish' | 'bearish' | 'neutral';
  strength: number;
  timeframe: string;
  description: string;
  asset: string;
}

export interface LiveSignal {
  type: 'price_alert' | 'volume_spike' | 'breakout' | 'support_test' | 'momentum_shift';
  asset: string;
  message: string;
  timestamp: string;
  strength: 'high' | 'medium' | 'low';
}

export interface TradingRecommendation {
  action: 'buy' | 'sell' | 'hold';
  asset: string;
  confidence: number;
  reason: string;
  targetPrice?: number;
}

export interface MarketNarrative {
  type: 'trend' | 'risk' | 'cycle' | 'news' | 'narrative';
  title: string;
  content: string;
  score: number;
  source: string;
  timestamp: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
}

export interface MarketAnalysis {
  bullish: {
    title: string;
    description: string;
    color: string;
    bgColor: string;
    borderColor: string;
  };
  bearish: {
    title: string;
    description: string;
    color: string;
    bgColor: string;
    borderColor: string;
  };
  neutral: {
    title: string;
    description: string;
    color: string;
    bgColor: string;
    borderColor: string;
  };
}