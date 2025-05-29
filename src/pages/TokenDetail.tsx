
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
import { TechnicalAnalysis } from "@/components/TechnicalAnalysis";
import { SentimentAnalysis } from "@/components/SentimentAnalysis";
import { DynamicTokenAnalysis } from "@/components/DynamicTokenAnalysis";
import { DynamicPredictionAdjuster } from "@/components/DynamicPredictionAdjuster";
import { AdBanner } from "@/components/AdBanner";
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
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <span className="text-6xl">{selectedToken.icon}</span>
              <div>
                <h1 className="text-4xl font-bold text-white">{selectedToken.label}</h1>
                <p className="text-gray-300 text-lg">{selectedToken.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge className={`${
                    selectedToken.category === 'Major' ? 'bg-blue-600' :
                    selectedToken.category === 'DeFi' ? 'bg-purple-600' :
                    selectedToken.category === 'Meme' ? 'bg-orange-600' :
                    selectedToken.category === 'AI' ? 'bg-green-600' : 'bg-gray-600'
                  }`}>
                    {selectedToken.category}
                  </Badge>
                  {selectedToken.website && (
                    <a href={selectedToken.website} target="_blank" rel="noopener noreferrer" 
                       className="text-gray-400 hover:text-white transition-colors">
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                  {selectedToken.twitter && (
                    <a href={selectedToken.twitter} target="_blank" rel="noopener noreferrer"
                       className="text-gray-400 hover:text-white transition-colors">
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-4xl font-bold text-white">${currentPrice.toFixed(2)}</div>
            <div className={`flex items-center gap-2 justify-end mt-1 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              <span className="text-xl font-bold">
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
              <span className="text-gray-400 text-sm">24h</span>
            </div>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="text-gray-400 text-sm">Market Cap</div>
              <div className="text-white font-bold">${(marketData.marketCap / 1000000000).toFixed(2)}B</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="text-gray-400 text-sm">24h Volume</div>
              <div className="text-white font-bold">${(marketData.volume24h / 1000000).toFixed(2)}M</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="text-gray-400 text-sm">7d Change</div>
              <div className={`font-bold ${marketData.priceChange7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {marketData.priceChange7d >= 0 ? '+' : ''}{marketData.priceChange7d.toFixed(2)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="text-gray-400 text-sm">All Time High</div>
              <div className="text-white font-bold">${marketData.allTimeHigh.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="text-gray-400 text-sm">All Time Low</div>
              <div className="text-white font-bold">${marketData.allTimeLow.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="text-gray-400 text-sm">AI Score</div>
              <div className="text-yellow-400 font-bold">{selectedToken.score}/10</div>
            </CardContent>
          </Card>
        </div>

        {/* Ad Banner */}
        <div className="flex justify-center mb-8">
          <AdBanner width={728} height={90} position="horizontal" />
        </div>

        {/* Controls */}
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

        {/* Dynamic Prediction Adjuster - Moved here from sidebar */}
        <div className="mb-8">
          <DynamicPredictionAdjuster
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

            {/* Detailed Analysis Tabs */}
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
                <TechnicalAnalysis data={cryptoData} isLoading={dataLoading} />
              </TabsContent>
              
              <TabsContent value="sentiment">
                <SentimentAnalysis crypto={tokenId || 'bitcoin'} />
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

            {/* Live Market Data */}
            <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  Live Market Data
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Circulating Supply</span>
                  <span className="text-white font-medium">
                    {(marketData.circulatingSupply / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Supply</span>
                  <span className="text-white font-medium">
                    {(marketData.totalSupply / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">30d Change</span>
                  <span className={`font-medium ${marketData.priceChange30d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {marketData.priceChange30d >= 0 ? '+' : ''}{marketData.priceChange30d.toFixed(2)}%
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-600">
                  <div className="text-xs text-gray-400 mb-2">Price Performance</div>
                  <Progress 
                    value={((currentPrice - marketData.allTimeLow) / (marketData.allTimeHigh - marketData.allTimeLow)) * 100} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>ATL: ${marketData.allTimeLow.toFixed(2)}</span>
                    <span>ATH: ${marketData.allTimeHigh.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

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
