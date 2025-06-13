import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Brain, 
  Target, 
  AlertCircle, 
  BarChart3, 
  ArrowLeft,
  Globe,
  Twitter,
  MessageCircle,
  ExternalLink,
  Clock,
  DollarSign,
  TrendingDownIcon,
  X
} from "lucide-react";
import { PriceChart } from "@/components/PriceChart";
import { PredictionCard } from "@/components/PredictionCard";
import { LockedTechnicalAnalysis } from "@/components/LockedTechnicalAnalysis";
import { LockedSentimentAnalysis } from "@/components/LockedSentimentAnalysis";
import { LockedDynamicPrediction } from "@/components/LockedDynamicPrediction";
import { DynamicTokenAnalysis } from "@/components/DynamicTokenAnalysis";
import { AdBanner } from "@/components/AdBanner";
import { IndexHeader } from "@/components/IndexHeader";
import Footer from "@/components/Footer";
import { ModelTypeTooltip } from "@/components/ModelTypeTooltip";
import { useCryptoData } from "@/hooks/useCryptoData";
import { usePrediction } from "@/hooks/usePrediction";
import { toast } from "sonner";

const TokenDetail = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [timeframe, setTimeframe] = useState('7d');
  const [predictionDays, setPredictionDays] = useState(7);
  const [modelType, setModelType] = useState('advanced');
  const [showPrediction, setShowPrediction] = useState(false);
  
  // Use ref to ensure market data stability
  const marketDataRef = useRef({
    marketCap: 0,
    volume24h: 0,
    circulatingSupply: 0,
    totalSupply: 0,
    allTimeHigh: 0,
    allTimeLow: 0,
    priceChange7d: 0,
    priceChange30d: 0
  });
  
  const [marketData, setMarketData] = useState(marketDataRef.current);
  const [isMarketDataInitialized, setIsMarketDataInitialized] = useState(false);

  // Map URL token IDs to CoinGecko IDs and get full token info
  const getTokenInfo = (urlTokenId: string) => {
    const tokenMap: { [key: string]: any } = {
      'bitcoin': { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿', category: 'Layer 1 (L1)', website: 'https://bitcoin.org', twitter: 'https://twitter.com/bitcoin', description: 'The first and largest cryptocurrency by market cap' },
      'btc': { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿', category: 'Layer 1 (L1)', website: 'https://bitcoin.org', twitter: 'https://twitter.com/bitcoin', description: 'The first and largest cryptocurrency by market cap' },
      'ethereum': { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', category: 'Layer 1 (L1)', website: 'https://ethereum.org', twitter: 'https://twitter.com/ethereum', description: 'Smart contract platform and second-largest cryptocurrency' },
      'eth': { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', category: 'Layer 1 (L1)', website: 'https://ethereum.org', twitter: 'https://twitter.com/ethereum', description: 'Smart contract platform and second-largest cryptocurrency' },
      'binancecoin': { id: 'binancecoin', symbol: 'BNB', name: 'BNB', icon: '🔶', category: 'Layer 1 (L1)', website: 'https://www.bnbchain.org', twitter: 'https://twitter.com/bnbchain', description: 'Native token of the Binance ecosystem' },
      'bnb': { id: 'binancecoin', symbol: 'BNB', name: 'BNB', icon: '🔶', category: 'Layer 1 (L1)', website: 'https://www.bnbchain.org', twitter: 'https://twitter.com/bnbchain', description: 'Native token of the Binance ecosystem' },
      'solana': { id: 'solana', symbol: 'SOL', name: 'Solana', icon: '◎', category: 'Layer 1 (L1)', website: 'https://solana.com', twitter: 'https://twitter.com/solana', description: 'High-performance blockchain for decentralized apps' },
      'sol': { id: 'solana', symbol: 'SOL', name: 'Solana', icon: '◎', category: 'Layer 1 (L1)', website: 'https://solana.com', twitter: 'https://twitter.com/solana', description: 'High-performance blockchain for decentralized apps' },
      'cardano': { id: 'cardano', symbol: 'ADA', name: 'Cardano', icon: '₳', category: 'Layer 1 (L1)', website: 'https://cardano.org', twitter: 'https://twitter.com/cardano', description: 'Proof-of-stake blockchain platform' },
      'ada': { id: 'cardano', symbol: 'ADA', name: 'Cardano', icon: '₳', category: 'Layer 1 (L1)', website: 'https://cardano.org', twitter: 'https://twitter.com/cardano', description: 'Proof-of-stake blockchain platform' },
      'ripple': { id: 'ripple', symbol: 'XRP', name: 'XRP', icon: '◉', category: 'Payment Token', website: 'https://ripple.com', twitter: 'https://twitter.com/ripple', description: 'Digital payment protocol for financial institutions' },
      'xrp': { id: 'ripple', symbol: 'XRP', name: 'XRP', icon: '◉', category: 'Payment Token', website: 'https://ripple.com', twitter: 'https://twitter.com/ripple', description: 'Digital payment protocol for financial institutions' },
      'dogecoin': { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', icon: '🐕', category: 'Meme Coin', website: 'https://dogecoin.com', twitter: 'https://twitter.com/dogecoin', description: 'The original meme cryptocurrency' },
      'doge': { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', icon: '🐕', category: 'Meme Coin', website: 'https://dogecoin.com', twitter: 'https://twitter.com/dogecoin', description: 'The original meme cryptocurrency' },
      'shiba-inu': { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', icon: '🐕‍🦺', category: 'Meme Coin', website: 'https://shibatoken.com', twitter: 'https://twitter.com/shibtoken', description: 'Community-driven meme token' },
      'shib': { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', icon: '🐕‍🦺', category: 'Meme Coin', website: 'https://shibatoken.com', twitter: 'https://twitter.com/shibtoken', description: 'Community-driven meme token' },
      'pepe': { id: 'pepe', symbol: 'PEPE', name: 'Pepe', icon: '🐸', category: 'Meme Coin', website: 'https://pepe.vip', twitter: 'https://twitter.com/pepecoineth', description: 'Meme token based on the Pepe the Frog internet meme' },
      'bonk': { id: 'bonk', symbol: 'BONK', name: 'Bonk', icon: '🔨', category: 'Meme Coin', website: 'https://bonkcoin.com', twitter: 'https://twitter.com/bonk_inu', description: 'Solana-based community meme coin' },
      'uniswap': { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', icon: '🦄', category: 'DeFi', website: 'https://uniswap.org', twitter: 'https://twitter.com/uniswap', description: 'Leading decentralized exchange protocol' },
      'uni': { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', icon: '🦄', category: 'DeFi', website: 'https://uniswap.org', twitter: 'https://twitter.com/uniswap', description: 'Leading decentralized exchange protocol' },
      'aave': { id: 'aave', symbol: 'AAVE', name: 'Aave', icon: '👻', category: 'DeFi', website: 'https://aave.com', twitter: 'https://twitter.com/aaveaave', description: 'Decentralized lending and borrowing protocol' },
      'fetch-ai': { id: 'fetch-ai', symbol: 'FET', name: 'Fetch.ai', icon: '🤖', category: 'AI', website: 'https://fetch.ai', twitter: 'https://twitter.com/fetch_ai', description: 'Decentralized machine learning platform' },
      'fet': { id: 'fetch-ai', symbol: 'FET', name: 'Fetch.ai', icon: '🤖', category: 'AI', website: 'https://fetch.ai', twitter: 'https://twitter.com/fetch_ai', description: 'Decentralized machine learning platform' },
      'render-token': { id: 'render-token', symbol: 'RNDR', name: 'Render', icon: '🎨', category: 'AI', website: 'https://rendertoken.com', twitter: 'https://twitter.com/rendertoken', description: 'Distributed GPU rendering network' },
      'rndr': { id: 'render-token', symbol: 'RNDR', name: 'Render', icon: '🎨', category: 'AI', website: 'https://rendertoken.com', twitter: 'https://twitter.com/rendertoken', description: 'Distributed GPU rendering network' },
      'polygon': { id: 'matic-network', symbol: 'MATIC', name: 'Polygon', icon: '🔷', category: 'L2', website: 'https://polygon.technology', twitter: 'https://twitter.com/0xpolygon', description: 'Ethereum scaling and infrastructure development' },
      'matic': { id: 'matic-network', symbol: 'MATIC', name: 'Polygon', icon: '🔷', category: 'L2', website: 'https://polygon.technology', twitter: 'https://twitter.com/0xpolygon', description: 'Ethereum scaling and infrastructure development' },
      'avalanche-2': { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', icon: '🔺', category: 'Layer 1 (L1)', website: 'https://avax.network', twitter: 'https://twitter.com/avalancheavax', description: 'Highly scalable smart contracts platform' },
      'avax': { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', icon: '🔺', category: 'Layer 1 (L1)', website: 'https://avax.network', twitter: 'https://twitter.com/avalancheavax', description: 'Highly scalable smart contracts platform' },
      'chainlink': { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', icon: '🔗', category: 'DeFi', website: 'https://chain.link', twitter: 'https://twitter.com/chainlink', description: 'Decentralized oracle network' },
      'link': { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', icon: '🔗', category: 'DeFi', website: 'https://chain.link', twitter: 'https://twitter.com/chainlink', description: 'Decentralized oracle network' },
      'polkadot': { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', icon: '⚫', category: 'Layer 1 (L1)', website: 'https://polkadot.network', twitter: 'https://twitter.com/polkadot', description: 'Multi-chain interoperability protocol' },
      'dot': { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', icon: '⚫', category: 'Layer 1 (L1)', website: 'https://polkadot.network', twitter: 'https://twitter.com/polkadot', description: 'Multi-chain interoperability protocol' },
      'litecoin': { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', icon: 'Ł', category: 'Payment Token', website: 'https://litecoin.org', twitter: 'https://twitter.com/litecoin', description: 'Peer-to-peer digital currency' },
      'ltc': { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', icon: 'Ł', category: 'Payment Token', website: 'https://litecoin.org', twitter: 'https://twitter.com/litecoin', description: 'Peer-to-peer digital currency' }
    };

    return tokenMap[urlTokenId?.toLowerCase()] || tokenMap['bitcoin'];
  };

  const selectedToken = getTokenInfo(tokenId || 'bitcoin');
  const cryptoId = selectedToken.id;

  const { data: cryptoData, isLoading: dataLoading, error: dataError } = useCryptoData(cryptoId, timeframe);
  const { prediction, isLoading: predictionLoading, generatePrediction } = usePrediction();

  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Layer 1 (L1)', score: 8.5, prediction: '+12.5%', 
      description: 'The first and largest cryptocurrency by market cap', 
      website: 'https://bitcoin.org', twitter: 'https://twitter.com/bitcoin' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Layer 1 (L1)', score: 8.2, prediction: '+8.3%',
      description: 'Smart contract platform and second-largest cryptocurrency',
      website: 'https://ethereum.org', twitter: 'https://twitter.com/ethereum' },
    { value: 'binancecoin', label: 'BNB (BNB)', icon: '🔶', category: 'Layer 1 (L1)', score: 7.8, prediction: '+6.1%',
      description: 'Native token of the Binance ecosystem',
      website: 'https://www.bnbchain.org', twitter: 'https://twitter.com/bnbchain' },
    { value: 'solana', label: 'Solana (SOL)', icon: '◎', category: 'Layer 1 (L1)', score: 8.1, prediction: '+15.8%',
      description: 'High-performance blockchain for decentralized apps',
      website: 'https://solana.com', twitter: 'https://twitter.com/solana' },
    { value: 'cardano', label: 'Cardano (ADA)', icon: '₳', category: 'Layer 1 (L1)', score: 6.9, prediction: '+3.2%',
      description: 'Proof-of-stake blockchain platform',
      website: 'https://cardano.org', twitter: 'https://twitter.com/cardano' },
    
    // DeFi Tokens
    { value: 'uniswap', label: 'Uniswap (UNI)', icon: '🦄', category: 'DeFi', score: 7.1, prediction: '+11.2%',
      description: 'Leading decentralized exchange protocol',
      website: 'https://uniswap.org', twitter: 'https://twitter.com/uniswap' },
    { value: 'aave', label: 'Aave (AAVE)', icon: '👻', category: 'DeFi', score: 7.4, prediction: '+8.7%',
      description: 'Decentralized lending and borrowing protocol',
      website: 'https://aave.com', twitter: 'https://twitter.com/aaveaave' },
    
    // Meme Coins
    { value: 'dogecoin', label: 'Dogecoin (DOGE)', icon: '🐕', category: 'Meme Coin', score: 6.1, prediction: '+18.5%',
      description: 'The original meme cryptocurrency',
      website: 'https://dogecoin.com', twitter: 'https://twitter.com/dogecoin' },
    { value: 'shiba-inu', label: 'Shiba Inu (SHIB)', icon: '🐕‍🦺', category: 'Meme Coin', score: 5.9, prediction: '+25.3%',
      description: 'Community-driven meme token',
      website: 'https://shibatoken.com', twitter: 'https://twitter.com/shibtoken' },
    { value: 'pepe', label: 'Pepe (PEPE)', icon: '🐸', category: 'Meme Coin', score: 8.8, prediction: '+65.3%',
      description: 'Meme token based on the Pepe the Frog internet meme',
      website: 'https://pepe.vip', twitter: 'https://twitter.com/pepecoineth' },
    
    // AI Tokens
    { value: 'fetch-ai', label: 'Fetch.ai (FET)', icon: '🤖', category: 'AI', score: 8.5, prediction: '+52.1%',
      description: 'Decentralized machine learning platform',
      website: 'https://fetch.ai', twitter: 'https://twitter.com/fetch_ai' },
    { value: 'singularitynet', label: 'SingularityNET (AGIX)', icon: '🧠', category: 'AI', score: 8.1, prediction: '+41.8%',
      description: 'Decentralized AI marketplace',
      website: 'https://singularitynet.io', twitter: 'https://twitter.com/singularitynet' },
    { value: 'render-token', label: 'Render (RNDR)', icon: '🎨', category: 'AI', score: 8.1, prediction: '+41.7%',
      description: 'Distributed GPU rendering network',
      website: 'https://rendertoken.com', twitter: 'https://twitter.com/rendertoken' }
  ];

  useEffect(() => {
    // Only generate market data once when crypto data is first loaded
    if (cryptoData && cryptoData.length > 0 && !isMarketDataInitialized) {
      const currentPrice = cryptoData[cryptoData.length - 1].price;
      
      // Generate different market data based on token type
      const getMarketCapMultiplier = () => {
        if (selectedToken.category === 'Layer 1 (L1)') return Math.random() * 800000000 + 200000000;
        if (selectedToken.category === 'DeFi') return Math.random() * 100000000 + 50000000;
        if (selectedToken.category === 'Meme Coin') return Math.random() * 50000000 + 10000000;
        if (selectedToken.category === 'AI') return Math.random() * 200000000 + 100000000;
        return Math.random() * 500000000 + 100000000;
      };

      const newMarketData = {
        marketCap: currentPrice * getMarketCapMultiplier(),
        volume24h: currentPrice * (Math.random() * 50000000 + 10000000),
        circulatingSupply: Math.random() * 1000000000 + 100000000,
        totalSupply: Math.random() * 1000000000 + 500000000,
        allTimeHigh: currentPrice * (1 + Math.random() * 5),
        allTimeLow: currentPrice * (Math.random() * 0.5 + 0.1),
        priceChange7d: (Math.random() - 0.5) * 40,
        priceChange30d: (Math.random() - 0.5) * 80
      };

      marketDataRef.current = newMarketData;
      setMarketData(newMarketData);
      setIsMarketDataInitialized(true);
    }
  }, [cryptoData, selectedToken, isMarketDataInitialized]);

  // Reset market data initialization when token changes
  useEffect(() => {
    setIsMarketDataInitialized(false);
  }, [cryptoId]);

  const handlePredict = async () => {
    if (!cryptoData) {
      toast.error("No data available for prediction");
      return;
    }
    
    await generatePrediction(cryptoData, cryptoId, predictionDays);
    setShowPrediction(true);
    toast.success("Prediction generated successfully!");
  };

  const handleClearPrediction = () => {
    setShowPrediction(false);
    toast.success("Prediction cleared from chart");
  };

  const currentPrice = cryptoData && cryptoData.length > 0 ? cryptoData[cryptoData.length - 1]?.price : 0;
  const previousPrice = cryptoData && cryptoData.length > 1 ? cryptoData[cryptoData.length - 2]?.price : 0;
  const priceChange = currentPrice && previousPrice ? ((currentPrice - previousPrice) / previousPrice) * 100 : 0;

  if (!selectedToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Token Not Found</h1>
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Homepage Header */}
        <IndexHeader 
          selectedCrypto={cryptoId}
          cryptoOptions={cryptoOptions}
          currentPrice={currentPrice}
          priceChange={priceChange}
        />

        {/* Ad Banner */}
        <div className="flex justify-center mb-8">
          <AdBanner width={728} height={90} position="horizontal" />
        </div>

        {/* Back Button - Outside the main card */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        {/* Combined Header Card - Updated to match homepage sections */}
        <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm overflow-hidden">
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Token Info Section */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">{selectedToken.name} ({selectedToken.symbol})</h1>
                    <Badge 
                      className={`px-3 py-1 text-sm font-medium ${
                        selectedToken.category === 'Layer 1 (L1)' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        selectedToken.category === 'DeFi' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                        selectedToken.category === 'Meme Coin' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                        selectedToken.category === 'AI' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                        'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      } border backdrop-blur-sm`}
                    >
                      {selectedToken.category}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-300 text-base lg:text-lg mb-6 leading-relaxed">
                    {selectedToken.description}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    {selectedToken.website && (
                      <a href={selectedToken.website} target="_blank" rel="noopener noreferrer" 
                         className="text-gray-400 hover:text-blue-400 transition-all duration-200 p-3 rounded-xl hover:bg-gray-700/30 hover:scale-105">
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                    {selectedToken.twitter && (
                      <a href={selectedToken.twitter} target="_blank" rel="noopener noreferrer"
                         className="text-gray-400 hover:text-blue-400 transition-all duration-200 p-3 rounded-xl hover:bg-gray-700/30 hover:scale-105">
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Current Price - Enhanced */}
                <div className="lg:w-72">
                  <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-gray-500/30 text-center backdrop-blur-sm shadow-xl">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="p-2 rounded-full bg-blue-500/20">
                        <DollarSign className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="text-gray-300 text-sm font-medium">Current Price</div>
                    </div>
                    <div className="text-4xl font-bold text-white mb-3">${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
                    <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl ${priceChange >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {priceChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="text-lg font-semibold">
                        {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                      </span>
                      <span className="text-sm opacity-80">24h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Statistics - Enhanced Design */}
              <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30 backdrop-blur-sm shadow-xl">
                <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                    <BarChart3 className="h-6 w-6 text-blue-400" />
                  </div>
                  Market Statistics
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-gray-600/30 to-gray-700/30 rounded-xl p-4 border border-gray-500/20 hover:border-blue-500/30 transition-all duration-200 hover:shadow-lg hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-blue-500/20">
                        <BarChart3 className="h-4 w-4 text-blue-400" />
                      </div>
                      <span className="text-gray-300 text-sm font-medium">Market Cap</span>
                    </div>
                    <span className="text-white font-bold text-lg">${(marketData.marketCap / 1000000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}B</span>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-600/30 to-gray-700/30 rounded-xl p-4 border border-gray-500/20 hover:border-green-500/30 transition-all duration-200 hover:shadow-lg hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-green-500/20">
                        <Activity className="h-4 w-4 text-green-400" />
                      </div>
                      <span className="text-gray-300 text-sm font-medium">24h Volume</span>
                    </div>
                    <span className="text-white font-bold text-lg">${(marketData.volume24h / 1000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M</span>
                  </div>

                  <div className="bg-gradient-to-br from-gray-600/30 to-gray-700/30 rounded-xl p-4 border border-gray-500/20 hover:border-purple-500/30 transition-all duration-200 hover:shadow-lg hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-purple-500/20">
                        <Clock className="h-4 w-4 text-purple-400" />
                      </div>
                      <span className="text-gray-300 text-sm font-medium">7d Change</span>
                    </div>
                    <span className={`font-bold text-lg ${marketData.priceChange7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {marketData.priceChange7d >= 0 ? '+' : ''}{marketData.priceChange7d.toFixed(2)}%
                    </span>
                  </div>

                  <div className="bg-gradient-to-br from-gray-600/30 to-gray-700/30 rounded-xl p-4 border border-gray-500/20 hover:border-orange-500/30 transition-all duration-200 hover:shadow-lg hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-orange-500/20">
                        <Clock className="h-4 w-4 text-orange-400" />
                      </div>
                      <span className="text-gray-300 text-sm font-medium">30d Change</span>
                    </div>
                    <span className={`font-bold text-lg ${marketData.priceChange30d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {marketData.priceChange30d >= 0 ? '+' : ''}{marketData.priceChange30d.toFixed(2)}%
                    </span>
                  </div>

                  <div className="bg-gradient-to-br from-gray-600/30 to-gray-700/30 rounded-xl p-4 border border-gray-500/20 hover:border-emerald-500/30 transition-all duration-200 hover:shadow-lg hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/20">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                      </div>
                      <span className="text-gray-300 text-sm font-medium">All Time High</span>
                    </div>
                    <span className="text-white font-bold text-lg">${marketData.allTimeHigh.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
                  </div>

                  <div className="bg-gradient-to-br from-gray-600/30 to-gray-700/30 rounded-xl p-4 border border-gray-500/20 hover:border-red-500/30 transition-all duration-200 hover:shadow-lg hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-red-500/20">
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      </div>
                      <span className="text-gray-300 text-sm font-medium">All Time Low</span>
                    </div>
                    <span className="text-white font-bold text-lg">${marketData.allTimeLow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
                  </div>

                  <div className="bg-gradient-to-br from-gray-600/30 to-gray-700/30 rounded-xl p-4 border border-gray-500/20 hover:border-cyan-500/30 transition-all duration-200 hover:shadow-lg hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-cyan-500/20">
                        <Activity className="h-4 w-4 text-cyan-400" />
                      </div>
                      <span className="text-gray-300 text-sm font-medium">Circulating</span>
                    </div>
                    <span className="text-white font-bold text-lg">{(marketData.circulatingSupply / 1000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M</span>
                  </div>

                  <div className="bg-gradient-to-br from-gray-600/30 to-gray-700/30 rounded-xl p-4 border border-gray-500/20 hover:border-yellow-500/30 transition-all duration-200 hover:shadow-lg hover:scale-105">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-yellow-500/20">
                        <BarChart3 className="h-4 w-4 text-yellow-400" />
                      </div>
                      <span className="text-gray-300 text-sm font-medium">Total Supply</span>
                    </div>
                    <span className="text-white font-bold text-lg">{(marketData.totalSupply / 1000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Now full width */}
        <div className="space-y-6">
          {/* Price Chart and AI Controls - Full Width */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Price Chart & AI Analysis
                </span>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  Real-time
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Chart */}
              <PriceChart 
                data={cryptoData} 
                prediction={showPrediction ? prediction?.predictions || null : null}
                isLoading={dataLoading}
                crypto={cryptoId}
                onClearPrediction={handleClearPrediction}
              />

              {/* AI Analysis Controls - Moved below chart */}
              <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-4 w-4 text-green-400" />
                  <span className="text-white font-medium">AI Analysis Controls</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Time Period</label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="1d" className="text-white">1 Day</SelectItem>
                        <SelectItem value="7d" className="text-white">7 Days</SelectItem>
                        <SelectItem value="30d" className="text-white">30 Days</SelectItem>
                        <SelectItem value="90d" className="text-white">90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Prediction Days</label>
                    <Select value={predictionDays.toString()} onValueChange={(value) => setPredictionDays(Number(value))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="1" className="text-white">1 Day</SelectItem>
                        <SelectItem value="3" className="text-white">3 Days</SelectItem>
                        <SelectItem value="7" className="text-white">7 Days</SelectItem>
                        <SelectItem value="14" className="text-white">14 Days</SelectItem>
                        <SelectItem value="30" className="text-white">30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      Model Type
                      <ModelTypeTooltip modelType={modelType} />
                    </label>
                    <Select value={modelType} onValueChange={setModelType}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="basic" className="text-white">Basic LSTM</SelectItem>
                        <SelectItem value="advanced" className="text-white">Advanced Neural</SelectItem>
                        <SelectItem value="ensemble" className="text-white">Ensemble Model</SelectItem>
                        <SelectItem value="transformer" className="text-white">Transformer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      onClick={handlePredict}
                      disabled={dataLoading || predictionLoading || !cryptoData}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {predictionLoading ? (
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 animate-spin" />
                          Analyzing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          Predict
                        </div>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Prediction Results - Now inside the AI Analysis Controls box */}
                {showPrediction && prediction && (
                  <div className="mt-6 pt-6 border-t border-gray-600/50">
                    <PredictionCard prediction={prediction} crypto={cryptoId} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Analysis Tabs */}
            <div className="lg:col-span-3 space-y-6">
              {/* Detailed Analysis Tabs - Now locked */}
              <Tabs defaultValue="technical" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
                  <TabsTrigger value="technical" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700">
                    Technical Analysis
                  </TabsTrigger>
                  <TabsTrigger value="sentiment" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700">
                    Market Sentiment
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="technical">
                  <LockedTechnicalAnalysis data={cryptoData} isLoading={dataLoading} />
                </TabsContent>
                
                <TabsContent value="sentiment">
                  <LockedSentimentAnalysis crypto={cryptoId} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Real-time Data */}
            <div className="space-y-6">
              {/* Side Ad */}
              <AdBanner width={300} height={250} position="vertical" />

              {/* Dynamic Token Analysis */}
              <DynamicTokenAnalysis
                selectedCrypto={cryptoId}
                currentPrice={currentPrice}
                priceChange={priceChange}
                cryptoOptions={cryptoOptions}
              />

              {/* Disclaimer */}
              <Card className="bg-yellow-900/20 border-yellow-700">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-200 font-medium mb-1">Investment Disclaimer</p>
                      <p className="text-xs text-yellow-300">
                        This analysis is for educational purposes only. Always do your own research before investing.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Ad Banner - Bottom */}
        <div className="flex justify-center my-8">
          <AdBanner width={728} height={90} position="horizontal" />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default TokenDetail;
