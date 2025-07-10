import { CryptoToken } from '@/types/crypto';

export interface MarketPulseData {
  marketHealth: number; // 0-100
  fearGreedIndex: number; // 0-100
  volatilityIndex: number; // 0-100
  volumeActivity: number; // 0-100
  trendStrength: number; // 0-100
  marketPhase: 'accumulation' | 'markup' | 'distribution' | 'markdown';
  dominantSentiment: 'bullish' | 'bearish' | 'neutral';
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
}

export interface TrendingMover {
  symbol: string;
  name: string;
  change: number;
  price: number;
  momentum: 'strong' | 'moderate' | 'weak';
  category: 'gainer' | 'loser';
}

export class MarketPulseService {
  static calculateMarketPulse(cryptos: CryptoToken[]): MarketPulseData {
    if (!cryptos || cryptos.length === 0) {
      return this.getDefaultPulse();
    }

    const validCryptos = cryptos.filter(c => c.price_change_percentage_24h !== undefined);
    const changes = validCryptos.map(c => c.price_change_percentage_24h || 0);
    const volumes = validCryptos.map(c => c.total_volume || 0);
    const marketCaps = validCryptos.map(c => c.market_cap || 0);

    // Calculate core metrics
    const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const volatility = this.calculateVolatility(changes);
    const volumeMetric = this.calculateVolumeActivity(volumes);
    const trendStrength = this.calculateTrendStrength(changes);
    
    // Market health (weighted composite)
    const marketHealth = Math.max(0, Math.min(100, 
      50 + (avgChange * 2) + (volumeMetric * 0.3) - (volatility * 0.5)
    ));

    // Fear & Greed (inverse of volatility + sentiment)
    const fearGreedIndex = Math.max(0, Math.min(100,
      50 + (avgChange * 1.5) - (volatility * 0.8) + (trendStrength * 0.3)
    ));

    // Market phase detection
    const marketPhase = this.determineMarketPhase(avgChange, volatility, volumeMetric);
    
    // Sentiment analysis
    const dominantSentiment = avgChange > 2 ? 'bullish' : avgChange < -2 ? 'bearish' : 'neutral';
    
    // Risk assessment
    const riskLevel = volatility > 8 ? 'extreme' : volatility > 5 ? 'high' : volatility > 3 ? 'medium' : 'low';

    return {
      marketHealth: Math.round(marketHealth),
      fearGreedIndex: Math.round(fearGreedIndex),
      volatilityIndex: Math.round(Math.min(100, volatility * 10)),
      volumeActivity: Math.round(volumeMetric),
      trendStrength: Math.round(trendStrength),
      marketPhase,
      dominantSentiment,
      riskLevel
    };
  }

  static getTrendingMovers(cryptos: CryptoToken[]): TrendingMover[] {
    if (!cryptos || cryptos.length === 0) return [];

    const movers = cryptos
      .filter(c => c.price_change_percentage_24h !== undefined)
      .map(crypto => ({
        symbol: crypto.symbol.toUpperCase(),
        name: crypto.name,
        change: crypto.price_change_percentage_24h || 0,
        price: crypto.current_price || 0,
        momentum: this.calculateMomentum(crypto.price_change_percentage_24h || 0),
        category: (crypto.price_change_percentage_24h || 0) >= 0 ? 'gainer' as const : 'loser' as const
      }))
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
      .slice(0, 8);

    return movers;
  }

  private static calculateVolatility(changes: number[]): number {
    const mean = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const variance = changes.reduce((sum, change) => sum + Math.pow(change - mean, 2), 0) / changes.length;
    return Math.sqrt(variance);
  }

  private static calculateVolumeActivity(volumes: number[]): number {
    const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    const recentVolume = volumes.slice(-Math.floor(volumes.length * 0.3));
    const recentAvg = recentVolume.reduce((sum, vol) => sum + vol, 0) / recentVolume.length;
    
    return Math.max(0, Math.min(100, (recentAvg / avgVolume) * 50));
  }

  private static calculateTrendStrength(changes: number[]): number {
    const positiveCount = changes.filter(c => c > 0).length;
    const negativeCount = changes.filter(c => c < 0).length;
    const strength = Math.abs(positiveCount - negativeCount) / changes.length;
    return strength * 100;
  }

  private static calculateMomentum(change: number): 'strong' | 'moderate' | 'weak' {
    const absChange = Math.abs(change);
    if (absChange > 10) return 'strong';
    if (absChange > 5) return 'moderate';
    return 'weak';
  }

  private static determineMarketPhase(
    avgChange: number, 
    volatility: number, 
    volumeActivity: number
  ): 'accumulation' | 'markup' | 'distribution' | 'markdown' {
    if (avgChange > 3 && volatility < 5 && volumeActivity > 60) return 'markup';
    if (avgChange < -3 && volatility > 5) return 'markdown';
    if (Math.abs(avgChange) < 2 && volumeActivity > 50) return 'accumulation';
    return 'distribution';
  }

  private static getDefaultPulse(): MarketPulseData {
    return {
      marketHealth: 75,
      fearGreedIndex: 65,
      volatilityIndex: 45,
      volumeActivity: 60,
      trendStrength: 55,
      marketPhase: 'accumulation',
      dominantSentiment: 'neutral',
      riskLevel: 'medium'
    };
  }
}