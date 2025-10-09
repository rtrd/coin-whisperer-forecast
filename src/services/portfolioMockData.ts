import { 
  PortfolioAsset, 
  PortfolioMetrics, 
  Transaction, 
  DeFiPosition, 
  RiskMetrics, 
  AIRecommendation, 
  SmartAlert, 
  CorrelationData, 
  PortfolioHistory 
} from '@/types/portfolio';

export const mockPortfolioAssets: PortfolioAsset[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: '₿',
    amount: 0.85,
    currentPrice: 43250,
    averageBuyPrice: 38900,
    totalValue: 36762.5,
    pnl: 3697.5,
    pnlPercentage: 11.2,
    allocation: 45.8,
    change24h: 2.3,
    volume24h: 15600000000,
    marketCap: 847500000000
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'Ξ',
    amount: 12.4,
    currentPrice: 2680,
    averageBuyPrice: 2450,
    totalValue: 33232,
    pnl: 2852,
    pnlPercentage: 9.4,
    allocation: 41.4,
    change24h: 1.8,
    volume24h: 8900000000,
    marketCap: 322400000000
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    icon: '◎',
    amount: 45.2,
    currentPrice: 105.8,
    averageBuyPrice: 95.2,
    totalValue: 4782.16,
    pnl: 479.12,
    pnlPercentage: 11.1,
    allocation: 6.0,
    change24h: 4.2,
    volume24h: 1200000000,
    marketCap: 47800000000
  },
  {
    id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    icon: '⬢',
    amount: 180.5,
    currentPrice: 17.85,
    averageBuyPrice: 19.2,
    totalValue: 3222.93,
    pnl: -243.68,
    pnlPercentage: -7.0,
    allocation: 4.0,
    change24h: -1.2,
    volume24h: 450000000,
    marketCap: 10500000000
  },
  {
    id: 'polygon',
    symbol: 'MATIC',
    name: 'Polygon',
    icon: '⬡',
    amount: 2850,
    currentPrice: 0.92,
    averageBuyPrice: 1.15,
    totalValue: 2622,
    pnl: -655.5,
    pnlPercentage: -20.0,
    allocation: 3.3,
    change24h: 0.8,
    volume24h: 320000000,
    marketCap: 8900000000
  }
];

export const mockPortfolioMetrics: PortfolioMetrics = {
  totalValue: 80621.59,
  totalPnL: 6129.44,
  totalPnLPercentage: 8.2,
  dayChange: 1850.32,
  dayChangePercentage: 2.35,
  weekChange: -980.15,
  weekChangePercentage: -1.2,
  monthChange: 4250.88,
  monthChangePercentage: 5.6,
  bestPerformer: mockPortfolioAssets[0],
  worstPerformer: mockPortfolioAssets[4]
};

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'buy',
    asset: 'BTC',
    amount: 0.25,
    price: 42800,
    totalValue: 10700,
    timestamp: new Date('2024-01-15T10:30:00Z'),
    hash: '0x1234...5678',
    fee: 15.50,
    status: 'completed'
  },
  {
    id: '2',
    type: 'buy',
    asset: 'ETH',
    amount: 5.0,
    price: 2650,
    totalValue: 13250,
    timestamp: new Date('2024-01-14T14:20:00Z'),
    hash: '0x2345...6789',
    fee: 8.25,
    status: 'completed'
  },
  {
    id: '3',
    type: 'sell',
    asset: 'SOL',
    amount: 15.0,
    price: 108.5,
    totalValue: 1627.5,
    timestamp: new Date('2024-01-13T09:15:00Z'),
    hash: '0x3456...7890',
    fee: 4.88,
    status: 'completed'
  }
];

export const mockDeFiPositions: DeFiPosition[] = [
  {
    id: '1',
    protocol: 'Uniswap V3',
    type: 'liquidity',
    asset: 'ETH/USDC',
    amount: 5850.25,
    apy: 12.4,
    rewards: 125.80,
    totalValue: 5976.05,
    risk: 'medium'
  },
  {
    id: '2',
    protocol: 'Aave',
    type: 'lending',
    asset: 'USDC',
    amount: 15000,
    apy: 8.2,
    rewards: 85.40,
    totalValue: 15085.40,
    risk: 'low'
  },
  {
    id: '3',
    protocol: 'Lido',
    type: 'staking',
    asset: 'stETH',
    amount: 8.5,
    apy: 4.8,
    rewards: 0.85,
    totalValue: 22785,
    risk: 'low'
  }
];

export const mockRiskMetrics: RiskMetrics = {
  sharpeRatio: 1.45,
  volatility: 28.5,
  maxDrawdown: -15.2,
  beta: 0.85,
  var95: -8.5,
  diversificationRatio: 0.72
};

