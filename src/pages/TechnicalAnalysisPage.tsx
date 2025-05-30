
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BarChart3, TrendingUp, Activity } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import { SignupLock } from "@/components/SignupLock";
import Footer from "@/components/Footer";

const TechnicalAnalysisPage = () => {
  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' },
  ];

  const lockedContent = (
    <div className="lg:col-span-3 space-y-8">
      {/* Page Header */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-8 w-8 text-blue-400" />
            <CardTitle 
              className="text-4xl text-white"
              style={{ textShadow: '0 0 15px rgba(0, 0, 0, 0.3)' }}
            >
              Technical Analysis
            </CardTitle>
          </div>
          <p className="text-gray-300 text-lg">Advanced technical indicators and chart analysis for cryptocurrency trading</p>
        </CardHeader>
      </Card>

      {/* Technical Indicators */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Technical Indicators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Moving Averages</h3>
              <p className="text-gray-300 text-sm mb-3">SMA, EMA, WMA analysis for trend identification</p>
              <Badge className="bg-green-600">Bullish Signal</Badge>
            </div>
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <h3 className="text-white font-semibold mb-2">RSI (Relative Strength)</h3>
              <p className="text-gray-300 text-sm mb-3">Momentum oscillator for overbought/oversold conditions</p>
              <Badge className="bg-yellow-600">Neutral</Badge>
            </div>
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <h3 className="text-white font-semibold mb-2">MACD</h3>
              <p className="text-gray-300 text-sm mb-3">Moving Average Convergence Divergence analysis</p>
              <Badge className="bg-blue-600">Buy Signal</Badge>
            </div>
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Bollinger Bands</h3>
              <p className="text-gray-300 text-sm mb-3">Volatility and support/resistance levels</p>
              <Badge className="bg-purple-600">Breakout Alert</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Patterns */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-400" />
            Chart Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { pattern: 'Head and Shoulders', crypto: 'Bitcoin', signal: 'Bearish', confidence: '85%' },
              { pattern: 'Bull Flag', crypto: 'Ethereum', signal: 'Bullish', confidence: '92%' },
              { pattern: 'Triangle', crypto: 'Cardano', signal: 'Neutral', confidence: '78%' },
              { pattern: 'Double Bottom', crypto: 'Solana', signal: 'Bullish', confidence: '88%' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{item.pattern}</h4>
                  <p className="text-gray-400 text-sm">{item.crypto}</p>
                </div>
                <div className="text-center">
                  <p className={`font-bold ${
                    item.signal === 'Bullish' ? 'text-green-400' : 
                    item.signal === 'Bearish' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {item.signal}
                  </p>
                  <p className="text-gray-400 text-sm">Confidence: {item.confidence}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Support & Resistance */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            Support & Resistance Levels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-white font-medium">Bitcoin (BTC)</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Resistance 3:</span>
                  <span className="text-red-400">$47,500</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Resistance 2:</span>
                  <span className="text-red-400">$46,200</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current Price:</span>
                  <span className="text-white font-bold">$45,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Support 1:</span>
                  <span className="text-green-400">$43,800</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Support 2:</span>
                  <span className="text-green-400">$42,500</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-medium">Ethereum (ETH)</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Resistance 3:</span>
                  <span className="text-red-400">$2,850</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Resistance 2:</span>
                  <span className="text-red-400">$2,720</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current Price:</span>
                  <span className="text-white font-bold">$2,650</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Support 1:</span>
                  <span className="text-green-400">$2,580</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Support 2:</span>
                  <span className="text-green-400">$2,450</span>
                </div>
              </div>
            </div>
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
            title="Unlock Technical Analysis"
            description="Access advanced technical indicators and chart patterns - 100% free!"
          >
            {lockedContent}
          </SignupLock>

          {/* Sticky Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-8">
              <MarketWinnersWidget />
              <AdBanner width={300} height={600} position="vertical" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TechnicalAnalysisPage;
