
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BarChart3, Activity, TrendingUp } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import Footer from "@/components/Footer";

const TechnicalAnalysisPage = () => {
  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' },
  ];

  const indicators = [
    { name: 'RSI (14)', value: 65.4, signal: 'Neutral', color: 'yellow' },
    { name: 'MACD', value: 234.5, signal: 'Buy', color: 'green' },
    { name: 'Moving Average (20)', value: 44250, signal: 'Buy', color: 'green' },
    { name: 'Bollinger Bands', value: 0.85, signal: 'Sell', color: 'red' },
  ];

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
          {/* Main Content */}
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
                <p className="text-gray-300 text-lg">Comprehensive technical indicators and chart patterns analysis</p>
              </CardHeader>
            </Card>

            {/* Technical Indicators */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Live Technical Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {indicators.map((indicator, index) => (
                    <div key={index} className="p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{indicator.name}</h4>
                        <Badge className={`bg-${indicator.color}-600`}>{indicator.signal}</Badge>
                      </div>
                      <p className="text-gray-300 text-lg font-bold">{indicator.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chart Patterns */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-400" />
                  Chart Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-700/30 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Ascending Triangle</h4>
                    <p className="text-gray-300 text-sm mb-2">Bullish pattern detected on 4H timeframe</p>
                    <Badge className="bg-green-600">Bullish Signal</Badge>
                  </div>
                  <div className="p-4 bg-gray-700/30 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Support & Resistance</h4>
                    <p className="text-gray-300 text-sm mb-2">Key levels identified at $43,500 and $46,200</p>
                    <Badge className="bg-blue-600">Key Levels</Badge>
                  </div>
                  <div className="p-4 bg-gray-700/30 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Volume Analysis</h4>
                    <p className="text-gray-300 text-sm mb-2">Above average volume confirms trend strength</p>
                    <Badge className="bg-purple-600">High Volume</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trading Signals */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Trading Signals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-700 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">BTC/USD</h4>
                      <p className="text-green-400 text-sm">Long Signal</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400">Entry: $44,800</p>
                      <p className="text-gray-400 text-sm">Target: $47,200</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-900/20 border border-red-700 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">ETH/USD</h4>
                      <p className="text-red-400 text-sm">Short Signal</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400">Entry: $2,650</p>
                      <p className="text-gray-400 text-sm">Target: $2,400</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

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
