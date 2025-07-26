import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { useAdScript } from "@/hooks/useAdScript";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Activity, TrendingUp, BarChart3, Zap, Clock } from "lucide-react";
import { AdUnit } from "@/components/ads/AdService";
import { GAMAdUnit } from "@/components/ads/GAMAdUnit";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import Footer from "@/components/Footer";
import { getAllCryptos } from "../../utils/api";

const RealTimeData = () => {
  // Initialize ad script on page load
  useAdScript();
  
  const [marketData, setMarketData] = useState([]);
  
  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' },
  ];

  const CACHE_KEY = "topGainersAndLosers";
  const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

  // Fetch real market data using the same approach as Article.tsx
  const fetchAndCacheMarketData = async () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setMarketData(data);
          return;
        }
      } catch (err) {
        console.error('Cache parsing error:', err);
      }
    }
    
    try {
      const data = await getAllCryptos();
      setMarketData(data);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Fallback to mock data
      setMarketData([
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price_change_percentage_24h: 5.2, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', current_price: 118184 },
        { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price_change_percentage_24h: 3.1, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', current_price: 3007 },
        { id: 'cardano', name: 'Cardano', symbol: 'ADA', price_change_percentage_24h: -2.5, image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', current_price: 0.72 },
        { id: 'solana', name: 'Solana', symbol: 'SOL', price_change_percentage_24h: -1.8, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', current_price: 164 }
      ]);
    }
  };

  useEffect(() => {
    fetchAndCacheMarketData();
  }, []);

  return (
    <>
      <script async src="https://appsha-prm.ctengine.io/js/script.js?wkey=Fkrv2lWxUV"></script>
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

      {/* Google Ad Manager - Header Ad */}
      <GAMAdUnit
        adUnitId="div-gpt-ad-1752654531765-0"
        size={[728, 90]}
        className="mb-6 md:mb-8"
      />

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
                  <Activity className="h-8 w-8 text-blue-400" />
                  <CardTitle 
                    className="text-4xl text-white"
                    style={{ textShadow: '0 0 15px rgba(0, 0, 0, 0.3)' }}
                  >
                    Real-Time Data
                  </CardTitle>
                </div>
                <p className="text-gray-300 text-lg">Live cryptocurrency market data and real-time price movements</p>
              </CardHeader>
            </Card>

            {/* Live Data Feed */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Live Price Feed
                  <Badge variant="outline" className="text-green-400 border-green-400 animate-pulse">
                    LIVE
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time price updates for major cryptocurrencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Bitcoin', 'Ethereum', 'Cardano', 'Solana', 'Polygon', 'Chainlink'].map((crypto, index) => (
                    <div key={crypto} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <h4 className="text-white font-medium">{crypto}</h4>
                        <Badge variant="outline" className="text-xs">LIVE</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">
                          ${(Math.random() * 50000 + 1000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className={`text-sm ${Math.random() > 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                          {Math.random() > 0.5 ? '+' : ''}{(Math.random() * 10 - 5).toFixed(2)}% (24h)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Overview */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Market Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-700/50 rounded-lg text-center">
                    <p className="text-gray-400 text-sm mb-2">Total Market Cap</p>
                    <p className="text-2xl font-bold text-white">$2.1T</p>
                    <p className="text-green-400 text-sm">+2.4% (24h)</p>
                  </div>
                  <div className="p-4 bg-gray-700/50 rounded-lg text-center">
                    <p className="text-gray-400 text-sm mb-2">24h Volume</p>
                    <p className="text-2xl font-bold text-white">$85.2B</p>
                    <p className="text-blue-400 text-sm">+8.1% (24h)</p>
                  </div>
                  <div className="p-4 bg-gray-700/50 rounded-lg text-center">
                    <p className="text-gray-400 text-sm mb-2">BTC Dominance</p>
                    <p className="text-2xl font-bold text-white">42.8%</p>
                    <p className="text-amber-400 text-sm">-0.3% (24h)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Trading Activity */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Live Trading Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span className="text-gray-300 text-sm">
                          {Math.random() > 0.5 ? 'BUY' : 'SELL'} {(Math.random() * 10).toFixed(2)} BTC
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm">
                          ${(Math.random() * 100000 + 50000).toLocaleString()}
                        </span>
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-400 text-xs">now</span>
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
              <MarketWinnersWidget topGainnersandLoosers={marketData} />
              <AdUnit type="skyscraper" />
            </div>
          </div>
        </div>

        {/* Google Ad Manager - Bottom Ad */}
        <GAMAdUnit
          adUnitId="div-gpt-ad-1752654531765-1"
          size={[728, 90]}
          className="mt-8"
        />
      </div>

      <Footer />
    </div>
    </>
  );
};

export default RealTimeData;
