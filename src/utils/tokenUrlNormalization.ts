/**
 * Token URL normalization utilities for consistent navigation
 */

import { getTokenUrlId, getCoinGeckoId, getTokenInfo } from './tokenMapping';

/**
 * Normalize a token identifier for URL usage
 * Handles various input formats and returns a consistent URL-friendly ID
 */
export const normalizeTokenForUrl = (tokenInput: string | undefined): string => {
  if (!tokenInput) return 'bitcoin';

  // Remove common prefixes and normalize
  const normalized = tokenInput
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  // Try to get URL-friendly ID through token mapping
  const urlId = getTokenUrlId(normalized);
  
  // Validate that the token exists in our system
  const tokenInfo = getTokenInfo(urlId);
  
  return tokenInfo ? urlId : 'bitcoin';
};

/**
 * Validate that a token URL is properly formatted and exists
 */
export const validateTokenUrl = (tokenId: string): boolean => {
  try {
    const tokenInfo = getTokenInfo(tokenId);
    const coinGeckoId = getCoinGeckoId(tokenId);
    return !!(tokenInfo && coinGeckoId);
  } catch {
    return false;
  }
};

/**
 * Get the canonical URL for a token given various input formats
 */
export const getCanonicalTokenUrl = (tokenInput: any): string => {
  // Handle different input formats
  if (typeof tokenInput === 'object') {
    // Token object with various possible ID fields
    const id = tokenInput.value || tokenInput.id || tokenInput.symbol?.toLowerCase() || tokenInput.name?.toLowerCase();
    return normalizeTokenForUrl(id);
  }
  
  // String input
  return normalizeTokenForUrl(tokenInput);
};