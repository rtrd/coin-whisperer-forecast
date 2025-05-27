
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, Brain } from "lucide-react";

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

interface PredictionCardProps {
  prediction: PredictionResult;
  crypto: string;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, crypto }) => {
  const latestPrediction = prediction.predictions[prediction.predictions.length - 1];
  const firstPrediction = prediction.predictions[0];
  const priceChange = latestPrediction.predictedPrice - firstPrediction.predictedPrice;
  const priceChangePercent = (priceChange / firstPrediction.predictedPrice) * 100;

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish': return 'text-green-400 border-green-400';
      case 'bearish': return 'text-red-400 border-red-400';
      default: return 'text-yellow-400 border-yellow-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="h-4 w-4" />;
      case 'bearish': return <TrendingDown className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-400" />
          AI Prediction Results
        </CardTitle>
        <CardDescription className="text-gray-300">
          Machine learning analysis for {crypto.toUpperCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Prediction */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Predicted Price</p>
            <p className="text-2xl font-bold text-white">
              ${latestPrediction.predictedPrice.toFixed(2)}
            </p>
            <div className="flex items-center gap-2">
              {priceChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span className={`text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Confidence Level</p>
            <p className="text-2xl font-bold text-white">
              {(latestPrediction.confidence * 100).toFixed(1)}%
            </p>
            <Progress 
              value={latestPrediction.confidence * 100} 
              className="h-2"
            />
          </div>
        </div>

        {/* Market Trend */}
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Market Trend</p>
          <Badge variant="outline" className={getTrendColor(prediction.trend)}>
            {getTrendIcon(prediction.trend)}
            <span className="ml-1 capitalize">{prediction.trend}</span>
          </Badge>
        </div>

        {/* Key Factors */}
        <div className="space-y-3">
          <p className="text-sm text-gray-400">Key Prediction Factors</p>
          <div className="space-y-2">
            {prediction.factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{factor.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{(factor.weight * 100).toFixed(0)}%</span>
                  <div className={`w-2 h-2 rounded-full ${
                    factor.impact === 'positive' ? 'bg-green-400' :
                    factor.impact === 'negative' ? 'bg-red-400' : 'bg-yellow-400'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Accuracy */}
        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Model Accuracy</span>
            <span className="text-sm font-medium text-green-400">
              {(prediction.accuracy * 100).toFixed(1)}%
            </span>
          </div>
          <Progress value={prediction.accuracy * 100} className="h-2 mt-2" />
        </div>
      </CardContent>
    </Card>
  );
};
