
import { useQuery } from '@tanstack/react-query';

interface PriceData {
  timestamp: number;
  price: number;
  volume?: number;
}

const generateMockData = (crypto: string, timeframe: string): PriceData[] => {
  const now = Date.now();
  const days = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
  const intervals = days === 1 ? 24 : days * 4; // hourly for 1d, 6h intervals for others
  
  // Base prices for different cryptocurrencies
  const basePrices: { [key: string]: number } = {
    // Major Cryptocurrencies
    'bitcoin': 45000,
    'ethereum': 2800,
    'binancecoin': 320,
    'ripple': 0.55,
    'cardano': 0.45,
    'solana': 95,
    'avalanche-2': 25,
    'polygon': 0.85,
    'polkadot': 6.5,
    'chainlink': 14,
    
    // DeFi Tokens
    'uniswap': 7.5,
    'aave': 85,
    'compound-governance-token': 45,
    'maker': 1200,
    'sushiswap': 1.2,
    'pancakeswap-token': 2.8,
    'curve-dao-token': 0.95,
    
    // Meme Coins
    'dogecoin': 0.08,
    'shiba-inu': 0.000008,
    'pepe': 0.0000012,
    'floki': 0.000025,
    'bonk': 0.0000045,
    'dogelon-mars': 0.0000003,
    'baby-doge-coin': 0.0000000015,
    'safemoon-2': 0.00025,
    
    // Layer 2 & Scaling
    'arbitrum': 1.2,
    'optimism': 2.1,
    'immutable-x': 1.8,
    'loopring': 0.25,
    
    // Gaming & NFT
    'axie-infinity': 8.5,
    'the-sandbox': 0.45,
    'decentraland': 0.65,
    'enjincoin': 0.35,
    'gala': 0.025,
    
    // AI & Data
    'fetch-ai': 0.45,
    'singularitynet': 0.35,
    'ocean-protocol': 0.55,
    'render-token': 2.8,
    
    // Privacy Coins
    'monero': 155,
    'zcash': 28,
    'dash': 35,
    
    // Stablecoins
    'tether': 1.0,
    'usd-coin': 1.0,
    'dai': 1.0,
    
    // Newer/Trending
    'sui': 1.15,
    'aptos': 8.5,
    'blur': 0.45,
    'injective-protocol': 25,
    'celestia': 12,
  };
  
  const basePrice = basePrices[crypto] || 1.0;
  
  const data: PriceData[] = [];
  let currentPrice = basePrice;
  
  for (let i = intervals; i >= 0; i--) {
    const timestamp = now - (i * (days === 1 ? 3600000 : 21600000)); // 1h or 6h intervals
    
    // Add some realistic price movement based on token type
    let volatility = 0.02; // 2% default volatility
    
    // Adjust volatility based on token type
    if (crypto.includes('shiba') || crypto.includes('pepe') || crypto.includes('bonk') || crypto.includes('floki')) {
      volatility = 0.08; // Higher volatility for meme coins
    } else if (crypto.includes('tether') || crypto.includes('usd-coin') || crypto.includes('dai')) {
      volatility = 0.001; // Very low volatility for stablecoins
    } else if (crypto === 'bitcoin' || crypto === 'ethereum') {
      volatility = 0.015; // Lower volatility for major coins
    }
    
    const change = (Math.random() - 0.5) * volatility;
    currentPrice = currentPrice * (1 + change);
    
    // Add trend based on crypto category
    let trend = 0.0001;
    if (crypto.includes('ai') || crypto.includes('fetch') || crypto.includes('singularity') || crypto.includes('render')) {
      trend = 0.0003; // AI tokens trending up
    } else if (crypto.includes('meme') || crypto.includes('doge') || crypto.includes('shib') || crypto.includes('pepe')) {
      trend = (Math.random() - 0.5) * 0.0005; // Meme coins more random
    }
    
    currentPrice = currentPrice * (1 + trend);
    
    data.push({
      timestamp,
      price: Math.max(currentPrice, 0.0000001), // Prevent negative prices
      volume: Math.random() * (basePrice > 100 ? 100000000 : basePrice > 1 ? 1000000000 : 10000000000) // Scaled volume
    });
  }
  
  return data;
};

export const useCryptoData = (crypto: string, timeframe: string) => {
  return useQuery({
    queryKey: ['crypto-data', crypto, timeframe],
    queryFn: async () => {
      console.log(`Fetching ${crypto} data for ${timeframe}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would fetch from CoinGecko, Binance, etc.
      // Example: const response = await fetch(`https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=${timeframe}`);
      
      return generateMockData(crypto, timeframe);
    },
    staleTime: 60000, // 1 minute
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
