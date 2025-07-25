import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, ArrowLeft } from "lucide-react";
import { Link } from 'react-router-dom';
import { IndexHeader } from "@/components/IndexHeader";
import { AIPredictionControls } from "@/components/token/AIPredictionControls";
import { AIPredictionResults } from "@/components/token/AIPredictionResults";
import Footer from "@/components/Footer";
import { getAllCryptos } from "../../utils/api";
import { category } from "../../utils/Category";
import { trackPageView, trackFeatureUsage } from "@/utils/analytics";
import { useCryptoData } from "@/hooks/useCryptoData";
import { usePrediction } from "@/hooks/usePrediction";
import { generateAIPredictionSEO } from "@/utils/pageSeo";

const AIPrediction = () => {
  const [cryptoOptions, setCryptoOptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [predictionDays, setPredictionDays] = useState(7);
  const [modelType, setModelType] = useState('technical');
  const [showPrediction, setShowPrediction] = useState(false);

  const { data: cryptoData, isLoading: dataLoading } = useCryptoData(selectedCrypto, '7d', [] as any);
  const { prediction, isLoading: predictionLoading, generatePrediction } = usePrediction();

  const seoData = generateAIPredictionSEO();

  function addCategoryToTokens(tokens: any[], categories: any[]) {
    const categoryMap = Object.fromEntries(
      categories.map((c) => [c.id, c.category])
    );

    return tokens.map((token) => ({
      ...token,
      category: categoryMap[token.id] || "Unknown",
    }));
  }

  const getCryptos = async () => {
    try {
      setIsLoading(true);
      const data = await getAllCryptos();
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error("API response is not an array:", data);
        throw new Error("Invalid API response format");
      }

      const updatedTokens = addCategoryToTokens(data, category);
      
      // Transform the API data to match the CryptoOption interface
      const transformedOptions = updatedTokens.map((crypto) => ({
        value: crypto.id,
        label: `${crypto.name} (${crypto.symbol.toUpperCase()})`,
        icon: getIconForCrypto(crypto.symbol.toLowerCase()),
        category: crypto.category,
        score: Math.random() * 10, // Mock score for now
        prediction: `+${(Math.random() * 20 - 5).toFixed(1)}%` // Mock prediction for now
      }));
      
      setCryptoOptions(transformedOptions);
    } catch (error) {
      console.error("Error fetching coins:", error);
      // Fallback to basic options if API fails
      setCryptoOptions([
        { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿', category: 'Layer 1', score: 8.5, prediction: '+12.5%' },
        { value: 'ethereum', label: 'Ethereum (ETH)', icon: 'Ξ', category: 'Layer 1', score: 8.2, prediction: '+8.3%' },
        { value: 'binancecoin', label: 'BNB (BNB)', icon: '🔶', category: 'Layer 1', score: 7.8, prediction: '+6.1%' },
        { value: 'ripple', label: 'XRP (XRP)', icon: '💧', category: 'Layer 1', score: 7.2, prediction: '+4.7%' },
        { value: 'cardano', label: 'Cardano (ADA)', icon: '₳', category: 'Layer 1', score: 6.9, prediction: '+3.2%' },
        { value: 'solana', label: 'Solana (SOL)', icon: '◎', category: 'Layer 1', score: 8.1, prediction: '+15.8%' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconForCrypto = (symbol: string): string => {
    const iconMap: { [key: string]: string } = {
      'btc': '₿',
      'eth': 'Ξ',
      'bnb': '🔶',
      'xrp': '💧',
      'ada': '₳',
      'sol': '◎',
      'avax': '🔺',
      'matic': '🟣',
      'dot': '⚫',
      'link': '🔗',
      'uni': '🦄',
      'usdt': '💰',
      'usdc': '💵',
      'dai': '🔹',
      'doge': '🐕',
      'shib': '🐕‍🦺',
    };
    return iconMap[symbol] || '🪙';
  };

  const handlePredict = async () => {
    if (!cryptoData || cryptoData.length === 0) return;
    
    await generatePrediction(cryptoData, selectedCrypto, predictionDays, modelType);
    setShowPrediction(true);
  };

  const handleClearPrediction = () => {
    setShowPrediction(false);
  };

  useEffect(() => {
    getCryptos();
    // Track page view
    trackPageView('/ai-prediction');
    trackFeatureUsage('ai_prediction_page', 'view');
  }, []);

  // Get current price data for the selected crypto
  const currentPrice = cryptoData && cryptoData.length > 0 ? cryptoData[cryptoData.length - 1].price : 50000;
  const priceChange = cryptoData && cryptoData.length > 1 ? 
    ((cryptoData[cryptoData.length - 1].price - cryptoData[cryptoData.length - 2].price) / cryptoData[cryptoData.length - 2].price * 100) : 2.5;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading cryptocurrency data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.canonical} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={seoData.openGraph.title} />
        <meta property="og:description" content={seoData.openGraph.description} />
        <meta property="og:type" content={seoData.openGraph.type} />
        <meta property="og:url" content={seoData.openGraph.url} />
        <meta property="og:image" content={seoData.openGraph.image} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content={seoData.twitter.card} />
        <meta name="twitter:title" content={seoData.twitter.title} />
        <meta name="twitter:description" content={seoData.twitter.description} />
        <meta name="twitter:image" content={seoData.twitter.image} />
      </Helmet>

      <script async src="https://appsha-prm.ctengine.io/js/script.js?wkey=Fkrv2lWxUV"></script>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 py-8">
          {/* Homepage Header */}
          <IndexHeader 
            selectedCrypto={selectedCrypto}
            cryptoOptions={cryptoOptions}
            currentPrice={currentPrice}
            priceChange={priceChange}
          />

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="outline" size="sm" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Zap className="h-12 w-12 text-blue-400" />
              AI Prediction Analysis
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced cryptocurrency predictions using machine learning algorithms and market sentiment analysis
            </p>
          </div>

          {/* AI Prediction Interface */}
          <Card className="bg-gray-800/50 border-gray-700 shadow-2xl mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Zap className="h-6 w-6 text-purple-400" />
                AI Price Prediction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Prediction Controls */}
              <AIPredictionControls
                predictionDays={predictionDays}
                setPredictionDays={setPredictionDays}
                modelType={modelType}
                setModelType={setModelType}
                predictionLoading={predictionLoading}
                handlePredict={handlePredict}
                handleClearPrediction={handleClearPrediction}
                showPrediction={showPrediction}
                cryptoData={cryptoData}
                selectedCrypto={selectedCrypto}
                setSelectedCrypto={setSelectedCrypto}
                cryptoOptions={cryptoOptions}
              />

              {/* AI Prediction Results */}
              {showPrediction && prediction && (
                <AIPredictionResults
                  prediction={prediction}
                  cryptoId={selectedCrypto}
                  modelType={modelType}
                  predictionDays={predictionDays}
                  currentPrice={currentPrice}
                />
              )}
            </CardContent>
          </Card>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default AIPrediction;
