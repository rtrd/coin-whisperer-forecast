
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
  
  const basePrice = crypto === 'bitcoin' ? 45000 : 
                   crypto === 'ethereum' ? 2800 :
                   crypto === 'cardano' ? 0.45 :
                   crypto === 'solana' ? 95 : 0.85;
  
  const data: PriceData[] = [];
  let currentPrice = basePrice;
  
  for (let i = intervals; i >= 0; i--) {
    const timestamp = now - (i * (days === 1 ? 3600000 : 21600000)); // 1h or 6h intervals
    
    // Add some realistic price movement
    const volatility = 0.02; // 2% volatility
    const change = (Math.random() - 0.5) * volatility;
    currentPrice = currentPrice * (1 + change);
    
    // Add trend based on crypto
    const trend = crypto === 'bitcoin' ? 0.0001 : 
                 crypto === 'ethereum' ? 0.0002 : 
                 crypto === 'solana' ? 0.0003 : 0.0001;
    currentPrice = currentPrice * (1 + trend);
    
    data.push({
      timestamp,
      price: currentPrice,
      volume: Math.random() * 1000000000 // Random volume
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
