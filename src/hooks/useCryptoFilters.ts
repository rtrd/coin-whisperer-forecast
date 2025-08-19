
import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiService } from '@/services/apiService';
import { CryptoToken, CryptoFilters, CryptoCategory } from '@/types/crypto';
import { category } from '../../utils/Category';
import { getTrendingTokens, shouldExcludeFromTrending } from '@/utils/trending';

export const useCryptoFilters = () => {
  const [filteredCryptos, setFilteredCryptos] = useState<CryptoToken[]>([]);
  const [allCryptosData, setAllCryptosData] = useState<CryptoToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCategoryToTokens = useCallback((tokens: CryptoToken[], categories: CryptoCategory[]): CryptoToken[] => {
    const categoryMap = new Map(categories.map((c) => [c.id, c.category]));

    return tokens.map((token) => ({
      ...token,
      category: categoryMap.get(token.id) || "Unknown",
    }));
  }, []);

  const removeDuplicates = useCallback((tokens: CryptoToken[]): CryptoToken[] => {
    const uniqueTokens = new Map<string, CryptoToken>();
    
    tokens.forEach((token) => {
      const key = token.id || token.value;
      if (key && !uniqueTokens.has(key)) {
        uniqueTokens.set(key, token);
      }
    });
    
    return Array.from(uniqueTokens.values());
  }, []);

  const getCryptos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await apiService.getAllCryptos();
      const cryptoArray = Array.isArray(data) ? data : [];
      const uniqueData = removeDuplicates(cryptoArray);
      const updatedTokens = addCategoryToTokens(uniqueData, category);

      setFilteredCryptos(updatedTokens);
      setAllCryptosData(updatedTokens);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch crypto data';
      setError(errorMessage);
      console.error('Crypto data fetch error:', error);
      
      // Set empty arrays as fallback to prevent infinite loading
      setFilteredCryptos([]);
      setAllCryptosData([]);
    } finally {
      setIsLoading(false);
    }
  }, [addCategoryToTokens, removeDuplicates]);

 const applySorting = useCallback((data: CryptoToken[], sortType: string): CryptoToken[] => {
    switch (sortType) {
    case "volume":
      return [...data].sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0));
    case "gainers":
      return data
        .filter((item) => item.price_change_24h > 0 && !shouldExcludeFromTrending(item))
        .sort((a, b) => b.price_change_24h - a.price_change_24h);
    case "losers":                   
      return data
        .filter((item) => item.price_change_24h < 0 && !shouldExcludeFromTrending(item))
        .sort((a, b) => a.price_change_24h - b.price_change_24h);
    case "market_cap":
      return [...data].sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0));
    case "trending":
      return getTrendingTokens(data);
    default:
      return data;
  }
}, []);


  const handleFilterChange = useCallback((filters: CryptoFilters | string) => {
    let filtered = [...allCryptosData];

    if (typeof filters === 'string') {
      const sorted = applySorting(filtered, filters);
      const uniqueSorted = removeDuplicates(sorted);
      setFilteredCryptos(uniqueSorted);
      return;
    }

    // Apply search filter
    if (filters.searchTerm?.trim()) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (crypto) =>
          crypto.symbol?.toLowerCase().includes(searchTerm) ||
          crypto.name?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(
        (crypto) => crypto.category === filters.category
      );
    }

    // Apply price range filter
    if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000)) {
      filtered = filtered.filter(
        (crypto) =>
          crypto.current_price >= filters.priceRange![0] &&
          crypto.current_price <= filters.priceRange![1]
      );
    }

    // Apply 24h change range filter
    if (filters.change24hRange && (filters.change24hRange[0] > -50 || filters.change24hRange[1] < 50)) {
      filtered = filtered.filter(
        (crypto) =>
          crypto.price_change_24h >= filters.change24hRange![0] &&
          crypto.price_change_24h <= filters.change24hRange![1]
      );
    }

    // Apply volume range filter
    if (filters.volumeRange && (filters.volumeRange[0] > 0 || filters.volumeRange[1] < 1000000000)) {
      filtered = filtered.filter(
        (crypto) =>
          crypto.total_volume >= filters.volumeRange![0] &&
          crypto.total_volume <= filters.volumeRange![1]
      );
    }

    // Apply market cap range filter
    if (filters.marketCapRange && (filters.marketCapRange[0] > 0 || filters.marketCapRange[1] < 1000000000000)) {
      filtered = filtered.filter(
        (crypto) =>
          crypto.market_cap >= filters.marketCapRange![0] &&
          crypto.market_cap <= filters.marketCapRange![1]
      );
    }

    // Handle sorting
    if (filters.sortBy) {
      let sorted = [...filtered];
      
      switch (filters.sortBy) {
        case "name":
          sorted.sort((a, b) => (a.label || a.name).localeCompare(b.label || b.name));
          break;
        case "category":
          sorted.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
          break;
        case "price":
          sorted.sort((a, b) => (b.current_price || 0) - (a.current_price || 0));
          break;
        case "change24h":
          sorted.sort((a, b) => (b.price_change_24h || 0) - (a.price_change_24h || 0));
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
  }, [allCryptosData, applySorting, removeDuplicates]);

  useEffect(() => {
    getCryptos();
  }, [getCryptos]);

  return useMemo(() => ({
    filteredCryptos,
    allCryptosData,
    handleFilterChange,
    isLoading,
    error,
    refetch: getCryptos
  }), [filteredCryptos, allCryptosData, handleFilterChange, isLoading, error, getCryptos]);
};
