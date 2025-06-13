
// Comprehensive token mapping for CoinGecko IDs to URL-friendly token IDs
const TOKEN_URL_MAP: { [key: string]: string } = {
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
  'litecoin': 'litecoin',
  'tron': 'tron',
  'nexo': 'nexo',
  'chainlink': 'link',
  'stellar': 'xlm',
  'monero': 'xmr',
  'ethereum-classic': 'etc',
  'eos': 'eos',
  'tezos': 'xtz',
  'vechain': 'vet',
  'iota': 'miota',
  'neo': 'neo',
  'dash': 'dash',
  'zcash': 'zec',
  'maker': 'mkr',
  'compound-governance-token': 'comp',
  'sushiswap': 'sushi',
  'pancakeswap-token': 'cake',
  'curve-dao-token': 'crv',
  'yearn-finance': 'yfi',
  'synthetix': 'snx',
  '1inch': '1inch',
  'the-graph': 'grt',
  'fantom': 'ftm',
  'polygon': 'matic',
  'cosmos': 'atom',
  'terra-luna': 'luna',
  'algorand': 'algo',
  'near': 'near',
  'internet-computer': 'icp',
  'hedera-hashgraph': 'hbar',
  'elrond-erd-2': 'egld',
  'helium': 'hnt',
  'theta-token': 'theta',
  'filecoin': 'fil',
  'decentraland': 'mana',
  'the-sandbox': 'sand',
  'axie-infinity': 'axs',
  'enjincoin': 'enj',
  'gala': 'gala',
  'flow': 'flow',
  'chiliz': 'chz',
  'basic-attention-token': 'bat',
  'loopring': 'lrc',
  'immutable-x': 'imx',
  'arbitrum': 'arb',
  'optimism': 'op',
  'aptos': 'apt',
  'sui': 'sui'
};

// Reverse mapping for URL to CoinGecko ID lookup
const URL_TOKEN_MAP: { [key: string]: string } = {};
Object.entries(TOKEN_URL_MAP).forEach(([coinGeckoId, urlId]) => {
  URL_TOKEN_MAP[urlId.toLowerCase()] = coinGeckoId;
});

// Map CoinGecko IDs to URL-friendly token IDs
export const getTokenUrlId = (coinGeckoId: string): string => {
  return TOKEN_URL_MAP[coinGeckoId] || coinGeckoId;
};

// Map URL-friendly token IDs back to CoinGecko IDs
export const getCoinGeckoId = (urlTokenId: string): string => {
  const normalized = urlTokenId.toLowerCase();
  return URL_TOKEN_MAP[normalized] || normalized;
};

