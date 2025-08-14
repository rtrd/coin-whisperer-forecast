import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Zap, Target, BarChart3, Clock, Shield, Cpu } from "lucide-react";
import { Link } from 'react-router-dom';

export const CryptoPredictionFeatures = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-400" />,
      title: "Bitcoin Price Prediction AI",
      description: "Advanced neural networks trained specifically on Bitcoin market patterns, providing highly accurate BTC price forecasts with confidence intervals.",
      accuracy: "95%",
      badge: "Most Popular"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-400" />,
      title: "Ethereum & Altcoin Price Forecasting",
      description: "Comprehensive AI models for Ethereum, Solana, Cardano, and 1000+ altcoins with real-time prediction updates and trend analysis.",
      accuracy: "92%",
      badge: "Multi-Asset"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-400" />,
      title: "Machine Learning Model Accuracy",
      description: "Our ensemble of ML models combines LSTM, Random Forest, and Transformer architectures to achieve industry-leading prediction accuracy.",
      accuracy: "94%",
      badge: "Proven Track Record"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: "Real-Time AI Analysis",
      description: "Instant cryptocurrency price predictions updated every hour with latest market data, sentiment analysis, and technical indicators.",
      accuracy: "Live",
      badge: "Real-Time"
    },
    {
      icon: <Target className="h-8 w-8 text-red-400" />,
      title: "Technical Analysis Integration",
      description: "AI predictions enhanced with traditional technical indicators, support/resistance levels, and chart pattern recognition.",
      accuracy: "Enhanced",
      badge: "Hybrid Approach"
    },
    {
      icon: <Clock className="h-8 w-8 text-cyan-400" />,
      title: "Multiple Prediction Timeframes",
      description: "Short-term (1-7 days), medium-term (1-4 weeks), and long-term (1-3 months) crypto price predictions with varying confidence levels.",
      accuracy: "Flexible",
      badge: "Time Adaptive"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          How Our AI Crypto Price Prediction Algorithm Works
        </h2>
        <p className="text-gray-300 text-lg max-w-4xl mx-auto">
          Our advanced machine learning system combines multiple AI models to deliver the most accurate cryptocurrency price predictions available. 
          Each prediction is backed by comprehensive data analysis and real-time market monitoring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="bg-gray-800/50 border-gray-700 shadow-xl hover:bg-gray-800/70 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {feature.icon}
                  <div className="flex flex-col">
                    <Badge variant="secondary" className="w-fit mb-2 bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {feature.badge}
                    </Badge>
                    <CardTitle className="text-white text-lg leading-tight">
                      {feature.title}
                    </CardTitle>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-400 border-green-400/50 bg-green-400/10">
                  {feature.accuracy}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-500/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Cpu className="h-8 w-8 text-blue-400" />
              Advanced AI Technology Stack
            </h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-400" />
                <span>LSTM Neural Networks for time-series prediction</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-400" />
                <span>Transformer models for market sentiment analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-400" />
                <span>Ensemble methods combining multiple algorithms</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-400" />
                <span>Real-time data processing and model updates</span>
              </div>
            </div>
          </div>
          <div className="text-center lg:text-right">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
              <div className="text-4xl font-bold text-blue-400 mb-2">95%</div>
              <div className="text-gray-300 text-sm mb-4">Average Prediction Accuracy</div>
              <Link to="/technical-analysis" className="text-blue-400 hover:text-blue-300 underline text-sm">
                View Technical Analysis →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};