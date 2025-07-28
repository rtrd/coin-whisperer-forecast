import {
  PriceData,
  PredictionResult,
  PredictionData,
  AIPredictionResponse,
} from "@/types/prediction";
import {
  linearRegression,
  calculateRSI,
  calculateVolatility,
  calculateMovingAverage,
} from "@/utils/technicalAnalysis";
import {
  getPredictionCache,
  setPredictionCache,
  PredictionType,
} from "@/services/predictionCache";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const generateTechnicalPrompt = (
  crypto: string,
  predictionDays: number,
  currentPrice: number,
  rsi: number,
  volatility: number,
  priceChange: number,
  slope: number,
  currentMA: number,
  supportLevel?: number,
  resistanceLevel?: number,
  volumes?: number
): string => {
  return `You are a financial AI model focused on technical analysis.

Based on the following technical indicators for ${crypto}, predict the price trend over the next ${predictionDays} days:

- Current Price: $${currentPrice.toFixed(2)}
- RSI (Relative Strength Index): ${rsi.toFixed(2)}
- 20-day Moving Average: ${currentMA.toFixed(2)}
- Price Change (past ${predictionDays} days): ${priceChange.toFixed(2)}%
- Trend Slope: ${slope.toFixed(4)}
- Volatility Index: ${volatility.toFixed(2)}
 - Volumes: ${Array.isArray(volumes) ? volumes.join(", ") : "N/A"}

${supportLevel ? `- Support Level: $${supportLevel.toFixed(2)}` : ""}
${resistanceLevel ? `- Resistance Level: $${resistanceLevel.toFixed(2)}` : ""}

Instructions:
1. Predict the overall price trend (bullish, bearish, or neutral)
2. Estimate the confidence (a value between 0 and 1)
3. Estimate the expected percentage price change over ${predictionDays} days

Return only:
- Predicted Trend:
- Confidence:
- Expected Change (%):`;
};
const generateSentimentPrompt = (
  crypto: string,
  predictionDays: number,
  currentPrice: number,
  sentimentScore: number,
  twitterMentions: number,
  redditActivity: number,
  newsSentiment: number,
  engagement: number,
  fearGreedIndex: number
): string => {
  return `You are a sentiment analysis AI model.

Based on the following social sentiment data for ${crypto}, predict the price trend over the next ${predictionDays} days:

- Current Price: $${currentPrice.toFixed(2)}
- Social Sentiment Score: ${sentimentScore}
- Twitter Mentions: ${twitterMentions}
- Reddit Activity: ${redditActivity}
- News Sentiment: ${newsSentiment}
- Community Engagement: ${engagement}
- Fear-Greed Index: ${fearGreedIndex}

Instructions:
1. Predict the overall trend (bullish, bearish, or neutral)
2. Provide a confidence score (0 to 1)
3. Estimate expected price change (%)

Return only:
- Predicted Trend:
- Confidence:
- Expected Change (%):`;
};

const generateHybridPrompt = (
  crypto: string,
  predictionDays: number,
  currentPrice: number,
  rsi: number,
  volatility: number,
  priceChange: number,
  slope: number,
  currentMA: number,
  sentimentScore: number,
  engagement: number,
  fearGreedIndex: number
): string => {
  return `You are an AI model that combines both technical and social sentiment data.

Based on the following data for ${crypto}, predict its price trend over the next ${predictionDays} days:

📉 Technical:
- Current Price: $${currentPrice.toFixed(2)}
- RSI: ${rsi.toFixed(2)}
- 20-day MA: ${currentMA.toFixed(2)}
- Price Change (%): ${priceChange.toFixed(2)}
- Volatility Index: ${volatility.toFixed(2)}
- Trend Slope: ${slope.toFixed(4)}

📢 Sentiment:
- Sentiment Score: ${sentimentScore}
- Community Engagement: ${engagement}
- Fear-Greed Index: ${fearGreedIndex}

Instructions:
1. Predict trend (bullish, bearish, neutral)
2. Confidence score (0 to 1)
3. Expected change (%)

Return only:
- Predicted Trend:
- Confidence:
- Expected Change (%):`;
};