// Get token info with proper fallback
export const getTokenInfo = (urlTokenId: string) => {
  const coinGeckoId = getCoinGeckoId(urlTokenId);
  
  const tokenInfoMap: { [key: string]: any } = {
    'bitcoin': { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿', category: 'Layer 1 (L1)', website: 'https://bitcoin.org', twitter: 'https://twitter.com/bitcoin', description: 'The first and largest cryptocurrency by market cap' },
    'ethereum': { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', category: 'Layer 1 (L1)', website: 'https://ethereum.org', twitter: 'https://twitter.com/ethereum', description: 'Smart contract platform and second-largest cryptocurrency' },
    'binancecoin': { id: 'binancecoin', symbol: 'BNB', name: 'BNB', icon: '🔶', category: 'Layer 1 (L1)', website: 'https://www.bnbchain.org', twitter: 'https://twitter.com/bnbchain', description: 'Native token of the Binance ecosystem' },
    'solana': { id: 'solana', symbol: 'SOL', name: 'Solana', icon: '◎', category: 'Layer 1 (L1)', website: 'https://solana.com', twitter: 'https://twitter.com/solana', description: 'High-performance blockchain for decentralized apps' },
    'cardano': { id: 'cardano', symbol: 'ADA', name: 'Cardano', icon: '₳', category: 'Layer 1 (L1)', website: 'https://cardano.org', twitter: 'https://twitter.com/cardano', description: 'Proof-of-stake blockchain platform' },
    'ripple': { id: 'ripple', symbol: 'XRP', name: 'XRP', icon: '◉', category: 'Payment Token', website: 'https://ripple.com', twitter: 'https://twitter.com/ripple', description: 'Digital payment protocol for financial institutions' },
    'dogecoin': { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', icon: '🐕', category: 'Meme Coin', website: 'https://dogecoin.com', twitter: 'https://twitter.com/dogecoin', description: 'The original meme cryptocurrency' },
    'shiba-inu': { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', icon: '🐕‍🦺', category: 'Meme Coin', website: 'https://shibatoken.com', twitter: 'https://twitter.com/shibtoken', description: 'Community-driven meme token' },
    'pepe': { id: 'pepe', symbol: 'PEPE', name: 'Pepe', icon: '🐸', category: 'Meme Coin', website: 'https://pepe.vip', twitter: 'https://twitter.com/pepecoineth', description: 'Meme token based on the Pepe the Frog internet meme' },
    'bonk': { id: 'bonk', symbol: 'BONK', name: 'Bonk', icon: '🔨', category: 'Meme Coin', website: 'https://bonkcoin.com', twitter: 'https://twitter.com/bonk_inu', description: 'Solana-based community meme coin' },
    'uniswap': { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', icon: '🦄', category: 'DeFi', website: 'https://uniswap.org', twitter: 'https://twitter.com/uniswap', description: 'Leading decentralized exchange protocol' },
    'aave': { id: 'aave', symbol: 'AAVE', name: 'Aave', icon: '👻', category: 'DeFi', website: 'https://aave.com', twitter: 'https://twitter.com/aaveaave', description: 'Decentralized lending and borrowing protocol' },
    'fetch-ai': { id: 'fetch-ai', symbol: 'FET', name: 'Fetch.ai', icon: '🤖', category: 'AI', website: 'https://fetch.ai', twitter: 'https://twitter.com/fetch_ai', description: 'Decentralized machine learning platform' },
    'render-token': { id: 'render-token', symbol: 'RNDR', name: 'Render', icon: '🎨', category: 'AI', website: 'https://rendertoken.com', twitter: 'https://twitter.com/rendertoken', description: 'Distributed GPU rendering network' },
    'matic-network': { id: 'matic-network', symbol: 'MATIC', name: 'Polygon', icon: '🔷', category: 'L2', website: 'https://polygon.technology', twitter: 'https://twitter.com/0xpolygon', description: 'Ethereum scaling and infrastructure development' },
    'avalanche-2': { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', icon: '🔺', category: 'Layer 1 (L1)', website: 'https://avax.network', twitter: 'https://twitter.com/avalancheavax', description: 'Highly scalable smart contracts platform' },
    'chainlink': { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', icon: '🔗', category: 'DeFi', website: 'https://chain.link', twitter: 'https://twitter.com/chainlink', description: 'Decentralized oracle network' },
    'polkadot': { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', icon: '⚫', category: 'Layer 1 (L1)', website: 'https://polkadot.network', twitter: 'https://twitter.com/polkadot', description: 'Multi-chain interoperability protocol' },
    'litecoin': { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', icon: 'Ł', category: 'Payment Token', website: 'https://litecoin.org', twitter: 'https://twitter.com/litecoin', description: 'Peer-to-peer digital currency' },
    'tron': { id: 'tron', symbol: 'TRX', name: 'Tron', icon: '⚡', category: 'Layer 1 (L1)', website: 'https://tron.network', twitter: 'https://twitter.com/tronfoundation', description: 'Decentralized blockchain platform for content sharing' },
    'nexo': { id: 'nexo', symbol: 'NEXO', name: 'Nexo', icon: '💎', category: 'DeFi', website: 'https://nexo.io', twitter: 'https://twitter.com/nexofinance', description: 'Digital assets lending and borrowing platform' }
  };

  return tokenInfoMap[coinGeckoId] || {
    id: coinGeckoId,
    symbol: urlTokenId.toUpperCase(),
    name: urlTokenId.charAt(0).toUpperCase() + urlTokenId.slice(1),
    icon: '🪙',
    category: 'Cryptocurrency',
    website: '',
    twitter: '',
    description: `${urlTokenId.charAt(0).toUpperCase() + urlTokenId.slice(1)} cryptocurrency`
  };
};
