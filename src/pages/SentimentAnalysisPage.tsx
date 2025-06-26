
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, TrendingUp, Users } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import { SignupLock } from "@/components/SignupLock";
import Footer from "@/components/Footer";

const SentimentAnalysisPage = () => {
  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' },
  ];

  // Mock data for MarketWinnersWidget
  const mockMarketData = [
    { name: 'Bitcoin', symbol: 'BTC', current_price: 45000, price_change_percentage_24h: 2.5, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
    { name: 'Ethereum', symbol: 'ETH', current_price: 2800, price_change_percentage_24h: 1.8, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
    { name: 'Solana', symbol: 'SOL', current_price: 95, price_change_percentage_24h: 5.2, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
    { name: 'Cardano', symbol: 'ADA', current_price: 0.45, price_change_percentage_24h: -2.1, image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
  ];

  const lockedContent = (
    <div className="lg:col-span-3 space-y-8">
      {/* Page Header */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-8 w-8 text-purple-400" />
            <CardTitle 
              className="text-4xl text-white"
              style={{ textShadow: '0 0 15px rgba(0, 0, 0, 0.3)' }}
            >
              Sentiment Analysis
            </CardTitle>
          </div>
          <p className="text-gray-300 text-lg">Real-time market sentiment analysis from social media, news, and trading data</p>
        </CardHeader>
      </Card>

      {/* Overall Sentiment */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Market Sentiment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-900/20 border border-green-700 rounded-lg">
              <div className="text-4xl font-bold text-green-400 mb-2">72%</div>
              <p className="text-gray-300">Bullish Sentiment</p>
              <Badge className="bg-green-600 mt-2">Strong Buy</Badge>
            </div>
            <div className="text-center p-6 bg-yellow-900/20 border border-yellow-700 rounded-lg">
              <div className="text-4xl font-bold text-yellow-400 mb-2">18%</div>
              <p className="text-gray-300">Neutral Sentiment</p>
              <Badge className="bg-yellow-600 mt-2">Hold</Badge>
            </div>
            <div className="text-center p-6 bg-red-900/20 border border-red-700 rounded-lg">
              <div className="text-4xl font-bold text-red-400 mb-2">10%</div>
              <p className="text-gray-300">Bearish Sentiment</p>
              <Badge className="bg-red-600 mt-2">Weak Sell</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Sentiment */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            Social Media Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { platform: 'Twitter/X', sentiment: 'Bullish', score: 8.2, posts: '12.5K', trend: '+5.2%' },
              { platform: 'Reddit', sentiment: 'Bullish', score: 7.8, posts: '3.2K', trend: '+2.1%' },
              { platform: 'Telegram', sentiment: 'Neutral', score: 6.5, posts: '8.7K', trend: '-1.3%' },
              { platform: 'Discord', sentiment: 'Bullish', score: 8.9, posts: '5.1K', trend: '+8.7%' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{item.platform.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{item.platform}</h4>
                    <p className="text-gray-400 text-sm">{item.posts} posts analyzed</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className={`font-bold ${
                    item.sentiment === 'Bullish' ? 'text-green-400' : 
                    item.sentiment === 'Bearish' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {item.sentiment}
                  </p>
                  <p className="text-gray-400 text-sm">Score: {item.score}/10</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${item.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {item.trend}
                  </p>
                  <p className="text-gray-400 text-sm">24h change</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* News Sentiment */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            News Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-green-600">Positive</Badge>
                <span className="text-green-400 text-sm">2 hours ago</span>
              </div>
              <h4 className="text-white font-medium mb-1">Major Institution Adopts Bitcoin</h4>
              <p className="text-gray-300 text-sm">Sentiment Score: 9.2/10 - Extremely Bullish</p>
            </div>
            
            <div className="p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-blue-600">Neutral</Badge>
                <span className="text-blue-400 text-sm">4 hours ago</span>
              </div>
              <h4 className="text-white font-medium mb-1">Regulatory Updates Discussion</h4>
              <p className="text-gray-300 text-sm">Sentiment Score: 6.1/10 - Cautiously Neutral</p>
            </div>
            
            <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-green-600">Positive</Badge>
                <span className="text-green-400 text-sm">6 hours ago</span>
              </div>
              <h4 className="text-white font-medium mb-1">New DeFi Innovation Announced</h4>
              <p className="text-gray-300 text-sm">Sentiment Score: 8.7/10 - Very Bullish</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fear & Greed Index */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Crypto Fear & Greed Index</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-6xl font-bold text-green-400 mb-4">73</div>
            <p className="text-2xl text-green-400 font-semibold mb-2">Greed</p>
            <p className="text-gray-300 mb-4">The market is showing signs of greed, indicating bullish sentiment</p>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="text-center">
                <div className="text-red-400 font-bold">0-24</div>
                <div className="text-gray-400">Extreme Fear</div>
              </div>
              <div className="text-center">
                <div className="text-orange-400 font-bold">25-49</div>
                <div className="text-gray-400">Fear</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-bold">50-74</div>
                <div className="text-gray-400">Greed</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold">75-100</div>
                <div className="text-gray-400">Extreme Greed</div>
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
            title="Unlock Sentiment Analysis"
            description="Access real-time market sentiment from social media and news - 100% free!"
          >
            {lockedContent}
          </SignupLock>

          {/* Sticky Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-8">
              <MarketWinnersWidget topGainnersandLoosers={mockMarketData} />
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
