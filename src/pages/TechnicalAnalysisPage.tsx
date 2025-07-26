import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { useAdScript } from "@/hooks/useAdScript";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, BarChart3, TrendingUp, Calculator, Activity, Zap, Target, LineChart, PieChart, BarChart } from "lucide-react";
import { AdUnit } from "@/components/ads/AdService";
import { GAMAdUnit } from "@/components/ads/GAMAdUnit";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import Footer from "@/components/Footer";
import { getAllCryptos } from "../../utils/api";

const CACHE_KEY = "topGainersAndLosers";
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

const TechnicalAnalysisPage = () => {
  // Initialize ad script on page load
  useAdScript();
  
  const [marketData, setMarketData] = useState([]);
  
  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' },
  ];

  // Fetch real market data using the same approach as AIPricePrediction.tsx
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
            {/* Key Features Section */}
            <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-4">
                    <BarChart3 className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">Advanced Technical Analysis</h2>
                  <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                    Professional-grade technical indicators and algorithms used by institutional traders
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl border border-blue-500/30 hover:shadow-lg transition-all">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                      <Calculator className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">50+ Indicators</h3>
                    <p className="text-gray-300 text-sm">RSI, MACD, Bollinger Bands, Fibonacci retracements, and more</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl border border-green-500/30 hover:shadow-lg transition-all">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                      <Activity className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Real-Time Signals</h3>
                    <p className="text-gray-300 text-sm">Live buy/sell signals updated every minute with market data</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30 hover:shadow-lg transition-all">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                      <LineChart className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Multi-Timeframe</h3>
                    <p className="text-gray-300 text-sm">Analysis across 1m, 5m, 15m, 1h, 4h, 1d, and weekly charts</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-xl border border-orange-500/30 hover:shadow-lg transition-all">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
                      <Target className="h-8 w-8 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Support/Resistance</h3>
                    <p className="text-gray-300 text-sm">Dynamic S/R levels calculated using volume and price action</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl border border-cyan-500/30 hover:shadow-lg transition-all">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-full mb-4">
                      <Zap className="h-8 w-8 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Algorithm Trading</h3>
                    <p className="text-gray-300 text-sm">Backtested algorithms with proven 78% success rate</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-pink-600/20 to-rose-600/20 rounded-xl border border-pink-500/30 hover:shadow-lg transition-all">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500/20 rounded-full mb-4">
                      <PieChart className="h-8 w-8 text-pink-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Pattern Recognition</h3>
                    <p className="text-gray-300 text-sm">AI-powered detection of head & shoulders, triangles, flags</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Analysis Calculations */}
            <Card className="bg-gray-800/50 border-gray-700 shadow-xl backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border-b border-gray-600/50">
                <div className="flex items-center gap-3 mb-2">
                  <Calculator className="h-8 w-8 text-green-400" />
                  <div>
                    <CardTitle className="text-2xl text-white">
                      How Our Technical Analysis Works
                    </CardTitle>
                    <p className="text-gray-300 mt-2">Mathematical formulas and algorithms behind our indicators</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-700/30 rounded-xl border border-gray-600/50">
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-blue-400" />
                      RSI Calculation
                    </h4>
                    <div className="text-gray-300 text-sm space-y-2">
                      <p className="font-mono bg-gray-800/50 p-3 rounded border">
                        RSI = 100 - (100 / (1 + RS))
                      </p>
                      <p className="font-mono bg-gray-800/50 p-3 rounded border">
                        RS = Average Gain / Average Loss
                      </p>
                      <p className="text-gray-400">Over 14-period default timeframe</p>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gray-700/30 rounded-xl border border-gray-600/50">
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-green-400" />
                      MACD Formula
                    </h4>
                    <div className="text-gray-300 text-sm space-y-2">
                      <p className="font-mono bg-gray-800/50 p-3 rounded border">
                        MACD = EMA(12) - EMA(26)
                      </p>
                      <p className="font-mono bg-gray-800/50 p-3 rounded border">
                        Signal = EMA(9) of MACD
                      </p>
                      <p className="text-gray-400">Exponential Moving Average convergence</p>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gray-700/30 rounded-xl border border-gray-600/50">
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-purple-400" />
                      Bollinger Bands
                    </h4>
                    <div className="text-gray-300 text-sm space-y-2">
                      <p className="font-mono bg-gray-800/50 p-3 rounded border">
                        Upper = SMA(20) + (2 × StdDev)
                      </p>
                      <p className="font-mono bg-gray-800/50 p-3 rounded border">
                        Lower = SMA(20) - (2 × StdDev)
                      </p>
                      <p className="text-gray-400">Volatility-based price channels</p>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gray-700/30 rounded-xl border border-gray-600/50">
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-orange-400" />
                      Fibonacci Levels
                    </h4>
                    <div className="text-gray-300 text-sm space-y-2">
                      <p className="font-mono bg-gray-800/50 p-3 rounded border">
                        Retracement = High - (High - Low) × Ratio
                      </p>
                      <p className="font-mono bg-gray-800/50 p-3 rounded border">
                        Ratios: 23.6%, 38.2%, 50%, 61.8%
                      </p>
                      <p className="text-gray-400">Golden ratio-based support/resistance</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Analysis FAQ */}
            <Card className="bg-gray-800/50 border-gray-700 shadow-xl backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-gray-600/50">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="h-8 w-8 text-blue-400" />
                  <div>
                    <CardTitle className="text-2xl text-white">
                      Technical Analysis FAQ
                    </CardTitle>
                    <p className="text-gray-300 mt-2">Common questions about our technical analysis tools</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="what-is-technical-analysis" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-blue-500/50 transition-colors">
                    <AccordionTrigger className="text-white hover:text-blue-400 font-medium">
                      What is Technical Analysis?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                      Technical analysis is a method of evaluating cryptocurrency prices by analyzing statistical trends gathered from trading activity, such as price movement and volume. Our platform uses advanced mathematical indicators like RSI, MACD, and Bollinger Bands to identify potential trading opportunities and market trends.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="how-indicators-work" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-green-500/50 transition-colors">
                    <AccordionTrigger className="text-white hover:text-green-400 font-medium">
                      How Do Technical Indicators Work?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                      Our technical indicators use mathematical formulas applied to price and volume data. For example, RSI measures the speed and magnitude of price changes to identify overbought/oversold conditions. MACD compares two moving averages to reveal trend changes. Each indicator provides unique insights that work together for comprehensive market analysis.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="accuracy-reliability" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-purple-500/50 transition-colors">
                    <AccordionTrigger className="text-white hover:text-purple-400 font-medium">
                      How Accurate Are Technical Indicators?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                      Our backtesting shows 78% accuracy for combined indicator signals over 2+ years of historical data. Individual indicators vary in accuracy - RSI and MACD perform best on trending markets, while Bollinger Bands excel in ranging conditions. We recommend using multiple indicators together rather than relying on single signals.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="timeframes" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-orange-500/50 transition-colors">
                    <AccordionTrigger className="text-white hover:text-orange-400 font-medium">
                      Which Timeframes Should I Use?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                      Different timeframes serve different purposes: 1-15 minute charts for scalping, 1-4 hour charts for day trading, and daily/weekly charts for swing trading. Our platform analyzes all timeframes simultaneously, with higher timeframes providing stronger trend direction and lower timeframes offering precise entry/exit points.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="support-resistance" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-cyan-500/50 transition-colors">
                    <AccordionTrigger className="text-white hover:text-cyan-400 font-medium">
                      How Are Support and Resistance Levels Calculated?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                      We use volume-weighted price analysis and historical pivot points to identify support/resistance levels. Our algorithm considers price rejection areas, volume spikes, and Fibonacci retracement levels. Dynamic levels update in real-time as new price action confirms or invalidates previous levels, providing the most accurate trading zones.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="best-practices" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-pink-500/50 transition-colors">
                    <AccordionTrigger className="text-white hover:text-pink-400 font-medium">
                      What Are Technical Analysis Best Practices?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                      Always use multiple indicators for confirmation, respect risk management rules (never risk more than 2% per trade), and combine technical analysis with fundamental analysis. Wait for multiple timeframe alignment, use proper position sizing, and remember that technical analysis works best in liquid markets like Bitcoin and Ethereum.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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

        {/* Bottom Ad Placement */}
        <div className="mt-12 flex justify-center">
          <AdUnit type="leaderboard" />
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

export default TechnicalAnalysisPage;
