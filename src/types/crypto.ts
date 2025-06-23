
export interface CryptoToken {
  id: string;
  value: string;
  label: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price: number;
  price_change_24h: number;
  change24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_24h_in_currency?: number;  
  price_change_percentage_7d_in_currency?: number;    
  price_change_percentage_30d_in_currency?: number;   
  total_volume: number;
  volume24h: number;
  market_cap: number;
  marketCap: number;
  category: string;
  predictionPercentage: number;
  aiScore: number;
  rank?: number;
  ath?: number
  atl?: number;
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

export interface MarketData {
  value: string;
  label: string;
  name: string;
  image: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  category: string;
  predictionPercentage: number;
  aiScore: number;
}
