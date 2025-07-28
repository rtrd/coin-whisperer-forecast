import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useCryptoData } from "@/hooks/useCryptoData";
import { usePrediction } from "@/hooks/usePrediction";
import { useCryptoFilters } from "@/hooks/useCryptoFilters";
import { getCurrentAndPreviousPrice } from "@/utils/priceCalculations";

export const useHomepageData = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [timeframe, setTimeframe] = useState("7d");
  const [predictionDays, setPredictionDays] = useState(7);
  const [modelType, setModelType] = useState("advanced");

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

  const { currentPrice, previousPrice, priceChange } = getCurrentAndPreviousPrice(cryptoData);

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

  return {
    // State
    selectedCrypto,
    setSelectedCrypto,
    timeframe,
    setTimeframe,
    predictionDays,
    setPredictionDays,
    modelType,
    setModelType,
    
    // Data
    filteredCryptos,
    allCryptosData,
    cryptoData,
    prediction,
    currentPrice,
    previousPrice,
    priceChange,
    
    // Loading states
    filtersLoading,
    dataLoading,
    predictionLoading,
    
    // Handlers
    handleFilterChange,
    handlePredict,
    
    // Errors
    dataError,
    filtersError,
  };
};