
import React, { useState, useEffect } from "react";
import { IndexContent } from "@/components/IndexContent";
import { toast } from "sonner";
import { useCryptoData } from "@/hooks/useCryptoData";
import { usePrediction } from "@/hooks/usePrediction";
import { useCryptoFilters } from "@/hooks/useCryptoFilters";

const Index = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [timeframe, setTimeframe] = useState("7d");
  const [predictionDays, setPredictionDays] = useState(7);
  const [modelType, setModelType] = useState("advanced");

  const {
    data: cryptoData,
    isLoading: dataLoading,
    error: dataError,
  } = useCryptoData(selectedCrypto, timeframe);
  
  const {
    prediction,
    isLoading: predictionLoading,
    generatePrediction,
  } = usePrediction();

  const {
    filteredCryptos,
    allCryptosData,
    handleFilterChange
  } = useCryptoFilters();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <IndexContent
        selectedCrypto={selectedCrypto}
        cryptoOptions={[]}
        currentPrice={currentPrice}
        priceChange={priceChange}
        filteredCryptos={filteredCryptos}
        AllCryptosData={allCryptosData}
        handleFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default Index;