export const generateTechnicalPrediction = async (
  technicalIndicator,
  predictionDays,
  crypto
): Promise<PredictionResult> => {
  const type: PredictionType = "technical";

  // Validate input data
  if (!technicalIndicator || !Array.isArray(technicalIndicator) || technicalIndicator.length === 0) {
    throw new Error("Invalid or missing technical indicator data");
  }

  // ✅ 1. Check cache first
  const cached = getPredictionCache<PredictionResult>(
    type,
    crypto,
    predictionDays
  );
  if (cached) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return cached;
  }

  // 🧠 2. Calculate inputs for prompt generation
  const validData = technicalIndicator.filter(d => d && typeof d.price === 'number' && !isNaN(d.price));
  if (validData.length === 0) {
    throw new Error("No valid price data found in technical indicators");
  }
  
  const prices = validData.slice(-predictionDays).map((d) => d.price);
  const volumes = validData
    .slice(-predictionDays)
    .map((d) => d.volume || 0);
  const currentPrice = prices[prices.length - 1];
  const avgVolume = volumes.reduce((sum, v) => sum + v, 0) / volumes.length;

  const rsi = calculateRSI(prices);
  const volatility = calculateVolatility(prices);
  const ma20 = calculateMovingAverage(prices, Math.min(20, prices.length - 1));
  const currentMA = ma20[ma20.length - 1] || currentPrice;
  const supportLevel = Math.min(...prices);
  const resistanceLevel = Math.max(...prices);
  const priceChange =
    prices.length > 1 ? ((currentPrice - prices[0]) / prices[0]) * 100 : 0;

  const { slope } = linearRegression(
    technicalIndicator.map((d, index) => ({ x: index, y: d.price }))
  );

  const Prompt = generateTechnicalPrompt(
    crypto,
    predictionDays,
    currentPrice,
    rsi,
    volatility,
    priceChange,
    slope,
    currentMA,
    supportLevel,
    resistanceLevel,
    avgVolume
  );

  try {
    const response = await fetch(`/api/openrouter-proxy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are a cryptocurrency analyst. Provide predictions in the exact format requested."
          },
          {
            role: "user", 
            content: Prompt
          }
        ],
        model: "openai/gpt-4o-mini",
        max_tokens: 200,
        temperature: 0.7
      }),
    });

    if (!response.ok) throw new Error(`AI API error: ${response.status}`);

    const result = await response.json();
    const text = result?.choices?.[0]?.message?.content || "";

    const trendMatch = text.match(/trend:\s*(bullish|bearish|neutral)/i);
    const confidenceMatch = text.match(/confidence:\s*(\d+(\.\d+)?)/i);
    const changeMatch = text.match(/change\s*\(%\):\s*(-?\d+(\.\d+)?)/i);

    const trend =
      (trendMatch?.[1]?.toLowerCase() as "bullish" | "bearish" | "neutral") ||
      "neutral";
    const confidence = parseFloat(confidenceMatch?.[1]) || 0.75;

    const baseTimestamp = new Date(
      Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate() + 1
      )
    ).getTime();

    const predictions: PredictionData[] = technicalIndicator
      .slice(-predictionDays)
      .map((item, index) => ({
        timestamp: baseTimestamp + index * 24 * 60 * 60 * 1000,
        predictedPrice: item.price,
        confidence: confidence,
      }));

    const factors = [
      {
        name: "Technical Indicators",
        weight: 70,
        impact:
          rsi > 70 || slope < 0
            ? "negative"
            : rsi < 30 || slope > 0
            ? "positive"
            : "neutral",
      },
      {
        name: "Price Trend",
        weight: 20,
        impact:
          priceChange > 5
            ? "positive"
            : priceChange < -5
            ? "negative"
            : "neutral",
      },
      {
        name: "Volume Analysis",
        weight: 10,
        impact: "neutral",
      },
    ] as {
      name: string;
      weight: number;
      impact: "positive" | "negative" | "neutral";
    }[];

    const finalResult: PredictionResult = {
      predictions,
      accuracy: confidence,
      trend,
      factors,
    };

    // ✅ 3. Save result to cache
    setPredictionCache(type, crypto, predictionDays, finalResult);

    return finalResult;
  } catch (error) {
    console.error("Gemini Technical Prediction API error:", error);

    return {
      predictions: technicalIndicator.slice(-predictionDays).map((item) => ({
        timestamp: item.timestamp || item.date || "",
        predictedPrice: item.close,
        confidence: 0.75,
      })),
      accuracy: 0.75,
      trend:
        priceChange > 5 ? "bullish" : priceChange < -5 ? "bearish" : "neutral",
      factors: [
        {
          name: "Fallback Weighted Factors",
          weight: 100,
          impact: "neutral",
        },
      ],
    };
  }
};

export const generateSentimentPrediction = async (
  sentimentData,
  predictionDays,
  crypto,
  currentPrice
): Promise<PredictionResult> => {
  const type: PredictionType = "sentiment";

  // ✅ 1. Check cache first
  const cached = getPredictionCache<PredictionResult>(
    type,
    crypto,
    predictionDays
  );
  if (cached) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return cached;
  }

  // 🧠 2. Extract sentiment values
  const {
    sentimentScore = 0.5,
    twitterMentions = 0,
    redditActivity = 0,
    newsSentiment = 0.5,
    engagement = 0,
    fearGreedIndex = 50,
  } = sentimentData || {};

  const Prompt = generateSentimentPrompt(
    crypto,
    predictionDays,
    currentPrice,
    sentimentScore,
    twitterMentions,
    redditActivity,
    newsSentiment,
    engagement,
    fearGreedIndex
  );

  try {
    const response = await fetch(`${SERVER_URL}/get-ai-predction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Prompt }),
    });

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

    const result = await response.json();
    const text = result?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const trendMatch = text.match(
      /Predicted Trend:\s*(bullish|bearish|neutral)/i
    );
    const accuracyMatch = text.match(/Confidence:\s*(\d+(\.\d+)?)/i);
    const changeMatch = text.match(
      /Expected Change\s*\(%\):\s*([+-]?\d+(\.\d+)?)/i
    );
    const factorMatches = [
      ...text.matchAll(
        /factor:\s*(.+?)\s+weight:\s*([\d.]+)\s+impact:\s*(positive|negative|neutral)/gi
      ),
    ];

    const trend =
      (trendMatch?.[1]?.toLowerCase() as "bullish" | "bearish" | "neutral") ??
      "neutral";
    const accuracy = accuracyMatch ? parseFloat(accuracyMatch[1]) : 0.75;
    const predictedChange = changeMatch ? parseFloat(changeMatch[1]) : 0;

    const dailyGrowthRate =
      Math.pow(1 + predictedChange / 100, 1 / predictionDays) - 1;

    const baseTimestamp = new Date(
      Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate() + 1
      )
    ).getTime();

    const predictions: PredictionData[] = Array.from(
      { length: predictionDays },
      (_, i) => {
        const timestamp = baseTimestamp + i * 24 * 60 * 60 * 1000;
        const predictedPrice = currentPrice * Math.pow(1 + dailyGrowthRate, i);
        return {
          timestamp,
          predictedPrice: parseFloat(predictedPrice.toFixed(2)),
          confidence: accuracy,
        };
      }
    );

    const factors: {
      name: string;
      weight: number;
      impact: "positive" | "negative" | "neutral";
    }[] =
      factorMatches.length > 0
        ? factorMatches.map((match) => ({
            name: match[1].trim(),
            weight: parseFloat(match[2]),
            impact: match[4].toLowerCase() as
              | "positive"
              | "negative"
              | "neutral",
          }))
        : [
            {
              name: "Social Sentiment Score",
              weight: 60,
              impact:
                sentimentScore > 0.6
                  ? "positive"
                  : sentimentScore < 0.4
                  ? "negative"
                  : "neutral",
            },
            {
              name: "News Sentiment",
              weight: 25,
              impact:
                newsSentiment > 0.6
                  ? "positive"
                  : newsSentiment < 0.4
                  ? "negative"
                  : "neutral",
            },
            {
              name: "Community Engagement",
              weight: 15,
              impact:
                engagement > 50
                  ? "positive"
                  : engagement < 10
                  ? "negative"
                  : "neutral",
            },
          ];

    const finalResult: PredictionResult = {
      predictions,
      accuracy,
      trend,
      factors,
    };

    // ✅ 3. Save to cache
    setPredictionCache(type, crypto, predictionDays, finalResult);

    return finalResult;
  } catch (error) {
    console.error("Gemini Sentiment Prediction API error:", error);

    return {
      predictions: Array.from({ length: predictionDays }, (_, i) => ({
        timestamp: Date.now() + i * 24 * 60 * 60 * 1000,
        predictedPrice: currentPrice,
        confidence: 0.7,
      })),
      accuracy: 0.7,
      trend: "neutral",
      factors: [
        {
          name: "Fallback Sentiment Score",
          weight: sentimentScore * 100,
          impact:
            sentimentScore > 0.6
              ? "positive"
              : sentimentScore < 0.4
              ? "negative"
              : "neutral",
        },
      ],
    };
  }
};

