
import { useState, useEffect } from 'react';
import { getAllCryptos } from '../../utils/api';
import { category } from '../../utils/Category';

export const useCryptoFilters = () => {
  const [filteredCryptos, setFilteredCryptos] = useState<any[]>([]);
  const [allCryptosData, setAllCryptosData] = useState<any[]>([]);

  const addCategoryToTokens = (tokens: any[], categories: any[]) => {
    const categoryMap = Object.fromEntries(
      categories.map((c) => [c.id, c.category])
    );

    return tokens.map((token) => ({
      ...token,
      category: categoryMap[token.id] || "Unknown",
    }));
  };

  const removeDuplicates = (tokens: any[]) => {
    const uniqueTokens = new Map();
    
    tokens.forEach((token) => {
      const key = token.id || token.value;
      if (key && !uniqueTokens.has(key)) {
        uniqueTokens.set(key, token);
      }
    });
    
    return Array.from(uniqueTokens.values());
  };

  const getCryptos = async () => {
    try {
      const data = await getAllCryptos();
      const uniqueData = removeDuplicates(data);
      const updatedTokens = addCategoryToTokens(uniqueData, category);

      setFilteredCryptos(updatedTokens);
      setAllCryptosData(updatedTokens);
    } catch (error) {
      console.error("Error fetching coins:", error.message);
      return [];
    }
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...allCryptosData];

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

    // Handle sorting
    const applySorting = (data: any[], sortType: string) => {
      switch (sortType) {
        case "volume":
          return data.sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0));
        case "gainers":
          return data
            .filter((item) => item.price_change_24h > 0)
            .sort((a, b) => b.price_change_24h - a.price_change_24h);
        case "losers":
          return data
            .filter((item) => item.price_change_24h < 0)
            .sort((a, b) => a.price_change_24h - b.price_change_24h);
        case "market_cap":
          return data.sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0));
        default:
          return data;
      }
    };

    if (
      filters === "gainers" ||
      filters === "losers" ||
      filters === "volume" ||
      filters === "market_cap"
    ) {
      const sorted = applySorting([...filtered], filters);
      const uniqueSorted = removeDuplicates(sorted);
      setFilteredCryptos(uniqueSorted);
      return;
    }

    if (filters.sortBy !== undefined && filters.sortBy !== "") {
      let sorted = [...filtered];
      
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
      
      filtered = sorted;
    }

    const finalUnique = removeDuplicates(filtered);
    setFilteredCryptos(finalUnique);
  };

  useEffect(() => {
    getCryptos();
  }, []);

  return {
    filteredCryptos,
    allCryptosData,
    handleFilterChange
  };
};
