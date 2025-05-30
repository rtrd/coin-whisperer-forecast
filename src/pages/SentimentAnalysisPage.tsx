
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Heart, MessageCircle, Users, Globe } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import Footer from "@/components/Footer";

const SentimentAnalysisPage = () => {
  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' },
  ];

  const sentimentSources = [
    { name: 'Twitter/X', sentiment: 78, mentions: 15420, icon: MessageCircle },
    { name: 'Reddit', sentiment: 65, mentions: 8750, icon: Users },
    { name: 'News Media', sentiment: 82, mentions: 1250, icon: Globe },
    { name: 'Crypto Forums', sentiment: 71, mentions: 3480, icon: MessageCircle },
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
                  <Heart className="h-8 w-8 text-pink-400" />
                  <CardTitle 
                    className="text-4xl text-white"
                    style={{ textShadow: '0 0 15px rgba(0, 0, 0, 0.3)' }}
                  >
                    Sentiment Analysis
                  </CardTitle>
                </div>
                <p className="text-gray-300 text-lg">Real-time market sentiment from social media and news sources</p>
              </CardHeader>
            </Card>

            {/* Overall Sentiment */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Overall Market Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold text-white">74/100</div>
                  <Badge className="bg-green-600 text-lg px-4 py-2">Bullish</Badge>
                  <Progress value={74} className="h-4" />
                  <p className="text-gray-300">Market sentiment is currently bullish with strong buying interest</p>
                </div>
              </CardContent>
            </Card>

            {/* Sentiment by Source */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Sentiment by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sentimentSources.map((source, index) => {
                    const IconComponent = source.icon;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-5 w-5 text-blue-400" />
                            <span className="text-white font-medium">{source.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-sm">{source.mentions.toLocaleString()} mentions</span>
                            <Badge className={source.sentiment > 60 ? 'bg-green-600' : 'bg-yellow-600'}>
                              {source.sentiment}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={source.sentiment} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Fear & Greed Index */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Fear & Greed Index</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-3xl font-bold text-green-400 mb-2">68</div>
                    <p className="text-white font-medium">Current</p>
                    <p className="text-gray-400 text-sm">Greed</p>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">45</div>
                    <p className="text-white font-medium">Yesterday</p>
                    <p className="text-gray-400 text-sm">Neutral</p>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-3xl font-bold text-red-400 mb-2">32</div>
                    <p className="text-white font-medium">Last Week</p>
                    <p className="text-gray-400 text-sm">Fear</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Trending Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Bitcoin ETF', 'Altcoin Season', 'DeFi Revival', 'NFT Comeback'].map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-white">{topic}</span>
                      <Badge className="bg-blue-600">#{index + 1}</Badge>
                    </div>
                  ))}
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

export default SentimentAnalysisPage;
