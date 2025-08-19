import { toast } from "sonner";
import { PriceData, PredictionResult } from "@/types/prediction";
import { CryptoToken } from "@/types/crypto";
import { generateAIPrediction } from "@/services/aiPredictionService";
import { fetchCryptoData } from "@/utils/tokenAnaylysis";

interface PredictionCache {
  [tokenId: string]: {
    predictionPercentage: number;
    aiScore: number;
    timestamp: number;
  };
}

class IndividualPredictionService {
  private cache: PredictionCache = {};
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async generateTokenPrediction(
    tokenId: string,
    tokenData: CryptoToken
  ): Promise<{ predictionPercentage: number; aiScore: number }> {
    // Check cache first
    const cached = this.cache[tokenId];
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`Using cached prediction for ${tokenId}`);
      return {
        predictionPercentage: cached.predictionPercentage,
        aiScore: cached.aiScore,
      };
    }

    try {
      // Fetch historical price data for the token
      let priceData: PriceData[] = [];
      
      try {
        const cryptoData = await fetchCryptoData(tokenId, "30d");
        if (cryptoData && cryptoData.length > 0) {
          priceData = cryptoData.map((d: any) => ({
            timestamp: d.timestamp || Date.now(),
            price: d.price || tokenData.current_price,
            volume: d.volume || tokenData.total_volume,
          }));
        }
      } catch (error) {
        console.warn(`Failed to fetch historical data for ${tokenId}, using fallback`);
        // Create fallback price data
        priceData = this.generateFallbackPriceData(tokenData);
      }

      // Generate AI prediction
      const prediction: PredictionResult = await generateAIPrediction(
        priceData,
        tokenId,
        7, // 7 days prediction
        "hybrid", // Use hybrid model for better accuracy
        this.calculateTechnicalIndicators(tokenData),
        [], // Sentiment data (empty for now)
        tokenData
      );

      // Calculate AI Score based on multiple factors
      const aiScore = this.calculateAIScore(prediction, tokenData);
      
      // Get prediction percentage from the result
      const predictionPercentage = this.extractPredictionPercentage(prediction, tokenData);

      // Cache the result
      this.cache[tokenId] = {
        predictionPercentage,
        aiScore,
        timestamp: Date.now(),
      };

      console.log(`Generated prediction for ${tokenId}:`, {
        predictionPercentage,
        aiScore,
      });

      return { predictionPercentage, aiScore };
    } catch (error) {
      console.error(`Failed to generate prediction for ${tokenId}:`, error);
      throw new Error(`Prediction generation failed: ${error.message}`);
    }
  }

  private generateFallbackPriceData(tokenData: CryptoToken): PriceData[] {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const currentPrice = tokenData.current_price || 1;
    const priceChange = tokenData.price_change_percentage_24h || 0;
    
    // Generate 30 days of synthetic price data
    return Array.from({ length: 30 }, (_, i) => {
      const timestamp = now - (29 - i) * oneDay;
      const volatility = Math.random() * 0.1 - 0.05; // ±5% random volatility
      const trendFactor = (priceChange / 100) * (i / 30); // Apply trend over time
      const price = currentPrice * (1 + trendFactor + volatility);
      
      return {
        timestamp,
        price: Math.max(price, 0.000001), // Ensure positive price
        volume: tokenData.total_volume || Math.random() * 1000000,
      };
    });
  }

  private calculateTechnicalIndicators(tokenData: CryptoToken) {
    // Calculate basic technical indicators
    const price = tokenData.current_price || 0;
    const change24h = tokenData.price_change_percentage_24h || 0;
    const change7d = tokenData.price_change_percentage_7d_in_currency || 0;
    const volume = tokenData.total_volume || 0;
    const marketCap = tokenData.market_cap || 0;

    return {
      rsi: this.calculateRSI(change24h, change7d),
      volatility: Math.abs(change24h) / 100,
      volume_ratio: volume / Math.max(marketCap, 1),
      price_trend: change7d > 0 ? "bullish" : change7d < 0 ? "bearish" : "neutral",
    };
  }

  private calculateRSI(change24h: number, change7d: number): number {
    // Simplified RSI calculation based on price changes
    const gains = Math.max(change24h, 0) + Math.max(change7d, 0);
    const losses = Math.abs(Math.min(change24h, 0)) + Math.abs(Math.min(change7d, 0));
    
    if (losses === 0) return 100;
    const rs = gains / losses;
    return 100 - (100 / (1 + rs));
  }

  private calculateAIScore(prediction: PredictionResult, tokenData: CryptoToken): number {
    // Confidence weight (40%)
    const confidenceScore = prediction.accuracy * 40;

    // Technical strength weight (30%)
    const technicalScore = this.getTechnicalScore(tokenData) * 30;

    // Market position weight (20%)
    const marketScore = this.getMarketScore(tokenData) * 20;

    // Volume score weight (10%)
    const volumeScore = this.getVolumeScore(tokenData) * 10;

    const totalScore = confidenceScore + technicalScore + marketScore + volumeScore;
    return Math.min(100, Math.max(0, totalScore));
  }

  private getTechnicalScore(tokenData: CryptoToken): number {
    const change7d = tokenData.price_change_percentage_7d_in_currency || 0;
    const change24h = tokenData.price_change_percentage_24h || 0;
    
    // Positive momentum increases score
    let score = 0.5; // Base score
    
    if (change7d > 0) score += 0.3;
    if (change24h > 0) score += 0.2;
    
    // Penalty for extreme volatility
    if (Math.abs(change24h) > 20) score -= 0.1;
    
    return Math.min(1, Math.max(0, score));
  }

  private getMarketScore(tokenData: CryptoToken): number {
    const rank = tokenData.rank || 999;
    const marketCap = tokenData.market_cap || 0;
    
    // Higher market cap and better rank = higher score
    let score = 0.5;
    
    if (rank <= 10) score += 0.4;
    else if (rank <= 50) score += 0.3;
    else if (rank <= 100) score += 0.2;
    else if (rank <= 500) score += 0.1;
    
    if (marketCap > 10000000000) score += 0.1; // >10B market cap bonus
    
    return Math.min(1, Math.max(0, score));
  }

  private getVolumeScore(tokenData: CryptoToken): number {
    const volume = tokenData.total_volume || 0;
    const marketCap = tokenData.market_cap || 1;
    const volumeRatio = volume / marketCap;
    
    // Healthy volume ratio indicates good liquidity
    if (volumeRatio > 0.1) return 1; // Very high volume
    if (volumeRatio > 0.05) return 0.8; // High volume
    if (volumeRatio > 0.02) return 0.6; // Medium volume
    if (volumeRatio > 0.01) return 0.4; // Low volume
    return 0.2; // Very low volume
  }

  private extractPredictionPercentage(prediction: PredictionResult, tokenData: CryptoToken): number {
    // Extract prediction percentage using ACTUAL current price as baseline
    if (prediction.predictions && prediction.predictions.length > 0) {
      const latestPrediction = prediction.predictions[prediction.predictions.length - 1];
      const actualCurrentPrice = tokenData.current_price || prediction.predictions[0]?.predictedPrice || 1;
      const predictedPrice = latestPrediction.predictedPrice;

      // Prevent division by zero
      const base = actualCurrentPrice > 0 ? actualCurrentPrice : 1;
      return ((predictedPrice - base) / base) * 100;
    }

    // Fallback based on trend
    if (prediction.trend === "bullish") {
      return Math.random() * 15 + 5; // 5-20% positive
    } else if (prediction.trend === "bearish") {
      return -(Math.random() * 15 + 5); // 5-20% negative
    } else {
      return (Math.random() - 0.5) * 10; // ±5% neutral
    }
  }

  clearCache() {
    this.cache = {};
  }

  getCacheSize(): number {
    return Object.keys(this.cache).length;
  }
}

export const individualPredictionService = new IndividualPredictionService();