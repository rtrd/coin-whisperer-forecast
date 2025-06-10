import React, { useState, useEffect, useCallback } from "react";
import { IndexContent } from "@/components/IndexContent";
import { toast } from "sonner";
import { useCryptoData } from "@/hooks/useCryptoData";
import { usePrediction } from "@/hooks/usePrediction";
import { category } from "../../utils/category";
import { getAllCryptos } from "../../utils/api";

const Index = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [timeframe, setTimeframe] = useState("7d");
  const [predictionDays, setPredictionDays] = useState(7);
  const [modelType, setModelType] = useState("advanced");
  const [filteredCryptos, setFilteredCryptos] = useState<any[]>([]);
  const [AllCryptosData, setAllCryptosData] = useState<any[]>([]);

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

  function addCategoryToTokens(tokens, categories) {
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
      const data = await getAllCryptos();

      const updatedTokens = addCategoryToTokens(data, category);

      setFilteredCryptos(updatedTokens);
      setAllCryptosData(updatedTokens);
    } catch (error) {
      console.error("Error fetching coins:", error.message);
      return [];
    }
  };

  const cryptoOptions = [];

  useEffect(() => {
    getCryptos();
  }, []);

  const handleFilterChange = (filters: any) => {
    let filtered = AllCryptosData;

    // Apply search filter
    if (filters.searchTerm && filters.searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (crypto) =>
          crypto.symbol
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          crypto.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    //Apply prediction range filter
    // if (filters.predictionRange && (filters.predictionRange[0] > -100 || filters.predictionRange[1] < 100)){
    //      filtered = filtered.filter(crypto => {
    //   const predictionValue = parseFloat(crypto.prediction.replace('%', '').replace('+', ''));
    //   return predictionValue >= filters.predictionRange[0] && predictionValue <= filters.predictionRange[1];
    // });
    // }

    // Apply category filter
    if (filters.category && filters.category !== "all") {
      console.log(filters.category);
      filtered = filtered.filter(
        (crypto) => crypto.category === filters.category
      );
    }

    // Apply price range filter
    if (
      filters.priceRange &&
      (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000)
    ) {
      filtered = filtered.filter(
        (crypto) =>
          crypto.current_price >= filters.priceRange[0] &&
          crypto.current_price <= filters.priceRange[1]
      );
    }

    // Apply 24h change range filter
    if (
      filters.change24hRange &&
      (filters.change24hRange[0] > -50 || filters.change24hRange[1] < 50)
    ) {
      filtered = filtered.filter(
        (crypto) =>
          crypto.price_change_24h >= filters.change24hRange[0] &&
          crypto.price_change_24h <= filters.change24hRange[1]
      );
    }

    // Apply volume range filter
    if (
      filters.volumeRange &&
      (filters.volumeRange[0] > 0 || filters.volumeRange[1] < 1000000000)
    ) {
      filtered = filtered.filter(
        (crypto) =>
          crypto.total_volume >= filters.volumeRange[0] &&
          crypto.total_volume <= filters.volumeRange[1]
      );
    }
    // Apply market cap range filter
    if (
      filters.marketCapRange &&
      (filters.marketCapRange[0] > 0 ||
        filters.marketCapRange[1] < 1000000000000)
    ) {
      filtered = filtered.filter(
        (crypto) =>
          crypto.market_cap >= filters.marketCapRange[0] &&
          crypto.market_cap <= filters.marketCapRange[1]
      );
    }

    debugger;
    // Sorting
    let sorted = [...filtered];
    if (
      filters === "gainers" ||
      filters === "losers" ||
      filters === "volume" ||
      filters === "market_cap"
    ) {
      switch (filters) {
        case "volume":
          sorted.sort((a, b) => (a.total_volume || 0) - (b.total_volume || 0));
          break;
        case "gainers":
          sorted = sorted
            .filter((item) => item.price_change_24h > 0)
            .sort((a, b) => b.price_change_24h - a.price_change_24h);
          break;
        case "losers":
          sorted = sorted
            .filter((item) => item.price_change_24h < 0)
            .sort((a, b) => a.price_change_24h - b.price_change_24h);
          break;
        case "marketCap":
          sorted.sort((a, b) => (a.market_cap || 0) - (b.market_cap || 0));
          break;
      }

      setFilteredCryptos(sorted);
    }

    if (filters.sortBy !== undefined && filters.sortBy !== "") {
      switch (filters.sortBy) {
        case "score":
          sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
          break;
        case "prediction":
          sorted.sort((a, b) => {
            const aPred = parseFloat(
              (a.prediction || "0").replace("%", "").replace("+", "")
            );
            const bPred = parseFloat(
              (b.prediction || "0").replace("%", "").replace("+", "")
            );
            return bPred - aPred;
          });
          break;
        case "name":
          sorted.sort((a, b) =>
            (a.label || a.name).localeCompare(b.label || b.name)
          );
          break;
        case "category":
          sorted.sort((a, b) =>
            (a.category || "").localeCompare(b.category || "")
          );
          break;
        case "price":
          sorted.sort(
            (a, b) => (a.current_price || 0) - (b.current_price || 0)
          );
          break;
        case "change24h":
          sorted.sort(
            (a, b) => (a.price_change_24h || 0) - (b.price_change_24h || 0)
          );
          break;
        case "volume":
          sorted.sort((a, b) => (a.total_volume || 0) - (b.total_volume || 0));
          break;
        case "gainers":
          sorted
            .filter((item) => item.change24h > 0)
            .sort((a, b) => b.change24h - a.change24h)
            .slice(0, 10);
          break;
        case "losers":
          sorted
            .filter((item) => item.change24h < 0)
            .sort((a, b) => a.change24h - b.change24h)
            .slice(0, 10);
          break;
        case "marketCap":
          sorted.sort((a, b) => (a.market_cap || 0) - (b.market_cap || 0));
          break;
      }

      setFilteredCryptos(sorted);
    }
  };

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
        cryptoOptions={cryptoOptions}
        currentPrice={currentPrice}
        priceChange={priceChange}
        filteredCryptos={filteredCryptos}
        AllCryptosData={AllCryptosData}
        handleFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default Index;
