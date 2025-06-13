
export interface TokenAnalysis {
  momentum: number;
  volatility: number;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  supportLevel: number;
  resistanceLevel: number;
}

export interface TokenAnalysisProps {
  selectedCrypto: string;
  currentPrice: number;
  priceChange: number;
  cryptoOptions?: any[];
}

export interface SelectedTokenInfo {
  value: string;
  label: string;
  symbol: string;
  name: string;
  icon: string;
  score: number;
  prediction: string;
  category: string;
}
