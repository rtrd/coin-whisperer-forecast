
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, PieChart, TrendingUp, Wallet, Plus } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import Footer from "@/components/Footer";

const PortfolioTracking = () => {
  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' },
  ];

  const portfolioAssets = [
    { symbol: 'BTC', amount: 0.5, value: 22617.28, allocation: 45.2, change: 2.34 },
    { symbol: 'ETH', amount: 8.2, value: 21765.42, allocation: 43.5, change: -1.22 },
    { symbol: 'ADA', amount: 1500, value: 3450.00, allocation: 6.9, change: 3.67 },
    { symbol: 'SOL', amount: 25, value: 2237.50, allocation: 4.4, change: 5.23 },
  ];

  const totalValue = portfolioAssets.reduce((sum, asset) => sum + asset.value, 0);

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
                  <PieChart className="h-8 w-8 text-green-400" />
                  <CardTitle 
                    className="text-4xl text-white"
                    style={{ textShadow: '0 0 15px rgba(0, 0, 0, 0.3)' }}
                  >
                    Portfolio Tracking
                  </CardTitle>
                </div>
                <p className="text-gray-300 text-lg">Track your cryptocurrency investments and portfolio performance</p>
              </CardHeader>
            </Card>

            {/* Portfolio Overview */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-blue-400" />
                    Portfolio Overview
                  </CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Asset
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-3xl font-bold text-white mb-2">${totalValue.toLocaleString()}</div>
                    <p className="text-gray-400">Total Value</p>
                    <Badge className="bg-green-600 mt-2">+2.45%</Badge>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-3xl font-bold text-green-400 mb-2">+$1,234</div>
                    <p className="text-gray-400">24h P&L</p>
                    <Badge className="bg-green-600 mt-2">+2.52%</Badge>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-3xl font-bold text-blue-400 mb-2">4</div>
                    <p className="text-gray-400">Assets</p>
                    <Badge className="bg-blue-600 mt-2">Diversified</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Assets */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Your Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioAssets.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{asset.symbol}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{asset.symbol}</h4>
                          <p className="text-gray-400 text-sm">{asset.amount} tokens</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-bold">${asset.value.toLocaleString()}</p>
                        <p className="text-gray-400 text-sm">{asset.allocation}% of portfolio</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${asset.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {asset.change > 0 ? '+' : ''}{asset.change.toFixed(2)}%
                        </p>
                        <p className="text-gray-400 text-sm">24h change</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Return</span>
                      <span className="text-green-400 font-bold">+15.67%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Best Performer</span>
                      <span className="text-green-400 font-bold">SOL (+45.2%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Worst Performer</span>
                      <span className="text-red-400 font-bold">ETH (-8.5%)</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sharpe Ratio</span>
                      <span className="text-blue-400 font-bold">1.34</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Drawdown</span>
                      <span className="text-red-400 font-bold">-12.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Volatility</span>
                      <span className="text-yellow-400 font-bold">28.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Alerts */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Portfolio Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg">
                    <p className="text-green-400 font-medium">Price Alert Triggered</p>
                    <p className="text-gray-300 text-sm">BTC reached your target price of $45,000</p>
                  </div>
                  <div className="p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                    <p className="text-yellow-400 font-medium">Rebalancing Suggested</p>
                    <p className="text-gray-300 text-sm">Your portfolio allocation has drifted from target</p>
                  </div>
                  <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                    <p className="text-blue-400 font-medium">Performance Update</p>
                    <p className="text-gray-300 text-sm">Your portfolio outperformed the market by 3.2% this week</p>
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

export default PortfolioTracking;
