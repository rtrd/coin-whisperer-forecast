
import { PriceData, PredictionResult, PredictionData, AIPredictionResponse } from '@/types/prediction';
import { linearRegression, calculateRSI, calculateVolatility, calculateMovingAverage } from '@/utils/technicalAnalysis';

export const generateAIPrediction = async (
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
  
  let aiPrediction: AIPredictionResponse;
  
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

    aiPrediction = await response.json();
    console.log('AI Prediction received:', aiPrediction);

  } catch (error) {
    console.error('Secure proxy API error:', error);
    // Use fallback prediction
    aiPrediction = {
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
