import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Activity, Brain, Target, AlertCircle, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { PriceChart } from "@/components/PriceChart";
import { PredictionCard } from "@/components/PredictionCard";
import { TechnicalAnalysis } from "@/components/TechnicalAnalysis";
import { SentimentAnalysis } from "@/components/SentimentAnalysis";
import WordPressIntegration from "@/components/WordPressIntegration";
import { DynamicMarketMovers } from "@/components/DynamicMarketMovers";
import { DynamicTokenAnalysis } from "@/components/DynamicTokenAnalysis";
import { AdBanner } from "@/components/AdBanner";
import { PumpFunIntegration } from "@/components/PumpFunIntegration";
import { DynamicPredictionAdjuster } from "@/components/DynamicPredictionAdjuster";
import Footer from "@/components/Footer";
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
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Major', score: 8.5, prediction: '+12.5%' },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Major', score: 8.2, prediction: '+8.3%' },
    { value: 'binancecoin', label: 'BNB (BNB)', icon: '🔶', category: 'Major', score: 7.8, prediction: '+6.1%' },
    { value: 'ripple', label: 'XRP (XRP)', icon: '💧', category: 'Major', score: 7.2, prediction: '+4.7%' },
    { value: 'cardano', label: 'Cardano (ADA)', icon: '₳', category: 'Major', score: 6.9, prediction: '+3.2%' },
    { value: 'solana', label: 'Solana (SOL)', icon: '◎', category: 'Major', score: 8.1, prediction: '+15.8%' },
    { value: 'avalanche-2', label: 'Avalanche (AVAX)', icon: '🔺', category: 'Major', score: 7.5, prediction: '+7.9%' },
    { value: 'polygon', label: 'Polygon (MATIC)', icon: '⬟', category: 'Major', score: 7.3, prediction: '+5.4%' },
    { value: 'polkadot', label: 'Polkadot (DOT)', icon: '⚫', category: 'Major', score: 6.8, prediction: '+2.1%' },
    { value: 'chainlink', label: 'Chainlink (LINK)', icon: '🔗', category: 'Major', score: 7.7, prediction: '+9.3%' },
    { value: 'litecoin', label: 'Litecoin (LTC)', icon: 'Ł', category: 'Major', score: 6.5, prediction: '+3.8%' },
    { value: 'bitcoin-cash', label: 'Bitcoin Cash (BCH)', icon: '₿', category: 'Major', score: 6.2, prediction: '+2.9%' },
    { value: 'stellar', label: 'Stellar (XLM)', icon: '🌟', category: 'Major', score: 6.4, prediction: '+4.1%' },
    { value: 'cosmos', label: 'Cosmos (ATOM)', icon: '⚛️', category: 'Major', score: 7.1, prediction: '+6.8%' },
    { value: 'algorand', label: 'Algorand (ALGO)', icon: '🔺', category: 'Major', score: 6.7, prediction: '+4.5%' },
    
    // DeFi Tokens
    { value: 'uniswap', label: 'Uniswap (UNI)', icon: '🦄', category: 'DeFi', score: 7.1, prediction: '+11.2%' },
    { value: 'aave', label: 'Aave (AAVE)', icon: '👻', category: 'DeFi', score: 7.4, prediction: '+8.7%' },
    { value: 'compound-governance-token', label: 'Compound (COMP)', icon: '🏦', category: 'DeFi', score: 6.5, prediction: '+4.3%' },
    { value: 'maker', label: 'Maker (MKR)', icon: '🏭', category: 'DeFi', score: 6.9, prediction: '+6.8%' },
    { value: 'sushiswap', label: 'SushiSwap (SUSHI)', icon: '🍣', category: 'DeFi', score: 6.2, prediction: '+3.1%' },
    { value: 'pancakeswap-token', label: 'PancakeSwap (CAKE)', icon: '🥞', category: 'DeFi', score: 5.8, prediction: '-2.4%' },
    { value: 'curve-dao-token', label: 'Curve (CRV)', icon: '📈', category: 'DeFi', score: 6.4, prediction: '+1.9%' },
    { value: 'yearn-finance', label: 'Yearn Finance (YFI)', icon: '🔥', category: 'DeFi', score: 6.8, prediction: '+7.2%' },
    { value: 'synthetix', label: 'Synthetix (SNX)', icon: '⚡', category: 'DeFi', score: 6.1, prediction: '+3.4%' },
    { value: 'balancer', label: 'Balancer (BAL)', icon: '⚖️', category: 'DeFi', score: 5.9, prediction: '+2.1%' },
    
    // Meme Coins
    { value: 'dogecoin', label: 'Dogecoin (DOGE)', icon: '🐕', category: 'Meme', score: 6.1, prediction: '+18.5%' },
    { value: 'shiba-inu', label: 'Shiba Inu (SHIB)', icon: '🐕‍🦺', category: 'Meme', score: 5.9, prediction: '+25.3%' },
    { value: 'pepe', label: 'Pepe (PEPE)', icon: '🐸', category: 'Meme', score: 8.8, prediction: '+65.3%' },
    { value: 'floki', label: 'Floki (FLOKI)', icon: '🐺', category: 'Meme', score: 7.2, prediction: '+32.1%' },
    { value: 'bonk', label: 'Bonk (BONK)', icon: '🔨', category: 'Meme', score: 9.2, prediction: '+78.5%' },
    { value: 'dogelon-mars', label: 'Dogelon Mars (ELON)', icon: '🚀', category: 'Meme', score: 6.8, prediction: '+22.7%' },
    { value: 'baby-doge-coin', label: 'Baby Doge (BABYDOGE)', icon: '🐶', category: 'Meme', score: 5.5, prediction: '+14.2%' },
    { value: 'safemoon-2', label: 'SafeMoon (SFM)', icon: '🌙', category: 'Meme', score: 4.1, prediction: '-8.9%' },
    { value: 'wojak', label: 'Wojak (WOJAK)', icon: '😭', category: 'Meme', score: 7.5, prediction: '+45.2%' },
    { value: 'pepecoin-network', label: 'PepeCoin (PEPECOIN)', icon: '🐸', category: 'Meme', score: 6.9, prediction: '+28.3%' },
    
    // Layer 2 & Scaling
    { value: 'arbitrum', label: 'Arbitrum (ARB)', icon: '🔵', category: 'L2', score: 7.8, prediction: '+13.4%' },
    { value: 'optimism', label: 'Optimism (OP)', icon: '🔴', category: 'L2', score: 7.6, prediction: '+10.2%' },
    { value: 'immutable-x', label: 'Immutable X (IMX)', icon: '⚡', category: 'L2', score: 7.1, prediction: '+8.5%' },
    { value: 'loopring', label: 'Loopring (LRC)', icon: '🔄', category: 'L2', score: 6.3, prediction: '+4.7%' },
    { value: 'polygon-ecosystem-token', label: 'POL Token (POL)', icon: '🟣', category: 'L2', score: 7.2, prediction: '+9.1%' },
    { value: 'metis-token', label: 'Metis (METIS)', icon: '🔷', category: 'L2', score: 6.8, prediction: '+6.3%' },
    
    // Gaming & NFT
    { value: 'axie-infinity', label: 'Axie Infinity (AXS)', icon: '🎮', category: 'Gaming', score: 6.7, prediction: '+12.1%' },
    { value: 'the-sandbox', label: 'The Sandbox (SAND)', icon: '🏖️', category: 'Gaming', score: 6.9, prediction: '+15.3%' },
    { value: 'decentraland', label: 'Decentraland (MANA)', icon: '🌐', category: 'Gaming', score: 6.4, prediction: '+9.8%' },
    { value: 'enjincoin', label: 'Enjin Coin (ENJ)', icon: '💎', category: 'Gaming', score: 6.2, prediction: '+7.1%' },
    { value: 'gala', label: 'Gala (GALA)', icon: '🎲', category: 'Gaming', score: 5.8, prediction: '+5.4%' },
    { value: 'immutable-x', label: 'Immutable X (IMX)', icon: '🃏', category: 'Gaming', score: 7.1, prediction: '+11.5%' },
    { value: 'flow', label: 'Flow (FLOW)', icon: '🌊', category: 'Gaming', score: 6.5, prediction: '+8.2%' },
    { value: 'theta-token', label: 'Theta (THETA)', icon: '📺', category: 'Gaming', score: 6.3, prediction: '+6.9%' },
    
    // AI & Data
    { value: 'fetch-ai', label: 'Fetch.ai (FET)', icon: '🤖', category: 'AI', score: 8.5, prediction: '+52.1%' },
    { value: 'singularitynet', label: 'SingularityNET (AGIX)', icon: '🧠', category: 'AI', score: 8.1, prediction: '+41.8%' },
    { value: 'ocean-protocol', label: 'Ocean Protocol (OCEAN)', icon: '🌊', category: 'AI', score: 7.9, prediction: '+38.2%' },
    { value: 'render-token', label: 'Render (RNDR)', icon: '🎨', category: 'AI', score: 8.1, prediction: '+41.7%' },
    { value: 'chainlink', label: 'Chainlink (LINK)', icon: '🔗', category: 'AI', score: 8.0, prediction: '+35.8%' },
    { value: 'the-graph', label: 'The Graph (GRT)', icon: '📊', category: 'AI', score: 7.3, prediction: '+24.1%' },
    { value: 'artificial-superintelligence-alliance', label: 'ASI Alliance (ASI)', icon: '🤖', category: 'AI', score: 8.3, prediction: '+48.9%' },
    
    // New & Trending
    { value: 'worldcoin-wld', label: 'Worldcoin (WLD)', icon: '🌍', category: 'New', score: 7.3, prediction: '+28.4%' },
    { value: 'sei-network', label: 'Sei (SEI)', icon: '⚡', category: 'New', score: 7.8, prediction: '+34.2%' },
    { value: 'starknet', label: 'Starknet (STRK)', icon: '🌟', category: 'New', score: 8.0, prediction: '+45.1%' },
    { value: 'jupiter-exchange-solana', label: 'Jupiter (JUP)', icon: '🪐', category: 'New', score: 7.5, prediction: '+19.8%' },
    { value: 'sui', label: 'Sui (SUI)', icon: '🌊', category: 'New', score: 7.9, prediction: '+31.5%' },
    { value: 'aptos', label: 'Aptos (APT)', icon: '🏛️', category: 'New', score: 7.7, prediction: '+26.8%' },
    { value: 'blur', label: 'Blur (BLUR)', icon: '🌀', category: 'New', score: 6.8, prediction: '+12.4%' },
    { value: 'injective-protocol', label: 'Injective (INJ)', icon: '💉', category: 'New', score: 7.9, prediction: '+35.2%' },
    { value: 'celestia', label: 'Celestia (TIA)', icon: '⭐', category: 'New', score: 8.2, prediction: '+42.1%' },
    { value: 'kaspa', label: 'Kaspa (KAS)', icon: '👻', category: 'New', score: 8.1, prediction: '+39.7%' },
    
    // Privacy Coins
    { value: 'monero', label: 'Monero (XMR)', icon: '🔒', category: 'Privacy', score: 4.5, prediction: '-8.9%' },
    { value: 'zcash', label: 'Zcash (ZEC)', icon: '🛡️', category: 'Privacy', score: 4.8, prediction: '-7.2%' },
    { value: 'dash', label: 'Dash (DASH)', icon: '💨', category: 'Privacy', score: 4.1, prediction: '-12.3%' },
    { value: 'beam', label: 'Beam (BEAM)', icon: '💡', category: 'Privacy', score: 5.2, prediction: '-3.1%' },
    { value: 'secret', label: 'Secret (SCRT)', icon: '🤫', category: 'Privacy', score: 5.5, prediction: '-1.8%' },
    
    // Stablecoins
    { value: 'tether', label: 'Tether (USDT)', icon: '💵', category: 'Stable', score: 3.2, prediction: '-0.05%' },
    { value: 'usd-coin', label: 'USD Coin (USDC)', icon: '🪙', category: 'Stable', score: 3.5, prediction: '+0.02%' },
    { value: 'dai', label: 'Dai (DAI)', icon: '⚖️', category: 'Stable', score: 3.8, prediction: '+0.08%' },
    { value: 'first-digital-usd', label: 'FDUSD (FDUSD)', icon: '💰', category: 'Stable', score: 3.1, prediction: '+0.01%' },
    { value: 'trueusd', label: 'TrueUSD (TUSD)', icon: '💎', category: 'Stable', score: 3.3, prediction: '-0.02%' },
    
    // Enterprise & Institutional
    { value: 'vechain', label: 'VeChain (VET)', icon: '⚡', category: 'Enterprise', score: 6.9, prediction: '+8.4%' },
    { value: 'quant-network', label: 'Quant (QNT)', icon: '🔢', category: 'Enterprise', score: 7.4, prediction: '+15.2%' },
    { value: 'hedera-hashgraph', label: 'Hedera (HBAR)', icon: '♦️', category: 'Enterprise', score: 7.1, prediction: '+11.8%' },
    { value: 'iota', label: 'IOTA (MIOTA)', icon: '🔗', category: 'Enterprise', score: 6.2, prediction: '+5.3%' },
    { value: 'neo', label: 'NEO (NEO)', icon: '🟢', category: 'Enterprise', score: 6.5, prediction: '+7.1%' },
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

  const currentPrice = cryptoData && cryptoData.length > 0 ? cryptoData[cryptoData.length - 1]?.price : 0;
  const previousPrice = cryptoData && cryptoData.length > 1 ? cryptoData[cryptoData.length - 2]?.price : 0;
  const priceChange = currentPrice && previousPrice ? ((currentPrice - previousPrice) / previousPrice) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="h-12 w-12 text-blue-400" />
            PumpParade
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">PRO</Badge>
            <Link to="/subscribe">
              <Button className="ml-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Unlock Premium
              </Button>
            </Link>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced cryptocurrency price prediction using machine learning, technical analysis, and market sentiment
          </p>
          
          {/* Live Price Ticker */}
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700 max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {cryptoOptions.find(c => c.value === selectedCrypto)?.icon}
                </span>
                <div>
                  <div className="text-white font-bold text-lg">${currentPrice.toFixed(2)}</div>
                  <div className="text-gray-400 text-sm">
                    {cryptoOptions.find(c => c.value === selectedCrypto)?.label.split(' ')[0]}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {priceChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="font-bold">
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  </span>
                </div>
                <div className="text-gray-400 text-xs">24h</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ad Banner 728x90 */}
        <div className="flex justify-center mb-8">
          <AdBanner width={728} height={90} position="horizontal" />
        </div>

        {/* WordPress Integration */}
        <WordPressIntegration />

        {/* Pump.fun Integration */}
        <PumpFunIntegration />

        {/* Dynamic Market Movers Widget */}
        <DynamicMarketMovers />

        {/* Controls */}
        <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-green-400" />
              AI Prediction Parameters
              <Badge className="bg-blue-600">Advanced</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Cryptocurrency</label>
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 max-h-96 overflow-y-auto">
                    {['Major', 'DeFi', 'Meme', 'L2', 'Gaming', 'AI', 'Privacy', 'Stable', 'New', 'Enterprise'].map(category => (
                      <div key={category}>
                        <div className="px-2 py-1 text-xs font-semibold text-gray-400 bg-gray-600">
                          {category} Coins
                        </div>
                        {cryptoOptions
                          .filter(crypto => crypto.category === category)
                          .map((crypto) => (
                            <SelectItem key={crypto.value} value={crypto.value} className="text-white">
                              <div className="flex items-center justify-between w-full">
                                <span className="flex items-center gap-2">
                                  <span className="text-yellow-400">{crypto.icon}</span>
                                  {crypto.label}
                                </span>
                                <div className="flex items-center gap-2 ml-4">
                                  <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                                    {crypto.prediction}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                                    {crypto.score}
                                  </Badge>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Historical Data Period</label>
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
                <label className="text-sm font-medium text-gray-300 mb-2 block">Prediction Horizon</label>
                <Input
                  type="number"
                  value={predictionDays}
                  onChange={(e) => setPredictionDays(Number(e.target.value))}
                  min="1"
                  max="30"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Model Type</label>
                <Select defaultValue="advanced">
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="basic" className="text-white">Basic Model</SelectItem>
                    <SelectItem value="advanced" className="text-white">Advanced AI</SelectItem>
                    <SelectItem value="ensemble" className="text-white">Ensemble Model</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={handlePredict}
                  disabled={dataLoading || predictionLoading || !cryptoData}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Chart and Prediction */}
          <div className="lg:col-span-3 space-y-6">
            {/* Price Chart */}
            <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Advanced Candlestick Chart & AI Prediction
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

          {/* Right Column - Analysis and Ads */}
          <div className="space-y-6">
            {/* Side Ad 300x250 */}
            <AdBanner width={300} height={250} position="vertical" />

            {/* Dynamic Prediction Adjuster */}
            <DynamicPredictionAdjuster
              selectedCrypto={selectedCrypto}
              currentPrice={currentPrice}
              priceChange={priceChange}
            />

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

            {/* Dynamic Token Analysis */}
            <DynamicTokenAnalysis
              selectedCrypto={selectedCrypto}
              currentPrice={currentPrice}
              priceChange={priceChange}
              cryptoOptions={cryptoOptions}
            />

            {/* Disclaimer */}
            <Card className="bg-yellow-900/20 border-yellow-700 shadow-2xl">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-200 font-medium mb-1">Investment Disclaimer</p>
                    <p className="text-xs text-yellow-300">
                      AI predictions are for educational purposes only. Cryptocurrency investments carry high risk. 
                      Always do your own research before making investment decisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;
