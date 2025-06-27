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
          <div className="mb-8">
            <LockedAITradingSignals />
          </div>

          {/* Ad Banner - Bottom */}
          <div className="flex justify-center my-8">
            <AdBanner width={728} height={90} position="horizontal" />
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </TokenProvider>
  );
};

export default TokenDetail;