export const generateHybridPrediction = async (
  technicalIndicator,
  sentimentData,
  predictionDays,
  crypto
): Promise<PredictionResult> => {
  debugger;
  const type: PredictionType = "sentiment";

  // ✅ 1. Check cache first
  const cached = getPredictionCache<PredictionResult>(
    type,
    crypto,
    predictionDays
  );
  if (cached) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return cached;
  }
  const prices = technicalIndicator.slice(-predictionDays).map((d) => d.price);
  const currentPrice = prices[prices.length - 1];
  const rsi = calculateRSI(prices);
  const volatility = calculateVolatility(prices);
  const ma20 = calculateMovingAverage(prices, Math.min(20, prices.length - 1));
  const currentMA = ma20[ma20.length - 1] || currentPrice;
  const priceChange =
    prices.length > 1 ? ((currentPrice - prices[0]) / prices[0]) * 100 : 0;
  const { slope } = linearRegression(
    technicalIndicator.map((d, index) => ({ x: index, y: d.price }))
  );

  const {
    sentimentScore = 0.5,
    engagement = 0,
    fearGreedIndex = 50,
  } = sentimentData || {};

  const Prompt = generateHybridPrompt(
    crypto,
    predictionDays,
    currentPrice,
    rsi,
    volatility,
    priceChange,
    slope,
    currentMA,
    sentimentScore,
    engagement,
    fearGreedIndex
  );

  try {
    debugger;
    const response = await fetch(`${SERVER_URL}/get-ai-predction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Prompt,
      }),
    });

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
    const result = await response.json();
    const text = result?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const trendMatch = text.match(
      /Predicted Trend:\s*(bullish|bearish|neutral)/i
    );
    const accuracyMatch = text.match(/Confidence:\s*(\d+(\.\d+)?)/i);
    const changeMatch = text.match(
      /Expected Change\s*\(%\):\s*([+-]?\d+(\.\d+)?)/i
    );
    const factorMatches = [
      ...text.matchAll(
        /factor:\s*(.+?)\s+weight:\s*([\d.]+)\s+impact:\s*(positive|negative|neutral)/gi
      ),
    ];
    const baseTimestamp = new Date(
      Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate() + 1 // start from tomorrow, at midnight UTC
      )
    ).getTime();

    const predictions: PredictionData[] = Array.from({
      length: predictionDays,
    }).map((_, index) => ({
      timestamp: baseTimestamp + index * 24 * 60 * 60 * 1000, // add 1 day per step
      predictedPrice: currentPrice,
      confidence: parseFloat(accuracyMatch?.[1]) || 0.75,
    }));

    const factors: {
      name: string;
      weight: number;
      impact: "positive" | "negative" | "neutral";
    }[] =
      factorMatches.length > 0
        ? factorMatches.map((match) => ({
            name: match[1].trim(),
            weight: parseFloat(match[2]),
            impact: match[4].toLowerCase() as
              | "positive"
              | "negative"
              | "neutral",
          }))
        : [
            {
              name: "Sentiment Score",
              weight: 35, // Hybrid model: Sentiment
              impact: (sentimentScore > 0.6
                ? "positive"
                : sentimentScore < 0.4
                ? "negative"
                : "neutral") as "positive" | "negative" | "neutral",
            },
            {
              name: "Fear-Greed Index",
              weight: 15, // Hybrid model: Market momentum
              impact: (fearGreedIndex > 60
                ? "positive"
                : fearGreedIndex < 40
                ? "negative"
                : "neutral") as "positive" | "negative" | "neutral",
            },
            {
              name: "Price Change",
              weight: 25, // Technical trend relevance
              impact: (priceChange > 0
                ? "positive"
                : priceChange < 0
                ? "negative"
                : "neutral") as "positive" | "negative" | "neutral",
            },
            {
              name: "Volatility",
              weight: 10, // Neutral weight
              impact: "neutral",
            },
            {
              name: "RSI",
              weight: 15, // RSI contribution in technical analysis
              impact: (rsi > 70
                ? "negative"
                : rsi < 30
                ? "positive"
                : "neutral") as "positive" | "negative" | "neutral",
            },
          ];

    const finalResult: PredictionResult = {
      predictions,
      accuracy: parseFloat(accuracyMatch?.[1]) || 0.75,
      trend:
        (trendMatch?.[1]?.toLowerCase() as "bullish" | "bearish" | "neutral") ||
        "neutral",
      factors,
    };

    // ✅ Save to cache
    setPredictionCache(type, crypto, predictionDays, finalResult);

    return finalResult;
  } catch (error) {
    console.error("Gemini Hybrid Prediction API error:", error);

    return {
      predictions: [
        {
          timestamp: Date.now(),
          predictedPrice: currentPrice,
          confidence: 0.7,
        },
      ],
      accuracy: 0.7,
      trend: "neutral",
      factors: [
        {
          name: "Fallback Sentiment Score",
          weight: sentimentScore * 100,
          impact: (sentimentScore > 0.6
            ? "positive"
            : sentimentScore < 0.4
            ? "negative"
            : "neutral") as "positive" | "negative" | "neutral",
        },
        {
          name: "Fallback Price Trend",
          weight: Math.abs(priceChange),
          impact: (priceChange > 0
            ? "positive"
            : priceChange < 0
            ? "negative"
            : "neutral") as "positive" | "negative" | "neutral",
        },
      ],
    };
  }
};

export const generateAIPrediction = async (
  data: PriceData[],
  crypto: string,
  predictionDays: number,
  modelType: string = "technical",
  technicalIndicator?: any,
  sentimentData?: any,
  Alltokenmarketstats?: any
): Promise<PredictionResult> => {
  debugger;
  let aiPrediction: PredictionResult;

  if (modelType === "technical" && technicalIndicator.length > 0) {
    aiPrediction = await generateTechnicalPrediction(
      technicalIndicator,
      predictionDays,
      crypto
    );
  } else if (modelType === "sentiment" && sentimentData.sources.length > 0) {
    const currentPrice = data[data.length - 1]?.price;
    aiPrediction = await generateSentimentPrediction(
      sentimentData,
      predictionDays,
      crypto,
      currentPrice
    );
  } else if (
    modelType === "hybrid" &&
    technicalIndicator.length > 0 &&
    sentimentData.sources.length > 0
  ) {
    aiPrediction = await generateHybridPrediction(
      technicalIndicator,
      sentimentData,
      predictionDays,
      crypto
    );
  } else {
    // Default fallback if modelType is not recognized
    aiPrediction = {
      predictions: [
        {
          timestamp: Date.now(),
          predictedPrice: data[data.length - 1]?.price || 0,
          confidence: 0.7,
        },
      ],
      accuracy: 0.7,
      trend: "neutral",
      factors: [
        {
          name: "Default",
          weight: 0,
          impact: "neutral",
        },
      ],
    };
  }
  return aiPrediction;
};

function mapTrend(trend: string): "positive" | "negative" | "neutral" {
  if (trend === "bullish") return "positive";
  if (trend === "bearish") return "negative";
  return "neutral";
}

export const fetchSentimentData = async (topic = "bitcoin") => {
  try {
    console.log(`Fetching sentiment data for topic: ${topic}`);
    console.log(
      `Using API key: ${import.meta.env.VITE_LUNAR_API ? "Present" : "Missing"}`
    );

    const url = `https://lunarcrush.com/api4/public/topic/${encodeURIComponent(
      topic
    )}/v1`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_LUNAR_API}`,
      },
    });

    console.log(`API Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error ${response.status}:`, errorText);
      throw new Error(
        `LunarCrush API error: ${response.status} - ${errorText}`
      );
    }

    const json = await response.json();
    console.log("Raw LunarCrush API response:", json);

    return json;
  } catch (err) {
    console.error("Error fetching LunarCrush sentiment data:", err);

    // Return fallback data structure
    return {
      data: {
        sentiment: Math.random() * 100,
        types_sentiment: {
          tweet: Math.random() * 100,
          "reddit-post": Math.random() * 100,
          news: Math.random() * 100,
          "youtube-video": Math.random() * 100,
        },
        types_interactions: {
          tweet: Math.floor(Math.random() * 10000) + 1000,
          "reddit-post": Math.floor(Math.random() * 5000) + 500,
          news: Math.floor(Math.random() * 1000) + 100,
          "youtube-video": Math.floor(Math.random() * 2000) + 200,
        },
      },
    };
  }
};

export const fetchTechnicalIndicators = async (
  topic = "bitcoin",
  timeframe = "3m"
) => {
  try {
    const res = await fetch(
      `https://lunarcrush.com/api4/public/coins/${topic}/time-series/v2?bucket=day&interval=${timeframe}`,
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
    const data: PriceData[] = [];
    data.push(
      ...json.data.map((item: any) => ({
        timestamp: item.time,
        price: item.close,
        volume: item.volume_24h,
      }))
    );
    const prices: number[] = json.data
      .map((d: any) => d.close)
      .filter((val: number | undefined) => typeof val === "number");

    // const currentPrice = prices.at(-1)!;
    // const rsi = calculateRSI(prices);
    return data;
  } catch (err) {
    console.error("Failed to fetch indicators from LunarCrush:", err);
    return [];
  }
};
