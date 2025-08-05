import { useState, useEffect } from 'react';

export interface PopularMemecoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  market_cap_rank: number;
  price_change_percentage_7d?: number;
  ath?: number;
  atl?: number;
  pumpScore: number;
}

export type SortOption = 'volume' | 'market_cap' | 'price_change_24h' | 'pump_score';

// Known memecoin IDs and patterns for filtering
const KNOWN_MEMECOINS = [
  'dogecoin', 'shiba-inu', 'pepe', 'floki', 'bonk', 'dogwifcoin', 'meme',
  'baby-doge-coin', 'dogelon-mars', 'samoyedcoin', 'kishu-inu', 'akita-inu',
  'hokkaido-inu', 'cat-in-a-dogs-world', 'book-of-meme', 'myro', 'jeo-boden',
  'popcat', 'mog-coin', 'brett-based', 'pajamas-cat', 'based-brett'
];

const MEMECOIN_KEYWORDS = [
  'doge', 'shib', 'pepe', 'inu', 'cat', 'dog', 'meme', 'bonk', 'floki',
  'elon', 'wojak', 'chad', 'based', 'moon', 'rocket', 'safe', 'baby'
];

export const usePopularMemecoins = () => {
  const [memecoins, setMemecoins] = useState<PopularMemecoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('volume');

  const calculatePumpScore = (coin: PopularMemecoin): number => {
    const volumeScore = Math.min(coin.total_volume / 10000000 * 3, 3); // Max 3 points
    const priceChangeScore = Math.min(Math.abs(coin.price_change_percentage_24h) / 20 * 4, 4); // Max 4 points
    const marketCapScore = Math.min(coin.market_cap / 100000000 * 2, 2); // Max 2 points
    const rankBonus = coin.market_cap_rank <= 100 ? 1 : 0; // Bonus for top 100
    
    return Math.min(volumeScore + priceChangeScore + marketCapScore + rankBonus, 10);
  };

  const isMemecoin = (coin: any): boolean => {
    // Check if it's in our known memecoins list
    if (KNOWN_MEMECOINS.includes(coin.id.toLowerCase())) {
      return true;
    }
    
    // Check if name or symbol contains memecoin keywords
    const nameCheck = MEMECOIN_KEYWORDS.some(keyword => 
      coin.name.toLowerCase().includes(keyword) || 
      coin.symbol.toLowerCase().includes(keyword)
    );
    
    return nameCheck;
  };

  const fetchMemecoins = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get meme tokens by category
      const marketResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=meme-token&order=volume_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h,7d`
      );

      if (!marketResponse.ok) {
        throw new Error('Failed to fetch market data');
      }

      const marketData = await marketResponse.json();

      // Filter to only include actual memecoins
      const filteredMemecoins = marketData.filter(isMemecoin);

      // Transform to our format and calculate pump scores
      const transformedCoins: PopularMemecoin[] = filteredMemecoins.slice(0, 18).map((coin: any) => {
        const memecoin: PopularMemecoin = {
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          image: coin.image,
          current_price: coin.current_price || 0,
          price_change_percentage_24h: coin.price_change_percentage_24h || 0,
          market_cap: coin.market_cap || 0,
          total_volume: coin.total_volume || 0,
          market_cap_rank: coin.market_cap_rank || 999,
          price_change_percentage_7d: coin.price_change_percentage_7d_in_currency,
          ath: coin.ath,
          atl: coin.atl,
          pumpScore: 0
        };
        
        memecoin.pumpScore = calculatePumpScore(memecoin);
        return memecoin;
      });

      setMemecoins(transformedCoins);
    } catch (err) {
      console.error('Error fetching memecoin data:', err);
      setError('Failed to fetch memecoin data');
      
      // Fallback to mock data
      const mockData: PopularMemecoin[] = [
        {
          id: 'dogecoin',
          symbol: 'DOGE',
          name: 'Dogecoin',
          image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
          current_price: 0.08,
          price_change_percentage_24h: 5.2,
          market_cap: 11500000000,
          total_volume: 450000000,
          market_cap_rank: 8,
          pumpScore: 7.5
        },
        {
          id: 'shiba-inu',
          symbol: 'SHIB',
          name: 'Shiba Inu',
          image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png',
          current_price: 0.000009,
          price_change_percentage_24h: -2.1,
          market_cap: 5300000000,
          total_volume: 180000000,
          market_cap_rank: 15,
          pumpScore: 6.8
        }
      ];
      setMemecoins(mockData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemecoins();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchMemecoins, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const sortedMemecoins = [...memecoins].sort((a, b) => {
    switch (sortBy) {
      case 'volume':
        return b.total_volume - a.total_volume;
      case 'market_cap':
        return b.market_cap - a.market_cap;
      case 'price_change_24h':
        return b.price_change_percentage_24h - a.price_change_percentage_24h;
      case 'pump_score':
        return b.pumpScore - a.pumpScore;
      default:
        return 0;
    }
  });

  return {
    memecoins: sortedMemecoins,
    loading,
    error,
    sortBy,
    setSortBy,
    refresh: fetchMemecoins
  };
};