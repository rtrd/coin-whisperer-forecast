
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ArrowLeft } from "lucide-react";
import { Link } from 'react-router-dom';
import { IndexHeader } from "@/components/IndexHeader";
import { IndependentPredictionWidget } from "@/components/IndependentPredictionWidget";

const AIPrediction = () => {
  const cryptoOptions = [
    // Layer 1 Cryptocurrencies
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Layer 1', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Layer 1', score: 8.2, prediction: '+8.3%' },
    { value: 'binancecoin', label: 'BNB (BNB)', icon: '🔶', category: 'Layer 1', score: 7.8, prediction: '+6.1%' },
    { value: 'ripple', label: 'XRP (XRP)', icon: '💧', category: 'Layer 1', score: 7.2, prediction: '+4.7%' },
    { value: 'cardano', label: 'Cardano (ADA)', icon: '₳', category: 'Layer 1', score: 6.9, prediction: '+3.2%' },
    { value: 'solana', label: 'Solana (SOL)', icon: '◎', category: 'Layer 1', score: 8.1, prediction: '+15.8%' },
    // Add more crypto options as needed
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Homepage Header */}
        <IndexHeader 
          selectedCrypto="bitcoin"
          cryptoOptions={cryptoOptions}
          currentPrice={50000}
          priceChange={2.5}
        />

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="h-12 w-12 text-blue-400" />
            AI Prediction Analysis
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced cryptocurrency predictions using machine learning algorithms and market sentiment analysis
          </p>
        </div>

        <IndependentPredictionWidget cryptoOptions={cryptoOptions} />
      </div>
    </div>
  );
};

export default AIPrediction;
