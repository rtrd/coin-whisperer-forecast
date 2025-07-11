
import { PriceData, PredictionResult, PredictionData, AIPredictionResponse } from '@/types/prediction';
import { linearRegression, calculateRSI, calculateVolatility, calculateMovingAverage } from '@/utils/technicalAnalysis';

// Helper function to generate model-specific factors
const generateModelFactors = (modelType: string, data: {
  aiTrend: string;
  slope: number;
  rsi: number;
  currentPrice: number;
  currentMA: number;
  volatility: number;
  priceChange: number;
}) => {
  const { aiTrend, slope, rsi, currentPrice, currentMA, volatility, priceChange } = data;

  if (modelType === 'technical') {
    return [
      {
        name: 'RSI Momentum',
        weight: 0.35,
        impact: rsi > 70 ? 'negative' : rsi < 30 ? 'positive' : 'neutral' as 'positive' | 'negative' | 'neutral'
      },
      {
        name: 'Moving Average Signal',
        weight: 0.25,
        impact: currentPrice > currentMA ? 'positive' : 'negative' as 'positive' | 'negative' | 'neutral'
      },
      {
        name: 'Price Trend Analysis',
        weight: 0.25,
        impact: slope > 0 ? 'positive' : slope < 0 ? 'negative' : 'neutral' as 'positive' | 'negative' | 'neutral'
      },
      {
        name: 'Volatility Index',
        weight: 0.15,
        impact: volatility > 0.05 ? 'negative' : volatility < 0.02 ? 'positive' : 'neutral' as 'positive' | 'negative' | 'neutral'
      }
    ];
  }

  if (modelType === 'sentiment') {
    return [
      {
        name: 'Social Media Buzz',
        weight: 0.40,
        impact: aiTrend === 'bullish' ? 'positive' : aiTrend === 'bearish' ? 'negative' : 'neutral' as 'positive' | 'negative' | 'neutral'
      },
      {
        name: 'Community Sentiment',
        weight: 0.30,
        impact: priceChange > 2 ? 'positive' : priceChange < -2 ? 'negative' : 'neutral' as 'positive' | 'negative' | 'neutral'
      },
      {
        name: 'News Impact Score',
        weight: 0.20,
        impact: Math.abs(priceChange) > 5 ? 'positive' : 'neutral' as 'positive' | 'negative' | 'neutral'
      },
      {
        name: 'Market Mentions',
        weight: 0.10,
        impact: volatility > 0.03 ? 'positive' : 'neutral' as 'positive' | 'negative' | 'neutral'
      }
    ];
  }

  // Hybrid model - combines both technical and sentiment
  return [
    {
      name: 'Social Sentiment Analysis',
      weight: 0.30,
      impact: aiTrend === 'bullish' ? 'positive' : aiTrend === 'bearish' ? 'negative' : 'neutral' as 'positive' | 'negative' | 'neutral'
    },
    {
      name: 'Technical Indicators',
      weight: 0.25,
      impact: rsi > 70 ? 'negative' : rsi < 30 ? 'positive' : 'neutral' as 'positive' | 'negative' | 'neutral'
    },
    {
      name: 'Price Action Trend',
      weight: 0.25,
      impact: slope > 0 ? 'positive' : slope < 0 ? 'negative' : 'neutral' as 'positive' | 'negative' | 'neutral'
    },
    {
      name: 'Market Psychology',
      weight: 0.20,
      impact: currentPrice > currentMA && priceChange > 0 ? 'positive' : 'negative' as 'positive' | 'negative' | 'neutral'
    }
  ];
};

