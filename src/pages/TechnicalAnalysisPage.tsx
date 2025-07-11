import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BarChart3, TrendingUp, TrendingDown, Activity, Target } from "lucide-react";
import { AdUnit } from "@/components/ads/AdService";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import Footer from "@/components/Footer";

const TechnicalAnalysisPage = () => {
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
                <p className="text-gray-300 text-lg">Advanced technical indicators and trading signals</p>
              </CardHeader>
            </Card>

            {/* Overall Signal */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-400" />
                  Overall Signal
                  <Badge className="bg-green-600">BUY</Badge>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Aggregate signal from multiple technical indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-green-400 mb-2">75</div>
                  <div className="text-gray-300">Signal Strength</div>
                  <Progress value={75} className="mt-4 h-3 [&>div]:bg-green-400" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-400 mb-1">Strong Buy</div>
                    <div className="text-sm text-gray-400">Recommendation</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400 mb-1">Bullish</div>
                    <div className="text-sm text-gray-400">Trend Direction</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400 mb-1">High</div>
                    <div className="text-sm text-gray-400">Confidence</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Indicators */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Technical Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <span className="text-white font-medium">RSI (14)</span>
                      <p className="text-gray-400 text-sm">Relative Strength Index</p>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold">65.2</span>
                      <Badge className="ml-2 bg-green-600">BUY</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <span className="text-white font-medium">MACD</span>
                      <p className="text-gray-400 text-sm">Moving Average Convergence Divergence</p>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold">+124.5</span>
                      <Badge className="ml-2 bg-green-600">BUY</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <span className="text-white font-medium">SMA 20</span>
                      <p className="text-gray-400 text-sm">Simple Moving Average (20)</p>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold">$45,280</span>
                      <Badge className="ml-2 bg-green-600">BUY</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <span className="text-white font-medium">Bollinger Bands</span>
                      <p className="text-gray-400 text-sm">Price volatility indicator</p>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold">Middle</span>
                      <Badge className="ml-2 bg-amber-600">NEUTRAL</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <span className="text-white font-medium">Stochastic</span>
                      <p className="text-gray-400 text-sm">Momentum oscillator</p>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold">72.8</span>
                      <Badge className="ml-2 bg-green-600">BUY</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support and Resistance Levels */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Support & Resistance Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-green-400 font-semibold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Support Levels
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between p-3 bg-green-900/20 rounded-lg border border-green-700/30">
                        <span className="text-green-300">S1 (Strong)</span>
                        <span className="text-white font-bold">$44,250</span>
                      </div>
                      <div className="flex justify-between p-3 bg-green-900/20 rounded-lg border border-green-700/30">
                        <span className="text-green-300">S2 (Medium)</span>
                        <span className="text-white font-bold">$43,100</span>
                      </div>
                      <div className="flex justify-between p-3 bg-green-900/20 rounded-lg border border-green-700/30">
                        <span className="text-green-300">S3 (Weak)</span>
                        <span className="text-white font-bold">$41,800</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-red-400 font-semibold flex items-center gap-2">
                      <TrendingDown className="h-4 w-4" />
                      Resistance Levels
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between p-3 bg-red-900/20 rounded-lg border border-red-700/30">
                        <span className="text-red-300">R1 (Strong)</span>
                        <span className="text-white font-bold">$46,800</span>
                      </div>
                      <div className="flex justify-between p-3 bg-red-900/20 rounded-lg border border-red-700/30">
                        <span className="text-red-300">R2 (Medium)</span>
                        <span className="text-white font-bold">$48,200</span>
                      </div>
                      <div className="flex justify-between p-3 bg-red-900/20 rounded-lg border border-red-700/30">
                        <span className="text-red-300">R3 (Weak)</span>
                        <span className="text-white font-bold">$49,500</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

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

export default TechnicalAnalysisPage;
