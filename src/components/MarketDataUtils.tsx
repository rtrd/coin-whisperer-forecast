
import { FilterType } from "./MarketDataFilters";

interface MarketData {
  value: string;
  label: string;
  name: string;
  image: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  category: string;
  predictionPercentage: number;
  aiScore: number;
}

export const generateMarketData = (cryptoOptions: any[], activeFilter: FilterType): MarketData[] => {
  // Generate expanded base data with more tokens to ensure 12 items per filter
  const baseTokens = [
    {
      value: "bitcoin",
      label: "Bitcoin",
      name: "Bitcoin BTC", 
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      price: 43250.75,
      change24h: 2.45,
      volume24h: 28500000000,
      marketCap: 847000000000,
      category: "Layer 1 (L1)",
      predictionPercentage: 8.5,
      aiScore: 85
    },
    {
      value: "ethereum", 
      label: "Ethereum",
      name: "Ethereum ETH",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      price: 2580.42,
      change24h: 1.85,
      volume24h: 15200000000,
      marketCap: 310000000000,
      category: "Layer 1 (L1)",
      predictionPercentage: 6.2,
      aiScore: 82
    },
    {
      value: "solana",
      label: "Solana", 
      name: "Solana SOL",
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      price: 98.75,
      change24h: 4.12,
      volume24h: 3800000000,
      marketCap: 44000000000,
      category: "Layer 1 (L1)",
      predictionPercentage: 12.8,
      aiScore: 78
    },
    {
      value: "chainlink",
      label: "Chainlink",
      name: "Chainlink LINK",
      image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
      price: 14.85,
      change24h: 3.75,
      volume24h: 625000000,
      marketCap: 8500000000,
      category: "DeFi", 
      predictionPercentage: 7.8,
      aiScore: 74
    },
    {
      value: "litecoin",
      label: "Litecoin",
      name: "Litecoin LTC",
      image: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
      price: 72.45,
      change24h: 1.25,
      volume24h: 580000000,
      marketCap: 5400000000,
      category: "Payment Token",
      predictionPercentage: 3.5,
      aiScore: 71
    },
    {
      value: "uniswap",
      label: "Uniswap",
      name: "Uniswap UNI",
      image: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
      price: 6.45,
      change24h: 2.85,
      volume24h: 285000000,
      marketCap: 3900000000,
      category: "DeFi",
      predictionPercentage: 4.1,
      aiScore: 69
    },
    {
      value: "matic",
      label: "Polygon",
      name: "Polygon MATIC",
      image: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
      price: 0.92,
      change24h: 5.75,
      volume24h: 420000000,
      marketCap: 9200000000,
      category: "L2",
      predictionPercentage: 6.8,
      aiScore: 64
    },
    {
      value: "ada",
      label: "Cardano",
      name: "Cardano ADA", 
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      price: 0.515,
      change24h: 3.25,
      volume24h: 520000000,
      marketCap: 18200000000,
      category: "Layer 1 (L1)",
      predictionPercentage: 5.2,
      aiScore: 67
    },
    {
      value: "avax",
      label: "Avalanche",
      name: "Avalanche AVAX",
      image: "https://assets.coingecko.com/coins/images/12559/large/avalanche-avax-logo.png",
      price: 38.75,
      change24h: 2.15,
      volume24h: 640000000,
      marketCap: 15200000000,
      category: "Layer 1 (L1)",
      predictionPercentage: 4.8,
      aiScore: 68
    },
    {
      value: "dot",
      label: "Polkadot",
      name: "Polkadot DOT",
      image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
      price: 6.25,
      change24h: 1.95,
      volume24h: 235000000,
      marketCap: 8900000000,
      category: "Layer 1 (L1)",
      predictionPercentage: 3.2,
      aiScore: 70
    },
    {
      value: "xlm",
      label: "Stellar",
      name: "Stellar XLM",
      image: "https://assets.coingecko.com/coins/images/100/large/stellar.png",
      price: 0.125,
      change24h: 4.85,
      volume24h: 185000000,
      marketCap: 3600000000,
      category: "Payment Token",
      predictionPercentage: 6.5,
      aiScore: 63
    },
    {
      value: "algo",
      label: "Algorand",
      name: "Algorand ALGO",
      image: "https://assets.coingecko.com/coins/images/4380/large/download.png",
      price: 0.185,
      change24h: 3.45,
      volume24h: 95000000,
      marketCap: 1500000000,
      category: "Layer 1 (L1)",
      predictionPercentage: 5.8,
      aiScore: 61
    },
    // Add losing tokens
    {
      value: "dogecoin",
      label: "Dogecoin",
      name: "Dogecoin DOGE",
      image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
      price: 0.078,
      change24h: -5.85,
      volume24h: 890000000,
      marketCap: 11000000000,
      category: "Meme Coin",
      predictionPercentage: -4.5,
      aiScore: 45
    },
    {
      value: "shiba-inu",
      label: "Shiba Inu",
      name: "Shiba Inu SHIB", 
      image: "https://assets.coingecko.com/coins/images/11939/large/shiba.png",
      price: 0.0000085,
      change24h: -6.25,
      volume24h: 340000000,
      marketCap: 5000000000,
      category: "Meme Coin",
      predictionPercentage: -5.8,
      aiScore: 38
    },
    {
      value: "polygon-old",
      label: "Polygon",
      name: "Polygon MATIC",
      image: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png", 
      price: 0.82,
      change24h: -4.25,
      volume24h: 380000000,
      marketCap: 8000000000,
      category: "L2",
      predictionPercentage: -3.2,
      aiScore: 58
    },
    {
      value: "avalanche-old",
      label: "Avalanche", 
      name: "Avalanche AVAX",
      image: "https://assets.coingecko.com/coins/images/12559/large/avalanche-avax-logo.png",
      price: 36.25,
      change24h: -3.65,
      volume24h: 520000000,
      marketCap: 14000000000,
      category: "Layer 1 (L1)",
      predictionPercentage: -2.8,
      aiScore: 62
    },
    {
      value: "polkadot-old",
      label: "Polkadot",
      name: "Polkadot DOT",
      image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
      price: 5.85,
      change24h: -2.95,
      volume24h: 195000000,
      marketCap: 8200000000,
      category: "Layer 1 (L1)",
      predictionPercentage: -1.2,
      aiScore: 68
    },
    {
      value: "uniswap-old",
      label: "Uniswap",
      name: "Uniswap UNI",
      image: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
      price: 6.45,
      change24h: -1.85,
      volume24h: 285000000,
      marketCap: 3900000000,
      category: "DeFi",
      predictionPercentage: 2.1,
      aiScore: 69
    },
    {
      value: "cardano-old",
      label: "Cardano",
      name: "Cardano ADA", 
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      price: 0.485,
      change24h: -2.15,
      volume24h: 450000000,
      marketCap: 17000000000,
      category: "Layer 1 (L1)",
      predictionPercentage: -1.5,
      aiScore: 65
    },
    {
      value: "xrp",
      label: "XRP",
      name: "XRP XRP",
      image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      price: 0.52,
      change24h: -3.85,
      volume24h: 1200000000,
      marketCap: 29000000000,
      category: "Payment Token",
      predictionPercentage: -2.5,
      aiScore: 59
    },
    {
      value: "ltc-old",
      label: "Litecoin", 
      name: "Litecoin LTC",
      image: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
      price: 70.15,
      change24h: -1.95,
      volume24h: 520000000,
      marketCap: 5200000000,
      category: "Payment Token",
      predictionPercentage: -0.8,
      aiScore: 66
    },
    {
      value: "bnb",
      label: "BNB",
      name: "BNB BNB",
      image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
      price: 315.75,
      change24h: -2.45,
      volume24h: 1800000000,
      marketCap: 47000000000,
      category: "Exchange Token",
      predictionPercentage: -1.8,
      aiScore: 72
    },
    {
      value: "trx",
      label: "TRON",
      name: "TRON TRX",
      image: "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png",
      price: 0.095,
      change24h: -4.15,
      volume24h: 420000000,
      marketCap: 8500000000,
      category: "Layer 1 (L1)",
      predictionPercentage: -3.5,
      aiScore: 54
    },
    {
      value: "link-old",
      label: "Chainlink",
      name: "Chainlink LINK",
      image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
      price: 13.95,
      change24h: -1.25,
      volume24h: 580000000,
      marketCap: 8200000000,
      category: "DeFi",
      predictionPercentage: -0.5,
      aiScore: 73
    }
  ];

  // Apply filtering and sorting based on activeFilter
  let filteredData = [...baseTokens];
  
  switch (activeFilter) {
    case "gainers":
      filteredData = baseTokens
        .filter(token => token.change24h > 0)
        .sort((a, b) => b.change24h - a.change24h)
        .slice(0, 12);
      break;
    case "losers":
      filteredData = baseTokens
        .filter(token => token.change24h < 0)
        .sort((a, b) => a.change24h - b.change24h)
        .slice(0, 12);
      break;
    case "volume":
      filteredData = baseTokens
        .sort((a, b) => b.volume24h - a.volume24h)
        .slice(0, 12);
      break;
    case "market_cap":
    default:
      filteredData = baseTokens
        .sort((a, b) => b.marketCap - a.marketCap)
        .slice(0, 12);
      break;
  }

  return filteredData;
};

export const formatPrice = (price: number): string => {
  if (price >= 1) {
    return price.toFixed(2);
  } else {
    return price.toPrecision(3);
  }
};

export const formatVolume = (volume: number): string => {
  if (volume >= 1000000000) {
    return (volume / 1000000000).toFixed(2) + "B";
  } else if (volume >= 1000000) {
    return (volume / 1000000).toFixed(2) + "M";
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(2) + "K";
  } else {
    return volume.toFixed(2);
  }
};

export const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1000000000000) {
    return (marketCap / 1000000000000).toFixed(2) + "T";
  } else if (marketCap >= 1000000000) {
    return (marketCap / 1000000000).toFixed(2) + "B";
  } else if (marketCap >= 1000000) {
    return (marketCap / 1000000).toFixed(2) + "M";
  } else {
    return marketCap.toFixed(2);
  }
};

export const getFilterTitle = (filter: FilterType): string => {
  switch (filter) {
    case "gainers":
      return "Top Gainers";
    case "losers":
      return "Top Losers";
    case "volume":
      return "Top Volume";
    case "market_cap":
      return "Top Market Cap";
    default:
      return "Market Data";
  }
};
