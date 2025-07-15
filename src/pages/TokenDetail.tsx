import React, { useState } from "react";
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
import { toast } from "sonner";
import { getTokenInfo, getCoinGeckoId } from "@/utils/tokenMapping";
import { useCryptoFilters } from "@/hooks/useCryptoFilters";
import { trackTokenPageView, trackPredictionTool, trackPageView } from "@/utils/analytics";
import { 
  generateTokenMetaTitle, 
  generateTokenMetaDescription, 
  generateTokenKeywords,
  generateTokenStructuredData,
  generateCanonicalUrl,
  type TokenSEOData
} from "@/utils/seo";
const TokenDetail = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const location = useLocation();
  const tokenmarketstats = location.state?.token;
  const Alltokenmarketstats = location.state?.AllCryptosData;
  const [timeframe, setTimeframe] = useState("7d");
  const [predictionDays, setPredictionDays] = useState(7);
  const [modelType, setModelType] = useState("technical");
  const [showPrediction, setShowPrediction] = useState(false);

  // Get token info and crypto options
  const selectedToken = getTokenInfo(tokenId || "bitcoin");
  const cryptoId = getCoinGeckoId(tokenId || "bitcoin");
  
  // Track token page view
  React.useEffect(() => {
    if (selectedToken) {
      trackTokenPageView(selectedToken.name, selectedToken.symbol, tokenmarketstats?.current_price);
      trackPageView(`/token/${tokenId}`);
    }
  }, [tokenId, selectedToken, tokenmarketstats?.current_price]);
  const cryptoOptions = TokenDataService.getCryptoOptions();
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
    price_change_percentage_30d_in_currency: marketData.priceChange30d,
  };

  const handlePredict = async () => {
    if (!cryptoData) {
      toast.error("No data available for prediction");
      return;
    }

    trackPredictionTool("generate", selectedToken?.name, modelType);
    await generatePrediction(cryptoData, cryptoId, predictionDays, modelType);
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
    name: selectedToken?.name || '',
    symbol: selectedToken?.symbol || '',
    currentPrice,
    priceChange,
    marketCap: displayMarketStats.market_cap,
    description: selectedToken?.description || `${selectedToken?.name} price analysis and predictions`,
    category: selectedToken?.category || 'Cryptocurrency'
  };

  const canonicalUrl = generateCanonicalUrl(tokenId || 'bitcoin');
  const breadcrumbItems = [
    { label: 'Tokens', href: '/tokens' },
    { label: `${selectedToken?.name} (${selectedToken?.symbol})` }
  ];

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
        <meta name="description" content={generateTokenMetaDescription(seoData)} />
        <meta name="keywords" content={generateTokenKeywords(seoData)} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={generateTokenMetaTitle(seoData)} />
        <meta property="og:description" content={generateTokenMetaDescription(seoData)} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://pumpparade.com/og-image.jpg" />
        <meta property="og:image:alt" content={`${seoData.name} price analysis and predictions`} />
        <meta property="og:site_name" content="Pump Parade" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={generateTokenMetaTitle(seoData)} />
        <meta name="twitter:description" content={generateTokenMetaDescription(seoData)} />
        <meta name="twitter:image" content="https://pumpparade.com/og-image.jpg" />
        <meta name="twitter:image:alt" content={`${seoData.name} price analysis and predictions`} />
        
        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="Pump Parade" />
        <meta name="theme-color" content="#1e40af" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(generateTokenStructuredData(seoData, canonicalUrl))}
        </script>
      </Helmet>
      
      <TokenProvider tokenId={tokenId || "bitcoin"} cryptoOptions={cryptoOptions}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <div className="container mx-auto px-4 py-6">
            <Breadcrumb items={breadcrumbItems} />
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
            />
          </div>
        </div>
      </TokenProvider>
    </>
  );
};

export default TokenDetail;
