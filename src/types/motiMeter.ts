export interface MotiScores {
  twitterInteraction: number;    // 1-5
  goodTicker: number;           // 1-5
  culturalRefs: number;         // 1-5
  ageOfProject: number;         // 1-5
  volumeConsistency: number;    // 1-5
  holderGrowth: number;         // 1-5
  higherLows: number;           // 1-5
}

export interface MotiToken {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price?: number;
  market_cap?: number;
  price_change_percentage_24h?: number;
  total_volume?: number;
  scores: MotiScores;
  motiScore: number; // Average of all scores
  aiSummary: string; // AI-generated analysis
  period: '24h' | '5d' | '7d';
}