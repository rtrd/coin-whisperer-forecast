import { MarketData } from '@/types/crypto';
import { FilterType } from '@/types/filters';

export const generateMarketData = (cryptoOptions: any[], activeFilter: FilterType): MarketData[] => {
  const baseTokens = [
    {
      id: "bitcoin",
      value: "bitcoin",
      label: "Bitcoin",
      name: "Bitcoin BTC",
      symbol: "BTC", 
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      price: 43250.75,
      change24h: 2.45,
      change7d: 8.2,
      change30d: 15.7,
      volume24h: 28500000000,
      marketCap: 847000000000,
      category: "Layer 1 (L1)",
      predictionPercentage: 8.5,
      aiScore: 85
    },
    {
      id: "ethereum",
      value: "ethereum", 
      label: "Ethereum",
      name: "Ethereum ETH",
      symbol: "ETH",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      price: 2580.42,
      change24h: 1.85,
      change7d: 5.4,
      change30d: 12.1,
      volume24h: 15200000000,
      marketCap: 310000000000,
      category: "Layer 1 (L1)",
      predictionPercentage: 6.2,
      aiScore: 82
    },
    {
      id: "solana",
      value: "solana",
      label: "Solana", 
      name: "Solana SOL",
      symbol: "SOL",
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      price: 98.75,
      change24h: 4.12,
      change7d: 18.5,
      change30d: 32.8,
      volume24h: 3800000000,
      marketCap: 44000000000,
      category: "Layer 1 (L1)",
      predictionPercentage: 12.8,
      aiScore: 78
    },
    {
      id: "chainlink",
      value: "chainlink",
      label: "Chainlink",
      name: "Chainlink LINK",
      symbol: "LINK",
      image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
      price: 14.85,
      change24h: 3.75,
      change7d: 11.2,
      change30d: 24.5,
      volume24h: 625000000,
      marketCap: 8500000000,
      category: "DeFi", 
      predictionPercentage: 7.8,
      aiScore: 74
    },
    {
      id: "litecoin",
      value: "litecoin",
      label: "Litecoin",
      name: "Litecoin LTC",
      symbol: "LTC",
      image: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
      price: 72.45,
      change24h: 1.25,
      change7d: 4.8,
      change30d: 18.3,
      volume24h: 580000000,
      marketCap: 5400000000,
      category: "Payment Token",
      predictionPercentage: 3.5,
      aiScore: 71
    },
    {
      id: "uniswap",
      value: "uniswap",
      label: "Uniswap",
      name: "Uniswap UNI",
      symbol: "UNI",
      image: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
      price: 6.45,
      change24h: 2.85,
      change7d: 15.7,
      change30d: 28.2,
      volume24h: 285000000,
      marketCap: 3900000000,
      category: "DeFi",
      predictionPercentage: 4.1,
      aiScore: 69
    },
    {
      id: "matic-network",
      value: "matic-network",
      label: "Polygon",
      name: "Polygon MATIC",
      symbol: "MATIC",
      image: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
      price: 0.92,
      change24h: 5.75,
      change7d: 22.1,
      change30d: 41.8,
      volume24h: 420000000,
      marketCap: 9200000000,
      category: "L2",
      predictionPercentage: 6.8,
      aiScore: 64
    },
    {
      id: "cardano",
      value: "cardano",
      label: "Cardano",
      name: "Cardano ADA",
      symbol: "ADA", 
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      price: 0.515,
      change24h: 3.25,
      change7d: 9.8,
      change30d: 16.4,
      volume24h: 520000000,
      marketCap: 18200000000,
      category: "Layer 1 (L1)",
      predictionPercentage: 5.2,
      aiScore: 67
    },
    {
      id: "avalanche-2",
      value: "avalanche-2",
      label: "Avalanche",
      name: "Avalanche AVAX",
      symbol: "AVAX",
      image: "https://assets.coingecko.com/coins/images/12559/large/avalanche-avax-logo.png",
      price: 38.75,
      change24h: 2.15,
      change7d: 8.9,
      change30d: 25.3,
      volume24h: 640000000,
      marketCap: 15200000000,
      category: "Layer 1 (L1)",
      predictionPercentage: 4.8,
      aiScore: 68
    },
    {
      id: "polkadot",
      value: "polkadot",
      label: "Polkadot",
      name: "Polkadot DOT",
      symbol: "DOT",
      image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
      price: 6.25,
      change24h: 1.95,
      change7d: 6.4,
      change30d: 14.7,
      volume24h: 235000000,
      marketCap: 8900000000,
      category: "Layer 1 (L1)",
      predictionPercentage: 3.2,
      aiScore: 70
    },
    {
      id: "stellar",
      value: "stellar",
      label: "Stellar",
      name: "Stellar XLM",
      symbol: "XLM",
      image: "https://assets.coingecko.com/coins/images/100/large/stellar.png",
      price: 0.125,
      change24h: 4.85,
      change7d: 12.3,
      change30d: 35.6,
      volume24h: 185000000,
      marketCap: 3600000000,
      category: "Payment Token",
      predictionPercentage: 6.5,
      aiScore: 63
    },
    {
      id: "algorand",
      value: "algorand",
      label: "Algorand",
      name: "Algorand ALGO",
      symbol: "ALGO",
      image: "https://assets.coingecko.com/coins/images/4380/large/download.png",
      price: 0.185,
      change24h: 3.45,
      change7d: 8.1,
      change30d: 19.2,
      volume24h: 95000000,
      marketCap: 1500000000,
      category: "Layer 1 (L1)",
      predictionPercentage: 5.8,
      aiScore: 61
    },
    // Add losing tokens
    {
      id: "dogecoin",
      value: "dogecoin",
      label: "Dogecoin",
      name: "Dogecoin DOGE",
      symbol: "DOGE",
      image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
      price: 0.078,
      change24h: -5.85,
      change7d: -12.3,
      change30d: -22.1,
      volume24h: 890000000,
      marketCap: 11000000000,
      category: "Meme Coin",
      predictionPercentage: -4.5,
      aiScore: 45
    },
    {
      id: "shiba-inu",
      value: "shiba-inu",
      label: "Shiba Inu",
      name: "Shiba Inu SHIB",
      symbol: "SHIB", 
      image: "https://assets.coingecko.com/coins/images/11939/large/shiba.png",
      price: 0.0000085,
      change24h: -6.25,
      change7d: -15.8,
      change30d: -28.4,
      volume24h: 340000000,
      marketCap: 5000000000,
      category: "Meme Coin",
      predictionPercentage: -5.8,
      aiScore: 38
    },
    {
      id: "ripple",
      value: "ripple",
      label: "XRP",
      name: "XRP XRP",
      symbol: "XRP",
      image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      price: 0.52,
      change24h: -3.85,
      change7d: -8.2,
      change30d: -14.6,
      volume24h: 1200000000,
      marketCap: 29000000000,
      category: "Payment Token",
      predictionPercentage: -2.5,
      aiScore: 59
    },
    {
      id: "binancecoin",
      value: "binancecoin",
      label: "BNB",
      name: "BNB BNB",
      symbol: "BNB",
      image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
      price: 315.75,
      change24h: -2.45,
      change7d: -5.1,
      change30d: -8.9,
      volume24h: 1800000000,
      marketCap: 47000000000,
      category: "Exchange Token",
      predictionPercentage: -1.8,
      aiScore: 72
    },
    {
      id: "tron",
      value: "tron",
      label: "TRON",
      name: "TRON TRX",
      symbol: "TRX",
      image: "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png",
      price: 0.095,
      change24h: -4.15,
      change7d: -9.7,
      change30d: -18.3,
      volume24h: 420000000,
      marketCap: 8500000000,
      category: "Layer 1 (L1)",
      predictionPercentage: -3.5,
      aiScore: 54
    },
    {
      id: "aave",
      value: "aave",
      label: "Aave",
      name: "Aave AAVE",
      symbol: "AAVE",
      image: "https://assets.coingecko.com/coins/images/12645/large/aave-token-round.png",
      price: 85.45,
      change24h: -1.25,
      change7d: -3.8,
      change30d: -7.2,
      volume24h: 180000000,
      marketCap: 1200000000,
      category: "DeFi",
      predictionPercentage: -0.5,
      aiScore: 73
    },
    {
      id: "compound-governance-token",
      value: "compound-governance-token",
      label: "Compound",
      name: "Compound COMP",
      symbol: "COMP",
      image: "https://assets.coingecko.com/coins/images/10775/large/COMP.png",
      price: 45.25,
      change24h: -2.85,
      change7d: -6.4,
      change30d: -12.1,
      volume24h: 65000000,
      marketCap: 280000000,
      category: "DeFi",
      predictionPercentage: -1.8,
      aiScore: 68
    },
    {
      id: "maker",
      value: "maker",
      label: "MakerDAO",
      name: "MakerDAO MKR",
      symbol: "MKR",
      image: "https://assets.coingecko.com/coins/images/1364/large/Mark_Maker.png",
      price: 1200.85,
      change24h: -0.95,
      change7d: -2.3,
      change30d: -4.8,
      volume24h: 45000000,
      marketCap: 1100000000,
      category: "DeFi",
      predictionPercentage: -0.2,
      aiScore: 71
    },
    {
      id: "fetch-ai",
      value: "fetch-ai",
      label: "Fetch.ai",
      name: "Fetch.ai FET",
      symbol: "FET",
      image: "https://assets.coingecko.com/coins/images/5681/large/Fetch.jpg",
      price: 0.45,
      change24h: 6.85,
      change7d: 24.3,
      change30d: 45.7,
      volume24h: 125000000,
      marketCap: 380000000,
      category: "AI",
      predictionPercentage: 8.2,
      aiScore: 76
    },
    {
      id: "render-token",
      value: "render-token",
      label: "Render",
      name: "Render RNDR",
      symbol: "RNDR",
      image: "https://assets.coingecko.com/coins/images/11636/large/rndr.png",
      price: 2.85,
      change24h: 7.25,
      change7d: 28.1,
      change30d: 52.8,
      volume24h: 95000000,
      marketCap: 1100000000,
      category: "AI",
      predictionPercentage: 9.5,
      aiScore: 79
    }
  ];

  // Transform to match MarketData interface
  const marketDataTokens: MarketData[] = baseTokens.map(token => ({
    ...token,
    current_price: token.price,
    price_change_24h: (token.price * token.change24h) / 100,
    price_change_percentage_24h: token.change24h,
    price_change_percentage_7d_in_currency: token.change7d,
    price_change_percentage_30d_in_currency: token.change30d,
    total_volume: token.volume24h,
    market_cap: token.marketCap,
    predictionStatus: 'idle' as const
  }));

  let filteredData = [...marketDataTokens];
  
  switch (activeFilter) {
    case "gainers":
      filteredData = marketDataTokens
        .filter(token => token.change24h > 0)
        .sort((a, b) => b.change24h - a.change24h)
        .slice(0, 12);
      break;
    case "losers":
      filteredData = marketDataTokens
        .filter(token => token.change24h < 0)
        .sort((a, b) => a.change24h - b.change24h)
        .slice(0, 12);
      break;
    case "volume":
      filteredData = marketDataTokens
        .sort((a, b) => b.volume24h - a.volume24h)
        .slice(0, 12);
      break;
    case "market_cap":
    default:
      filteredData = marketDataTokens
        .sort((a, b) => b.marketCap - a.marketCap)
        .slice(0, 12);
      break;
  }

  return filteredData;
};