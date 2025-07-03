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
import { TechnicalAnalysis } from "@/components/TechnicalAnalysis";
import { SentimentAnalysis } from "@/components/SentimentAnalysis";
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
import { LockedAITradingSignals } from "@/components/LockedAITradingSignals";
import { fetchTechnicalIndicators } from "../services/aiPredictionService";

const TokenDetail = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const location = useLocation();
  const tokenmarketstats = location.state?.token;
  const [timeframe, setTimeframe] = useState("7d");
  const [predictionDays, setPredictionDays] = useState(7);
  const [modelType, setModelType] = useState("advanced");
  const [showPrediction, setShowPrediction] = useState(false);
  const [technicalAnaylysisData, settechnicalAnaylysisData] = useState([]);

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
    selectedToken?.category,
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

  useEffect(() => {
    const loadIndicators = async () => {
      const technicalData = await fetchTechnicalIndicators(tokenId);
      settechnicalAnaylysisData(technicalData);
      console.log("Price Data", technicalData);
    };

    loadIndicators();
  }, []);
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
          {/* <div className="mb-8">
            <LockedAITradingSignals />
          </div> */}

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
                  prediction={
                    showPrediction ? prediction?.predictions || null : null
                  }
                  isLoading={dataLoading}
                  crypto={cryptoId}
                  onClearPrediction={handleClearPrediction}
                />

                {/* AI Analysis Controls */}
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-4 w-4 text-green-400" />
                    <span className="text-white font-medium">
                      AI Analysis Controls
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Time Period
                      </label>
                      <Select value={timeframe} onValueChange={setTimeframe}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="1d" className="text-white">
                            1 Day
                          </SelectItem>
                          <SelectItem value="7d" className="text-white">
                            7 Days
                          </SelectItem>
                          <SelectItem value="30d" className="text-white">
                            30 Days
                          </SelectItem>
                          <SelectItem value="90d" className="text-white">
                            90 Days
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Prediction Days
                      </label>
                      <Select
                        value={predictionDays.toString()}
                        onValueChange={(value) =>
                          setPredictionDays(Number(value))
                        }
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="1" className="text-white">
                            1 Day
                          </SelectItem>
                          <SelectItem value="3" className="text-white">
                            3 Days
                          </SelectItem>
                          <SelectItem value="7" className="text-white">
                            7 Days
                          </SelectItem>
                          <SelectItem value="14" className="text-white">
                            14 Days
                          </SelectItem>
                          <SelectItem value="30" className="text-white">
                            30 Days
                          </SelectItem>
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
                          <SelectItem value="basic" className="text-white">
                            Basic LSTM
                          </SelectItem>
                          <SelectItem value="advanced" className="text-white">
                            Advanced Neural
                          </SelectItem>
                          <SelectItem value="ensemble" className="text-white">
                            Ensemble Model
                          </SelectItem>
                          <SelectItem
                            value="transformer"
                            className="text-white"
                          >
                            Transformer
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        onClick={handlePredict}
                        disabled={
                          dataLoading || predictionLoading || !cryptoData
                        }
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

                  {/* Prediction Results */}
                  {showPrediction && prediction && (
                    <div className="mt-6 pt-6 border-t border-gray-600/50">
                      <PredictionCard
                        prediction={prediction}
                        crypto={cryptoId}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Column - Analysis Tabs */}
              <div className="lg:col-span-3 space-y-6">
                <Tabs defaultValue="technical" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
                    <TabsTrigger
                      value="technical"
                      className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700"
                    >
                      Technical Analysis
                    </TabsTrigger>
                    <TabsTrigger
                      value="sentiment"
                      className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700"
                    >
                      Market Sentiment
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="technical">
                    <TechnicalAnalysis
                      data={technicalAnaylysisData}
                      isLoading={dataLoading}
                    />
                  </TabsContent>

                  <TabsContent value="sentiment">
                    <SentimentAnalysis
                      crypto={cryptoId}
                      symbol={selectedToken.symbol}
                    />
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
                        <p className="text-sm text-yellow-200 font-medium mb-1">
                          Investment Disclaimer
                        </p>
                        <p className="text-xs text-yellow-300">
                          This analysis is for educational purposes only. Always
                          do your own research before investing.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
      </div>
    </TokenProvider>
  );
};

export default TokenDetail;
