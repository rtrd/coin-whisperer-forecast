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
} from "lucide-react";
import { PriceChart } from "@/components/PriceChart";
import { PredictionCard } from "@/components/PredictionCard";
import { LockedTechnicalAnalysis } from "@/components/LockedTechnicalAnalysis";
import { LockedSentimentAnalysis } from "@/components/LockedSentimentAnalysis";
import { LockedDynamicPrediction } from "@/components/LockedDynamicPrediction";
import { LockedAITradingSignals } from "@/components/LockedAITradingSignals";
import { DynamicTokenAnalysis } from "@/components/DynamicTokenAnalysis";
import { AdBanner } from "@/components/AdBanner";
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
import { Helmet } from "react-helmet";

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
    .split(" ")
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
    cryptoData && cryptoData.length > 0
      ? cryptoData[cryptoData.length - 1]?.price
      : 0;
  const previousPrice =
    cryptoData && cryptoData.length > 1
      ? cryptoData[cryptoData.length - 2]?.price
      : 0;
  const priceChange =
    currentPrice && previousPrice
      ? ((currentPrice - previousPrice) / previousPrice) * 100
      : 0;

  const { marketData } = useMarketData(
    currentPrice,
    selectedToken.category,
    cryptoId
  );

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

  if (!selectedToken) {
    return (
      <>
        <Helmet>
          <title>
            {formattedTokenName} Technical Analysis and Market Sentiment
          </title>
          <meta
            name="description"
            content={`Real-time technical analysis and market sentiment for ${formattedTokenName}. Stay updated with price trends, volume, and insights.`}
          />
        </Helmet>

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
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {formattedTokenName} Technical Analysis and Market Sentiment
        </title>
        <meta
          name="description"
          content={`Real-time technical analysis and market sentiment for ${formattedTokenName}. Stay updated with price trends, volume, and insights.`}
        />
      </Helmet>

      <TokenProvider
        tokenId={tokenId || "bitcoin"}
        cryptoOptions={cryptoOptions}
      >
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

            {/* Token Header Card */}
            <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm overflow-hidden">
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Token Info Section */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                    <TokenHeader />
                    <TokenPriceDisplay
                      currentPrice={tokenmarketstats?.current_price || 0}
                      priceChange={
                        tokenmarketstats?.price_change_percentage_24h || 0
                      }
                    />
                  </div>

                  {/* Market Statistics */}
                  <TokenMarketStats marketData={tokenmarketstats} />
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="space-y-6">
              {/* Price Chart and AI Controls */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-400" />
                      Price Chart & AI Analysis
                    </span>
                    <Badge
                      variant="outline"
                      className="text-green-400 border-green-400"
                    >
                      Real-time
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price Chart */}
                  <PriceChart
                    data={cryptoData}
                    isLoading={dataLoading}
                    prediction={showPrediction ? prediction?.predictions : null}
                    timeframe={timeframe}
                    onTimeframeChange={setTimeframe}
                  />

                  {/* AI Prediction Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-600">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-400" />
                        <span className="text-white text-sm font-medium">
                          AI Prediction:
                        </span>
                      </div>
                      <Select
                        value={predictionDays.toString()}
                        onValueChange={(value) =>
                          setPredictionDays(parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="1">1 Day</SelectItem>
                          <SelectItem value="3">3 Days</SelectItem>
                          <SelectItem value="7">7 Days</SelectItem>
                          <SelectItem value="14">14 Days</SelectItem>
                          <SelectItem value="30">30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2">
                        <Select value={modelType} onValueChange={setModelType}>
                          <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="basic">Basic Model</SelectItem>
                            <SelectItem value="advanced">
                              Advanced Model
                            </SelectItem>
                            <SelectItem value="pro">Pro Model</SelectItem>
                          </SelectContent>
                        </Select>
                        <ModelTypeTooltip modelType={modelType} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handlePredict}
                        disabled={predictionLoading || !cryptoData}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {predictionLoading ? (
                          <>
                            <Activity className="h-4 w-4 mr-2 animate-spin" />
                            Predicting...
                          </>
                        ) : (
                          <>
                            <Target className="h-4 w-4 mr-2" />
                            Generate Prediction
                          </>
                        )}
                      </Button>
                      {showPrediction && (
                        <Button
                          onClick={handleClearPrediction}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Prediction Result */}
                  {showPrediction && prediction && (
                    <PredictionCard
                      prediction={prediction}
                      crypto={selectedToken.name}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Analysis Tabs */}
              <Tabs defaultValue="analysis" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-gray-800 border-gray-700">
                  <TabsTrigger
                    value="analysis"
                    className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700"
                  >
                    Token Analysis
                  </TabsTrigger>
                  <TabsTrigger
                    value="technical"
                    className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700"
                  >
                    Technical
                  </TabsTrigger>
                  <TabsTrigger
                    value="sentiment"
                    className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700"
                  >
                    Sentiment
                  </TabsTrigger>
                  <TabsTrigger
                    value="signals"
                    className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700"
                  >
                    AI Signals
                  </TabsTrigger>
                  <TabsTrigger
                    value="prediction"
                    className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700"
                  >
                    Live Prediction
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="mt-6">
                  <DynamicTokenAnalysis
                    selectedCrypto={cryptoId}
                    currentPrice={currentPrice}
                    priceChange={priceChange}
                    cryptoOptions={cryptoOptions}
                  />
                </TabsContent>

                <TabsContent value="technical" className="mt-6">
                  <LockedTechnicalAnalysis
                    data={cryptoData}
                    isLoading={dataLoading}
                  />
                </TabsContent>

                <TabsContent value="sentiment" className="mt-6">
                  <LockedSentimentAnalysis crypto={cryptoId} />
                </TabsContent>

                <TabsContent value="signals" className="mt-6">
                  <LockedAITradingSignals />
                </TabsContent>

                <TabsContent value="prediction" className="mt-6">
                  <LockedDynamicPrediction
                    selectedCrypto={cryptoId}
                    currentPrice={currentPrice}
                    priceChange={priceChange}
                  />
                </TabsContent>
              </Tabs>

              {/* Risk Disclaimer */}
              <Card className="bg-yellow-900/20 border-yellow-700">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-200 font-medium mb-1">
                        Investment Risk Disclaimer
                      </p>
                      <p className="text-xs text-yellow-300">
                        All AI predictions and technical analysis are for
                        educational purposes only. Cryptocurrency investments
                        carry significant risk and past performance does not
                        guarantee future results. Always conduct your own
                        research and consider your risk tolerance before making
                        investment decisions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Footer />
        </div>
      </TokenProvider>
    </>
  );
};

export default TokenDetail;
