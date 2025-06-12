
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
      case 'bullish': return 'text-green-400 border-green-400 bg-green-500/10';
      case 'bearish': return 'text-red-400 border-red-400 bg-red-500/10';
      default: return 'text-yellow-400 border-yellow-400 bg-yellow-500/10';
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
    <Card className="bg-gray-800/50 border-gray-600/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-purple-400" />
          AI Prediction Results
        </CardTitle>
        <CardDescription className="text-gray-400">
          Analysis for {crypto.toUpperCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Prediction */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
            <p className="text-sm text-gray-400 mb-1">Predicted Price</p>
            <p className="text-2xl font-bold text-white">
              ${latestPrediction.predictedPrice.toFixed(2)}
            </p>
            <div className={`flex items-center gap-1 text-sm ${
              priceChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {priceChange >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
            </div>
          </div>
          
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
            <p className="text-sm text-gray-400 mb-1">Confidence</p>
            <p className="text-2xl font-bold text-white">
              {(latestPrediction.confidence * 100).toFixed(1)}%
            </p>
            <Progress 
              value={latestPrediction.confidence * 100} 
              className="h-2 mt-2"
            />
          </div>
        </div>

        {/* Market Trend */}
        <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
          <span className="text-sm text-gray-400">Market Trend</span>
          <Badge variant="outline" className={`${getTrendColor(prediction.trend)} text-sm`}>
            {getTrendIcon(prediction.trend)}
            <span className="ml-1 capitalize">{prediction.trend}</span>
          </Badge>
        </div>

        {/* Key Factors */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">Key Factors</h4>
          <div className="space-y-2">
            {prediction.factors.slice(0, 3).map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-700/30 rounded text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    factor.impact === 'positive' ? 'bg-green-400' :
                    factor.impact === 'negative' ? 'bg-red-400' : 'bg-yellow-400'
                  }`} />
                  <span className="text-white">{factor.name}</span>
                </div>
                <span className="text-gray-400">{(factor.weight * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Model Accuracy */}
        <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <span className="text-sm text-gray-400">Model Accuracy</span>
          <span className="text-lg font-semibold text-purple-300">
            {(prediction.accuracy * 100).toFixed(1)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
