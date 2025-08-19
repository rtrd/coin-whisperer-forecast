import { CryptoToken } from '@/types/crypto';

// Exclusion patterns for wrapped, stable, and derivative tokens
const EXCLUDED_PATTERNS = [
  // Wrapped tokens
  /^w[A-Z]+$/i,           // wETH, wBTC, etc.
  /wrapped/i,             // Wrapped anything
  /^[A-Z]+-[A-Z]+$/,      // ETH-USD, BTC-ETH (trading pairs)
  
  // Stablecoins
  /usdt?$/i,              // USDT, USDC, etc.
  /dai$/i,                // DAI
  /busd$/i,               // BUSD
  /frax$/i,               // FRAX
  /tusd$/i,               // TUSD
  /ustc?$/i,              // USTC, UST
  
  // Bridged/derivative tokens
  /\.e$/i,                // Avalanche bridged (.e suffix)
  /^st[A-Z]/i,            // Staked tokens (stETH, stMATIC)
  /^x[A-Z]/i,             // xToken derivatives
  /^a[A-Z]{3,}$/i,        // Aave tokens (aUSDC, aETH)
  /^c[A-Z]{3,}$/i,        // Compound tokens (cUSDC, cETH)
  /^lp-/i,                // LP tokens
  /^uni-v/i,              // Uniswap LP tokens
  /^sushi-/i,             // SushiSwap LP tokens
  
  // Test/fake tokens
  /test/i,
  /fake/i,
  /demo/i,
];

const EXCLUDED_NAMES = [
  // Common wrapped token names
  'wrapped bitcoin',
  'wrapped ether',
  'wrapped eth',
  'wrapped bnb',
  'wrapped avax',
  'wrapped matic',
  
  // Stablecoin names
  'tether',
  'usd coin',
  'binance usd',
  'dai stablecoin',
  'frax',
  'trueusd',
  'terraclassicusd',
  
  // Bridge/derivative names
  'compound',
  'aave',
  'yearn',
  'curve',
  'convex',
  'rocket pool',
  'lido',
];

/**
 * Check if a token should be excluded from trending calculations
 */
export const shouldExcludeFromTrending = (token: CryptoToken): boolean => {
  const symbol = (token.symbol || '').toLowerCase();
  const name = (token.name || '').toLowerCase();
  const category = (token.category || '').toLowerCase();
  
  // Check category exclusions
  const excludedCategories = ['wrapped token', 'liquid staking'];
  if (excludedCategories.some(excluded => category.includes(excluded))) {
    return true;
  }
  
  // Check symbol patterns
  if (EXCLUDED_PATTERNS.some(pattern => pattern.test(symbol))) {
    return true;
  }
  
  // Check name patterns
  if (EXCLUDED_PATTERNS.some(pattern => pattern.test(name))) {
    return true;
  }
  
  // Check explicit name exclusions
  if (EXCLUDED_NAMES.some(excluded => name.includes(excluded))) {
    return true;
  }
  
  // Exclude tokens with very low liquidity (< $10k volume)
  if ((token.total_volume || 0) < 10000) {
    return true;
  }
  
  // Exclude tokens with suspicious price changes (> 1000% or < -95%)
  const priceChange = Math.abs(token.price_change_percentage_24h || 0);
  if (priceChange > 1000 || priceChange < -95) {
    return true;
  }
  
  return false;
};

/**
 * Calculate trending score based on 50% volume weight + 50% absolute price change weight
 * Uses logarithmic scaling for volume to prevent mega-cap dominance
 */
export const calculateTrendingScore = (token: CryptoToken): number => {
  const volume = token.total_volume || 0;
  const priceChange = Math.abs(token.price_change_percentage_24h || 0);
  const marketCap = token.market_cap || 0;
  
  // Minimum thresholds
  if (volume < 10000 || marketCap < 100000) {
    return 0;
  }
  
  // Log-scaled volume score (0-100 range)
  const volumeScore = volume > 0 ? Math.min(100, Math.log10(volume) * 10) : 0;
  
  // Price change score (0-100 range, capped at 50% change for stability)
  const priceChangeScore = Math.min(100, priceChange * 2);
  
  // Turnover ratio as tie-breaker (volume / market_cap)
  const turnoverRatio = marketCap > 0 ? (volume / marketCap) * 100 : 0;
  
  // 50% volume + 50% price change + small turnover bonus
  const baseScore = (volumeScore * 0.5) + (priceChangeScore * 0.5);
  const tieBreaker = Math.min(10, turnoverRatio); // Max 10 point bonus
  
  return baseScore + tieBreaker;
};

/**
 * Get trending tokens with the new algorithm
 */
export const getTrendingTokens = (tokens: CryptoToken[]): CryptoToken[] => {
  return tokens
    .filter(token => !shouldExcludeFromTrending(token))
    .map(token => ({
      ...token,
      trendingScore: calculateTrendingScore(token),
    }))
    .filter(token => token.trendingScore > 0)
    .sort((a, b) => b.trendingScore - a.trendingScore);
};