
export interface SelectedTokenInfo {
  value: string;
  label: string;
  symbol: string;
  name: string;
  icon: string;
  category: string;
  score: number;
  prediction: string;
  description?: string;
  website?: string;
  twitter?: string;
}

export interface TokenAnalysis {
  momentum: number;
  volatility: number;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  supportLevel: number;
  resistanceLevel: number;
}
