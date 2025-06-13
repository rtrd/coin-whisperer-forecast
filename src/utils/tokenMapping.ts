
// Map CoinGecko IDs to URL-friendly token IDs
export const getTokenUrlId = (coinGeckoId: string): string => {
  const urlMap: { [key: string]: string } = {
    'bitcoin': 'bitcoin',
    'ethereum': 'ethereum', 
    'binancecoin': 'bnb',
    'solana': 'solana',
    'cardano': 'cardano',
    'ripple': 'xrp',
    'dogecoin': 'doge',
    'shiba-inu': 'shib',
    'pepe': 'pepe',
    'bonk': 'bonk',
    'uniswap': 'uniswap',
    'aave': 'aave',
    'fetch-ai': 'fetch-ai',
    'render-token': 'render-token',
    'matic-network': 'polygon',
    'avalanche-2': 'avalanche-2',
    'chainlink': 'chainlink',
    'polkadot': 'polkadot',
    'litecoin': 'litecoin'
  };
  
  return urlMap[coinGeckoId] || coinGeckoId;
};