export const mockAIRecommendations: AIRecommendation[] = [
  {
    id: '1',
    type: 'rebalance',
    title: 'Rebalance Portfolio for Better Risk Distribution',
    description: 'Your BTC allocation is 5.8% above target. Consider taking profits and diversifying.',
    priority: 'medium',
    potential_impact: 8.5,
    reasoning: 'Current BTC allocation exceeds optimal risk-adjusted allocation by significant margin',
    actions: [
      'Reduce BTC position by 0.15 BTC (~$6,500)',
      'Increase stablecoin allocation to 15%',
      'Consider adding small-cap altcoins for growth potential'
    ]
  },
  {
    id: '2',
    type: 'risk_management',
    title: 'Set Stop-Loss Orders for Volatile Assets',
    description: 'Your SOL and MATIC positions have high volatility. Consider protective measures.',
    priority: 'high',
    potential_impact: 12.0,
    reasoning: 'High correlation with market downturns could amplify losses',
    actions: [
      'Set trailing stop-loss at 15% for SOL position',
      'Consider reducing MATIC exposure by 30%',
      'Implement DCA strategy for new entries'
    ]
  },
  {
    id: '3',
    type: 'diversification',
    title: 'Add Real World Assets (RWA) Exposure',
    description: 'Consider adding tokenized assets for portfolio diversification.',
    priority: 'low',
    potential_impact: 5.2,
    reasoning: 'Low correlation with crypto markets provides hedge against volatility',
    actions: [
      'Allocate 5-10% to tokenized real estate',
      'Consider treasury bill tokens for yield',
      'Research regulated RWA platforms'
    ]
  }
];

export const mockSmartAlerts: SmartAlert[] = [
  {
    id: '1',
    type: 'price',
    asset: 'BTC',
    condition: 'above',
    threshold: 45000,
    isActive: true,
    message: 'Bitcoin reached your target price of $45,000'
  },
  {
    id: '2',
    type: 'portfolio',
    condition: 'total_value_change',
    threshold: -10,
    isActive: true,
    lastTriggered: new Date('2024-01-10T08:30:00Z'),
    message: 'Portfolio value dropped by more than 10%'
  },
  {
    id: '3',
    type: 'volume',
    asset: 'ETH',
    condition: 'above',
    threshold: 10000000000,
    isActive: false,
    message: 'Ethereum volume exceeded $10B in 24h'
  }
];

export const mockCorrelationData: CorrelationData[] = [
  { asset1: 'BTC', asset2: 'ETH', correlation: 0.85 },
  { asset1: 'BTC', asset2: 'SOL', correlation: 0.72 },
  { asset1: 'BTC', asset2: 'LINK', correlation: 0.68 },
  { asset1: 'BTC', asset2: 'MATIC', correlation: 0.71 },
  { asset1: 'ETH', asset2: 'SOL', correlation: 0.79 },
  { asset1: 'ETH', asset2: 'LINK', correlation: 0.74 },
  { asset1: 'ETH', asset2: 'MATIC', correlation: 0.81 },
  { asset1: 'SOL', asset2: 'LINK', correlation: 0.65 },
  { asset1: 'SOL', asset2: 'MATIC', correlation: 0.70 },
  { asset1: 'LINK', asset2: 'MATIC', correlation: 0.58 }
];

// export const generateMockPortfolioHistory = (): PortfolioHistory[] => {
//   const history: PortfolioHistory[] = [];
//   const now = new Date();
//   const totalDays = 30;

//   for (let i = totalDays; i >= 0; i--) {
//     const date = new Date(now);
//     date.setDate(date.getDate() - i);
    
//     const baseValue = 75000;
//     const randomVariation = (Math.random() - 0.5) * 0.1;
//     const trendValue = baseValue + (baseValue * randomVariation);
//     const totalValue = Math.max(trendValue + (Math.random() - 0.5) * 5000, 60000);
    
//     history.push({
//       timestamp: date,
//       totalValue,
//       pnl: totalValue - 74492.15, // Initial investment
//       assets: {
//         BTC: {
//           value: totalValue * 0.458,
//           amount: 0.85,
//           price: (totalValue * 0.458) / 0.85
//         },
//         ETH: {
//           value: totalValue * 0.414,
//           amount: 12.4,
//           price: (totalValue * 0.414) / 12.4
//         },
//         SOL: {
//           value: totalValue * 0.060,
//           amount: 45.2,
//           price: (totalValue * 0.060) / 45.2
//         },
//         LINK: {
//           value: totalValue * 0.040,
//           amount: 180.5,
//           price: (totalValue * 0.040) / 180.5
//         },
//         MATIC: {
//           value: totalValue * 0.033,
//           amount: 2850,
//           price: (totalValue * 0.033) / 2850
//         }
//       }
//     });
//   }
  
//   return history;
// };

export const GetPortfolioData = async( walletAddress, chain) => {
  debugger;
  if (!walletAddress) return alert("Enter wallet address");

     try {
      const response = await fetch("https://server.pumpparade.com/api/getPortfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress, chain }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch portfolio data");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
      alert("Failed to fetch portfolio");
    } finally {
    }

}