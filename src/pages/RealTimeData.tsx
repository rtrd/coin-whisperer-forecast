
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Activity, Zap, Globe, RefreshCw } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import { SignupLock } from "@/components/SignupLock";
import Footer from "@/components/Footer";

const RealTimeData = () => {
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
            <Activity className="h-8 w-8 text-green-400" />
            <CardTitle 
              className="text-4xl text-white"
              style={{ textShadow: '0 0 15px rgba(0, 0, 0, 0.3)' }}
            >
              Real-Time Data
            </CardTitle>
          </div>
          <p className="text-gray-300 text-lg">Live cryptocurrency market data, prices, and trading volumes</p>
        </CardHeader>
      </Card>

      {/* Live Market Data */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Live Market Data
            </CardTitle>
            <Badge className="bg-green-600 animate-pulse">LIVE</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Bitcoin', symbol: 'BTC', price: '$45,234.56', change: '+2.34%', volume: '$28.5B' },
              { name: 'Ethereum', symbol: 'ETH', price: '$2,658.90', change: '-1.22%', volume: '$15.2B' },
              { name: 'Binance Coin', symbol: 'BNB', price: '$309.45', change: '+3.67%', volume: '$2.1B' },
              { name: 'Solana', symbol: 'SOL', price: '$89.50', change: '+5.23%', volume: '$1.8B' },
              { name: 'Cardano', symbol: 'ADA', price: '$2.30', change: '+1.89%', volume: '$945M' },
              { name: 'Polygon', symbol: 'MATIC', price: '$0.85', change: '-2.45%', volume: '$567M' }
            ].map((crypto, index) => (
              <div key={index} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{crypto.symbol}</h4>
                  <RefreshCw className="h-4 w-4 text-green-400 animate-spin" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{crypto.price}</div>
                <div className="flex justify-between items-center text-sm">
                  <span className={`font-medium ${crypto.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {crypto.change}
                  </span>
                  <span className="text-gray-400">Vol: {crypto.volume}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exchange Data */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-400" />
            Multi-Exchange Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { exchange: 'Binance', btc: '$45,234.56', eth: '$2,658.90', volume: '$28.5B', status: 'Online' },
              { exchange: 'Coinbase', btc: '$45,245.12', eth: '$2,659.45', volume: '$12.3B', status: 'Online' },
              { exchange: 'Kraken', btc: '$45,228.90', eth: '$2,657.23', volume: '$8.7B', status: 'Online' },
              { exchange: 'KuCoin', btc: '$45,239.67', eth: '$2,658.34', volume: '$6.2B', status: 'Online' }
            ].map((exchange, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{exchange.exchange.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{exchange.exchange}</h4>
                    <p className="text-gray-400 text-sm">24h Vol: {exchange.volume}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-white text-sm">BTC: {exchange.btc}</div>
                  <div className="text-white text-sm">ETH: {exchange.eth}</div>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-600">{exchange.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Book Data */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Live Order Book (BTC/USDT)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-red-400 font-medium mb-3">Sell Orders</h4>
              <div className="space-y-2">
                {[
                  { price: '45,256.78', amount: '0.2345', total: '10,617.45' },
                  { price: '45,245.90', amount: '0.5678', total: '25,688.23' },
                  { price: '45,239.12', amount: '1.2345', total: '55,845.67' },
                  { price: '45,235.45', amount: '0.8901', total: '40,256.78' }
                ].map((order, index) => (
                  <div key={index} className="flex justify-between text-sm bg-red-900/10 p-2 rounded">
                    <span className="text-red-400">{order.price}</span>
                    <span className="text-gray-300">{order.amount}</span>
                    <span className="text-gray-400">{order.total}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-green-400 font-medium mb-3">Buy Orders</h4>
              <div className="space-y-2">
                {[
                  { price: '45,230.12', amount: '0.3456', total: '15,623.45' },
                  { price: '45,225.67', amount: '0.7890', total: '35,689.12' },
                  { price: '45,220.34', amount: '1.5678', total: '70,845.23' },
                  { price: '45,215.89', amount: '0.9876', total: '44,667.89' }
                ].map((order, index) => (
                  <div key={index} className="flex justify-between text-sm bg-green-900/10 p-2 rounded">
                    <span className="text-green-400">{order.price}</span>
                    <span className="text-gray-300">{order.amount}</span>
                    <span className="text-gray-400">{order.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Stats */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Market Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-700/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-400 mb-2">$1.89T</div>
              <p className="text-gray-300">Total Market Cap</p>
              <p className="text-green-400 text-sm mt-1">+2.34% (24h)</p>
            </div>
            <div className="text-center p-4 bg-gray-700/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-400 mb-2">$89.5B</div>
              <p className="text-gray-300">24h Trading Volume</p>
              <p className="text-red-400 text-sm mt-1">-1.23% (24h)</p>
            </div>
            <div className="text-center p-4 bg-gray-700/30 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400 mb-2">48.7%</div>
              <p className="text-gray-300">Bitcoin Dominance</p>
              <p className="text-green-400 text-sm mt-1">+0.45% (24h)</p>
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
            title="Unlock Real-Time Data"
            description="Access live market data and trading information - 100% free!"
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

export default RealTimeData;
