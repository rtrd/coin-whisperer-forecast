
import { useState } from 'react';
import { toast } from 'sonner';

interface PriceData {
  timestamp: number;
  price: number;
  volume?: number;
}

interface PredictionData {
  timestamp: number;
  predictedPrice: number;
  confidence: number;
}

interface PredictionResult {
  predictions: PredictionData[];
  accuracy: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  factors: {
    name: string;
    weight: number;
    impact: 'positive' | 'negative' | 'neutral';
  }[];
}

// Simple linear regression for trend prediction
const linearRegression = (data: { x: number; y: number }[]) => {
  const n = data.length;
  const sumX = data.reduce((sum, point) => sum + point.x, 0);
  const sumY = data.reduce((sum, point) => sum + point.y, 0);
  const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
  const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return { slope, intercept };
};

// Moving average calculation
const calculateMovingAverage = (prices: number[], period: number): number[] => {
  const ma: number[] = [];
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    ma.push(sum / period);
  }
  return ma;
};

// RSI calculation
const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length < period + 1) return 50;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgGain / avgLoss;
  
  return 100 - (100 / (1 + rs));
};

// Volatility calculation
const calculateVolatility = (prices: number[]): number => {
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
  
  return Math.sqrt(variance);
};

export const usePrediction = () => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generatePrediction = async (
    data: PriceData[],
    crypto: string,
    predictionDays: number
  ): Promise<void> => {
    setIsLoading(true);
    
    try {
      console.log('Generating prediction for', crypto, 'with', predictionDays, 'days');
      
      // Simulate ML processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const prices = data.map(d => d.price);
      const currentPrice = prices[prices.length - 1];
      
      // Technical analysis
      const rsi = calculateRSI(prices);
      const volatility = calculateVolatility(prices);
      const ma20 = calculateMovingAverage(prices, Math.min(20, prices.length - 1));
      const currentMA = ma20[ma20.length - 1] || currentPrice;
      
      // Prepare data for linear regression
      const regressionData = data.map((d, index) => ({
        x: index,
        y: d.price
      }));
      
      const { slope, intercept } = linearRegression(regressionData);
      
      // Generate predictions
      const predictions: PredictionData[] = [];
      const lastIndex = data.length - 1;
      
      for (let i = 1; i <= predictionDays; i++) {
        const futureIndex = lastIndex + i;
        const trendPrice = slope * futureIndex + intercept;
        
        // Add some randomness and apply technical factors
        const trendWeight = 0.4;
        const maWeight = 0.3;
        const rsiWeight = 0.2;
        const volatilityWeight = 0.1;
        
        // RSI influence (overbought/oversold)
        const rsiInfluence = rsi > 70 ? -0.02 : rsi < 30 ? 0.02 : 0;
        
        // MA influence
        const maInfluence = (currentMA - currentPrice) / currentPrice * 0.5;
        
        // Volatility influence (higher volatility = less certainty)
        const volatilityInfluence = (Math.random() - 0.5) * volatility * 2;
        
        const predictedPrice = trendPrice * 
          (1 + rsiInfluence * rsiWeight) *
          (1 + maInfluence * maWeight) *
          (1 + volatilityInfluence * volatilityWeight);
        
        // Confidence decreases with time and increases with data quality
        const baseConfidence = 0.85;
        const timeDecay = Math.exp(-i * 0.1);
        const dataQuality = Math.min(data.length / 100, 1);
        const confidence = baseConfidence * timeDecay * (0.5 + dataQuality * 0.5);
        
        predictions.push({
          timestamp: data[data.length - 1].timestamp + (i * 24 * 60 * 60 * 1000),
          predictedPrice: Math.max(predictedPrice, 0),
          confidence: Math.max(Math.min(confidence, 1), 0.1)
        });
      }
      
      // Determine overall trend
      const firstPrediction = predictions[0].predictedPrice;
      const lastPrediction = predictions[predictions.length - 1].predictedPrice;
      const priceChange = (lastPrediction - currentPrice) / currentPrice;
      
      const trend: 'bullish' | 'bearish' | 'neutral' = priceChange > 0.05 ? 'bullish' : 
                   priceChange < -0.05 ? 'bearish' : 'neutral';
      
      // Generate prediction factors with proper typing
      const factors: { name: string; weight: number; impact: 'positive' | 'negative' | 'neutral' }[] = [
        {
          name: 'Technical Trend',
          weight: 0.3,
          impact: slope > 0 ? 'positive' : slope < 0 ? 'negative' : 'neutral'
        },
        {
          name: 'RSI Signal',
          weight: 0.2,
          impact: rsi > 70 ? 'negative' : rsi < 30 ? 'positive' : 'neutral'
        },
        {
          name: 'Moving Average',
          weight: 0.25,
          impact: currentPrice > currentMA ? 'positive' : currentPrice < currentMA ? 'negative' : 'neutral'
        },
        {
          name: 'Market Volatility',
          weight: 0.15,
          impact: volatility > 0.05 ? 'negative' : 'positive'
        },
        {
          name: 'Volume Pattern',
          weight: 0.1,
          impact: Math.random() > 0.5 ? 'positive' : 'negative'
        }
      ];
      
      // Calculate model accuracy (simulated)
      const accuracy = 0.7 + Math.random() * 0.25; // 70-95% accuracy
      
      const result: PredictionResult = {
        predictions,
        accuracy,
        trend,
        factors
      };
      
      setPrediction(result);
      console.log('Prediction generated:', result);
      
    } catch (error) {
      console.error('Prediction generation failed:', error);
      toast.error('Failed to generate prediction');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    prediction,
    isLoading,
    generatePrediction
  };
};
