import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAdScript } from "@/hooks/useAdScript";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  Brain,
  TrendingUp,
  BarChart3,
  Zap,
  Target,
  Cpu,
  Shield,
  ChartLine,
  Users,
} from "lucide-react";
import { AdUnit } from "@/components/ads/AdService";
import { GAMAdUnit } from "@/components/ads/GAMAdUnit";
import { IndexHeader } from "@/components/IndexHeader";
import { MainNavigation } from "@/components/MainNavigation";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import { SignupLock } from "@/components/SignupLock";
import { LazyLiveAIPredictions } from "@/components/lazy/LazyLiveAIPredictions";
import Footer from "@/components/Footer";
import { getAllCryptos } from "../../utils/api";

const CACHE_KEY = "topGainersAndLosers";
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

const AIPricePrediction = () => {
  const [marketData, setMarketData] = useState([]);

  const cryptoOptions = [
    {
      value: "bitcoin",
      label: "Bitcoin (BTC)",
      icon: "₿",
      category: "Major",
      score: 8.5,
      prediction: "+12.5%",
    },
    {
      value: "ethereum",
      label: "Ethereum (ETH)",
      icon: "Ξ",
      category: "Major",
      score: 8.2,
      prediction: "+8.3%",
    },
  ];

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
        console.error("Cache parsing error:", err);
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
      console.error("Error fetching market data:", error);
      // Fallback to mock data
      setMarketData([
        {
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "BTC",
          price_change_percentage_24h: 5.2,
          image:
            "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
          current_price: 118184,
        },
        {
          id: "ethereum",
          name: "Ethereum",
          symbol: "ETH",
          price_change_percentage_24h: 3.1,
          image:
            "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
          current_price: 3007,
        },
        {
          id: "cardano",
          name: "Cardano",
          symbol: "ADA",
          price_change_percentage_24h: -2.5,
          image:
            "https://assets.coingecko.com/coins/images/975/large/cardano.png",
          current_price: 0.72,
        },
        {
          id: "solana",
          name: "Solana",
          symbol: "SOL",
          price_change_percentage_24h: -1.8,
          image:
            "https://assets.coingecko.com/coins/images/4128/large/solana.png",
          current_price: 164,
        },
      ]);
    }
  };

  useEffect(() => {
    fetchAndCacheMarketData();
  }, []);

  const lockedContent = (
    <div className="lg:col-span-3 space-y-8">
      {/* Key Features Section */}
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              AI-Powered Predictions
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Experience the future of crypto trading with our advanced machine
              learning algorithms
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
             <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl border border-blue-500/30 hover:shadow-lg transition-all">
               <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/20 rounded-full mb-3 sm:mb-4">
                 <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
               </div>
               <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                 Real-Time Analysis
               </h3>
               <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                 Predictions updated every 15 minutes using live market data
               </p>
             </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl border border-green-500/30 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <Target className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                95% Accuracy
              </h3>
              <p className="text-gray-300 text-sm">
                Proven track record with industry-leading prediction accuracy
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                <Cpu className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Multi-Model AI
              </h3>
              <p className="text-gray-300 text-sm">
                LSTM, Random Forest, and Transformer models working together
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-xl border border-orange-500/30 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
                <Shield className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Risk Assessment
              </h3>
              <p className="text-gray-300 text-sm">
                Confidence scores and risk analysis for informed decisions
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl border border-cyan-500/30 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-full mb-4">
                <ChartLine className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                30+ Data Sources
              </h3>
              <p className="text-gray-300 text-sm">
                Comprehensive market analysis from premium APIs and exchanges
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-pink-600/20 to-rose-600/20 rounded-xl border border-pink-500/30 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500/20 rounded-full mb-4">
                <Users className="h-8 w-8 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Community Driven
              </h3>
              <p className="text-gray-300 text-sm">
                Social sentiment analysis from Twitter, Reddit, and news sources
              </p>
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

      {/* AI Price Prediction FAQ */}
      <Card className="bg-gray-800/50 border-gray-700 shadow-xl backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-gray-600/50">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-8 w-8 text-blue-400" />
            <div>
              <CardTitle className="text-2xl text-white">
                How Pump Parade's AI Price Prediction Works
              </CardTitle>
              <p className="text-gray-300 mt-2">
                Get instant crypto price predictions powered by advanced machine
                learning
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem
              value="what-is-ai-prediction"
              className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-blue-500/50 transition-colors"
            >
              <AccordionTrigger className="text-white hover:text-blue-400 font-medium">
                What is AI Price Prediction on Pump Parade?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                Pump Parade's AI Price Prediction uses advanced machine learning
                algorithms to analyze cryptocurrency market data and provide
                real-time price forecasts. Our system processes thousands of
                data points including price history, volume, market sentiment,
                and technical indicators to generate accurate predictions for
                short-term and long-term price movements.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="how-it-works"
              className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-green-500/50 transition-colors"
            >
              <AccordionTrigger className="text-white hover:text-green-400 font-medium">
                How Does Our AI Algorithm Work?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                Our AI system combines multiple neural network architectures
                including LSTM (Long Short-Term Memory) networks for time series
                analysis, Random Forest for pattern recognition, and Transformer
                models for complex market behavior understanding. The algorithm
                analyzes historical price data, trading volumes, social
                sentiment, and macro-economic factors to generate predictions
                with confidence scores.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="accuracy"
              className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-purple-500/50 transition-colors"
            >
              <AccordionTrigger className="text-white hover:text-purple-400 font-medium">
                How Accurate Are the Predictions?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                Our AI models achieve accuracy rates of 85-95% for short-term
                predictions (24-48 hours) and 70-85% for medium-term forecasts
                (1-7 days). The accuracy varies by cryptocurrency, with major
                coins like Bitcoin and Ethereum showing higher prediction
                accuracy due to more stable trading patterns and larger data
                sets.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="data-sources"
              className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-orange-500/50 transition-colors"
            >
              <AccordionTrigger className="text-white hover:text-orange-400 font-medium">
                What Data Sources Do We Use?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                We aggregate data from 30+ premium APIs including major
                exchanges (Binance, Coinbase, Kraken), social sentiment from
                Twitter and Reddit, on-chain analytics, Google Trends, fear &
                greed index, and macro-economic indicators. This comprehensive
                data approach ensures our predictions consider all market-moving
                factors.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="how-to-use"
              className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-cyan-500/50 transition-colors"
            >
              <AccordionTrigger className="text-white hover:text-cyan-400 font-medium">
                How to Use AI Predictions for Trading?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                Our AI predictions show expected price movements with confidence
                levels. Use predictions as one factor in your trading decisions
                - combine them with your own analysis, risk management, and
                never invest more than you can afford to lose. Higher confidence
                scores (above 80%) indicate stronger conviction in the
                prediction.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="updates"
              className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-pink-500/50 transition-colors"
            >
              <AccordionTrigger className="text-white hover:text-pink-400 font-medium">
                How Often Are Predictions Updated?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                Our AI models run continuously, updating predictions every 15
                minutes during active trading hours. This ensures you always
                have the most current market analysis based on the latest price
                movements, volume changes, and sentiment shifts.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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

      {/* Live Predictions */}
      <LazyLiveAIPredictions />
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

      {/* Navigation */}
      <MainNavigation />

      <div className="container mx-auto px-4 pb-8 pt-20">
        {/* Google Ad Manager - Header Ad */}
        <GAMAdUnit
          adUnitId="div-gpt-ad-1752654531765-0"
          size={[728, 90]}
          className="mb-6 md:mb-8"
        />


        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content with SignupLock */}
          <SignupLock
            title="Unlock AI Price Predictions"
            description="Get access to advanced machine learning price predictions - 100% free!"
          >
            {lockedContent}
          </SignupLock>

          {/* Responsive Sidebar */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="lg:sticky lg:top-8 space-y-4 sm:space-y-6 lg:space-y-8">
              <MarketWinnersWidget topGainnersandLoosers={marketData} />
              <div className="hidden lg:block">
                <AdUnit type="skyscraper" className="ad-click" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Ad Placement */}
        <div className="mt-12 flex justify-center">
          <AdUnit type="leaderboard" className="ad-click" />
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
  );
};

export default AIPricePrediction;
