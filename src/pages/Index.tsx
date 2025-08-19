import React, { useState, useEffect } from "react";
import { EnhancedSEOHead } from "@/components/seo/EnhancedSEOHead";
import { BreadcrumbSchema, generateBreadcrumbs } from "@/components/seo/BreadcrumbSchema";
import { FAQSchema, cryptoFAQs } from "@/components/seo/FAQSchema";
import { IndexContent } from "@/components/IndexContent";
import { toast } from "sonner";
import { useCryptoData } from "@/hooks/useCryptoData";
import { usePrediction } from "@/hooks/usePrediction";
import { useCryptoFilters } from "@/hooks/useCryptoFilters";
import { generateHomepageSEO } from "@/utils/pageSeo";
import { useAdScript } from "@/hooks/useAdScript";
import { useLocation } from "react-router-dom";

const Index = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [timeframe, setTimeframe] = useState("7d");
  const [predictionDays, setPredictionDays] = useState(7);
  const [modelType, setModelType] = useState("advanced");
  
  const location = useLocation();
  const seoData = generateHomepageSEO();
  const breadcrumbs = generateBreadcrumbs(location.pathname);
  
  // Initialize ad script on page load
  useAdScript();

  const {
    filteredCryptos,
    allCryptosData,
    handleFilterChange,
    isLoading: filtersLoading,
    error: filtersError
  } = useCryptoFilters();

  const {
    data: cryptoData,
    isLoading: dataLoading,
    error: dataError,
  } = useCryptoData(selectedCrypto, timeframe, allCryptosData as any || []);
  
  const {
    prediction,
    isLoading: predictionLoading,
    generatePrediction,
  } = usePrediction();

  const handlePredict = async () => {
    if (!cryptoData?.length) {
      toast.error("No data available for prediction");
      return;
    }

    try {
      await generatePrediction(cryptoData, selectedCrypto, predictionDays);
      toast.success("Prediction generated successfully!");
    } catch (error) {
      toast.error("Failed to generate prediction");
    }
  };

  useEffect(() => {
    if (dataError) {
      toast.error("Failed to fetch crypto data");
    }
    if (filtersError) {
      toast.error(filtersError);
    }
  }, [dataError, filtersError]);

  const currentPrice = cryptoData?.length 
    ? cryptoData[cryptoData.length - 1]?.price || 0
    : 0;
    
  const previousPrice = cryptoData?.length > 1
    ? cryptoData[cryptoData.length - 2]?.price || 0
    : 0;
    
  const priceChange = currentPrice && previousPrice
    ? ((currentPrice - previousPrice) / previousPrice) * 100
    : 0;

  // Show loading state while data is being fetched
  if (filtersLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <EnhancedSEOHead seoData={seoData} />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={cryptoFAQs} />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <IndexContent
          selectedCrypto={selectedCrypto}
          cryptoOptions={filteredCryptos}
          currentPrice={currentPrice}
          priceChange={priceChange}
          filteredCryptos={filteredCryptos}
          AllCryptosData={allCryptosData}
          handleFilterChange={handleFilterChange}
        />
      </div>
    </>
  );
};

export default Index;
