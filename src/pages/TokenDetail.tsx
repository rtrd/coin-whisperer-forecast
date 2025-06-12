
import React, { useState, useEffect } from 'react';
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
  TrendingDownIcon
} from "lucide-react";
import { PriceChart } from "@/components/PriceChart";
import { PredictionCard } from "@/components/PredictionCard";
import { LockedTechnicalAnalysis } from "@/components/LockedTechnicalAnalysis";
import { LockedSentimentAnalysis } from "@/components/LockedSentimentAnalysis";
import { LockedDynamicPrediction } from "@/components/LockedDynamicPrediction";
import { DynamicTokenAnalysis } from "@/components/DynamicTokenAnalysis";
import { AdBanner } from "@/components/AdBanner";
import { IndexHeader } from "@/components/IndexHeader";
import { useCryptoData } from "@/hooks/useCryptoData";
import { usePrediction } from "@/hooks/usePrediction";
import { toast } from "sonner";

const TokenDetail = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [timeframe, setTimeframe] = useState('7d');
  const [predictionDays, setPredictionDays] = useState(7);
  const [marketData, setMarketData] = useState({
    marketCap: 0,
    volume24h: 0,
    circulatingSupply: 0,
    totalSupply: 0,
    allTimeHigh: 0,
    allTimeLow: 0,
    priceChange7d: 0,
    priceChange30d: 0
  });

  const { data: cryptoData, isLoading: dataLoading, error: dataError } = useCryptoData(tokenId || 'bitcoin', timeframe);
  const { prediction, isLoading: predictionLoading, generatePrediction } = usePrediction();

  const cryptoOptions = [
    // Major Cryptocurrencies
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%', 
      description: 'The first and largest cryptocurrency by market cap', 
      website: 'https://bitcoin.org', twitter: 'https://twitter.com/bitcoin' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%',
      description: 'Smart contract platform and second-largest cryptocurrency',
      website: 'https://ethereum.org', twitter: 'https://twitter.com/ethereum' },
    { value: 'binancecoin', label: 'BNB (BNB)', icon: '🔶', category: 'Major', score: 7.8, prediction: '+6.1%',
      description: 'Native token of the Binance ecosystem',
      website: 'https://www.bnbchain.org', twitter: 'https://twitter.com/bnbchain' },
    { value: 'solana', label: 'Solana (SOL)', icon: '◎', category: 'Major', score: 8.1, prediction: '+15.8%',
      description: 'High-performance blockchain for decentralized apps',
      website: 'https://solana.com', twitter: 'https://twitter.com/solana' },
    { value: 'cardano', label: 'Cardano (ADA)', icon: '₳', category: 'Major', score: 6.9, prediction: '+3.2%',
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
    { value: 'dogecoin', label: 'Dogecoin (DOGE)', icon: '🐕', category: 'Meme', score: 6.1, prediction: '+18.5%',
      description: 'The original meme cryptocurrency',
      website: 'https://dogecoin.com', twitter: 'https://twitter.com/dogecoin' },
    { value: 'shiba-inu', label: 'Shiba Inu (SHIB)', icon: '🐕‍🦺', category: 'Meme', score: 5.9, prediction: '+25.3%',
      description: 'Community-driven meme token',
      website: 'https://shibatoken.com', twitter: 'https://twitter.com/shibtoken' },
    { value: 'pepe', label: 'Pepe (PEPE)', icon: '🐸', category: 'Meme', score: 8.8, prediction: '+65.3%',
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

  const selectedToken = cryptoOptions.find(c => c.value === tokenId) || cryptoOptions[0];

  useEffect(() => {
    // Generate random market data
    if (cryptoData && cryptoData.length > 0) {
      const currentPrice = cryptoData[cryptoData.length - 1].price;
      setMarketData({
        marketCap: currentPrice * (Math.random() * 500000000 + 100000000),
        volume24h: currentPrice * (Math.random() * 50000000 + 10000000),
        circulatingSupply: Math.random() * 1000000000 + 100000000,
        totalSupply: Math.random() * 1000000000 + 500000000,
        allTimeHigh: currentPrice * (1 + Math.random() * 5),
        allTimeLow: currentPrice * (Math.random() * 0.5 + 0.1),
        priceChange7d: (Math.random() - 0.5) * 40,
        priceChange30d: (Math.random() - 0.5) * 80
      });
    }
  }, [cryptoData]);

  const handlePredict = async () => {
    if (!cryptoData) {
      toast.error("No data available for prediction");
      return;
    }
    
    await generatePrediction(cryptoData, tokenId || 'bitcoin', predictionDays);
    toast.success("Prediction generated successfully!");
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
                Back to Dashboard
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
          selectedCrypto={tokenId || 'bitcoin'}
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
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Combined Header Card - Styled like main page sections */}
        <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              {/* Left Column - Token Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-4xl font-bold text-white">{selectedToken.label}</h1>
                    <Badge 
                      className={`px-3 py-1 text-sm font-medium ${
                        selectedToken.category === 'Major' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        selectedToken.category === 'DeFi' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                        selectedToken.category === 'Meme' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                        selectedToken.category === 'AI' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                        'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      } border backdrop-blur-sm`}
                    >
                      {selectedToken.category}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">{selectedToken.description}</p>
                  
                  <div className="flex items-center gap-4">
                    {selectedToken.website && (
                      <a href={selectedToken.website} target="_blank" rel="noopener noreferrer" 
                         className="text-gray-400 hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-700/30">
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                    {selectedToken.twitter && (
                      <a href={selectedToken.twitter} target="_blank" rel="noopener noreferrer"
                         className="text-gray-400 hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-700/30">
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Current Price and Change */}
                <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-xl p-6 border border-gray-600/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Current Price</div>
                      <div className="text-4xl font-bold text-white">${currentPrice.toFixed(2)}</div>
                    </div>
                    <div className={`flex items-center gap-2 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {priceChange >= 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                      <span className="text-2xl font-bold">
                        {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                      </span>
                      <span className="text-gray-400 text-sm">24h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Market Stats */}
              <div className="lg:w-80">
                <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-xl p-6 border border-gray-600/50">
                  <h3 className="text-white font-semibold text-lg mb-4">Market Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="h-4 w-4 text-blue-400" />
                        <div className="text-gray-400 text-sm">Market Cap</div>
                      </div>
                      <div className="text-white font-semibold">${(marketData.marketCap / 1000000000).toFixed(2)}B</div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-4 w-4 text-green-400" />
                        <div className="text-gray-400 text-sm">24h Volume</div>
                      </div>
                      <div className="text-white font-semibold">${(marketData.volume24h / 1000000).toFixed(2)}M</div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-purple-400" />
                        <div className="text-gray-400 text-sm">7d Change</div>
                      </div>
                      <div className={`font-semibold ${marketData.priceChange7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {marketData.priceChange7d >= 0 ? '+' : ''}{marketData.priceChange7d.toFixed(2)}%
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        <div className="text-gray-400 text-sm">All Time High</div>
                      </div>
                      <div className="text-white font-semibold">${marketData.allTimeHigh.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ad Banner */}
        <div className="flex justify-center mb-8">
          <AdBanner width={728} height={90} position="horizontal" />
        </div>

        {/* AI Analysis Controls */}
        <Card className="mb-8 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-green-400" />
              AI Analysis Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      Generate Prediction
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Prediction Adjuster - Now locked */}
        <div className="mb-8">
          <LockedDynamicPrediction
            selectedCrypto={tokenId || 'bitcoin'}
            currentPrice={currentPrice}
            priceChange={priceChange}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Chart and Analysis */}
          <div className="lg:col-span-3 space-y-6">
            {/* Price Chart */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Price Chart & AI Prediction
                  </span>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    Real-time
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PriceChart 
                  data={cryptoData} 
                  prediction={prediction?.predictions || null}
                  isLoading={dataLoading}
                  crypto={tokenId || 'bitcoin'}
                />
              </CardContent>
            </Card>

            {/* Prediction Results */}
            {prediction && (
              <PredictionCard prediction={prediction} crypto={tokenId || 'bitcoin'} />
            )}

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
                <LockedSentimentAnalysis crypto={tokenId || 'bitcoin'} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Real-time Data */}
          <div className="space-y-6">
            {/* Side Ad */}
            <AdBanner width={300} height={250} position="vertical" />

            {/* Dynamic Token Analysis */}
            <DynamicTokenAnalysis
              selectedCrypto={tokenId || 'bitcoin'}
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
    </div>
  );
};

export default TokenDetail;
