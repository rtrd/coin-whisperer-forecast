
import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Brain,
  Target,
  AlertCircle,
  BarChart3,
  ArrowLeft,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { PriceChart } from "@/components/PriceChart";
import { PredictionCard } from "@/components/PredictionCard";
import { TechnicalAnalysis } from "@/components/TechnicalAnalysis";
import { SentimentAnalysis } from "@/components/SentimentAnalysis";
import { DynamicTokenAnalysis } from "@/components/DynamicTokenAnalysis";
import { IndexHeader } from "@/components/IndexHeader";
import Footer from "@/components/Footer";
import { ModelTypeTooltip } from "@/components/ModelTypeTooltip";
import { TokenProvider } from "@/contexts/TokenContext";
import { TokenHeader } from "@/components/token/TokenHeader";
import { TokenPriceDisplay } from "@/components/token/TokenPriceDisplay";
import { TokenMarketStats } from "@/components/token/TokenMarketStats";
import { TokenDataService } from "@/services/tokenDataService";
import { useCryptoData } from "@/hooks/useCryptoData";
import { usePrediction } from "@/hooks/usePrediction";
import { useMarketData } from "@/hooks/useMarketData";
import { toast } from "sonner";
import { getTokenInfo, getCoinGeckoId } from "@/utils/tokenMapping";

const TokenDetail = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const location = useLocation();
  const tokenmarketstats = location.state?.token;
  const [timeframe, setTimeframe] = useState("7d");
  const [predictionDays, setPredictionDays] = useState(7);
  const [modelType, setModelType] = useState("advanced");
  const [showPrediction, setShowPrediction] = useState(false);

  // Get token info and crypto options
  const selectedToken = getTokenInfo(tokenId || "bitcoin");
  const cryptoId = getCoinGeckoId(tokenId || "bitcoin");
  const cryptoOptions = TokenDataService.getCryptoOptions();

  const formattedTokenName = tokenId
    ?.split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const {
    data: cryptoData,
    isLoading: dataLoading,
    error: dataError,
  } = useCryptoData(cryptoId, timeframe);
  const {
    prediction,
    isLoading: predictionLoading,
    generatePrediction,
  } = usePrediction();

  const currentPrice =
    tokenmarketstats?.current_price ||
    (cryptoData && cryptoData.length > 0
      ? cryptoData[cryptoData.length - 1]?.price
      : 0);
  const previousPrice =
    cryptoData && cryptoData.length > 1
      ? cryptoData[cryptoData.length - 2]?.price
      : 0;
  const priceChange =
    tokenmarketstats?.price_change_percentage_24h ||
    (currentPrice && previousPrice
      ? ((currentPrice - previousPrice) / previousPrice) * 100
      : 0);

  const { marketData } = useMarketData(
    currentPrice,
    selectedToken?.category,
    cryptoId
  );

  // Create fallback market stats if none provided
  const displayMarketStats = tokenmarketstats || {
    current_price: currentPrice,
    price_change_percentage_24h: priceChange,
    market_cap: marketData.marketCap,
    total_volume: marketData.volume24h,
    circulating_supply: marketData.circulatingSupply,
    total_supply: marketData.totalSupply,
    ath: marketData.allTimeHigh,
    atl: marketData.allTimeLow,
    price_change_percentage_7d_in_currency: marketData.priceChange7d,
    price_change_percentage_30d_in_currency: marketData.priceChange30d
  };

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

  const handleBuy = () => {
    toast.success("Redirecting to buy...", {
      description: "This would redirect to a trading platform"
    });
  };

  const handleSell = () => {
    toast.success("Redirecting to sell...", {
      description: "This would redirect to a trading platform"
    });
  };

  if (!selectedToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Token Not Found
            </h1>
            <p className="text-gray-300 mb-4">
              The token "{tokenId}" could not be found.
            </p>
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TokenProvider tokenId={tokenId || "bitcoin"} cryptoOptions={cryptoOptions}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 py-8">
          {/* Homepage Header */}
          <IndexHeader
            selectedCrypto={cryptoId}
            cryptoOptions={cryptoOptions}
            currentPrice={currentPrice}
            priceChange={priceChange}
          />

          {/* Back Button */}
          <div className="mb-6">
            <Link to="/">
              <Button
                variant="outline"
                className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>

          {/* Main Content - Full Width */}
          <div className="space-y-6">
            {/* Token Info Card */}
            <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm overflow-hidden">
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Token Info Section */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                    <TokenHeader />
                    <TokenPriceDisplay
                      currentPrice={currentPrice}
                      priceChange={priceChange}
                    />
                  </div>

                  {/* Market Statistics */}
                  <TokenMarketStats marketData={displayMarketStats} />
                </div>
              </CardContent>
            </Card>

            {/* Price Chart */}
            <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Price Chart & AI Prediction
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger className="w-24 bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="1d">1D</SelectItem>
                        <SelectItem value="7d">7D</SelectItem>
                        <SelectItem value="30d">30D</SelectItem>
                        <SelectItem value="90d">90D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Enhanced AI Prediction Controls */}
                <div className="bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-xl p-6 mt-4 border border-gray-600/30 backdrop-blur-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
                        <Brain className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">AI Prediction Engine</h3>
                        <p className="text-gray-300 text-sm">Generate advanced price forecasts</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 ml-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300 font-medium">Timeframe:</span>
                        <Select value={predictionDays.toString()} onValueChange={(value) => setPredictionDays(Number(value))}>
                          <SelectTrigger className="w-28 bg-gray-600/50 border-gray-500/50 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-600 border-gray-500">
                            <SelectItem value="7">7 Days</SelectItem>
                            <SelectItem value="14">14 Days</SelectItem>
                            <SelectItem value="30">30 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300 font-medium">Model:</span>
                        <Select value={modelType} onValueChange={setModelType}>
                          <SelectTrigger className="w-32 bg-gray-600/50 border-gray-500/50 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-600 border-gray-500">
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                        <ModelTypeTooltip modelType={modelType} />
                      </div>
                      
                      <Button
                        onClick={handlePredict}
                        disabled={predictionLoading}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg"
                      >
                        {predictionLoading ? (
                          <>
                            <Activity className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Target className="h-4 w-4 mr-2" />
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <PriceChart
                  data={cryptoData || []}
                  isLoading={dataLoading}
                  prediction={showPrediction && prediction ? prediction.predictions : null}
                  crypto={cryptoId}
                  onClearPrediction={handleClearPrediction}
                />
              </CardContent>
            </Card>

            {/* Market Sentiment and Technical Analysis - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SentimentAnalysis crypto={cryptoId} />
              <TechnicalAnalysis data={cryptoData} isLoading={dataLoading} />
            </div>

            {/* AI Prediction Results */}
            {prediction && (
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <PredictionCard
                    prediction={prediction}
                    crypto={cryptoId}
                  />
                </div>
              </div>
            )}

            {/* Token Analysis Section - Moved to Bottom */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <DynamicTokenAnalysis
                  selectedCrypto={cryptoId}
                  currentPrice={currentPrice}
                  priceChange={priceChange}
                  cryptoOptions={cryptoOptions}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12">
            <Footer />
          </div>
        </div>
        
        {/* Sticky Buy/Sell Buttons */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-white text-sm font-medium mb-1">{selectedToken.name}</div>
                <div className="text-gray-300 text-xs">
                  ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleBuy}
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  BUY
                </Button>
                <Button
                  onClick={handleSell}
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  SELL
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TokenProvider>
  );
};

export default TokenDetail;
