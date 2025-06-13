
import { SelectedTokenInfo } from '@/types/tokenAnalysis';

export const CRYPTO_OPTIONS: SelectedTokenInfo[] = [
  { value: 'bitcoin', label: 'Bitcoin (BTC)', symbol: 'BTC', name: 'Bitcoin', icon: '₿', category: 'Layer 1 (L1)', score: 8.5, prediction: '+12.5%', 
    description: 'The first and largest cryptocurrency by market cap', 
    website: 'https://bitcoin.org', twitter: 'https://twitter.com/bitcoin' },
  { value: 'ethereum', label: 'Ethereum (ETH)', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', category: 'Layer 1 (L1)', score: 8.2, prediction: '+8.3%',
    description: 'Smart contract platform and second-largest cryptocurrency',
    website: 'https://ethereum.org', twitter: 'https://twitter.com/ethereum' },
  { value: 'binancecoin', label: 'BNB (BNB)', symbol: 'BNB', name: 'BNB', icon: '🔶', category: 'Layer 1 (L1)', score: 7.8, prediction: '+6.1%',
    description: 'Native token of the Binance ecosystem',
    website: 'https://www.bnbchain.org', twitter: 'https://twitter.com/bnbchain' },
  { value: 'solana', label: 'Solana (SOL)', symbol: 'SOL', name: 'Solana', icon: '◎', category: 'Layer 1 (L1)', score: 8.1, prediction: '+15.8%',
    description: 'High-performance blockchain for decentralized apps',
    website: 'https://solana.com', twitter: 'https://twitter.com/solana' },
  { value: 'cardano', label: 'Cardano (ADA)', symbol: 'ADA', name: 'Cardano', icon: '₳', category: 'Layer 1 (L1)', score: 6.9, prediction: '+3.2%',
    description: 'Proof-of-stake blockchain platform',
    website: 'https://cardano.org', twitter: 'https://twitter.com/cardano' },
  { value: 'uniswap', label: 'Uniswap (UNI)', symbol: 'UNI', name: 'Uniswap', icon: '🦄', category: 'DeFi', score: 7.1, prediction: '+11.2%',
    description: 'Leading decentralized exchange protocol',
    website: 'https://uniswap.org', twitter: 'https://twitter.com/uniswap' },
  { value: 'aave', label: 'Aave (AAVE)', symbol: 'AAVE', name: 'Aave', icon: '👻', category: 'DeFi', score: 7.4, prediction: '+8.7%',
    description: 'Decentralized lending and borrowing protocol',
    website: 'https://aave.com', twitter: 'https://twitter.com/aaveaave' },
  { value: 'dogecoin', label: 'Dogecoin (DOGE)', symbol: 'DOGE', name: 'Dogecoin', icon: '🐕', category: 'Meme Coin', score: 6.1, prediction: '+18.5%',
    description: 'The original meme cryptocurrency',
    website: 'https://dogecoin.com', twitter: 'https://twitter.com/dogecoin' },
  { value: 'shiba-inu', label: 'Shiba Inu (SHIB)', symbol: 'SHIB', name: 'Shiba Inu', icon: '🐕‍🦺', category: 'Meme Coin', score: 5.9, prediction: '+25.3%',
    description: 'Community-driven meme token',
    website: 'https://shibatoken.com', twitter: 'https://twitter.com/shibtoken' },
  { value: 'pepe', label: 'Pepe (PEPE)', symbol: 'PEPE', name: 'Pepe', icon: '🐸', category: 'Meme Coin', score: 8.8, prediction: '+65.3%',
    description: 'Meme token based on the Pepe the Frog internet meme',
    website: 'https://pepe.vip', twitter: 'https://twitter.com/pepecoineth' },
  { value: 'fetch-ai', label: 'Fetch.ai (FET)', symbol: 'FET', name: 'Fetch.ai', icon: '🤖', category: 'AI', score: 8.5, prediction: '+52.1%',
    description: 'Decentralized machine learning platform',
    website: 'https://fetch.ai', twitter: 'https://twitter.com/fetch_ai' },
  { value: 'singularitynet', label: 'SingularityNET (AGIX)', symbol: 'AGIX', name: 'SingularityNET', icon: '🧠', category: 'AI', score: 8.1, prediction: '+41.8%',
    description: 'Decentralized AI marketplace',
    website: 'https://singularitynet.io', twitter: 'https://twitter.com/singularitynet' },
  { value: 'render-token', label: 'Render (RNDR)', symbol: 'RNDR', name: 'Render', icon: '🎨', category: 'AI', score: 8.1, prediction: '+41.7%',
    description: 'Distributed GPU rendering network',
    website: 'https://rendertoken.com', twitter: 'https://twitter.com/rendertoken' }
];

export class TokenDataService {
  static getCryptoOptions(): SelectedTokenInfo[] {
    return CRYPTO_OPTIONS;
  }

  static findTokenByValue(value: string): SelectedTokenInfo | undefined {
    return CRYPTO_OPTIONS.find(token => token.value === value);
  }

  static generateMarketData(currentPrice: number, category: string) {
    const getMarketCapMultiplier = () => {
      if (category === 'Layer 1 (L1)') return Math.random() * 800000000 + 200000000;
      if (category === 'DeFi') return Math.random() * 100000000 + 50000000;
      if (category === 'Meme Coin') return Math.random() * 50000000 + 10000000;
      if (category === 'AI') return Math.random() * 200000000 + 100000000;
      return Math.random() * 500000000 + 100000000;
    };

    return {
      marketCap: currentPrice * getMarketCapMultiplier(),
      volume24h: currentPrice * (Math.random() * 50000000 + 10000000),
      circulatingSupply: Math.random() * 1000000000 + 100000000,
      totalSupply: Math.random() * 1000000000 + 500000000,
      allTimeHigh: currentPrice * (1 + Math.random() * 5),
      allTimeLow: currentPrice * (Math.random() * 0.5 + 0.1),
      priceChange7d: (Math.random() - 0.5) * 40,
      priceChange30d: (Math.random() - 0.5) * 80
    };
  }
}
