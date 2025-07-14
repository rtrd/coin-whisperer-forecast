import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CryptoFilters } from "@/components/CryptoFilters";
import { useLocation } from "react-router-dom";
import { IndexHeader } from "@/components/IndexHeader";
import Footer from "@/components/Footer";
import { generateMarketData } from "@/components/MarketDataUtils";
import { getTokenUrlId } from "@/utils/tokenMapping";
import { MarketDataFilters, FilterType } from "@/components/MarketDataFilters";

const AllTokens = () => {
  const [filteredCryptos, setFilteredCryptos] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("market_cap");
  const location = useLocation();
  const { AllCryptosData } = location.state || { AllCryptosData: [] };

  const cryptoOptions = [
    {
      value: "bitcoin",
      label: "Bitcoin (BTC)",
      icon: "₿",
      category: "Major",
      score: 8.5,
      prediction: "+12.5%",
    },
    {
      value: "ethereum",
      label: "Ethereum (ETH)",
      icon: "Ξ",
      category: "Major",
      score: 8.2,
      prediction: "+8.3%",
    },
  ];

  useEffect(() => {
    setFilteredCryptos(AllCryptosData);
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

    // Sorting
    let sorted = [...filtered];

    if (filters.sortBy !== undefined && filters.sortBy !== "") {
      switch (filters.sortBy) {
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
            (a, b) => (b.current_price || 0) - (a.current_price || 0)
          );
          break;
        case "change24h":
          sorted.sort(
            (a, b) => (b.price_change_24h || 0) - (a.price_change_24h || 0)
          );
          break;
        case "volume":
          sorted.sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0));
          break;
        case "marketCap":
          sorted.sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0));
          break;
      }

      setFilteredCryptos(sorted);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Homepage Header */}
        <IndexHeader
          selectedCrypto="bitcoin"
          cryptoOptions={cryptoOptions}
          currentPrice={50000}
          priceChange={2.5}
        />

        <div className="mb-6">
          <Link to="/">
            <Button
              variant="outline"
              className="mb-4 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">All Tokens</h1>
          <p className="text-gray-300">
            Browse and analyze all available cryptocurrencies
          </p>
        </div>

        {/* Crypto Filters */}
        <CryptoFilters onFilterChange={handleFilterChange} />

        {/* Token List */}
        <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-blue-400" />
              All Tokens ({filteredCryptos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredCryptos.map((token) => (
                <Link
                  key={token.name}
                  to={`/token/${token.name}`}
                  state={{ token, AllCryptosData }}
                  className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600 hover:bg-gray-600/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      <img
                        src={token.image}
                        alt={token.label}
                        width={30}
                        height={30}
                      />
                    </span>
                    <div>
                      <div className="text-white font-medium group-hover:text-blue-400 transition-colors">
                        {token.symbol.toUpperCase()}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {(Math.random() * 10).toFixed(2)}/10
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${
                        token.price_change_percentage_24h > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      <span>
                        {token.price_change_percentage_24h > 0 ? "+" : ""}
                      </span>
                      {(token.price_change_percentage_24h ?? 0).toFixed(2)}%
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs text-gray-300 border-gray-500"
                    >
                      {token.category}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AllTokens;
