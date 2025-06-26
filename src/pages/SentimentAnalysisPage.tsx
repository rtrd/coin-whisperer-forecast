import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Heart, MessageCircle, TrendingUp, Users, Globe, Brain } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import Footer from "@/components/Footer";

const SentimentAnalysisPage = () => {
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
                  <Heart className="h-8 w-8 text-pink-400" />
                  <CardTitle 
                    className="text-4xl text-white"
                    style={{ textShadow: '0 0 15px rgba(0, 0, 0, 0.3)' }}
                  >
                    Market Sentiment Analysis
                  </CardTitle>
                </div>
                <p className="text-gray-300 text-lg">AI-powered analysis of social media, news, and market sentiment</p>
              </CardHeader>
            </Card>

            {/* Overall Market Sentiment */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  Overall Market Sentiment
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    Bullish
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time sentiment analysis across multiple data sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-green-400 mb-2">72</div>
                  <div className="text-gray-300">Market Sentiment Score</div>
                  <Progress value={72} className="mt-4 h-3 [&>div]:bg-green-400" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-400 mb-1">Bullish</div>
                    <div className="text-sm text-gray-400">Primary Trend</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400 mb-1">High</div>
                    <div className="text-sm text-gray-400">Confidence Level</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400 mb-1">Rising</div>
                    <div className="text-sm text-gray-400">24h Change</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sentiment by Source */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Sentiment by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-blue-400" />
                      <span className="text-white font-medium">Twitter/X</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm">15.2K mentions</span>
                      <Badge className="bg-green-600">Bullish (78)</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-orange-400" />
                      <span className="text-white font-medium">Reddit</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm">8.4K mentions</span>
                      <Badge className="bg-green-600">Bullish (65)</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-purple-400" />
                      <span className="text-white font-medium">News Media</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm">2.1K articles</span>
                      <Badge className="bg-amber-600">Neutral (55)</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-gray-400" />
                      <span className="text-white font-medium">Crypto Forums</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm">5.7K posts</span>
                      <Badge className="bg-green-600">Bullish (70)</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Cryptocurrencies by Sentiment */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Top Cryptocurrencies by Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Bitcoin', symbol: 'BTC', sentiment: 78, trend: 'up' },
                    { name: 'Ethereum', symbol: 'ETH', sentiment: 72, trend: 'up' },
                    { name: 'Solana', symbol: 'SOL', sentiment: 68, trend: 'up' },
                    { name: 'Cardano', symbol: 'ADA', sentiment: 45, trend: 'down' },
                    { name: 'Polygon', symbol: 'MATIC', sentiment: 62, trend: 'up' }
                  ].map((crypto, index) => (
                    <div key={crypto.symbol} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">{crypto.name}</span>
                        <span className="text-gray-400 text-sm">({crypto.symbol})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={crypto.sentiment} className="w-24 h-2" />
                        <span className="text-white font-bold">{crypto.sentiment}</span>
                        {crypto.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sticky Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-8">
              <MarketWinnersWidget topGainnersandLoosers={mockTopGainersAndLosers} />
              <AdBanner width={300} height={600} position="vertical" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SentimentAnalysisPage;
