import { useQuery } from '@tanstack/react-query';

interface PriceData {
  timestamp: number;
  price: number;
  volume?: number;
}

const fetchCryptoData = async (crypto: string, timeframe: string): Promise<PriceData[]> => {
  console.log(`Fetching real ${crypto} data for ${timeframe}`);
  
  try {
    // Use Supabase Edge Function instead of direct API call
    const response = await fetch('/api/coingecko-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ crypto, timeframe }),
    });

    if (!response.ok) {
      throw new Error(`Proxy API error: ${response.status}`);
    }

    const priceData = await response.json();
    console.log(`Successfully fetched ${priceData.length} data points for ${crypto}`);
    return priceData;
  } catch (error) {
    console.error('Error fetching from secure proxy:', error);
    
    // Fallback to mock data if proxy fails
    return generateMockData(crypto, timeframe);
  }
};

const generateMockData = (crypto: string, timeframe: string): PriceData[] => {
  const now = Date.now();
  const days = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
  const intervals = days === 1 ? 24 : days * 4;
  
  const basePrices: { [key: string]: number } = {
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
    'uniswap': 7.5,
    'aave': 85,
    'compound-governance-token': 45,
    'maker': 1200,
    'sushiswap': 1.2,
    'pancakeswap-token': 2.8,
    'curve-dao-token': 0.95,
    'dogecoin': 0.08,
    'shiba-inu': 0.000008,
    'pepe': 0.0000012,
    'floki': 0.000025,
    'bonk': 0.0000045,
    'dogelon-mars': 0.0000003,
    'baby-doge-coin': 0.0000000015,
    'safemoon-2': 0.00025,
    'arbitrum': 1.2,
    'optimism': 2.1,
    'immutable-x': 1.8,
    'loopring': 0.25,
    'axie-infinity': 8.5,
    'the-sandbox': 0.45,
    'decentraland': 0.65,
    'enjincoin': 0.35,
    'gala': 0.025,
    'fetch-ai': 0.45,
    'singularitynet': 0.35,
    'ocean-protocol': 0.55,
    'render-token': 2.8,
    'monero': 155,
    'zcash': 28,
    'dash': 35,
    'tether': 1.0,
    'usd-coin': 1.0,
    'dai': 1.0,
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
    const timestamp = now - (i * (days === 1 ? 3600000 : 21600000));
    
    let volatility = 0.02;
    
    if (crypto.includes('shiba') || crypto.includes('pepe') || crypto.includes('bonk') || crypto.includes('floki')) {
      volatility = 0.08;
    } else if (crypto.includes('tether') || crypto.includes('usd-coin') || crypto.includes('dai')) {
      volatility = 0.001;
    } else if (crypto === 'bitcoin' || crypto === 'ethereum') {
      volatility = 0.015;
    }
    
    const change = (Math.random() - 0.5) * volatility;
    currentPrice = currentPrice * (1 + change);
    
    let trend = 0.0001;
    if (crypto.includes('ai') || crypto.includes('fetch') || crypto.includes('singularity') || crypto.includes('render')) {
      trend = 0.0003;
    } else if (crypto.includes('meme') || crypto.includes('doge') || crypto.includes('shib') || crypto.includes('pepe')) {
      trend = (Math.random() - 0.5) * 0.0005;
    }
    
    currentPrice = currentPrice * (1 + trend);
    
    data.push({
      timestamp,
      price: Math.max(currentPrice, 0.0000001),
      volume: Math.random() * (basePrice > 100 ? 100000000 : basePrice > 1 ? 1000000000 : 10000000000)
    });
  }
  
  return data;
};

export const useCryptoData = (crypto: string, timeframe: string) => {
  return useQuery({
    queryKey: ['crypto-data', crypto, timeframe],
    queryFn: () => fetchCryptoData(crypto, timeframe),
    staleTime: 60000,
    refetchInterval: 30000,
  });
};
