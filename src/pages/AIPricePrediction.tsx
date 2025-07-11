
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, TrendingUp, BarChart3 } from "lucide-react";
import { AdUnit } from "@/components/ads/AdService";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import { SignupLock } from "@/components/SignupLock";
import Footer from "@/components/Footer";

const AIPricePrediction = () => {
  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' },
  ];

  // Mock data for MarketWinnersWidget
  const mockTopGainersAndLosers = {
    gainers: [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price_change_percentage_24h: 5.2 },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price_change_percentage_24h: 3.1 }
    ],
    losers: [
      { id: 'cardano', name: 'Cardano', symbol: 'ADA', price_change_percentage_24h: -2.5 },
      { id: 'solana', name: 'Solana', symbol: 'SOL', price_change_percentage_24h: -1.8 }
    ]
  };

  const lockedContent = (
    <div className="lg:col-span-3 space-y-8">
      {/* Page Header */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-blue-400" />
            <CardTitle 
              className="text-4xl text-white"
              style={{ textShadow: '0 0 15px rgba(0, 0, 0, 0.3)' }}
            >
              AI Price Prediction
            </CardTitle>
          </div>
          <p className="text-gray-300 text-lg">Advanced machine learning algorithms predicting cryptocurrency price movements</p>
        </CardHeader>
      </Card>

      {/* Prediction Models */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Prediction Models</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <h3 className="text-white font-semibold mb-2">LSTM Neural Network</h3>
              <p className="text-gray-300 text-sm mb-3">Long Short-Term Memory networks for time series prediction</p>
              <Badge className="bg-green-600">92% Accuracy</Badge>
            </div>
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Random Forest</h3>
              <p className="text-gray-300 text-sm mb-3">Ensemble learning method for robust predictions</p>
              <Badge className="bg-blue-600">88% Accuracy</Badge>
            </div>
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Gradient Boosting</h3>
              <p className="text-gray-300 text-sm mb-3">Advanced boosting algorithms for complex patterns</p>
              <Badge className="bg-purple-600">90% Accuracy</Badge>
            </div>
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Transformer Models</h3>
              <p className="text-gray-300 text-sm mb-3">State-of-the-art attention mechanisms</p>
              <Badge className="bg-orange-600">95% Accuracy</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Predictions */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Live Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Bitcoin', 'Ethereum', 'Cardano', 'Solana'].map((crypto, index) => (
              <div key={crypto} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{crypto}</h4>
                  <p className="text-gray-400 text-sm">24h prediction</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">+{(Math.random() * 10 + 2).toFixed(1)}%</p>
                  <p className="text-gray-400 text-sm">Confidence: {(85 + Math.random() * 10).toFixed(0)}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header like homepage */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        <IndexHeader
          selectedCrypto="bitcoin"
          cryptoOptions={cryptoOptions}
          currentPrice={45000}
          priceChange={2.5}
        />
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="outline" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content with SignupLock */}
          <SignupLock
            title="Unlock AI Price Predictions"
            description="Get access to advanced machine learning price predictions - 100% free!"
          >
            {lockedContent}
          </SignupLock>

          {/* Sticky Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-8">
              <MarketWinnersWidget topGainnersandLoosers={mockTopGainersAndLosers} />
              <AdUnit type="skyscraper" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AIPricePrediction;
