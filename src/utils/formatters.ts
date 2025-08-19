/**
 * Consolidated formatting utilities for market data
 * Combines logic from MarketDataUtils.ts, marketDataHelpers.ts, and seo.ts
 */

export const formatPrice = (price: number | undefined | null): string => {
  // Handle undefined, null, or non-numeric values
  if (price == null || typeof price !== 'number' || isNaN(price)) {
    return '$0.00';
  }
  
  if (price < 0.01) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })}`;
  } else if (price < 1) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
  } else {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

export const formatVolume = (volume: number | undefined | null): string => {
  if (volume == null || typeof volume !== 'number' || isNaN(volume)) {
    return '$0.00';
  }
  
  if (volume >= 1000000000) {
    return `$${(volume / 1000000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}B`;
  } else if (volume >= 1000000) {
    return `$${(volume / 1000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`;
  } else if (volume >= 1000) {
    return `$${(volume / 1000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}K`;
  } else {
    return `$${volume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

export const formatMarketCap = (marketCap: number | undefined | null): string => {
  if (marketCap == null || typeof marketCap !== 'number' || isNaN(marketCap)) {
    return '$0.00';
  }
  
  if (marketCap >= 1000000000000) {
    return `$${(marketCap / 1000000000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}T`;
  } else if (marketCap >= 1000000000) {
    return `$${(marketCap / 1000000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}B`;
  } else if (marketCap >= 1000000) {
    return `$${(marketCap / 1000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`;
  } else {
    return `$${marketCap.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

/**
 * Format price for SEO purposes (without $ symbol)
 */
export const formatPricePlain = (price: number): string => {
  if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  }
  return price.toFixed(8).replace(/\.?0+$/, '');
};

/**
 * Format percentage change with sign
 */
export const formatPercentage = (percentage: number | undefined | null): string => {
  if (percentage == null || typeof percentage !== 'number' || isNaN(percentage)) {
    return '0.00%';
  }
  
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
};