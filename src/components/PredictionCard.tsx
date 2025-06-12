
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
    <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/50 to-gray-900/60 border-gray-600/50 shadow-2xl backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 rounded-t-lg border-b border-gray-600/30">
        <CardTitle className="text-white flex items-center gap-3 text-xl">
          <div className="p-2 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30">
            <Brain className="h-6 w-6 text-purple-300" />
          </div>
          AI Prediction Results
        </CardTitle>
        <CardDescription className="text-gray-300 text-base">
          Advanced machine learning analysis for {crypto.toUpperCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-8">
        {/* Main Prediction - Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-full bg-blue-500/20">
                <Target className="h-5 w-5 text-blue-400" />
              </div>
              <p className="text-sm font-medium text-gray-300">Predicted Price</p>
            </div>
            <p className="text-3xl font-bold text-white mb-4">
              ${latestPrediction.predictedPrice.toFixed(2)}
            </p>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              priceChange >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {priceChange >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="font-semibold">
                {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
              </span>
              <span className="text-sm opacity-80">change</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/10 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-full bg-green-500/20">
                <Brain className="h-5 w-5 text-green-400" />
              </div>
              <p className="text-sm font-medium text-gray-300">Confidence Level</p>
            </div>
            <p className="text-3xl font-bold text-white mb-4">
              {(latestPrediction.confidence * 100).toFixed(1)}%
            </p>
            <div className="space-y-2">
              <Progress 
                value={latestPrediction.confidence * 100} 
                className="h-3 bg-gray-700/50"
              />
              <p className="text-xs text-gray-400 text-center">
                AI Model Certainty
              </p>
            </div>
          </div>
        </div>

        {/* Market Trend - Enhanced */}
        <div className="bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-2xl p-6 border border-gray-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 mb-2">Market Trend Analysis</p>
              <Badge variant="outline" className={`${getTrendColor(prediction.trend)} px-4 py-2 text-base font-medium`}>
                {getTrendIcon(prediction.trend)}
                <span className="ml-2 capitalize">{prediction.trend}</span>
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Overall Sentiment</p>
              <p className={`text-lg font-bold ${
                prediction.trend === 'bullish' ? 'text-green-400' :
                prediction.trend === 'bearish' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {prediction.trend === 'bullish' ? 'Positive' :
                 prediction.trend === 'bearish' ? 'Negative' : 'Neutral'}
              </p>
            </div>
          </div>
        </div>

        {/* Key Factors - Enhanced Design */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20">
              <Target className="h-5 w-5 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Key Prediction Factors</h3>
          </div>
          <div className="grid gap-3">
            {prediction.factors.map((factor, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-700/40 to-gray-600/40 rounded-xl p-4 border border-gray-500/20 hover:border-gray-400/30 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      factor.impact === 'positive' ? 'bg-green-400 shadow-lg shadow-green-400/30' :
                      factor.impact === 'negative' ? 'bg-red-400 shadow-lg shadow-red-400/30' : 
                      'bg-yellow-400 shadow-lg shadow-yellow-400/30'
                    }`} />
                    <span className="text-white font-medium">{factor.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-300">
                        {(factor.weight * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-400">weight</div>
                    </div>
                    <Badge variant="outline" className={`${
                      factor.impact === 'positive' ? 'text-green-400 border-green-400/50 bg-green-500/10' :
                      factor.impact === 'negative' ? 'text-red-400 border-red-400/50 bg-red-500/10' :
                      'text-yellow-400 border-yellow-400/50 bg-yellow-500/10'
                    } px-3 py-1`}>
                      {factor.impact}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Accuracy - Enhanced */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-indigo-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-indigo-500/20">
                <Brain className="h-5 w-5 text-indigo-400" />
              </div>
              <span className="text-lg font-semibold text-white">Model Performance</span>
            </div>
            <span className="text-2xl font-bold text-indigo-300">
              {(prediction.accuracy * 100).toFixed(1)}%
            </span>
          </div>
          <div className="space-y-2">
            <Progress value={prediction.accuracy * 100} className="h-3 bg-gray-700/50" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Historical Accuracy</span>
              <span className={`font-medium ${
                prediction.accuracy > 0.8 ? 'text-green-400' :
                prediction.accuracy > 0.6 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {prediction.accuracy > 0.8 ? 'Excellent' :
                 prediction.accuracy > 0.6 ? 'Good' : 'Moderate'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
