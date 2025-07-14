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
  marketSentiment: "bullish" | "bearish" | "neutral";
  supportLevel: number;
  resistanceLevel: number;
}

export interface TokenAnalysisProps {
  selectedCrypto: string;
  currentPrice: number;
  priceChange: number;
  cryptoOptions?: any[];
  cryptoData?: any[];
  technicalIndicator?: any[]; // Optional, can be undefined if not used
}
