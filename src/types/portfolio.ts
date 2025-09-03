export interface WalletConnection {
  address: string;
  isConnected: boolean;
  chainId?: number;
  balance?: string;
}

export interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  amount: number;
  currentPrice: number;
  averageBuyPrice: number;
  totalValue: number;
  pnl: number;
  pnlPercentage: number;
  allocation: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer' | 'stake' | 'unstake';
  asset: string;
  amount: number;
  price: number;
  totalValue: number;
  timestamp: Date;
  hash: string;
  fee: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface DeFiPosition {
  id: string;
  protocol: string;
  type: 'liquidity' | 'staking' | 'lending' | 'yield_farming';
  asset: string;
  amount: number;
  apy: number;
  rewards: number;
  totalValue: number;
  risk: 'low' | 'medium' | 'high';
}

export interface PortfolioMetrics {
  totalValue: number;
  totalPnL: number;
  totalPnLPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
  weekChange: number;
  weekChangePercentage: number;
  monthChange: number;
  monthChangePercentage: number;
  bestPerformer: PortfolioAsset;
  worstPerformer: PortfolioAsset;
}

export interface RiskMetrics {
  sharpeRatio: number;
  volatility: number;
  maxDrawdown: number;
  beta: number;
  var95: number;
  diversificationRatio: number;
}

export interface AIRecommendation {
  id: string;
  type: 'rebalance' | 'risk_management' | 'rotation' | 'diversification';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  potential_impact: number;
  reasoning: string;
  actions: string[];
}

export interface SmartAlert {
  id: string;
  type: 'price' | 'volume' | 'portfolio' | 'news';
  asset?: string;
  condition: string;
  threshold: number;
  isActive: boolean;
  lastTriggered?: Date;
  message: string;
}

export interface CorrelationData {
  asset1: string;
  asset2: string;
  correlation: number;
}

export interface PortfolioStrategy {
  id: string;
  name: 'conservative' | 'moderate' | 'aggressive' | 'custom';
  description: string;
  riskTolerance: number;
  targetAllocation: {
    [asset: string]: number;
  };
  rebalanceThreshold: number;
}

export interface PortfolioHistory {
  timestamp: Date;
  totalValue: number;
  pnl: number;
  assets: {
    [symbol: string]: {
      value: number;
      amount: number;
      price: number;
    };
  };
}