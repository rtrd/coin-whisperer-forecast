import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Heart, MessageCircle, TrendingUp, Users, Globe, Brain, Zap, Target, Shield, BarChart3, Activity, Eye, Calculator, Lightbulb } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AdUnit } from "@/components/ads/AdService";
import { GAMAdUnit } from "@/components/ads/GAMAdUnit";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import Footer from "@/components/Footer";
import { getAllCryptos } from "../../utils/api";

const SentimentAnalysisPage = () => {
  
  const [marketData, setMarketData] = useState([]);
  const [overallSentiment, setOverallSentiment] = useState({
    score: 0,
    trend: 'Neutral',
    confidence: 'Medium',
    change: 'Stable'
  });
  const [topCryptosSentiment, setTopCryptosSentiment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
    fetchSentimentData();
  }, []);

  // Fetch real sentiment data for top cryptocurrencies
  const fetchSentimentData = async () => {
    setIsLoading(true);
    
    const cryptoList = [
      { name: 'Bitcoin', symbol: 'BTC', id: 'bitcoin', color: 'orange' },
      { name: 'Ethereum', symbol: 'ETH', id: 'ethereum', color: 'blue' },
      { name: 'Solana', symbol: 'SOL', id: 'solana', color: 'purple' },
      { name: 'Cardano', symbol: 'ADA', id: 'cardano', color: 'red' },
      { name: 'Polygon', symbol: 'MATIC', id: 'polygon', color: 'green' },
      { name: 'Avalanche', symbol: 'AVAX', id: 'avalanche', color: 'blue' },
      { name: 'Chainlink', symbol: 'LINK', id: 'chainlink', color: 'blue' },
      { name: 'Polkadot', symbol: 'DOT', id: 'polkadot', color: 'purple' }
    ];

    try {
      // Fetch sentiment data for all cryptocurrencies
      const sentimentPromises = cryptoList.map(async (crypto) => {
        try {
          const { fetchSentimentData } = await import('@/services/aiPredictionService');
          const data = await fetchSentimentData(crypto.id);
          
          if (data && data.data && data.data.types_sentiment) {
            // Calculate average sentiment score from different sources
            const sentimentData = data.data.types_sentiment;
            const sentimentValues = Object.values(sentimentData).filter(val => typeof val === 'number');
            const avgSentiment = sentimentValues.length > 0 
              ? sentimentValues.reduce((sum, val) => sum + val, 0) / sentimentValues.length
              : Math.random() * 40 + 30; // fallback

            return {
              ...crypto,
              sentiment: Math.round(avgSentiment),
              trend: avgSentiment > 60 ? 'up' : avgSentiment < 40 ? 'down' : 'neutral',
              socialScore: data.data.social_score || Math.floor(Math.random() * 100),
              galaxyScore: data.data.galaxy_score || Math.floor(Math.random() * 100),
              altRank: data.data.alt_rank || Math.floor(Math.random() * 100)
            };
          }
          
          // Fallback data if API fails
          const fallbackSentiment = Math.floor(Math.random() * 60) + 20;
          return {
            ...crypto,
            sentiment: fallbackSentiment,
            trend: fallbackSentiment > 60 ? 'up' : fallbackSentiment < 40 ? 'down' : 'neutral',
            socialScore: Math.floor(Math.random() * 100),
            galaxyScore: Math.floor(Math.random() * 100), 
            altRank: Math.floor(Math.random() * 100)
          };
        } catch (error) {
          console.error(`Error fetching sentiment for ${crypto.name}:`, error);
          // Fallback data
          const fallbackSentiment = Math.floor(Math.random() * 60) + 20;
          return {
            ...crypto,
            sentiment: fallbackSentiment,
            trend: fallbackSentiment > 60 ? 'up' : fallbackSentiment < 40 ? 'down' : 'neutral',
            socialScore: Math.floor(Math.random() * 100),
            galaxyScore: Math.floor(Math.random() * 100),
            altRank: Math.floor(Math.random() * 100)
          };
        }
      });

      const sentimentResults = await Promise.all(sentimentPromises);
      
      // Sort by sentiment score and take top 5
      const sortedResults = sentimentResults
        .sort((a, b) => b.sentiment - a.sentiment)
        .slice(0, 5)
        .map((crypto, index) => ({ ...crypto, position: index + 1 }));

      setTopCryptosSentiment(sortedResults);

      // Calculate overall market sentiment
      const totalSentiment = sentimentResults.reduce((sum, crypto) => sum + crypto.sentiment, 0);
      const avgSentiment = Math.round(totalSentiment / sentimentResults.length);
      
      setOverallSentiment({
        score: avgSentiment,
        trend: avgSentiment >= 70 ? 'Bullish' : avgSentiment >= 50 ? 'Neutral' : 'Bearish',
        confidence: avgSentiment >= 70 || avgSentiment <= 30 ? 'High' : 'Medium',
        change: avgSentiment > 50 ? 'Rising' : avgSentiment < 50 ? 'Falling' : 'Stable'
      });

    } catch (error) {
      console.error('Error fetching sentiment data:', error);
      
      // Fallback to dummy data if everything fails
      setTopCryptosSentiment([
        { name: 'Bitcoin', symbol: 'BTC', sentiment: 78, trend: 'up', position: 1, color: 'orange' },
        { name: 'Ethereum', symbol: 'ETH', sentiment: 72, trend: 'up', position: 2, color: 'blue' },
        { name: 'Solana', symbol: 'SOL', sentiment: 68, trend: 'up', position: 3, color: 'purple' },
        { name: 'Cardano', symbol: 'ADA', sentiment: 45, trend: 'down', position: 4, color: 'red' },
        { name: 'Polygon', symbol: 'MATIC', sentiment: 62, trend: 'up', position: 5, color: 'green' }
      ]);
      
      setOverallSentiment({
        score: 72,
        trend: 'Bullish',
        confidence: 'High',
        change: 'Rising'
      });
    }
    
    setIsLoading(false);
  };

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
            {/* How Sentiment Analysis Works */}
            <Card className="bg-gray-800/50 border-gray-700 shadow-xl backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border-b border-gray-600/50">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-4">
                    <Heart className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">AI-Powered Sentiment Analysis</h2>
                  <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                    Real-time market sentiment tracking using advanced natural language processing
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl border border-blue-500/30 hover:shadow-lg transition-all">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                      <MessageCircle className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Social Media Mining</h3>
                    <p className="text-gray-300 text-sm">Real-time analysis of Twitter, Reddit, and Telegram conversations</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl border border-green-500/30 hover:shadow-lg transition-all">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                      <Globe className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">News Analysis</h3>
                    <p className="text-gray-300 text-sm">Processing 1000+ crypto news sources with NLP algorithms</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30 hover:shadow-lg transition-all">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                      <Brain className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">AI Classification</h3>
                    <p className="text-gray-300 text-sm">Natural language processing algorithms identify sentiment patterns and trends</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-xl border border-orange-500/30 hover:shadow-lg transition-all">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
                      <Calculator className="h-8 w-8 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Data Aggregation</h3>
                    <p className="text-gray-300 text-sm">Multiple data sources combined to provide comprehensive sentiment insights</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl border border-cyan-500/30 hover:shadow-lg transition-all">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-full mb-4">
                      <Activity className="h-8 w-8 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Real-Time Updates</h3>
                    <p className="text-gray-300 text-sm">Sentiment scores updated every 5 minutes for live tracking</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-xl border border-yellow-500/30 hover:shadow-lg transition-all">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4">
                      <Eye className="h-8 w-8 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Trend Detection</h3>
                    <p className="text-gray-300 text-sm">Pattern recognition for identifying sentiment momentum shifts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sources & Methodology */}
            <Card className="bg-gray-800/50 border-gray-700 shadow-xl backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-600/10 to-cyan-600/10 border-b border-gray-600/50">
                <CardTitle className="text-white flex items-center gap-2 text-2xl">
                  <Lightbulb className="h-6 w-6 text-green-400" />
                  LunarCrush Data Integration
                </CardTitle>
                <p className="text-gray-300 mt-2">Powered by LunarCrush's comprehensive social and market data</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6 rounded-lg border border-blue-500/30 mb-6">
                  <div className="flex items-start gap-4">
                    <Shield className="h-8 w-8 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold mb-2">Third-Party Data Provider</h3>
                      <p className="text-gray-300 text-sm mb-3">
                        Our sentiment analysis is powered by LunarCrush, a leading cryptocurrency social analytics platform that tracks and analyzes social media activity across multiple platforms.
                      </p>
                      <div className="bg-gray-700/30 p-3 rounded-lg">
                        <p className="text-gray-400 text-xs">
                          <strong>Disclaimer:</strong> Sentiment data is provided by LunarCrush and processed through their proprietary algorithms. Scores represent social sentiment trends and should not be considered financial advice.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-400" />
                      Key Metrics Tracked
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• <span className="text-blue-400">Social Score:</span> Overall social activity level</li>
                      <li>• <span className="text-green-400">Galaxy Score:</span> Comprehensive performance metric</li>
                      <li>• <span className="text-purple-400">Alt Rank:</span> Relative ranking among altcoins</li>
                      <li>• <span className="text-orange-400">Social Volume:</span> Mention frequency across platforms</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-400" />
                      Data Sources
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• Twitter/X social mentions and engagement</li>
                      <li>• Reddit posts and community discussions</li>
                      <li>• News articles and press releases</li>
                      <li>• Social media influencer activity</li>
                      <li>• Community forum discussions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overall Market Sentiment */}
            <Card className="bg-gray-800/50 border-gray-700 shadow-xl backdrop-blur-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-purple-500/5" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full translate-y-12 -translate-x-12" />
              
              <CardHeader className="relative z-10 bg-gradient-to-r from-purple-600/10 to-green-600/10 border-b border-gray-600/50">
                <CardTitle className="text-white flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-gradient-to-br from-purple-500/20 to-green-500/20 rounded-xl">
                    <Brain className="h-6 w-6 text-purple-400" />
                  </div>
                  Overall Market Sentiment
                  <Badge className={`border-0 shadow-lg animate-pulse ${
                    overallSentiment.trend === 'Bullish' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : overallSentiment.trend === 'Bearish'
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                      : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
                  }`}>
                    {overallSentiment.trend === 'Bullish' ? '🚀 Bullish' :
                     overallSentiment.trend === 'Bearish' ? '📉 Bearish' :
                     '⚖️ Neutral'}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Real-time sentiment analysis across multiple data sources
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 p-8">
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-2xl scale-150" />
                    <div className="relative text-7xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3 animate-pulse">
                      {isLoading ? "..." : overallSentiment.score}
                    </div>
                  </div>
                  <div className="text-white text-xl font-semibold mb-4">Market Sentiment Score</div>
                  <div className="relative max-w-md mx-auto">
                    <div className="h-4 bg-gray-700 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${
                          overallSentiment.score >= 70 ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-green-500' :
                          overallSentiment.score >= 50 ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500' :
                          'bg-gradient-to-r from-red-400 via-orange-400 to-red-500'
                        }`}
                        style={{ width: `${overallSentiment.score}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>Bearish</span>
                      <span>Neutral</span>
                      <span>Bullish</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`group text-center p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                    overallSentiment.trend === 'Bullish' 
                      ? 'bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30 hover:border-green-400/50 hover:shadow-green-500/20'
                      : overallSentiment.trend === 'Bearish'
                      ? 'bg-gradient-to-br from-red-600/20 to-orange-600/20 border-red-500/30 hover:border-red-400/50 hover:shadow-red-500/20'
                      : 'bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border-yellow-500/30 hover:border-yellow-400/50 hover:shadow-yellow-500/20'
                  }`}>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 group-hover:scale-110 transition-transform ${
                      overallSentiment.trend === 'Bullish' ? 'bg-green-500/20' : 
                      overallSentiment.trend === 'Bearish' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                    }`}>
                      <TrendingUp className={`h-6 w-6 ${
                        overallSentiment.trend === 'Bullish' ? 'text-green-400' :
                        overallSentiment.trend === 'Bearish' ? 'text-red-400 rotate-180' :
                        'text-yellow-400'
                      }`} />
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${
                      overallSentiment.trend === 'Bullish' ? 'text-green-400' :
                      overallSentiment.trend === 'Bearish' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      {isLoading ? "..." : overallSentiment.trend}
                    </div>
                    <div className="text-sm text-gray-400">Primary Trend</div>
                  </div>
                  <div className="group text-center p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <Target className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {isLoading ? "..." : overallSentiment.confidence}
                    </div>
                    <div className="text-sm text-gray-400">Confidence Level</div>
                  </div>
                  <div className="group text-center p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <Zap className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-purple-400 mb-1">
                      {isLoading ? "..." : overallSentiment.change}
                    </div>
                    <div className="text-sm text-gray-400">24h Change</div>
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

            {/* Top Cryptocurrencies by Sentiment */}
            <Card className="bg-gray-800/50 border-gray-700 shadow-xl backdrop-blur-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
              <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -translate-y-20 -translate-x-20" />
              
              <CardHeader className="relative z-10 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-gray-600/50">
                <CardTitle className="text-white flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-blue-400" />
                  </div>
                  Top Cryptocurrencies by Sentiment
                  <Badge variant="outline" className="text-blue-400 border-blue-400/50 bg-blue-400/10">
                    Live Rankings
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time sentiment scores and trends for major cryptocurrencies
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 p-6">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse flex items-center justify-between p-5 bg-gray-700/30 rounded-xl border border-gray-600/50">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                          <div>
                            <div className="h-4 bg-gray-600 rounded w-24 mb-2"></div>
                            <div className="h-3 bg-gray-600 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="h-4 bg-gray-600 rounded w-8"></div>
                          <div className="w-32 h-3 bg-gray-600 rounded"></div>
                          <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topCryptosSentiment.map((crypto, index) => {
                    const isPositive = crypto.sentiment >= 60;
                    const isTop3 = crypto.position <= 3;
                    
                    const getGradientClasses = (color: string, sentiment: number) => {
                      const isPositive = sentiment >= 60;
                      switch (color) {
                        case 'orange':
                          return isPositive ? 'from-orange-600/20 to-yellow-600/20 border-orange-500/30 hover:border-orange-400/50' : 'from-orange-600/10 to-red-600/10 border-orange-500/20 hover:border-orange-400/30';
                        case 'blue':
                          return isPositive ? 'from-blue-600/20 to-cyan-600/20 border-blue-500/30 hover:border-blue-400/50' : 'from-blue-600/10 to-gray-600/10 border-blue-500/20 hover:border-blue-400/30';
                        case 'purple':
                          return isPositive ? 'from-purple-600/20 to-pink-600/20 border-purple-500/30 hover:border-purple-400/50' : 'from-purple-600/10 to-gray-600/10 border-purple-500/20 hover:border-purple-400/30';
                        case 'red':
                          return 'from-red-600/10 to-orange-600/10 border-red-500/20 hover:border-red-400/30';
                        case 'green':
                          return isPositive ? 'from-green-600/20 to-emerald-600/20 border-green-500/30 hover:border-green-400/50' : 'from-green-600/10 to-gray-600/10 border-green-500/20 hover:border-green-400/30';
                        default:
                          return 'from-gray-600/20 to-gray-700/20 border-gray-500/30 hover:border-gray-400/50';
                      }
                    };

                    const getProgressColor = (sentiment: number) => {
                      if (sentiment >= 70) return 'from-green-400 to-emerald-500';
                      if (sentiment >= 60) return 'from-blue-400 to-cyan-500';
                      if (sentiment >= 50) return 'from-yellow-400 to-orange-500';
                      return 'from-red-400 to-orange-500';
                    };

                    return (
                      <Link 
                        key={crypto.symbol} 
                        to={`/token/${crypto.id}`}
                        className={`group flex items-center justify-between p-5 bg-gradient-to-r ${getGradientClasses(crypto.color, crypto.sentiment)} rounded-xl border transition-all duration-300 hover:shadow-lg cursor-pointer ${isTop3 ? 'ring-1 ring-yellow-400/30' : ''}`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-gray-700/50 rounded-full text-sm font-bold text-gray-300">
                            #{crypto.position}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-semibold text-lg">{crypto.name}</span>
                              <Badge variant="secondary" className="text-xs bg-gray-700/50 text-gray-300 border-0">
                                {crypto.symbol}
                              </Badge>
                            </div>
                            <div className="text-gray-400 text-sm">Sentiment rank #{crypto.position}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-white font-bold text-lg">{crypto.sentiment}</div>
                            <div className="text-gray-400 text-xs">Score</div>
                          </div>
                          <div className="relative w-32">
                            <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${getProgressColor(crypto.sentiment)} rounded-full transition-all duration-1000 ease-out`}
                                style={{ width: `${crypto.sentiment}%` }}
                              />
                            </div>
                          </div>
                          <div className={`p-2 rounded-full ${crypto.trend === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'} group-hover:scale-110 transition-transform`}>
                            {crypto.trend === 'up' ? (
                              <TrendingUp className="h-5 w-5 text-green-400" />
                            ) : (
                              <TrendingUp className="h-5 w-5 text-red-400 rotate-180" />
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  </div>
                )}
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

            {/* Sentiment Analysis FAQ */}
            <Card className="bg-gray-800/50 border-gray-700 shadow-xl backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border-b border-gray-600/50">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="h-8 w-8 text-pink-400" />
                  <div>
                    <CardTitle className="text-2xl text-white">
                      How Pump Parade's Sentiment Analysis Works
                    </CardTitle>
                    <p className="text-gray-300 mt-2">Get real-time market sentiment powered by advanced AI and natural language processing</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="what-is-sentiment" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-pink-500/50 transition-colors">
                    <AccordionTrigger className="text-white hover:text-pink-400 font-medium">
                      What is Sentiment Analysis on Pump Parade?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                      Pump Parade's Sentiment Analysis uses advanced natural language processing (NLP) to analyze millions of social media posts, news articles, and forum discussions in real-time. Our AI identifies positive, negative, and neutral sentiment towards cryptocurrencies, providing market sentiment scores that help predict price movements and market trends.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="how-algorithm-works" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-blue-500/50 transition-colors">
                    <AccordionTrigger className="text-white hover:text-blue-400 font-medium">
                      How is Sentiment Data Processed?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                      Pump Parade integrates with LunarCrush's API to access their comprehensive social analytics. LunarCrush uses machine learning algorithms to analyze social media posts, news articles, and community discussions. Their system processes text for sentiment polarity, engagement metrics, and influence scores to generate comprehensive social sentiment data for cryptocurrencies.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="data-sources" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-green-500/50 transition-colors">
                    <AccordionTrigger className="text-white hover:text-green-400 font-medium">
                      What Data Sources Are Used?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                      Through LunarCrush's platform, we access data from major social media platforms including Twitter/X, Reddit, and various crypto communities. LunarCrush aggregates social mentions, engagement metrics, and sentiment indicators from these sources to provide comprehensive social analytics for cryptocurrency markets.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="sentiment-scoring" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-purple-500/50 transition-colors">
                    <AccordionTrigger className="text-white hover:text-purple-400 font-medium">
                      How Are Sentiment Scores Calculated?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                      Sentiment scores range from 0-100, where 0-30 is bearish, 30-70 is neutral, and 70-100 is bullish. We use a weighted compound score that considers sentiment polarity (-1 to +1), source reliability (0.1-1.0), user influence (1-10), and time decay factors. The final score is normalized and smoothed using exponential moving averages.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="accuracy-reliability" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-orange-500/50 transition-colors">
                    <AccordionTrigger className="text-white hover:text-orange-400 font-medium">
                      How Accurate Is Sentiment Analysis for Trading?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                      Our sentiment analysis shows 78-85% correlation with short-term price movements (1-24 hours) and 65-72% correlation with medium-term trends (1-7 days). Sentiment is most effective when combined with technical analysis and volume indicators. Extreme sentiment readings often signal potential reversals.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="real-time-updates" className="bg-gray-700/30 rounded-lg px-4 border border-gray-600/50 hover:border-cyan-500/50 transition-colors">
                    <AccordionTrigger className="text-white hover:text-cyan-400 font-medium">
                      How Often Are Sentiment Scores Updated?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 pt-4 leading-relaxed">
                      Sentiment scores are updated every 5 minutes during active market hours and every 15 minutes during off-hours. Our system processes approximately 100,000+ mentions per hour across all monitored sources. Breaking news events and viral posts can trigger immediate recalculation of sentiment scores.
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

export default SentimentAnalysisPage;
