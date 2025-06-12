export const formatPrice = (price: number) => {
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  if (price < 100) return `$${price.toFixed(2)}`;
  return `$${price.toLocaleString()}`;
};

export const formatVolume = (volume: number) => {
  if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
  if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
  if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
  return `$${volume.toFixed(2)}`;
};

export const formatMarketCap = (marketCap: number) => {
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
  return `$${(marketCap / 1e3).toFixed(2)}K`;
};

export const getFilterTitle = (filter: string) => {
  switch (filter) {
    case 'market_cap': return 'Top Cryptocurrencies by Market Cap';
    case 'volume': return 'Top Cryptocurrencies by Volume';
    case 'gainers': return 'Top Cryptocurrencies Gainers (24h)';
    case 'losers': return 'Top Cryptocurrencies Losers (24h)';
    case 'trending': return 'Trending Cryptocurrencies';
    default: return 'Top Cryptocurrencies';
  }
};

export const generateMarketData = (cryptoOptions: any[], filter: string) => {
  let dataWithMarketData = cryptoOptions.map((crypto, index) => {
    const basePrice = parseFloat(crypto.prediction?.replace('%', '').replace('+', '')) || 0;
    const mockPrice = crypto.current_price; //Math.random() * 1000 + 1;
    const mockChange24h = crypto.price_change_percentage_24h
    const mockVolume = crypto.total_volume;//Math.random() * 1000000000;
    const mockMarketCap = crypto.market_cap;//mockPrice * (Math.random() * 100000000 + 1000000);
    const predictionPercentage = basePrice || (Math.random() - 0.5) * 20;
    const aiScore = Math.random() * 100;
    
    return {
      ...crypto,
      price: mockPrice,
      change24h: mockChange24h,
      volume24h: mockVolume,
      marketCap: mockMarketCap,
      predictionPercentage,
      aiScore,
      rank: index + 1
    };
  });

  switch (filter) {
    case 'market_cap':
      return dataWithMarketData.sort((a, b) => b.marketCap - a.marketCap).slice(0, 10);
    case 'volume':
      return dataWithMarketData.sort((a, b) => b.volume24h - a.volume24h).slice(0, 10);
    case 'gainers':
      return dataWithMarketData.filter(item => item.change24h > 0).sort((a, b) => b.change24h - a.change24h).slice(0, 10);
    case 'losers':
      return dataWithMarketData.filter(item => item.change24h < 0).sort((a, b) => a.change24h - b.change24h).slice(0, 10);
    case 'trending':
      // Calculate trending score based on volume and absolute price change
      return dataWithMarketData.map(item => ({
        ...item,
        trendingScore: (item.volume24h / 1000000) + (Math.abs(item.change24h) * 100)
      }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 10);
    default:
      return dataWithMarketData.slice(0, 10);
  }
};
