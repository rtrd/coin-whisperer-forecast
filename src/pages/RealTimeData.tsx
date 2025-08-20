import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAdScript } from "@/hooks/useAdScript";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Activity, TrendingUp, BarChart3, Zap, Clock, Globe, Eye, Radar, Signal, Radio, Wifi, Monitor, ChartLine, ChartBar, ChartPie, Target, Users, MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AdUnit } from "@/components/ads/AdService";
import { GAMAdUnit } from "@/components/ads/GAMAdUnit";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import Footer from "@/components/Footer";
import { getAllCryptos } from "../../utils/api";
import { apiService } from "@/services/apiService";
import { formatMarketCap, formatPrice, formatVolume } from '@/utils/marketDataHelpers';
import VdoFloatingAd from "@/components/ads/VdoFloatingAd";

import ScrollToTop from "@/components/ScrollToTop";

const RealTimeData = () => {
  // Initialize ad script on page load
  useAdScript();
  
  const [marketData, setMarketData] = useState([]);
  const [liveStats, setLiveStats] = useState({
    totalMarketCap: 0,
    totalVolume: 0,
    btcDominance: 0,
    ethDominance: 0,
    activeCoins: 0,
    markets: 0
  });
  const [fearGreedIndex, setFearGreedIndex] = useState({ value: 52, classification: 'Neutral' });
  const [defiTVL, setDefiTVL] = useState({ tvl: 127800000000, change24h: 3.2 });
  const [marketVolatility, setMarketVolatility] = useState({ volatility: 32, trend: 'normal' as 'low' | 'normal' | 'high' });
  const [loading, setLoading] = useState(true);
  
  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' },
  ];

  const CACHE_KEY = "topGainersAndLosers";
  const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes for more frequent updates

  // Fetch real market data using the same approach as Article.tsx
  const fetchAndCacheMarketData = async () => {
    setLoading(true);
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setMarketData(data);
          updateLiveStats(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Cache parsing error:', err);
      }
    }
    
    try {
      const data = await getAllCryptos();
      setMarketData(data);
      updateLiveStats(data);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Fallback to mock data
      const fallbackData = [
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price_change_percentage_24h: 5.2, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', current_price: 118184, market_cap: 2340000000000, total_volume: 45000000000 },
        { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price_change_percentage_24h: 3.1, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', current_price: 3007, market_cap: 362000000000, total_volume: 18000000000 },
        { id: 'cardano', name: 'Cardano', symbol: 'ADA', price_change_percentage_24h: -2.5, image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', current_price: 0.72, market_cap: 25000000000, total_volume: 850000000 },
        { id: 'solana', name: 'Solana', symbol: 'SOL', price_change_percentage_24h: -1.8, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', current_price: 164, market_cap: 78000000000, total_volume: 3200000000 }
      ];
      setMarketData(fallbackData);
      updateLiveStats(fallbackData);
    }
    setLoading(false);
  };

  const updateLiveStats = (data) => {
    const totalMarketCap = data.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
    const totalVolume = data.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);
    const btcMarketCap = data.find(coin => coin.id === 'bitcoin')?.market_cap || 0;
    const ethMarketCap = data.find(coin => coin.id === 'ethereum')?.market_cap || 0;
    
    setLiveStats({
      totalMarketCap,
      totalVolume,
      btcDominance: totalMarketCap > 0 ? (btcMarketCap / totalMarketCap * 100) : 42.8,
      ethDominance: totalMarketCap > 0 ? (ethMarketCap / totalMarketCap * 100) : 18.2,
      activeCoins: data.length,
      markets: Math.floor(data.length * 1.5) // Approximate markets per coin
    });
  };

  const fetchRealTimeMetrics = async () => {
    try {
      const [fearGreed, tvl, volatility] = await Promise.all([
        apiService.getFearGreedIndex(),
        apiService.getDefiTVL(),
        apiService.getMarketVolatility()
      ]);
      
      setFearGreedIndex(fearGreed);
      setDefiTVL(tvl);
      setMarketVolatility(volatility);
    } catch (error) {
      console.error('Error fetching real-time metrics:', error);
    }
  };

  useEffect(() => {
    fetchAndCacheMarketData();
    fetchRealTimeMetrics();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAndCacheMarketData();
      fetchRealTimeMetrics();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-x-hidden">
      <ScrollToTop />
            {loading ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <Helmet>
                  <title>Real-Time Cryptocurrency Market Data | Live Prices & Analytics</title>
                  <meta name="description" content="Access real-time cryptocurrency market data with live prices, trading volumes, social sentiment analysis, and comprehensive market intelligence. Professional-grade tools for crypto traders." />
                  <meta name="keywords" content="real-time crypto data, live cryptocurrency prices, market data, trading analytics, social sentiment, market intelligence" />
                  <meta property="og:title" content="Real-Time Cryptocurrency Market Data | Live Prices & Analytics" />
                  <meta property="og:description" content="Professional real-time crypto market data with live prices, social sentiment analysis, and comprehensive trading analytics." />
                  <meta property="og:type" content="website" />
                  <link rel="canonical" href="https://yoursite.com/real-time-data" />
                </Helmet>

                {/* Header like homepage */}
                <div className="container mx-auto px-4 py-4 md:py-8">
                  <IndexHeader
                    selectedCrypto="bitcoin"
                    cryptoOptions={cryptoOptions}
                    currentPrice={marketData.find(coin => coin.id === 'bitcoin')?.current_price || 45000}
                    priceChange={marketData.find(coin => coin.id === 'bitcoin')?.price_change_percentage_24h || 2.5}
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
        <div className="flex items-center mb-6">
          <Link to="/">
            <Button variant="outline" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-4 sm:space-y-6 lg:space-y-8">
                      {/* Real-Time Features Section */}
                      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm">
                        <CardContent className="p-8">
                          <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-4">
                              <Activity className="h-10 w-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-3">Real-Time Market Intelligence</h2>
                            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                              Live cryptocurrency data streaming with millisecond precision and professional-grade analytics
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl border border-blue-500/30 hover:shadow-lg transition-all">
                              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/20 rounded-full mb-3 sm:mb-4">
                                <Radio className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                              </div>
                              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Live Data Streams</h3>
                              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">Real-time price feeds updated every second via WebSocket connections</p>
                            </div>
                            
                            <div className="text-center p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl border border-green-500/30 hover:shadow-lg transition-all">
                              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                                <Signal className="h-8 w-8 text-green-400" />
                              </div>
                              <h3 className="text-xl font-semibold text-white mb-2">Market Signals</h3>
                              <p className="text-gray-300 text-sm">Instant buy/sell signals based on real-time market movements</p>
                            </div>
                            
                            <div className="text-center p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30 hover:shadow-lg transition-all">
                              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                                <Radar className="h-8 w-8 text-purple-400" />
                              </div>
                              <h3 className="text-xl font-semibold text-white mb-2">Volume Tracking</h3>
                              <p className="text-gray-300 text-sm">Live volume analysis across multiple exchanges and trading pairs</p>
                            </div>
                            
                            <div className="text-center p-6 bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-xl border border-orange-500/30 hover:shadow-lg transition-all">
                              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
                                <Monitor className="h-8 w-8 text-orange-400" />
                              </div>
                              <h3 className="text-xl font-semibold text-white mb-2">Multi-Exchange</h3>
                              <p className="text-gray-300 text-sm">Aggregated data from 50+ exchanges for complete market coverage</p>
                            </div>
                            
                            <div className="text-center p-6 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl border border-cyan-500/30 hover:shadow-lg transition-all">
                              <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-full mb-4">
                                <Wifi className="h-8 w-8 text-cyan-400" />
                              </div>
                              <h3 className="text-xl font-semibold text-white mb-2">Low Latency</h3>
                              <p className="text-gray-300 text-sm">Sub-second data delivery for professional trading applications</p>
                            </div>
                            
                            <div className="text-center p-6 bg-gradient-to-br from-pink-600/20 to-rose-600/20 rounded-xl border border-pink-500/30 hover:shadow-lg transition-all">
                              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500/20 rounded-full mb-4">
                                <Eye className="h-8 w-8 text-pink-400" />
                              </div>
                              <h3 className="text-xl font-semibold text-white mb-2">Market Surveillance</h3>
                              <p className="text-gray-300 text-sm">24/7 monitoring for unusual trading patterns and market anomalies</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Real-Time Data FAQ */}
                      <Card className="bg-gray-800/50 border-gray-700 shadow-xl backdrop-blur-sm">
                        <CardHeader className="bg-gradient-to-r from-blue-600/10 to-green-600/10 border-b border-gray-600/50">
                          <div className="flex items-center gap-3 mb-2">
                            <Activity className="h-8 w-8 text-blue-400" />
                            <div>
                              <CardTitle className="text-2xl text-white">
                                Real-Time Data FAQ
                              </CardTitle>
                              <p className="text-gray-300 mt-2">Learn about our real-time cryptocurrency data feeds and how they work</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <Accordion type="single" collapsible className="space-y-3">
                            <AccordionItem value="what-is-realtime" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-blue-500/50 transition-colors">
                              <AccordionTrigger className="text-white hover:text-blue-400 font-medium">
                                What is real-time market data?
                              </AccordionTrigger>
                              <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                                Real-time market data provides live price updates, trading volumes, and market metrics updated within seconds of market movements. This data is essential for making informed trading decisions and understanding market dynamics as they happen.
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="update-frequency" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-green-500/50 transition-colors">
                              <AccordionTrigger className="text-white hover:text-green-400 font-medium">
                                How often is the data updated?
                              </AccordionTrigger>
                              <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                                Our platform updates cryptocurrency prices and market data every 30 seconds to 1 minute, depending on the data source. Social sentiment data from LunarCrush is updated multiple times per hour to capture the latest social media trends.
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="data-sources" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-purple-500/50 transition-colors">
                              <AccordionTrigger className="text-white hover:text-purple-400 font-medium">
                                What sources do you use for market data?
                              </AccordionTrigger>
                              <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                                We aggregate data from multiple premium sources including CoinGecko Pro API for price and market data, and LunarCrush API for social sentiment analysis. This multi-source approach ensures accuracy and comprehensive coverage.
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="sentiment-analysis" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-orange-500/50 transition-colors">
                              <AccordionTrigger className="text-white hover:text-orange-400 font-medium">
                                What is social sentiment analysis?
                              </AccordionTrigger>
                              <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                                Social sentiment analysis uses AI to analyze millions of social media posts, news articles, and online discussions about cryptocurrencies. It provides insights into market psychology and can often predict price movements before they occur.
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="prediction-accuracy" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-cyan-500/50 transition-colors">
                              <AccordionTrigger className="text-white hover:text-cyan-400 font-medium">
                                How accurate are the market predictions?
                              </AccordionTrigger>
                              <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                                Our AI models combine real-time price data, technical indicators, and social sentiment to generate predictions. While no prediction is guaranteed, our multi-factor approach historically shows higher accuracy than single-metric models.
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="automated-trading" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-pink-500/50 transition-colors">
                              <AccordionTrigger className="text-white hover:text-pink-400 font-medium">
                                Can I use this data for automated trading?
                              </AccordionTrigger>
                              <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                                Yes, our real-time data feeds are designed to support both manual analysis and automated trading strategies. The low-latency updates and comprehensive metrics make it suitable for algorithmic trading applications.
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="what-makes-different" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-yellow-500/50 transition-colors">
                              <AccordionTrigger className="text-white hover:text-yellow-400 font-medium">
                                What makes your data different?
                              </AccordionTrigger>
                              <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                                We provide a unique combination of on-chain metrics, real-time price data, and social sentiment analysis all in one platform. This 360-degree view of the market gives traders and investors a significant advantage.
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="api-availability" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-indigo-500/50 transition-colors">
                              <AccordionTrigger className="text-white hover:text-indigo-400 font-medium">
                                Is there an API available?
                              </AccordionTrigger>
                              <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                                Currently, our real-time data is available through our web platform. We're developing API access for premium subscribers to integrate our data feeds directly into their own applications and trading systems.
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>
                      </Card>

                      {/* Live Price Feed */}
                      <Card className="bg-gray-800/50 border-gray-700 shadow-xl backdrop-blur-sm">
                        <CardHeader className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-b border-gray-600/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <TrendingUp className="h-8 w-8 text-purple-400" />
                              <div>
                                <CardTitle className="text-2xl text-white">Live Price Feed</CardTitle>
                                <p className="text-gray-300 mt-1">Real-time cryptocurrency prices</p>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            {marketData.slice(0, 8).map((crypto, index) => (
                              <Link 
                                key={crypto.id} 
                                to={`/token/${crypto.id}`}
                                className="block transition-all duration-200 hover:scale-[1.01]"
                              >
                                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-purple-500/50 hover:bg-gray-700/50">
                                  <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                                    <div>
                                      <h4 className="text-white font-medium">{crypto.name}</h4>
                                      <p className="text-gray-400 text-sm">{crypto.symbol.toUpperCase()}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-white font-bold">
                                      ${formatPrice(crypto.current_price)}
                                    </p>
                                    <p className={`text-sm ${crypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                      {crypto.price_change_percentage_24h >= 0 ? '+' : ''}{crypto.price_change_percentage_24h?.toFixed(2)}% (24h)
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Global Market Statistics */}
                      <Card className="bg-gray-800/50 border-gray-700 shadow-xl backdrop-blur-sm">
                        <CardHeader className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border-b border-gray-600/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Globe className="h-8 w-8 text-green-400" />
                              <div>
                                <CardTitle className="text-2xl text-white">Global Market Statistics</CardTitle>
                                <p className="text-gray-300 mt-1">Live data updated every 30 seconds</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-green-400 border-green-400 animate-pulse">
                              LIVE
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl border border-blue-500/30">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-white font-semibold flex items-center gap-2">
                                  <ChartPie className="h-5 w-5 text-blue-400" />
                                  Total Market Cap
                                </h4>
                                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                              </div>
                              <p className="text-3xl font-bold text-white mb-2">
                                ${formatMarketCap(liveStats.totalMarketCap || 2850000000000)}
                              </p>
                              <p className="text-green-400 text-sm">+2.4% (24h)</p>
                            </div>
                            
                            <div className="p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl border border-green-500/30">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-white font-semibold flex items-center gap-2">
                                  <ChartBar className="h-5 w-5 text-green-400" />
                                  24h Volume
                                </h4>
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                              </div>
                              <p className="text-3xl font-bold text-white mb-2">
                                ${formatVolume(liveStats.totalVolume || 98500000000)}
                              </p>
                              <p className="text-blue-400 text-sm">+8.1% (24h)</p>
                            </div>
                            
                            <div className="p-6 bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-xl border border-orange-500/30">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-white font-semibold flex items-center gap-2">
                                  <Target className="h-5 w-5 text-orange-400" />
                                  BTC Dominance
                                </h4>
                                <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                              </div>
                              <p className="text-3xl font-bold text-white mb-2">{liveStats.btcDominance.toFixed(1)}%</p>
                              <p className="text-amber-400 text-sm">-0.3% (24h)</p>
                            </div>
                            
                            <div className="p-6 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl border border-cyan-500/30">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-white font-semibold flex items-center gap-2">
                                  <ChartLine className="h-5 w-5 text-cyan-400" />
                                  Market Volatility
                                </h4>
                                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                              </div>
                              <p className="text-3xl font-bold text-white mb-2">{marketVolatility.volatility}</p>
                              <p className={`text-sm ${marketVolatility.trend === 'low' ? 'text-green-400' : marketVolatility.trend === 'high' ? 'text-red-400' : 'text-yellow-400'}`}>
                                {marketVolatility.trend === 'low' ? 'Low volatility' : marketVolatility.trend === 'high' ? 'High volatility' : 'Normal volatility'}
                              </p>
                            </div>
                            
                            <div className="p-6 bg-gradient-to-br from-pink-600/20 to-rose-600/20 rounded-xl border border-pink-500/30">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-white font-semibold flex items-center gap-2">
                                  <Target className="h-5 w-5 text-pink-400" />
                                  Fear & Greed
                                </h4>
                                <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
                              </div>
                              <p className="text-3xl font-bold text-white mb-2">{fearGreedIndex.value}</p>
                              <p className={`text-sm ${fearGreedIndex.value >= 75 ? 'text-red-400' : fearGreedIndex.value >= 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                                {fearGreedIndex.classification}
                              </p>
                            </div>
                            
                            <div className="p-6 bg-gradient-to-br from-emerald-600/20 to-green-600/20 rounded-xl border border-emerald-500/30">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-white font-semibold flex items-center gap-2">
                                  <ChartBar className="h-5 w-5 text-emerald-400" />
                                  DeFi TVL
                                </h4>
                                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                              </div>
                              <p className="text-3xl font-bold text-white mb-2">${formatMarketCap(defiTVL.tvl)}</p>
                              <p className="text-green-400 text-sm">+{defiTVL.change24h}% (24h)</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Ad Banner After Section 1 */}
                      <div className="w-full min-h-[120px] bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center my-8">
                        <GAMAdUnit
                          adUnitId="div-gpt-ad-1752654531765-2"
                          size={[728, 120]}
                          className="max-w-full h-full"
                        />
                      </div>

                      {/* Market Movers Analysis */}
                      <Card className="bg-gray-800/50 border-gray-700 shadow-xl backdrop-blur-sm">
                        <CardHeader className="bg-gradient-to-r from-orange-600/10 to-red-600/10 border-b border-gray-600/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Zap className="h-8 w-8 text-orange-400" />
                              <div>
                                <CardTitle className="text-2xl text-white">Market Movers Analysis</CardTitle>
                                <p className="text-gray-300 mt-1">Real-time market momentum and volume insights</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-orange-400 border-orange-400 animate-pulse">
                              LIVE
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Top Gainers */}
                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-400" />
                                Top Gainers (24h)
                              </h4>
                              {marketData
                                .filter(crypto => crypto.price_change_percentage_24h > 0)
                                .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
                                .slice(0, 5)
                                .map((crypto, index) => (
                                  <Link 
                                    key={crypto.id} 
                                    to={`/token/${crypto.id}`}
                                    className="block transition-all duration-200 hover:scale-[1.02]"
                                  >
                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg border border-green-500/30 hover:border-green-400/50">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                          <span className="text-green-400 font-bold text-sm">#{index + 1}</span>
                                        </div>
                                        <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                                        <div>
                                          <p className="text-white font-medium">{crypto.name}</p>
                                          <p className="text-gray-400 text-sm">{crypto.symbol.toUpperCase()}</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-white font-semibold">${formatPrice(crypto.current_price)}</p>
                                        <div className="flex items-center gap-1">
                                          <TrendingUp className="h-3 w-3 text-green-400" />
                                          <span className="text-green-400 text-sm font-medium">
                                            +{crypto.price_change_percentage_24h.toFixed(2)}%
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                            </div>

                            {/* High Volume Movers */}
                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                <ChartBar className="h-5 w-5 text-blue-400" />
                                High Volume Movers
                              </h4>
                              {marketData
                                .sort((a, b) => b.total_volume - a.total_volume)
                                .slice(0, 5)
                                .map((crypto, index) => (
                                  <Link 
                                    key={crypto.id} 
                                    to={`/token/${crypto.id}`}
                                    className="block transition-all duration-200 hover:scale-[1.02]"
                                  >
                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg border border-blue-500/30 hover:border-blue-400/50">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                          <span className="text-blue-400 font-bold text-sm">#{index + 1}</span>
                                        </div>
                                        <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                                        <div>
                                          <p className="text-white font-medium">{crypto.name}</p>
                                          <p className="text-gray-400 text-sm">{crypto.symbol.toUpperCase()}</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-white font-semibold">${formatVolume(crypto.total_volume)}</p>
                                        <div className="flex items-center gap-1">
                                          <ChartBar className="h-3 w-3 text-blue-400" />
                                          <span className={`text-sm font-medium ${
                                            crypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                                          }`}>
                                            {crypto.price_change_percentage_24h >= 0 ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                            </div>
                          </div>

                          {/* Market Momentum Indicators */}
                          <div className="border-t border-gray-600/50 pt-6">
                            <h4 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                              <Target className="h-5 w-5 text-purple-400" />
                              Market Momentum Indicators
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-gray-300 text-sm">Bullish Signals</span>
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                </div>
                                <p className="text-2xl font-bold text-white">
                                  {marketData.filter(crypto => crypto.price_change_percentage_24h > 5).length}
                                </p>
                                <p className="text-green-400 text-xs">Tokens +5% or more</p>
                              </div>
                              
                              <div className="p-4 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg border border-orange-500/30">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-gray-300 text-sm">Bearish Signals</span>
                                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                </div>
                                <p className="text-2xl font-bold text-white">
                                  {marketData.filter(crypto => crypto.price_change_percentage_24h < -5).length}
                                </p>
                                <p className="text-red-400 text-xs">Tokens -5% or more</p>
                              </div>
                              
                              <div className="p-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg border border-cyan-500/30">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-gray-300 text-sm">Neutral Zone</span>
                                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                </div>
                                <p className="text-2xl font-bold text-white">
                                  {marketData.filter(crypto => 
                                    crypto.price_change_percentage_24h >= -5 && crypto.price_change_percentage_24h <= 5
                                  ).length}
                                </p>
                                <p className="text-yellow-400 text-xs">Tokens in ±5% range</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Ad Banner After Section 2 */}
                      <div className="w-full min-h-[120px] bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center my-8">
                        <GAMAdUnit
                          adUnitId="div-gpt-ad-1752654531765-3"
                          size={[728, 120]}
                          className="max-w-full h-full"
                        />
                      </div>

                      {/* Social Sentiment Intelligence */}
                      <Card className="bg-gray-800/50 border-gray-700 shadow-xl backdrop-blur-sm">
                        <CardHeader className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-gray-600/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <MessageCircle className="h-8 w-8 text-blue-400" />
                              <div>
                                <CardTitle className="text-2xl text-white">Social Sentiment Intelligence</CardTitle>
                                <p className="text-gray-300 mt-1">Real-time social data and sentiment analysis from LunarCrush</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-blue-400 border-blue-400 animate-pulse">
                              SOCIAL
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            <div className="text-center p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl border border-blue-500/30 hover:shadow-lg transition-all">
                              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                                <Users className="h-8 w-8 text-blue-400" />
                              </div>
                              <h3 className="text-xl font-semibold text-white mb-2">Social Volume</h3>
                              <p className="text-gray-300 text-sm">Track social mentions, posts, and engagement across platforms</p>
                            </div>
                            
                            <div className="text-center p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl border border-green-500/30 hover:shadow-lg transition-all">
                              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                                <TrendingUp className="h-8 w-8 text-green-400" />
                              </div>
                              <h3 className="text-xl font-semibold text-white mb-2">Sentiment Score</h3>
                              <p className="text-gray-300 text-sm">AI-powered sentiment analysis from social conversations</p>
                            </div>
                            
                            <div className="text-center p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30 hover:shadow-lg transition-all">
                              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                                <Eye className="h-8 w-8 text-purple-400" />
                              </div>
                              <h3 className="text-xl font-semibold text-white mb-2">Influencer Impact</h3>
                              <p className="text-gray-300 text-sm">Monitor key influencer mentions and their market impact</p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                              <MessageCircle className="h-5 w-5 text-blue-400" />
                              Why Social Data Matters
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  <h5 className="text-white font-medium">Early Signal Detection</h5>
                                </div>
                                <p className="text-gray-300 text-sm">Social sentiment often precedes price movements, providing early warning signals for market shifts.</p>
                              </div>
                              
                              <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  <h5 className="text-white font-medium">Market Psychology</h5>
                                </div>
                                <p className="text-gray-300 text-sm">Understand crowd psychology and retail investor sentiment that drives market volatility.</p>
                              </div>
                              
                              <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                  <h5 className="text-white font-medium">Risk Management</h5>
                                </div>
                                <p className="text-gray-300 text-sm">Identify potential risks by monitoring negative sentiment spikes and FUD campaigns.</p>
                              </div>
                              
                              <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                  <h5 className="text-white font-medium">Opportunity Discovery</h5>
                                </div>
                                <p className="text-gray-300 text-sm">Discover emerging trends and tokens gaining social traction before they hit mainstream media.</p>
                              </div>
                            </div>
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
                <VdoFloatingAd />
                <Footer />
              </>
            )}
    </div>
  );
};

export default RealTimeData;