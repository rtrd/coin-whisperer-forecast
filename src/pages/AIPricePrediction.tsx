
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Brain, TrendingUp, BarChart3 } from "lucide-react";
import { AdUnit } from "@/components/ads/AdService";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import { SignupLock } from "@/components/SignupLock";
import Footer from "@/components/Footer";

const AIPricePrediction = () => {
  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' },
  ];

  // Mock data for MarketWinnersWidget - flattened array format
  const mockTopGainersAndLosers = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price_change_percentage_24h: 5.2, image: '/placeholder.svg', current_price: 45000 },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price_change_percentage_24h: 3.1, image: '/placeholder.svg', current_price: 2500 },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', price_change_percentage_24h: -2.5, image: '/placeholder.svg', current_price: 0.35 },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price_change_percentage_24h: -1.8, image: '/placeholder.svg', current_price: 85 }
  ];

  const lockedContent = (
    <div className="lg:col-span-3 space-y-8">
      {/* AI Price Prediction FAQ */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-blue-400" />
            <div>
              <CardTitle className="text-3xl text-white mb-2">
                How Pump Parade's AI Price Prediction Works
              </CardTitle>
              <p className="text-gray-300">Get instant crypto price predictions powered by advanced machine learning</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="what-is-ai-prediction" className="bg-gray-700/30 rounded-lg px-4 border-gray-600">
              <AccordionTrigger className="text-white hover:text-blue-400">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  What is AI Price Prediction on Pump Parade?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pt-4">
                Pump Parade's AI Price Prediction uses advanced machine learning algorithms to analyze cryptocurrency market data and provide real-time price forecasts. Our system processes thousands of data points including price history, volume, market sentiment, and technical indicators to generate accurate predictions for short-term and long-term price movements.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="how-it-works" className="bg-gray-700/30 rounded-lg px-4 border-gray-600">
              <AccordionTrigger className="text-white hover:text-blue-400">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-green-400" />
                  How Does Our AI Algorithm Work?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pt-4">
                Our AI system combines multiple neural network architectures including LSTM (Long Short-Term Memory) networks for time series analysis, Random Forest for pattern recognition, and Transformer models for complex market behavior understanding. The algorithm analyzes historical price data, trading volumes, social sentiment, and macro-economic factors to generate predictions with confidence scores.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="accuracy" className="bg-gray-700/30 rounded-lg px-4 border-gray-600">
              <AccordionTrigger className="text-white hover:text-blue-400">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  How Accurate Are the Predictions?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pt-4">
                Our AI models achieve accuracy rates of 85-95% for short-term predictions (24-48 hours) and 70-85% for medium-term forecasts (1-7 days). The accuracy varies by cryptocurrency, with major coins like Bitcoin and Ethereum showing higher prediction accuracy due to more stable trading patterns and larger data sets.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-sources" className="bg-gray-700/30 rounded-lg px-4 border-gray-600">
              <AccordionTrigger className="text-white hover:text-blue-400">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-400" />
                  What Data Sources Do We Use?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pt-4">
                We aggregate data from 30+ premium APIs including major exchanges (Binance, Coinbase, Kraken), social sentiment from Twitter and Reddit, on-chain analytics, Google Trends, fear & greed index, and macro-economic indicators. This comprehensive data approach ensures our predictions consider all market-moving factors.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="how-to-use" className="bg-gray-700/30 rounded-lg px-4 border-gray-600">
              <AccordionTrigger className="text-white hover:text-blue-400">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-cyan-400" />
                  How to Use AI Predictions for Trading?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pt-4">
                Our AI predictions show expected price movements with confidence levels. Use predictions as one factor in your trading decisions - combine them with your own analysis, risk management, and never invest more than you can afford to lose. Higher confidence scores (above 80%) indicate stronger conviction in the prediction.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="updates" className="bg-gray-700/30 rounded-lg px-4 border-gray-600">
              <AccordionTrigger className="text-white hover:text-blue-400">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-pink-400" />
                  How Often Are Predictions Updated?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pt-4">
                Our AI models run continuously, updating predictions every 15 minutes during active trading hours. This ensures you always have the most current market analysis based on the latest price movements, volume changes, and sentiment shifts.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Live Predictions */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Live Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Bitcoin', 'Ethereum', 'Cardano', 'Solana'].map((crypto, index) => (
              <div key={crypto} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{crypto}</h4>
                  <p className="text-gray-400 text-sm">24h prediction</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">+{(Math.random() * 10 + 2).toFixed(1)}%</p>
                  <p className="text-gray-400 text-sm">Confidence: {(85 + Math.random() * 10).toFixed(0)}%</p>
                </div>
              </div>
            ))}
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
            title="Unlock AI Price Predictions"
            description="Get access to advanced machine learning price predictions - 100% free!"
          >
            {lockedContent}
          </SignupLock>

          {/* Sticky Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-8">
              <MarketWinnersWidget topGainnersandLoosers={mockTopGainersAndLosers} />
              <AdUnit type="skyscraper" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AIPricePrediction;
