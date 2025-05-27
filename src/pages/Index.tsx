
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Activity, Brain, Target, AlertCircle } from "lucide-react";
import { PriceChart } from "@/components/PriceChart";
import { PredictionCard } from "@/components/PredictionCard";
import { TechnicalAnalysis } from "@/components/TechnicalAnalysis";
import { SentimentAnalysis } from "@/components/SentimentAnalysis";
import { useCryptoData } from "@/hooks/useCryptoData";
import { usePrediction } from "@/hooks/usePrediction";
import { toast } from "sonner";

const Index = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [timeframe, setTimeframe] = useState('7d');
  const [predictionDays, setPredictionDays] = useState(7);
  
  const { data: cryptoData, isLoading: dataLoading, error: dataError } = useCryptoData(selectedCrypto, timeframe);
  const { prediction, isLoading: predictionLoading, generatePrediction } = usePrediction();

  const cryptoOptions = [
    // Major Cryptocurrencies
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major' },
    { value: 'binancecoin', label: 'BNB (BNB)', icon: '🔶', category: 'Major' },
    { value: 'ripple', label: 'XRP (XRP)', icon: '💧', category: 'Major' },
    { value: 'cardano', label: 'Cardano (ADA)', icon: '₳', category: 'Major' },
    { value: 'solana', label: 'Solana (SOL)', icon: '◎', category: 'Major' },
    { value: 'avalanche-2', label: 'Avalanche (AVAX)', icon: '🔺', category: 'Major' },
    { value: 'polygon', label: 'Polygon (MATIC)', icon: '⬟', category: 'Major' },
    { value: 'polkadot', label: 'Polkadot (DOT)', icon: '⚫', category: 'Major' },
    { value: 'chainlink', label: 'Chainlink (LINK)', icon: '🔗', category: 'Major' },
    
    // DeFi Tokens
    { value: 'uniswap', label: 'Uniswap (UNI)', icon: '🦄', category: 'DeFi' },
    { value: 'aave', label: 'Aave (AAVE)', icon: '👻', category: 'DeFi' },
    { value: 'compound-governance-token', label: 'Compound (COMP)', icon: '🏦', category: 'DeFi' },
    { value: 'maker', label: 'Maker (MKR)', icon: '🏭', category: 'DeFi' },
    { value: 'sushiswap', label: 'SushiSwap (SUSHI)', icon: '🍣', category: 'DeFi' },
    { value: 'pancakeswap-token', label: 'PancakeSwap (CAKE)', icon: '🥞', category: 'DeFi' },
    { value: 'curve-dao-token', label: 'Curve (CRV)', icon: '📈', category: 'DeFi' },
    
    // Meme Coins
    { value: 'dogecoin', label: 'Dogecoin (DOGE)', icon: '🐕', category: 'Meme' },
    { value: 'shiba-inu', label: 'Shiba Inu (SHIB)', icon: '🐕‍🦺', category: 'Meme' },
    { value: 'pepe', label: 'Pepe (PEPE)', icon: '🐸', category: 'Meme' },
    { value: 'floki', label: 'Floki (FLOKI)', icon: '🐺', category: 'Meme' },
    { value: 'bonk', label: 'Bonk (BONK)', icon: '🔨', category: 'Meme' },
    { value: 'dogelon-mars', label: 'Dogelon Mars (ELON)', icon: '🚀', category: 'Meme' },
    { value: 'baby-doge-coin', label: 'Baby Doge (BABYDOGE)', icon: '🐶', category: 'Meme' },
    { value: 'safemoon-2', label: 'SafeMoon (SFM)', icon: '🌙', category: 'Meme' },
    
    // Layer 2 & Scaling
    { value: 'arbitrum', label: 'Arbitrum (ARB)', icon: '🔵', category: 'L2' },
    { value: 'optimism', label: 'Optimism (OP)', icon: '🔴', category: 'L2' },
    { value: 'immutable-x', label: 'Immutable X (IMX)', icon: '⚡', category: 'L2' },
    { value: 'loopring', label: 'Loopring (LRC)', icon: '🔄', category: 'L2' },
    
    // Gaming & NFT
    { value: 'axie-infinity', label: 'Axie Infinity (AXS)', icon: '🎮', category: 'Gaming' },
    { value: 'the-sandbox', label: 'The Sandbox (SAND)', icon: '🏖️', category: 'Gaming' },
    { value: 'decentraland', label: 'Decentraland (MANA)', icon: '🌐', category: 'Gaming' },
    { value: 'enjincoin', label: 'Enjin Coin (ENJ)', icon: '💎', category: 'Gaming' },
    { value: 'gala', label: 'Gala (GALA)', icon: '🎲', category: 'Gaming' },
    
    // AI & Data
    { value: 'fetch-ai', label: 'Fetch.ai (FET)', icon: '🤖', category: 'AI' },
    { value: 'singularitynet', label: 'SingularityNET (AGIX)', icon: '🧠', category: 'AI' },
    { value: 'ocean-protocol', label: 'Ocean Protocol (OCEAN)', icon: '🌊', category: 'AI' },
    { value: 'render-token', label: 'Render (RNDR)', icon: '🎨', category: 'AI' },
    
    // Privacy Coins
    { value: 'monero', label: 'Monero (XMR)', icon: '🔒', category: 'Privacy' },
    { value: 'zcash', label: 'Zcash (ZEC)', icon: '🛡️', category: 'Privacy' },
    { value: 'dash', label: 'Dash (DASH)', icon: '💨', category: 'Privacy' },
    
    // Stablecoins
    { value: 'tether', label: 'Tether (USDT)', icon: '💵', category: 'Stable' },
    { value: 'usd-coin', label: 'USD Coin (USDC)', icon: '🪙', category: 'Stable' },
    { value: 'dai', label: 'Dai (DAI)', icon: '⚖️', category: 'Stable' },
    
    // Newer/Trending
    { value: 'sui', label: 'Sui (SUI)', icon: '🌊', category: 'New' },
    { value: 'aptos', label: 'Aptos (APT)', icon: '🏛️', category: 'New' },
    { value: 'blur', label: 'Blur (BLUR)', icon: '🌀', category: 'New' },
    { value: 'injective-protocol', label: 'Injective (INJ)', icon: '💉', category: 'New' },
    { value: 'celestia', label: 'Celestia (TIA)', icon: '⭐', category: 'New' },
  ];

  const handlePredict = async () => {
    if (!cryptoData) {
      toast.error("No data available for prediction");
      return;
    }
    
    await generatePrediction(cryptoData, selectedCrypto, predictionDays);
    toast.success("Prediction generated successfully!");
  };

  useEffect(() => {
    if (dataError) {
      toast.error("Failed to fetch crypto data");
    }
  }, [dataError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="h-10 w-10 text-blue-400" />
            CryptoPredictAI
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Advanced cryptocurrency price prediction using machine learning, technical analysis, and market sentiment
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-8 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-green-400" />
              Prediction Parameters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Cryptocurrency</label>
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 max-h-96 overflow-y-auto">
                    {['Major', 'DeFi', 'Meme', 'L2', 'Gaming', 'AI', 'Privacy', 'Stable', 'New'].map(category => (
                      <div key={category}>
                        <div className="px-2 py-1 text-xs font-semibold text-gray-400 bg-gray-600">
                          {category} Coins
                        </div>
                        {cryptoOptions
                          .filter(crypto => crypto.category === category)
                          .map((crypto) => (
                            <SelectItem key={crypto.value} value={crypto.value} className="text-white">
                              <span className="flex items-center gap-2">
                                <span className="text-yellow-400">{crypto.icon}</span>
                                {crypto.label}
                              </span>
                            </SelectItem>
                          ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Data Timeframe</label>
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
                <Input
                  type="number"
                  value={predictionDays}
                  onChange={(e) => setPredictionDays(Number(e.target.value))}
                  min="1"
                  max="30"
                  className="bg-gray-700 border-gray-600 text-white"
                />
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Chart and Prediction */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Chart */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-400" />
                    Price Chart & Prediction
                  </span>
                  {cryptoData && (
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Live Data
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PriceChart 
                  data={cryptoData} 
                  prediction={prediction?.predictions || null}
                  isLoading={dataLoading}
                  crypto={selectedCrypto}
                />
              </CardContent>
            </Card>

            {/* Prediction Results */}
            {prediction && (
              <PredictionCard prediction={prediction} crypto={selectedCrypto} />
            )}
          </div>

          {/* Right Column - Analysis */}
          <div className="space-y-6">
            <Tabs defaultValue="technical" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
                <TabsTrigger value="technical" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700">
                  Technical
                </TabsTrigger>
                <TabsTrigger value="sentiment" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700">
                  Sentiment
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="technical">
                <TechnicalAnalysis data={cryptoData} isLoading={dataLoading} />
              </TabsContent>
              
              <TabsContent value="sentiment">
                <SentimentAnalysis crypto={selectedCrypto} />
              </TabsContent>
            </Tabs>

            {/* Current Price Info */}
            {cryptoData && cryptoData.length > 0 && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-yellow-400">
                      {cryptoOptions.find(c => c.value === selectedCrypto)?.icon}
                    </span>
                    Current Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-white">
                      ${cryptoData[cryptoData.length - 1]?.price?.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2">
                      {cryptoData[cryptoData.length - 1]?.price > cryptoData[cryptoData.length - 2]?.price ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      )}
                      <span className={`text-sm ${
                        cryptoData[cryptoData.length - 1]?.price > cryptoData[cryptoData.length - 2]?.price 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {cryptoData[cryptoData.length - 1]?.price > cryptoData[cryptoData.length - 2]?.price ? '+' : ''}
                        {(((cryptoData[cryptoData.length - 1]?.price - cryptoData[cryptoData.length - 2]?.price) / 
                           cryptoData[cryptoData.length - 2]?.price) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Disclaimer */}
            <Card className="bg-yellow-900/20 border-yellow-700">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-200 font-medium mb-1">Investment Disclaimer</p>
                    <p className="text-xs text-yellow-300">
                      Predictions are for educational purposes only. Cryptocurrency investments carry high risk. 
                      Always do your own research before making investment decisions.
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

export default Index;
