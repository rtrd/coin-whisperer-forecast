/**
 * Base interface for crypto-related data
 */
export interface CryptoBase {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
  category: string;
}

export interface CryptoToken extends CryptoBase {
  value: string;
  label: string;
  price: number;
  change24h: number;
  price_change_percentage_24h_in_currency?: number;  
  price_change_percentage_7d_in_currency?: number;    
  price_change_percentage_30d_in_currency?: number;   
  volume24h: number;
  marketCap: number;
  rank?: number;
  ath?: number;
  atl?: number;
}

export interface MarketData extends CryptoBase {
  value: string;
  label: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

export interface CryptoCategory {
  id: string;
  category: string;
}

export interface CryptoFilters {
  searchTerm?: string;
  category?: string;
  priceRange?: [number, number];
  change24hRange?: [number, number];
  volumeRange?: [number, number];
  marketCapRange?: [number, number];
  sortBy?: string;
}

export interface PriceData {
  timestamp: number;
  price: number;
  volume?: number;
}