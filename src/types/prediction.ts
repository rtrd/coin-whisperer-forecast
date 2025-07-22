export interface PriceData {
  [x: string]: any;
  timestamp: number;
  price: number;
  volume?: number;
}

export interface PredictionData {
  timestamp: number;
  predictedPrice: number;
  confidence: number;
}

export interface PredictionResult {
  predictions: PredictionData[];
  accuracy: number;
  trend: "bullish" | "bearish" | "neutral";
  factors: {
    name: string;
    weight: number;
    impact: "positive" | "negative" | "neutral";
  }[];
}

export interface AIPredictionResponse {
  trend: "bullish" | "bearish" | "neutral";
  prediction_percentage: number;
  confidence: number;
}
