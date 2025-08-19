import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { TokenProvider } from "@/contexts/TokenContext";
import { TokenDetailLayout } from "@/components/token/TokenDetailLayout";
import { TokenDataService } from "@/services/tokenDataService";
import { useCryptoData } from "@/hooks/useCryptoData";
import { usePrediction } from "@/hooks/usePrediction";
import { useMarketData } from "@/hooks/useMarketData";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { toast } from "sonner";
import { getTokenInfo, getCoinGeckoId } from "@/utils/tokenMapping";
import { useCryptoFilters } from "@/hooks/useCryptoFilters";
import {
  trackTokenPageView,
  trackPredictionTool,
  trackPageView,
} from "@/utils/analytics";
import {
  generateTokenMetaTitle,
  generateTokenMetaDescription,
  generateTokenKeywords,
  generateTokenStructuredData,
  generateCanonicalUrl,
  type TokenSEOData,
} from "@/utils/seo";
import { fetchTechnicalIndicators } from "@/services/aiPredictionService";
import { PriceData } from "@/types/crypto";
import { useAdScript } from "@/hooks/useAdScript";
const TokenDetail = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const location = useLocation();
  const tokenmarketstats = location.state?.token;
  const Alltokenmarketstats = location.state?.AllCryptosData;
  const [timeframe, setTimeframe] = useState("7d");
  const [predictionDays, setPredictionDays] = useState(7);
  const [modelType, setModelType] = useState("technical");
  const [showPrediction, setShowPrediction] = useState(false);
  const [sentimentData, setSentimentData] = useState<any>(null);

  // Get token info and crypto options
  const selectedToken = getTokenInfo(tokenId || "bitcoin");
  const cryptoId = getCoinGeckoId(tokenId || "bitcoin");
  
  // Fetch real token data from API
  const { data: tokenInfo, isLoading: tokenInfoLoading, error: tokenInfoError } = useTokenInfo(cryptoId);

  // Initialize ad script on page load
  useAdScript();

  // Track token page view
  React.useEffect(() => {
    if (selectedToken) {
      trackTokenPageView(
        selectedToken.name,
        selectedToken.symbol,
        tokenmarketstats?.current_price
      );
      trackPageView(`/token/${tokenId}`);
    }
  }, [tokenId, selectedToken, tokenmarketstats?.current_price]);
  const cryptoOptions = TokenDataService.getCryptoOptions();

  const [technicalIndicator, setTechnicalIndicator] = React.useState<any>(null);
  
  // Reset state when tokenId changes
  useEffect(() => {
    setTimeframe("7d");
    setPredictionDays(7);
    setModelType("technical");
    setShowPrediction(false);
    setSentimentData(null);
    setTechnicalIndicator(null);
  }, [tokenId]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchTechnicalIndicators(cryptoId, "3m");
        console.log("Fetched technical indicators:", response);
        const prices = response.map((d) => d.price);
        if (prices[0] == undefined) {
          const data = generateMockData(
            cryptoId,
            timeframe,
            Alltokenmarketstats
          );
          setTechnicalIndicator(data);
        } else {
          setTechnicalIndicator(response);
        }
      } catch (error) {
        console.error("Error fetching technical indicators:", error);
        // Generate fallback data on error
        const data = generateMockData(cryptoId, timeframe, Alltokenmarketstats);
        setTechnicalIndicator(data);
      }
    };

    if (tokenId && cryptoId) {
      getData();
    }
  }, [tokenId, cryptoId, timeframe]);
  const {
    data: cryptoData,
    isLoading: dataLoading,
    error: dataError,
  } = useCryptoData(cryptoId, timeframe, Alltokenmarketstats);
  const {
    prediction,
    isLoading: predictionLoading,
    generatePrediction,
  } = usePrediction();
  const {
    filteredCryptos,
    allCryptosData,
    handleFilterChange,
    isLoading: filtersLoading,
    error: filtersError,
  } = useCryptoFilters();

  const currentPrice =
    tokenInfo?.current_price ||
    tokenmarketstats?.current_price ||
    (cryptoData && cryptoData.length > 0
      ? cryptoData[cryptoData.length - 1]?.price
      : 0);
  const previousPrice =
    cryptoData && cryptoData.length > 1
      ? cryptoData[cryptoData.length - 2]?.price
      : 0;
  const priceChange =
    tokenInfo?.price_change_percentage_24h ||
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
  const displayMarketStats = tokenInfo || tokenmarketstats || {
    current_price: currentPrice,
    price_change_percentage_24h: priceChange,
    market_cap: tokenInfo?.market_cap || marketData.marketCap,
    total_volume: tokenInfo?.total_volume || marketData.volume24h,
    circulating_supply: marketData.circulatingSupply,
    total_supply: marketData.totalSupply,
    ath: marketData.allTimeHigh,
    atl: marketData.allTimeLow,
    price_change_percentage_7d_in_currency: marketData.priceChange7d,
    price_change_percentage_30d_in_currency: marketData.priceChange30d,
  };
  const generateMockData = (
    crypto: string,
    timeframe: string,
    AllCryptosData: any[]
  ): PriceData[] => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // normalize to midnight

    // Normalize timeframe
    const normalizedTimeframe =
      timeframe === "7d"
        ? "1w"
        : timeframe === "30d"
        ? "1m"
        : timeframe === "90d"
        ? "3m"
        : timeframe;

    const days =
      normalizedTimeframe === "1d"
        ? 1
        : normalizedTimeframe === "1w"
        ? 7
        : normalizedTimeframe === "1m"
        ? 30
        : 90;

    const pointsPerDay = days === 1 ? 24 : 1;
    const totalPoints = days * pointsPerDay;

    const intervalSec = (24 * 60 * 60) / pointsPerDay; // seconds between points
    const nowSec = Math.floor(now.getTime() / 1000); // now in seconds

    // Get base price
    const basePrices: { [key: string]: number } = {};
    AllCryptosData.forEach((token) => {
      const { id, current_price } = token;
      if (typeof current_price === "number" && !isNaN(current_price)) {
        basePrices[id] = current_price;
      }
    });

    const basePrice = basePrices[crypto] || 1.0;
    let currentPrice = basePrice;
    const data: PriceData[] = [];

    for (let i = 0; i < totalPoints; i++) {
      const timestamp = nowSec - (totalPoints - 1 - i) * intervalSec;

      // Volatility logic
      let volatility = 0.02;
      if (
        crypto.includes("shiba") ||
        crypto.includes("pepe") ||
        crypto.includes("bonk") ||
        crypto.includes("floki")
      ) {
        volatility = 0.08;
      } else if (
        crypto.includes("tether") ||
        crypto.includes("usd-coin") ||
        crypto.includes("dai")
      ) {
        volatility = 0.001;
      } else if (crypto === "bitcoin" || crypto === "ethereum") {
        volatility = 0.015;
      }

      const change = (Math.random() - 0.5) * volatility;
      currentPrice *= 1 + change;

      // Trend logic
      let trend = 0.0001;
      if (
        crypto.includes("ai") ||
        crypto.includes("fetch") ||
        crypto.includes("singularity") ||
        crypto.includes("render")
      ) {
        trend = 0.0003;
      } else if (
        crypto.includes("meme") ||
        crypto.includes("doge") ||
        crypto.includes("shib") ||
        crypto.includes("pepe")
      ) {
        trend = (Math.random() - 0.5) * 0.0005;
      }

      currentPrice *= 1 + trend;

      data.push({
        timestamp,
        price: Math.max(currentPrice, 0.0000001),
        volume:
          Math.random() *
          (basePrice > 100
            ? 100_000_000
            : basePrice > 1
            ? 1_000_000_000
            : 10_000_000_000),
      });
    }

    return data;
  };

  const handlePredict = async () => {
    if (!technicalIndicator && !cryptoData) {
      toast.error("No data available for prediction");
      return;
    }

    await generatePrediction(
      cryptoData,
      cryptoId,
      predictionDays,
      modelType,
      technicalIndicator,
      sentimentData,
      Alltokenmarketstats
    );
    setShowPrediction(true);
    toast.success("Prediction generated successfully!");
  };

  const handleClearPrediction = () => {
    trackPredictionTool("clear", selectedToken?.name, modelType);
    setShowPrediction(false);
    toast.success("Prediction cleared from chart");
  };

  // Create SEO data object
  const seoData: TokenSEOData = {
    name: tokenInfo?.name || selectedToken?.name || "",
    symbol: tokenInfo?.symbol || selectedToken?.symbol || "",
    currentPrice,
    priceChange,
    marketCap: displayMarketStats.market_cap,
    description:
      tokenInfo?.description ||
      selectedToken?.description ||
      `${tokenInfo?.name || selectedToken?.name} price analysis and predictions`,
    category: selectedToken?.category || "Cryptocurrency",
  };

  const canonicalUrl = generateCanonicalUrl(tokenId || "bitcoin");
  const breadcrumbItems = [
    { label: "Tokens", href: "/tokens" },
    { label: `${tokenInfo?.name || selectedToken?.name} (${tokenInfo?.symbol || selectedToken?.symbol})` },
  ];

  // Show loading state while fetching token info
  if (tokenInfoLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-300">Loading token data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
    <>
      <Helmet>
        <title>{generateTokenMetaTitle(seoData)}</title>
        <meta
          name="description"
          content={generateTokenMetaDescription(seoData)}
        />
        <meta name="keywords" content={generateTokenKeywords(seoData)} />

        {/* Open Graph tags */}
        <meta property="og:title" content={generateTokenMetaTitle(seoData)} />
        <meta
          property="og:description"
          content={generateTokenMetaDescription(seoData)}
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://pumpparade.com/og-image.jpg"
        />
        <meta
          property="og:image:alt"
          content={`${seoData.name} price analysis and predictions`}
        />
        <meta property="og:site_name" content="Pump Parade" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={generateTokenMetaTitle(seoData)} />
        <meta
          name="twitter:description"
          content={generateTokenMetaDescription(seoData)}
        />
        <meta
          name="twitter:image"
          content="https://pumpparade.com/og-image.jpg"
        />
        <meta
          name="twitter:image:alt"
          content={`${seoData.name} price analysis and predictions`}
        />

        {/* Additional SEO tags */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="author" content="Pump Parade" />
        <meta name="theme-color" content="#1e40af" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(generateTokenStructuredData(seoData, canonicalUrl))}
        </script>
      </Helmet>
      <TokenProvider
        tokenId={tokenId || "bitcoin"}
        cryptoOptions={cryptoOptions}
      >
        <TokenDetailLayout
          cryptoId={cryptoId}
          cryptoOptions={cryptoOptions}
          currentPrice={currentPrice}
          priceChange={priceChange}
          marketData={displayMarketStats}
          cryptoData={cryptoData}
          dataLoading={dataLoading}
          prediction={prediction}
          showPrediction={showPrediction}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          predictionDays={predictionDays}
          setPredictionDays={setPredictionDays}
          modelType={modelType}
          setModelType={setModelType}
          predictionLoading={predictionLoading}
          handlePredict={handlePredict}
          handleClearPrediction={handleClearPrediction}
          tokenId={tokenId || "bitcoin"}
          selectedToken={selectedToken}
          allCryptosData={allCryptosData}
          SentimentData={setSentimentData}
          tokenInfo={tokenInfo}
        />
      </TokenProvider>
    </>
  );
};

export default TokenDetail;
