import { useQuery } from '@tanstack/react-query';
import { MotiToken, MotiScores } from '@/types/motiMeter';
import { apiService } from '@/services/apiService';

// Mock meme coin data - in production this would come from your APIs
const MEME_COINS = [
  'dogecoin', 'shiba-inu', 'pepe', 'floki', 'bonk', 'dogwifhat', 
  'mog-coin', 'brett-based', 'book-of-meme', 'cat-in-a-dogs-world',
  'popcat', 'mew', 'goatseus-maximus', 'ponke', 'mother-iggy'
];

// AI-powered scoring function (simplified for demo)
const calculateMotiScores = async (tokenData: any, period: string): Promise<MotiScores> => {
  // In production, this would use Gemini AI to analyze:
  // - Twitter mentions, engagement
  // - Cultural relevance  
  // - Technical analysis
  // - Volume patterns
  // - Holder analysis
  
  // For now, generate realistic scores based on available data
  const priceChange = tokenData.price_change_percentage_24h || 0;
  const volume = tokenData.total_volume || 0;
  const marketCap = tokenData.market_cap || 0;
  
  // Simple scoring logic (would be much more sophisticated with real AI)
  const twitterInteraction = Math.min(5, Math.max(1, 3 + (priceChange > 0 ? 1 : -0.5) + (volume > 1000000 ? 1 : 0)));
  const goodTicker = Math.min(5, Math.max(1, tokenData.symbol.length <= 4 ? 5 : tokenData.symbol.length <= 6 ? 3 : 1));
  const culturalRefs = Math.min(5, Math.max(1, Math.random() * 3 + 2)); // Would analyze meme relevance
  const ageOfProject = Math.min(5, Math.max(1, marketCap > 10000000 ? 4 : marketCap > 1000000 ? 3 : 2));
  const volumeConsistency = Math.min(5, Math.max(1, volume > 5000000 ? 4 : volume > 1000000 ? 3 : 2));
  const holderGrowth = Math.min(5, Math.max(1, 3 + (priceChange > -10 ? 1 : -1)));
  const higherLows = Math.min(5, Math.max(1, priceChange > -5 ? 4 : priceChange > -15 ? 3 : 2));
  
  return {
    twitterInteraction: Math.round(twitterInteraction * 10) / 10,
    goodTicker: Math.round(goodTicker * 10) / 10,
    culturalRefs: Math.round(culturalRefs * 10) / 10,
    ageOfProject: Math.round(ageOfProject * 10) / 10,
    volumeConsistency: Math.round(volumeConsistency * 10) / 10,
    holderGrowth: Math.round(holderGrowth * 10) / 10,
    higherLows: Math.round(higherLows * 10) / 10,
  };
};

// Generate AI summary for each token
const generateAISummary = (token: any, scores: MotiScores): string => {
  const priceChange = token.price_change_percentage_24h || 0;
  const volume = token.total_volume || 0;
  const marketCap = token.market_cap || 0;
  
  let line1 = "";
  let line2 = "";
  
  // Generate first line based on price action and momentum
  if (priceChange > 5) {
    line1 = `${token.symbol.toUpperCase()} is showing strong bullish momentum with exceptional viral energy across social platforms.`;
  } else if (priceChange > 0) {
    line1 = `${token.symbol.toUpperCase()} maintains steady upward movement with growing community engagement and positive sentiment.`;
  } else if (priceChange > -5) {
    line1 = `${token.symbol.toUpperCase()} is consolidating with stable holder base despite minor price corrections in the market.`;
  } else {
    line1 = `${token.symbol.toUpperCase()} faces current headwinds but shows resilient community support and strong fundamentals.`;
  }
  
  // Generate second line based on scoring analysis
  if (scores.twitterInteraction >= 4 && scores.culturalRefs >= 4) {
    line2 = "High meme virality combined with excellent cultural relevance makes this a top-tier momentum play.";
  } else if (scores.volumeConsistency >= 4 && scores.holderGrowth >= 4) {
    line2 = "Consistent trading volume and growing holder conviction indicate strong long-term potential.";
  } else if (scores.goodTicker >= 4) {
    line2 = "Premium ticker symbol and solid technical foundation position this for sustained growth.";
  } else if (scores.ageOfProject >= 4) {
    line2 = "Mature project with proven track record offers stability in the volatile meme coin sector.";
  } else {
    line2 = "Mixed signals suggest cautious optimism with focus on risk management and position sizing.";
  }
  
  return `${line1} ${line2}`;
};

const fetchMotiMeterData = async (period: '24h' | '5d' | '7d'): Promise<MotiToken[]> => {
  try {
    // Fetch meme coin data from CoinGecko
    const cryptos = await apiService.getAllCryptos();
    
    // Filter for meme coins only
    const memeCoins = cryptos.filter(crypto => 
      MEME_COINS.includes(crypto.id.toLowerCase()) ||
      crypto.id.toLowerCase().includes('meme') ||
      crypto.id.toLowerCase().includes('doge') ||
      crypto.id.toLowerCase().includes('shib') ||
      crypto.id.toLowerCase().includes('pepe') ||
      crypto.id.toLowerCase().includes('floki') ||
      crypto.id.toLowerCase().includes('bonk')
    );

    // Calculate MOTI scores for each token
    const motiTokens: MotiToken[] = [];
    
    for (const crypto of memeCoins.slice(0, 15)) { // Process top 15 candidates
      try {
        const scores = await calculateMotiScores(crypto, period);
        const motiScore = (
          scores.twitterInteraction +
          scores.goodTicker +
          scores.culturalRefs +
          scores.ageOfProject +
          scores.volumeConsistency +
          scores.holderGrowth +
          scores.higherLows
        ) / 7;

        const aiSummary = generateAISummary(crypto, scores);

        motiTokens.push({
          id: crypto.id,
          symbol: crypto.symbol,
          name: crypto.name,
          image: crypto.image,
          current_price: crypto.current_price,
          market_cap: crypto.market_cap,
          price_change_percentage_24h: crypto.price_change_percentage_24h,
          total_volume: crypto.total_volume,
          scores,
          motiScore: Math.round(motiScore * 10) / 10,
          aiSummary,
          period
        });
      } catch (error) {
        console.warn(`Failed to process ${crypto.name}:`, error);
      }
    }

    // Sort by MOTI score and return top 10
    return motiTokens
      .sort((a, b) => b.motiScore - a.motiScore)
      .slice(0, 10);

  } catch (error) {
    console.error('Error fetching MOTI data:', error);
    throw new Error('Failed to fetch MOTI meter data');
  }
};

export const useMotiMeterData = (period: '24h' | '5d' | '7d') => {
  return useQuery({
    queryKey: ['moti-meter', period],
    queryFn: () => fetchMotiMeterData(period),
    staleTime: 300000, // 5 minutes
    refetchInterval: 300000, // Auto-refresh every 5 minutes
    retry: 2,
  });
};