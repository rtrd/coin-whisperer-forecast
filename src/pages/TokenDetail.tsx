import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PriceChart } from "@/components/PriceChart";
import { PredictionCard } from "@/components/PredictionCard";
import { TokenSidebar } from "@/components/token/TokenSidebar";
import { TokenHeader } from "@/components/token/TokenHeader";
import { TokenPriceDisplay } from "@/components/token/TokenPriceDisplay";
import { useCryptoData } from '@/hooks/useCryptoData';
import { usePrediction } from '@/hooks/usePrediction';
import { 
  BarChart3, 
  Target, 
  Brain, 
  X, 
  Coins,
  ExternalLink
} from "lucide-react";
import { toast } from 'sonner';

interface OtherToken {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  icon: string;
}

export default function TokenDetail() {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [predictionDays, setPredictionDays] = useState(7);
  const [modelType, setModelType] = useState('lstm');
  const [confidenceLevel, setConfidenceLevel] = useState('moderate');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [otherTokens, setOtherTokens] = useState<OtherToken[]>([]);

  // Hooks
  const { data: cryptoData, isLoading: dataLoading } = useCryptoData(tokenId || 'bitcoin');
  const { prediction, isLoading: isGeneratingPrediction, generatePrediction } = usePrediction();

  // Crypto options for fallback
  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
    { value: 'ethereum', label: 'Ethereum (ETH)', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { value: 'ripple', label: 'XRP (XRP)', symbol: 'XRP', name: 'XRP', icon: '◉' },
    { value: 'dogecoin', label: 'Dogecoin (DOGE)', symbol: 'DOGE', name: 'Dogecoin', icon: '🐕' }
  ];

  useEffect(() => {
    if (cryptoData && cryptoData.length > 0) {
      const latestData = cryptoData[cryptoData.length - 1];
      setCurrentPrice(latestData.price);
      
      if (cryptoData.length > 1) {
        const previousData = cryptoData[cryptoData.length - 2];
        const change = ((latestData.price - previousData.price) / previousData.price) * 100;
        setPriceChange(change);
      }
    }
  }, [cryptoData]);

  useEffect(() => {
    // Generate other tokens data
    const generateOtherTokens = () => {
      const tokens = [
        { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
        { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
        { id: 'ripple', symbol: 'XRP', name: 'XRP', icon: '◉' },
        { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', icon: '🐕' },
        { id: 'cardano', symbol: 'ADA', name: 'Cardano', icon: '🔷' },
        { id: 'solana', symbol: 'SOL', name: 'Solana', icon: '🌞' }
      ].filter(token => token.id !== tokenId);

      const tokensWithPrices = tokens.map(token => ({
        ...token,
        price: Math.random() * 100 + 10,
        change24h: (Math.random() - 0.5) * 20
      }));

      setOtherTokens(tokensWithPrices);
    };

    generateOtherTokens();
  }, [tokenId]);

  const handleGeneratePrediction = async () => {
    if (!cryptoData || cryptoData.length === 0) {
      toast.error('No data available for prediction');
      return;
    }

    try {
      await generatePrediction(cryptoData, tokenId || 'bitcoin', predictionDays);
      toast.success('AI prediction generated successfully!');
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Failed to generate prediction');
    }
  };

  const handleClearPrediction = () => {
    // Clear prediction logic would go here
    toast.info('Prediction cleared');
  };

  if (!tokenId) {
    return <div>Token not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              CryptoPredictAI
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              <Link to="/tokens" className="text-gray-300 hover:text-white transition-colors">Tokens</Link>
              <Link to="/pump" className="text-gray-300 hover:text-white transition-colors">Pump.fun</Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Token Header */}
            <TokenHeader tokenId={tokenId} />

            {/* Token Price Display */}
            <TokenPriceDisplay 
              currentPrice={currentPrice}
              priceChange={priceChange}
              tokenId={tokenId}
            />

            {/* Chart and AI Prediction */}
            <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Price Chart & AI Prediction
                  </span>
                  {cryptoData && (
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Live Data
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Prediction Engine */}
                <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="h-5 w-5 text-purple-400" />
                    <span className="text-white font-semibold text-lg">AI Prediction Engine</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Prediction Days
                      </label>
                      <Select value={predictionDays.toString()} onValueChange={(value) => setPredictionDays(Number(value))}>
                        <SelectTrigger className="bg-gray-800/70 border-gray-600 hover:border-purple-400 focus:border-purple-400 text-white transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="7" className="text-white hover:bg-gray-700 focus:bg-gray-700">7 Days</SelectItem>
                          <SelectItem value="14" className="text-white hover:bg-gray-700 focus:bg-gray-700">14 Days</SelectItem>
                          <SelectItem value="30" className="text-white hover:bg-gray-700 focus:bg-gray-700">30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Model Type
                      </label>
                      <Select value={modelType} onValueChange={setModelType}>
                        <SelectTrigger className="bg-gray-800/70 border-gray-600 hover:border-purple-400 focus:border-purple-400 text-white transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="lstm" className="text-white hover:bg-gray-700 focus:bg-gray-700">LSTM Neural Network</SelectItem>
                          <SelectItem value="transformer" className="text-white hover:bg-gray-700 focus:bg-gray-700">Transformer</SelectItem>
                          <SelectItem value="ensemble" className="text-white hover:bg-gray-700 focus:bg-gray-700">Ensemble Model</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Confidence Level
                      </label>
                      <Select value={confidenceLevel} onValueChange={setConfidenceLevel}>
                        <SelectTrigger className="bg-gray-800/70 border-gray-600 hover:border-purple-400 focus:border-purple-400 text-white transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="conservative" className="text-white hover:bg-gray-700 focus:bg-gray-700">Conservative (80%)</SelectItem>
                          <SelectItem value="moderate" className="text-white hover:bg-gray-700 focus:bg-gray-700">Moderate (90%)</SelectItem>
                          <SelectItem value="aggressive" className="text-white hover:bg-gray-700 focus:bg-gray-700">Aggressive (95%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleGeneratePrediction}
                      disabled={isGeneratingPrediction || !cryptoData}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg transition-all duration-200 hover:shadow-purple-500/25"
                    >
                      {isGeneratingPrediction ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Target className="h-4 w-4 mr-2" />
                          Generate AI Prediction
                        </>
                      )}
                    </Button>
                    
                    {prediction && (
                      <Button
                        onClick={handleClearPrediction}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear Prediction
                      </Button>
                    )}
                  </div>
                </div>

                {/* Price Chart */}
                <PriceChart 
                  data={cryptoData} 
                  prediction={prediction?.predictions || null}
                  isLoading={dataLoading}
                  crypto={tokenId}
                  onClearPrediction={handleClearPrediction}
                />

                {/* Prediction Results */}
                {prediction && (
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="h-4 w-4 text-green-400" />
                      <span className="text-white font-medium">AI Prediction Results</span>
                    </div>
                    <PredictionCard prediction={prediction} crypto={tokenId} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Other Tokens Section */}
            <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-white flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-400" />
                  Other Tokens
                </CardTitle>
                <Link to="/tokens">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/50 text-blue-300 hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-purple-600/30 hover:border-blue-400 transition-all duration-200"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View All Tokens
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {/* Mobile: Horizontal Scroll */}
                <div className="md:hidden">
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {otherTokens.map((token, index) => (
                      <Link 
                        key={index} 
                        to={`/token/${token.id}`}
                        className="block min-w-[280px] group"
                      >
                        <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/30 rounded-xl p-4 hover:border-blue-400/50 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 group-hover:transform group-hover:scale-[1.02]">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="text-2xl">{token.icon}</div>
                            <div>
                              <div className="text-white font-semibold">{token.symbol}</div>
                              <div className="text-gray-400 text-sm">{token.name}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-gray-400">Price</div>
                              <div className="text-white font-mono">${token.price.toFixed(4)}</div>
                            </div>
                            <div>
                              <div className="text-gray-400">24h</div>
                              <div className={`font-bold ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Desktop: Grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {otherTokens.map((token, index) => (
                    <Link 
                      key={index} 
                      to={`/token/${token.id}`}
                      className="block group"
                    >
                      <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/30 rounded-xl p-4 hover:border-blue-400/50 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 group-hover:transform group-hover:scale-[1.02]">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-2xl">{token.icon}</div>
                          <div className="min-w-0 flex-1">
                            <div className="text-white font-semibold truncate">{token.symbol}</div>
                            <div className="text-gray-400 text-sm truncate">{token.name}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-gray-400">Price</div>
                            <div className="text-white font-mono">${token.price.toFixed(4)}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">24h</div>
                            <div className={`font-bold ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TokenSidebar 
              currentTokenId={tokenId}
              selectedCrypto={tokenId}
              currentPrice={currentPrice}
              priceChange={priceChange}
              cryptoOptions={cryptoOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
