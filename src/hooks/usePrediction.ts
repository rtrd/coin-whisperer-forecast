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

const OPENROUTER_API_KEY = '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';

// Technical analysis functions
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

const calculateMovingAverage = (prices: number[], period: number): number[] => {
  const ma: number[] = [];
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    ma.push(sum / period);
  }
  return ma;
};

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

const calculateVolatility = (prices: number[]): number => {
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
  
  return Math.sqrt(variance);
};

const generateAIPrediction = async (
  data: PriceData[],
  crypto: string,
  predictionDays: number
): Promise<PredictionResult> => {
  const prices = data.map(d => d.price);
  const currentPrice = prices[prices.length - 1];
  
  // Prepare market analysis data
  const rsi = calculateRSI(prices);
  const volatility = calculateVolatility(prices);
  const ma20 = calculateMovingAverage(prices, Math.min(20, prices.length - 1));
  const currentMA = ma20[ma20.length - 1] || currentPrice;
  
  const priceChange = prices.length > 1 ? 
    ((currentPrice - prices[0]) / prices[0]) * 100 : 0;
  
  try {
    // Use Supabase Edge Function instead of direct API call
    const response = await fetch('/api/openrouter-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        crypto,
        currentPrice,
        rsi,
        volatility,
        priceChange,
        predictionDays
      }),
    });

    if (!response.ok) {
      throw new Error(`Proxy API error: ${response.status}`);
    }

    const aiPrediction = await response.json();
    console.log('AI Prediction received:', aiPrediction);

  } catch (error) {
    console.error('Secure proxy API error:', error);
    // Use fallback prediction
    var aiPrediction = {
      trend: priceChange > 5 ? 'bullish' : priceChange < -5 ? 'bearish' : 'neutral',
      prediction_percentage: priceChange * 0.5,
      confidence: 0.75
    };
  }

  // Generate predictions based on AI analysis and technical indicators
  const predictions: PredictionData[] = [];
  const regressionData = data.map((d, index) => ({ x: index, y: d.price }));
  const { slope } = linearRegression(regressionData);
  
  for (let i = 1; i <= predictionDays; i++) {
    const trendInfluence = (aiPrediction.prediction_percentage / 100) / predictionDays;
    const technicalInfluence = (slope / currentPrice) * 0.1;
    const rsiInfluence = rsi > 70 ? -0.01 : rsi < 30 ? 0.01 : 0;
    
    const dailyChange = trendInfluence + technicalInfluence + rsiInfluence;
    const predictedPrice = currentPrice * Math.pow(1 + dailyChange, i);
    
    const baseConfidence = aiPrediction.confidence || 0.75;
    const timeDecay = Math.exp(-i * 0.1);
    const confidence = baseConfidence * timeDecay;
    
    predictions.push({
      timestamp: data[data.length - 1].timestamp + (i * 24 * 60 * 60 * 1000),
      predictedPrice: Math.max(predictedPrice, 0),
      confidence: Math.max(Math.min(confidence, 1), 0.1)
    });
  }

  const factors = [
    {
      name: 'AI Market Analysis',
      weight: 0.4,
      impact: aiPrediction.trend === 'bullish' ? 'positive' : 
              aiPrediction.trend === 'bearish' ? 'negative' : 'neutral' as 'positive' | 'negative' | 'neutral'
    },
    {
      name: 'Technical Trend',
      weight: 0.25,
      impact: slope > 0 ? 'positive' : slope < 0 ? 'negative' : 'neutral' as 'positive' | 'negative' | 'neutral'
    },
    {
      name: 'RSI Signal',
      weight: 0.2,
      impact: rsi > 70 ? 'negative' : rsi < 30 ? 'positive' : 'neutral' as 'positive' | 'negative' | 'neutral'
    },
    {
      name: 'Moving Average',
      weight: 0.15,
      impact: currentPrice > currentMA ? 'positive' : 'negative' as 'positive' | 'negative' | 'neutral'
    }
  ];

  return {
    predictions,
    accuracy: (aiPrediction.confidence || 0.75) * 100,
    trend: aiPrediction.trend as 'bullish' | 'bearish' | 'neutral',
    factors
  };
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
      console.log('Generating AI prediction for', crypto, 'with', predictionDays, 'days');
      
      const result = await generateAIPrediction(data, crypto, predictionDays);
      setPrediction(result);
      console.log('AI Prediction generated:', result);
      
    } catch (error) {
      console.error('Prediction generation failed:', error);
      toast.error('Failed to generate AI prediction');
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
