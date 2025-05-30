
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Activity, Clock, Globe, Zap } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import Footer from "@/components/Footer";

const RealTimeData = () => {
  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' },
  ];

  const marketData = [
    { symbol: 'BTC', price: 45234.56, change: 2.34, volume: '23.4B', marketCap: '887.2B' },
    { symbol: 'ETH', price: 2654.32, change: -1.22, volume: '12.1B', marketCap: '318.7B' },
    { symbol: 'BNB', price: 298.45, change: 3.67, volume: '1.2B', marketCap: '44.5B' },
    { symbol: 'XRP', price: 0.5234, change: 5.23, volume: '2.1B', marketCap: '29.1B' },
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
                  <Activity className="h-8 w-8 text-green-400" />
                  <CardTitle 
                    className="text-4xl text-white"
                    style={{ textShadow: '0 0 15px rgba(0, 0, 0, 0.3)' }}
                  >
                    Real-time Data
                  </CardTitle>
                </div>
                <p className="text-gray-300 text-lg">Live cryptocurrency prices, volumes, and market data</p>
              </CardHeader>
            </Card>

            {/* Data Sources */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-700/30 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Exchange APIs</h4>
                    <p className="text-gray-300 text-sm mb-2">Direct feeds from major exchanges</p>
                    <Badge className="bg-green-600">Live</Badge>
                  </div>
                  <div className="p-4 bg-gray-700/30 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Market Data Providers</h4>
                    <p className="text-gray-300 text-sm mb-2">Aggregated data from CoinGecko, CoinMarketCap</p>
                    <Badge className="bg-blue-600">Verified</Badge>
                  </div>
                  <div className="p-4 bg-gray-700/30 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Blockchain Data</h4>
                    <p className="text-gray-300 text-sm mb-2">On-chain metrics and transaction data</p>
                    <Badge className="bg-purple-600">Real-time</Badge>
                  </div>
                  <div className="p-4 bg-gray-700/30 rounded-lg">
                    <h4 className="text-white font-medium mb-2">DeFi Protocols</h4>
                    <p className="text-gray-300 text-sm mb-2">Decentralized finance data streams</p>
                    <Badge className="bg-orange-600">Updated</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Market Data */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Live Market Data
                  <Badge className="bg-green-600 ml-2">
                    <Clock className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketData.map((crypto, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{crypto.symbol}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{crypto.symbol}</h4>
                          <p className="text-gray-400 text-sm">Vol: {crypto.volume}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">${crypto.price.toLocaleString()}</p>
                        <p className={`text-sm ${crypto.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {crypto.change > 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Data Refresh Status */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Data Refresh Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-green-400 font-bold text-2xl mb-1">1s</div>
                    <p className="text-white text-sm">Price Updates</p>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-blue-400 font-bold text-2xl mb-1">5s</div>
                    <p className="text-white text-sm">Volume Data</p>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-purple-400 font-bold text-2xl mb-1">15s</div>
                    <p className="text-white text-sm">Market Cap</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Endpoints */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Available API Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-700/30 rounded-lg">
                    <code className="text-green-400">/api/v1/prices</code>
                    <p className="text-gray-300 text-sm mt-1">Real-time cryptocurrency prices</p>
                  </div>
                  <div className="p-3 bg-gray-700/30 rounded-lg">
                    <code className="text-green-400">/api/v1/markets</code>
                    <p className="text-gray-300 text-sm mt-1">Market data and statistics</p>
                  </div>
                  <div className="p-3 bg-gray-700/30 rounded-lg">
                    <code className="text-green-400">/api/v1/historical</code>
                    <p className="text-gray-300 text-sm mt-1">Historical price data</p>
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

export default RealTimeData;
