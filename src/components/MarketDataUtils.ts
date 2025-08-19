import { CryptoToken } from '@/types/crypto';
import type { FilterType } from '@/types/filters';

// Re-export consolidated utilities
export { formatPrice, formatVolume, formatMarketCap } from '@/utils/formatters';
export type { FilterType } from '@/types/filters';
export { getFilterTitle } from '@/types/filters';

export const generateMarketData = (cryptoOptions: CryptoToken[], activeFilter: FilterType) => {
  console.log("Generating market data :", cryptoOptions);
  const marketData = cryptoOptions.map((crypto, index) => ({
    ...crypto,
    value: crypto.id || crypto.symbol?.toLowerCase() || `token-${index}`,
    price: crypto.current_price || Math.random() * 1000,
    change24h: crypto.price_change_percentage_24h || (Math.random() - 0.5) * 20,
    volume24h: crypto.total_volume || Math.random() * 1000000000,
    marketCap: crypto.market_cap || Math.random() * 10000000000,
    category: crypto.category || 'Cryptocurrency',
    pricechange_24h: crypto.price_change_24h,
    price_change_percentage_7d_in_currency: crypto.price_change_percentage_7d_in_currency || (Math.random() - 0.5) * 40,
    price_change_percentage_24h: crypto.price_change_percentage_24h,
    price_change_percentage_24h_in_currency: crypto.price_change_percentage_24h_in_currency,
    price_change_percentage_30d_in_currency: crypto.price_change_percentage_30d_in_currency || (Math.random() - 0.5) * 60,
    AllTimeHigh: crypto.ath || Math.random() * 1000,
    AllTimeLow: crypto.atl || Math.random() * 10
  }));
  
   return marketData.slice(0, 12);
};