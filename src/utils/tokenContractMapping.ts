export interface TokenContract {
  address: string;
  network: string;
}

export const TOKEN_CONTRACTS: Record<string, TokenContract | null> = {
  'bitcoin': { 
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC on Ethereum
    network: 'eth' 
  },
  'ethereum': { 
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
    network: 'eth' 
  },
  'tether': { 
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7', 
    network: 'eth' 
  },
  'usd-coin': { 
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 
    network: 'eth' 
  },
  'binancecoin': { 
    address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', 
    network: 'bsc' 
  },
  'cardano': null, // Native blockchain
  'solana': {
    address: 'So11111111111111111111111111111111111111112',
    network: 'solana'
  },
  'ripple': null, // Native blockchain
  'polkadot': null, // Native blockchain
  'dogecoin': null, // Native blockchain
  'matic-network': { 
    address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', 
    network: 'polygon-pos' 
  },
  'shiba-inu': { 
    address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', 
    network: 'eth' 
  },
  'dai': { 
    address: '0x6b175474e89094c44da98b954eedeac495271d0f', 
    network: 'eth' 
  },
  'uniswap': { 
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', 
    network: 'eth' 
  },
  'chainlink': { 
    address: '0x514910771af9ca656af840dff83e8264ecf986ca', 
    network: 'eth' 
  },
  'wrapped-bitcoin': { 
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', 
    network: 'eth' 
  },
  'avalanche-2': { 
    address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', 
    network: 'avalanche' 
  },
  'litecoin': null, // Native blockchain
  'stellar': null, // Native blockchain
  'cosmos': null, // Native blockchain
  'tron': null, // Native blockchain
  'okb': { 
    address: '0x75231f58b43240c9718dd58b4967c5114342a86c', 
    network: 'eth' 
  },
  'the-graph': { 
    address: '0xc944e90c64b2c07662a292be6244bdf05cda44a7', 
    network: 'eth' 
  },
};

export const getTokenContract = (tokenId: string): TokenContract | null => {
  return TOKEN_CONTRACTS[tokenId.toLowerCase()] || null;
};