// Enhanced confidence calculation function
const calculateEnhancedConfidence = (
  data: PriceData[],
  prices: number[],
  rsi: number,
  volatility: number,
  currentPrice: number,
  currentMA: number,
  slope: number,
  aiConfidence: number,
  dayOffset: number
): number => {
  // 1. Data Quality Score (0.1 - 1.0)
  const dataPointsScore = Math.min(Math.log10(prices.length + 1) / 3, 1); // Log scale, max at 1000 points
  
  // Volume consistency (if available)
  const volumes = data.map(d => d.volume).filter(v => v !== undefined) as number[];
  const volumeConsistency = volumes.length > 0 ? 
    1 - (calculateVolatility(volumes) * 0.5) : 0.7; // Default if no volume data
  
  const dataQualityScore = (dataPointsScore * 0.7 + volumeConsistency * 0.3);
  
  // 2. Technical Convergence Score (0.0 - 1.0)
  const rsiSignal = rsi > 70 ? -0.3 : rsi < 30 ? 0.3 : 0; // RSI overbought/oversold
  const maSignal = currentPrice > currentMA ? 0.2 : -0.2; // Price vs MA
  const trendSignal = slope > 0 ? 0.2 : slope < 0 ? -0.2 : 0; // Trend direction
  
  // Check alignment - when signals point in same direction, convergence is higher
  const signalAlignment = Math.abs(rsiSignal + maSignal + trendSignal);
  const technicalConvergence = Math.min(signalAlignment / 0.7, 1);
  
  // 3. Market Stability Score (0.2 - 1.0)
  const volatilityPenalty = Math.min(volatility * 10, 0.8); // High volatility reduces confidence
  const rsiStability = rsi > 20 && rsi < 80 ? 0.2 : 0; // Extreme RSI reduces stability
  const marketStability = Math.max(1 - volatilityPenalty + rsiStability, 0.2);
  
  // 4. Adaptive Time Decay
  const baseDecayRate = 0.08; // Base decay per day
  const volatilityMultiplier = 1 + (volatility * 5); // Higher volatility = faster decay
  const adaptiveDecayRate = baseDecayRate * volatilityMultiplier;
  const timeDecay = Math.exp(-dayOffset * adaptiveDecayRate);
  
  // 5. Combine all factors with weights
  const baseConfidence = aiConfidence || 0.75;
  const enhancedConfidence = baseConfidence * 
    (dataQualityScore * 0.25 + 
     technicalConvergence * 0.30 + 
     marketStability * 0.25 + 
     0.20) * // Base component
    timeDecay;
  
  // Ensure confidence stays within realistic bounds (5% - 98%)
  return Math.max(Math.min(enhancedConfidence, 0.98), 0.05);
};

export const generateAIPrediction = async (
  data: PriceData[],
  crypto: string,
  predictionDays: number,
  modelType: string = 'technical'
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
    const response = await fetch('api/openrouter-proxy', {
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
    
    // Use enhanced confidence calculation
    const confidence = calculateEnhancedConfidence(
      data,
      prices,
      rsi,
      volatility,
      currentPrice,
      currentMA,
      slope,
      aiPrediction.confidence || 0.75,
      i
    );
    
    predictions.push({
      timestamp: data[data.length - 1].timestamp + (i * 24 * 60 * 60 * 1000),
      predictedPrice: Math.max(predictedPrice, 0),
      confidence
    });
  }

  // Generate model-specific factors
  const factors = generateModelFactors(modelType, {
    aiTrend: aiPrediction.trend,
    slope,
    rsi,
    currentPrice,
    currentMA,
    volatility,
    priceChange
  });

  return {
    predictions,
    accuracy: (aiPrediction.confidence || 0.75) * 100,
    trend: aiPrediction.trend as 'bullish' | 'bearish' | 'neutral',
    factors
  };
};


export const fetchSentimentData = async (topic = 'bitcoin') => {
  try {
    const url = `https://lunarcrush.com/api4/public/topic/${encodeURIComponent(topic)}/v1`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_LUNAR_API}`
      }
    });
    const json = await response.json();
    return json;
  } catch (err) {
    console.error('Error fetching LunarCrush data:', err);
    return null;
  }
};


export const fetchTechnicalIndicators = async (
  topic = "bitcoin"
) => {
  try {
    const res = await fetch(
      `https://lunarcrush.com/api4/public/coins/${topic}/time-series/v2`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_LUNAR_API}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} – ensure your token and permissions`);
    }
    const json = await res.json();
    const prices: number[] = json.data
    .map((d: any) => d.close)
    .filter((val: number | undefined) => typeof val === "number");
  
      // const currentPrice = prices.at(-1)!;
      // const rsi = calculateRSI(prices);
      return json.data;
   

    
  } catch (err) {
    console.error("Failed to fetch indicators from LunarCrush:", err);
    return [];
  }
};













