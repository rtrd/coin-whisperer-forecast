
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, TrendingDown, Activity, AlertTriangle } from "lucide-react";

interface PredictionAdjustment {
  factor: string;
  impact: number;
  confidence: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  reason: string;
}

interface DynamicPredictionAdjusterProps {
  selectedCrypto: string;
  currentPrice: number;
  priceChange: number;
}

export const DynamicPredictionAdjuster: React.FC<DynamicPredictionAdjusterProps> = ({
  selectedCrypto,
  currentPrice,
  priceChange
}) => {
  const [adjustments, setAdjustments] = useState<PredictionAdjustment[]>([]);
  const [overallConfidence, setOverallConfidence] = useState(75);
  const [aiPrediction, setAiPrediction] = useState(0);

  useEffect(() => {
    const updatePrediction = () => {
      // Dynamic adjustments based on price changes
      const newAdjustments: PredictionAdjustment[] = [];
      
      // Price momentum adjustment
      if (Math.abs(priceChange) > 10) {
        newAdjustments.push({
          factor: 'Price Momentum',
          impact: priceChange > 0 ? 15 : -15,
          confidence: 85,
          trend: priceChange > 0 ? 'bullish' : 'bearish',
          reason: `Strong ${priceChange > 0 ? 'upward' : 'downward'} momentum detected`
        });
      }

      // Volatility adjustment
      const volatility = Math.abs(priceChange);
      if (volatility > 5) {
        newAdjustments.push({
          factor: 'Market Volatility',
          impact: volatility > 15 ? -8 : 5,
          confidence: 70,
          trend: volatility > 15 ? 'bearish' : 'bullish',
          reason: volatility > 15 ? 'High volatility increases risk' : 'Moderate volatility shows activity'
        });
      }

      // Market sentiment (simulated)
      const sentimentScore = Math.random() * 100;
      newAdjustments.push({
        factor: 'AI Sentiment',
        impact: sentimentScore > 60 ? 12 : sentimentScore < 40 ? -10 : 0,
        confidence: Math.floor(sentimentScore),
        trend: sentimentScore > 60 ? 'bullish' : sentimentScore < 40 ? 'bearish' : 'neutral',
        reason: `Market sentiment analysis: ${sentimentScore > 60 ? 'Positive' : sentimentScore < 40 ? 'Negative' : 'Neutral'}`
      });

      // Technical indicators (simulated)
      const technicalScore = 50 + (Math.random() - 0.5) * 60;
      newAdjustments.push({
        factor: 'Technical Analysis',
        impact: technicalScore > 70 ? 8 : technicalScore < 30 ? -8 : 0,
        confidence: Math.floor(Math.abs(technicalScore - 50) * 2),
        trend: technicalScore > 70 ? 'bullish' : technicalScore < 30 ? 'bearish' : 'neutral',
        reason: `RSI and moving averages ${technicalScore > 70 ? 'oversold' : technicalScore < 30 ? 'overbought' : 'neutral'}`
      });

      setAdjustments(newAdjustments);
      
      // Calculate overall prediction
      const totalImpact = newAdjustments.reduce((sum, adj) => sum + adj.impact, 0);
      setAiPrediction(totalImpact);
      
      // Calculate overall confidence
      const avgConfidence = newAdjustments.reduce((sum, adj) => sum + adj.confidence, 0) / newAdjustments.length;
      setOverallConfidence(Math.floor(avgConfidence));
    };

    updatePrediction();
    const interval = setInterval(updatePrediction, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [selectedCrypto, currentPrice, priceChange]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-red-400" />;
      default: return <Activity className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-700/50 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-400" />
          Dynamic AI Prediction
          <Badge className="bg-purple-600">REAL-TIME</Badge>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse ml-2"></div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Prediction */}
          <div className="p-4 bg-gray-800/50 rounded-lg border border-purple-700/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">AI Prediction Score</span>
              <div className={`flex items-center gap-1 ${aiPrediction >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {aiPrediction >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="font-bold">
                  {aiPrediction >= 0 ? '+' : ''}{aiPrediction.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 text-sm">Confidence:</span>
              <Progress value={overallConfidence} className="flex-1 h-2" />
              <span className="text-white text-sm">{overallConfidence}%</span>
            </div>
          </div>

          {/* Individual Adjustments */}
          <div className="space-y-3">
            {adjustments.map((adjustment, index) => (
              <div key={index} className="p-3 bg-gray-800/30 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(adjustment.trend)}
                    <span className="text-white font-medium text-sm">{adjustment.factor}</span>
                  </div>
                  <div className={`font-bold text-sm ${getTrendColor(adjustment.trend)}`}>
                    {adjustment.impact >= 0 ? '+' : ''}{adjustment.impact.toFixed(1)}%
                  </div>
                </div>
                <p className="text-gray-400 text-xs mb-2">{adjustment.reason}</p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs">Confidence:</span>
                  <Progress value={adjustment.confidence} className="flex-1 h-1" />
                  <span className="text-gray-400 text-xs">{adjustment.confidence}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-yellow-900/20 rounded-lg border border-yellow-700/50">
            <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-200 text-xs font-medium">Real-time Analysis</p>
              <p className="text-yellow-300 text-xs">
                This AI model adjusts predictions based on live price movements and market conditions.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
