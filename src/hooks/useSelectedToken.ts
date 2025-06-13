
import { useMemo } from 'react';
import { SelectedTokenInfo } from '@/types/tokenAnalysis';
import { getCoinGeckoId, getTokenInfo } from '@/utils/tokenMapping';
import { TokenInfo } from '@/hooks/useTokenInfo';

export const useSelectedToken = (
  selectedCrypto: string,
  tokenInfo: TokenInfo | undefined,
  cryptoOptions: any[] = []
): SelectedTokenInfo | undefined => {
  const coinGeckoId = useMemo(() => getCoinGeckoId(selectedCrypto), [selectedCrypto]);
  const fallbackToken = useMemo(() => getTokenInfo(selectedCrypto), [selectedCrypto]);

  return useMemo(() => {
    if (tokenInfo) {
      return {
        value: tokenInfo.id,
        label: `${tokenInfo.name} (${tokenInfo.symbol})`,
        symbol: tokenInfo.symbol,
        name: tokenInfo.name,
        icon: tokenInfo.symbol === 'BTC' ? '₿' : 
              tokenInfo.symbol === 'ETH' ? 'Ξ' : 
              tokenInfo.symbol === 'XRP' ? '◉' : 
              tokenInfo.symbol === 'DOGE' ? '🐕' : '🪙',
        score: Math.random() * 3 + 7,
        prediction: `${(Math.random() * 20 - 10).toFixed(1)}%`,
        category: tokenInfo.categories?.[0] || 'Cryptocurrency'
      };
    }
    
    // Fall back to static token info
    if (fallbackToken) {
      return {
        value: fallbackToken.id,
        label: `${fallbackToken.name} (${fallbackToken.symbol})`,
        symbol: fallbackToken.symbol,
        name: fallbackToken.name,
        icon: fallbackToken.icon,
        score: Math.random() * 3 + 7,
        prediction: `${(Math.random() * 20 - 10).toFixed(1)}%`,
        category: fallbackToken.category
      };
    }
    
    // Final fallback to cryptoOptions
    return cryptoOptions.find(c => c.value === selectedCrypto);
  }, [tokenInfo, fallbackToken, cryptoOptions, selectedCrypto]);
};
