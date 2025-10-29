import { useState } from "react";
import { EnhancedSEOHead } from "@/components/seo/EnhancedSEOHead";
import { generatePortfolioDashboardSEO } from "@/utils/pageSeo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Brain,
  Shield,
  Coins,
  Info,
  Star,
  Target,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { EnhancedRiskAnalysis } from "@/components/portfolio/EnhancedRiskAnalysis";
import { PerformanceChart } from "@/components/portfolio/PerformanceChart";
import { HoldingsTable } from "@/components/portfolio/HoldingsTable";
import { AssetAllocation } from "@/components/portfolio/AssetAllocation";
import { mockRiskMetrics } from "@/services/portfolioMockData";

import Footer from "@/components/Footer";

// Mock portfolio data
const mockPortfolioData = {
  portfolioAssets: [
    {
      id: "1",
      symbol: "ETH",
      name: "Ethereum",
      icon: "⟠",
      amount: 0.65,
      currentPrice: 2680,
      averageBuyPrice: 2450,
      totalValue: 1742,
      pnl: 149.5,
      pnlPercentage: 9.4,
      allocation: 38.5,
      change24h: 1.8,
      volume24h: 8900000000,
      marketCap: 322400000000,
    },
    {
      id: "2",
      symbol: "BTC",
      name: "Bitcoin",
      icon: "₿",
      amount: 0.04,
      currentPrice: 43250,
      averageBuyPrice: 38900,
      totalValue: 1730,
      pnl: 174,
      pnlPercentage: 11.2,
      allocation: 38.2,
      change24h: 2.3,
      volume24h: 15600000000,
      marketCap: 847500000000,
    },
    {
      id: "3",
      symbol: "SOL",
      name: "Solana",
      icon: "◎",
      amount: 5.8,
      currentPrice: 105.8,
      averageBuyPrice: 95.2,
      totalValue: 613.64,
      pnl: 61.48,
      pnlPercentage: 11.1,
      allocation: 13.6,
      change24h: 4.2,
      volume24h: 1200000000,
      marketCap: 47800000000,
    },
    {
      id: "4",
      symbol: "LINK",
      name: "Chainlink",
      icon: "🔗",
      amount: 16.5,
      currentPrice: 17.85,
      averageBuyPrice: 19.2,
      totalValue: 294.53,
      pnl: -22.28,
      pnlPercentage: -7.0,
      allocation: 6.5,
      change24h: -1.2,
      volume24h: 450000000,
      marketCap: 10500000000,
    },
    {
      id: "5",
      symbol: "MATIC",
      name: "Polygon",
      icon: "⬡",
      amount: 160,
      currentPrice: 0.92,
      averageBuyPrice: 1.15,
      totalValue: 147.2,
      pnl: -36.8,
      pnlPercentage: -20.0,
      allocation: 3.2,
      change24h: 0.8,
      volume24h: 320000000,
      marketCap: 8900000000,
    },
  ],
  portfolioSummary: {
    totalValue: 4527.37,
    totalPnL: 325.9,
    totalPnLPercentage: 7.8,
    assets: 5,
    change24h: {
      absolute: 98.45,
      percent: 2.22,
    },
  },
  transactions: [
    {
      id: "1",
      type: "buy",
      asset: "ETH",
      amount: 0.5,
      price: 2650,
      totalValue: 1325,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      hash: "0x1234...5678",
      fee: 1.85,
      status: "completed",
    },
    {
      id: "2",
      type: "sell",
      asset: "SOL",
      amount: 2.5,
      price: 108.5,
      totalValue: 271.25,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      hash: "0x2345...6789",
      fee: 0.88,
      status: "completed",
    },
    {
      id: "3",
      type: "buy",
      asset: "BTC",
      amount: 0.02,
      price: 42800,
      totalValue: 856,
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      hash: "0x3456...7890",
      fee: 2.50,
      status: "completed",
    },
    {
      id: "4",
      type: "buy",
      asset: "LINK",
      amount: 10,
      price: 17.9,
      totalValue: 179,
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      hash: "0x4567...8901",
      fee: 0.55,
      status: "completed",
    },
    {
      id: "5",
      type: "buy",
      asset: "MATIC",
      amount: 100,
      price: 1.12,
      totalValue: 112,
      timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      hash: "0x5678...9012",
      fee: 0.38,
      status: "completed",
    },
  ],
  defiPositions: [
    {
      id: "1",
      protocol: "Aave",
      type: "lending",
      asset: "USDC",
      amount: 850,
      apy: 8.2,
      rewards: 4.82,
      totalValue: 854.82,
      risk: "low",
    },
    {
      id: "2",
      protocol: "Uniswap",
      type: "liquidity",
      asset: "ETH-USDC",
      amount: 325.50,
      apy: 12.4,
      rewards: 6.85,
      totalValue: 332.35,
      risk: "medium",
    },
  ],
};

// Mock portfolio history
const mockPortfolioHistory = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const baseValue = 4200;
  const variation = Math.sin(i / 5) * 350 + Math.random() * 150;
  const totalValue = baseValue + variation;
  const pnl = totalValue - 4200;

  return {
    timestamp: date,
    date: date,
    totalValue,
    pnl,
    assets: {
      ETH: {
        value: totalValue * 0.385,
        amount: 0.65,
        price: (totalValue * 0.385) / 0.65,
      },
      BTC: {
        value: totalValue * 0.382,
        amount: 0.04,
        price: (totalValue * 0.382) / 0.04,
      },
      SOL: {
        value: totalValue * 0.136,
        amount: 5.8,
        price: (totalValue * 0.136) / 5.8,
      },
      LINK: {
        value: totalValue * 0.065,
        amount: 16.5,
        price: (totalValue * 0.065) / 16.5,
      },
      MATIC: {
        value: totalValue * 0.032,
        amount: 160,
        price: (totalValue * 0.032) / 160,
      },
    },
  };
});

// Mock AI recommendations
const mockAIRecommendations = [
  {
    id: "1",
    type: "rebalance",
    title: "Rebalance Portfolio to Target Allocation",
    description:
      "Your BTC allocation is 5.8% above target. Consider taking profits and diversifying.",
    priority: "medium",
    potential_impact: 8.5,
    reasoning:
      "Maintaining target allocation reduces concentration risk and improves risk-adjusted returns.",
    actions: ["Reduce BTC position by 0.008 BTC (~$350)", "Increase stablecoin allocation to 15%"],
  },
  {
    id: "2",
    type: "risk_management",
    title: "Set Stop-Loss Orders for Volatile Assets",
    description:
      "Your SOL and MATIC positions have high volatility. Consider protective measures.",
    priority: "high",
    potential_impact: 12.0,
    reasoning:
      "High correlation with market downturns could amplify losses.",
    actions: ["Set trailing stop-loss at 15% for SOL position", "Consider reducing MATIC exposure by 30%"],
  },
  {
    id: "3",
    type: "diversification",
    title: "Add Real World Assets (RWA) Exposure",
    description:
      "Consider adding tokenized assets for portfolio diversification.",
    priority: "low",
    potential_impact: 5.2,
    reasoning:
      "Low correlation with crypto markets provides hedge against volatility.",
    actions: [
      "Allocate 5-10% to tokenized real estate",
      "Consider treasury bill tokens for yield",
    ],
  },
];

// Mock alerts
const mockAlerts = [
  {
    id: "1",
    type: "price",
    asset: "BTC",
    condition: "above",
    threshold: 45000,
    isActive: true,
    lastTriggered: undefined,
    message: "Bitcoin reached your target price of $45,000",
  },
  {
    id: "2",
    type: "portfolio",
    condition: "total_value_change",
    threshold: -10,
    isActive: true,
    lastTriggered: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    message: "Portfolio value dropped by more than 10%",
  },
  {
    id: "3",
    type: "volume",
    asset: "ETH",
    condition: "above",
    threshold: 10000000000,
    isActive: false,
    lastTriggered: undefined,
    message: "Ethereum volume exceeded $10B in 24h",
  },
];

export const PortfolioDashboardMockup = () => {
  const seoData = generatePortfolioDashboardSEO();
  const [selectedStrategy, setSelectedStrategy] = useState("moderate");
  const [aiRecommendations, setaiRecommendations] = useState(
    mockAIRecommendations
  );
  const [loading, setLoading] = useState(false);

  // Mock wallet info
  const mockWalletAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb3";
  const mockChainId = 1; // Ethereum mainnet

  const GetAIPortfolioInsights = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setaiRecommendations(mockAIRecommendations);
    setLoading(false);
  };

  // Enhanced AI Insights
  const EnhancedAIInsights = () => (
    <Card className="bg-gray-800/80 border-gray-700 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <Brain className="h-5 w-5 text-blue-400" />
            AI Portfolio Insights
            <Star className="h-4 w-4 text-yellow-400" />
          </CardTitle>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <label className="text-sm text-gray-300 mb-1 block">
              Investment Strategy
            </label>
            <div className="relative">
              <select
                className="w-40 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pr-8 text-white text-sm appearance-none"
                onChange={(e) => setSelectedStrategy(e.target.value)}
                value={selectedStrategy}
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 pt-6">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white border-0"
              onClick={GetAIPortfolioInsights}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                  Loading
                </>
              ) : (
                "Generate Suggestions"
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      {aiRecommendations !== null && aiRecommendations.length > 0 ? (
        <CardContent className="space-y-3 pt-0">
          {aiRecommendations.slice(0, 3).map((rec) => (
            <div
              key={rec.id}
              className="p-3 rounded-lg bg-gray-700/60 border border-gray-600/50"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-white text-sm">
                  {rec.title}
                </h4>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${
                      rec.priority === "high"
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : rec.priority === "medium"
                        ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                        : "bg-green-500/20 text-green-300 border border-green-500/30"
                    }`}
                  >
                    {rec.priority}
                  </span>
                  <Zap className="h-3 w-3 text-blue-400" />
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-2">{rec.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Target className="h-3 w-3" />
                Impact: +{rec.potential_impact}%
              </div>
            </div>
          ))}
        </CardContent>
      ) : null}
    </Card>
  );

  // Enhanced Risk Metrics with Tooltips
  const EnhancedRiskMetrics = () => (
    <TooltipProvider>
      <Card className="bg-gray-800/80 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <Shield className="h-4 w-4 text-blue-400" />
            Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 rounded-lg bg-gray-700/40 text-center cursor-help border border-gray-600/30">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <p className="text-xs text-gray-300">Sharpe Ratio</p>
                    <Info className="h-3 w-3 text-blue-400" />
                  </div>
                  <p className="font-bold text-white text-base">
                    {mockRiskMetrics.sharpeRatio}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  Measures risk-adjusted returns. Higher is better (&gt;1 is
                  good).
                </p>
              </TooltipContent>
            </Tooltip>

            <div className="p-2 rounded-lg bg-gray-700/40 text-center border border-gray-600/30">
              <p className="text-xs text-gray-300 mb-1">Volatility</p>
              <p className="font-bold text-white text-base">
                {mockRiskMetrics.volatility}%
              </p>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 rounded-lg bg-gray-700/40 text-center cursor-help border border-gray-600/30">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <p className="text-xs text-gray-300">Max Drawdown</p>
                    <Info className="h-3 w-3 text-blue-400" />
                  </div>
                  <p className="font-bold text-red-400 text-base">
                    {mockRiskMetrics.maxDrawdown}%
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  Largest peak-to-trough decline. Lower is better.
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 rounded-lg bg-gray-700/40 text-center cursor-help border border-gray-600/30">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <p className="text-xs text-gray-300">Beta</p>
                    <Info className="h-3 w-3 text-blue-400" />
                  </div>
                  <p className="font-bold text-white text-base">
                    {mockRiskMetrics.beta}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  Correlation with market. 1 = moves with market, &gt;1 = more
                  volatile.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );

  // Recent Transactions
  const RecentTransactions = () => (
    <Card className="bg-gray-800/80 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <TrendingUp className="h-4 w-4 text-blue-400" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {mockPortfolioData.transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-700/60 hover:bg-gray-700/80 transition-colors border border-gray-600/50"
          >
            <div>
              <p className="font-medium text-white text-sm">
                {tx.type.toUpperCase()}
              </p>
              <p className="text-xs text-gray-400">
                {tx.asset} • {new Date(tx.timestamp).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white text-sm">
                {tx.totalValue > 0
                  ? `$${tx.totalValue.toLocaleString()}`
                  : "$0"}
              </p>
              <p
                className={`text-xs ${
                  tx.type === "buy"
                    ? "text-green-400"
                    : tx.type === "sell"
                    ? "text-red-400"
                    : "text-gray-400"
                }`}
              >
                {tx.amount.toFixed(4)} {tx.asset}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  // Enhanced Quick Stats Component
  const QuickStats = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gray-800/80 border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <p className="text-sm text-gray-300 font-medium">Total Value</p>
          </div>
          <p className="font-bold text-white text-2xl">
            ${mockPortfolioData.portfolioSummary.totalValue.toLocaleString()}
          </p>
          <p className="text-sm text-green-400 mt-1">
            +{mockPortfolioData.portfolioSummary.totalPnLPercentage.toFixed(1)}
            %
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800/80 border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-blue-400" />
            <p className="text-sm text-gray-300 font-medium">24h Change</p>
          </div>
          <p className="font-bold text-white text-2xl">
            $
            {Math.abs(
              mockPortfolioData.portfolioSummary.change24h.absolute
            ).toLocaleString()}
          </p>
          <p
            className={`text-sm mt-1 ${
              mockPortfolioData.portfolioSummary.change24h.percent >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {mockPortfolioData.portfolioSummary.change24h.percent >= 0
              ? "+"
              : ""}
            {mockPortfolioData.portfolioSummary.change24h.percent.toFixed(1)}%
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800/80 border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coins className="h-4 w-4 text-blue-400" />
            <p className="text-sm text-gray-300 font-medium">Assets</p>
          </div>
          <p className="font-bold text-white text-2xl">
            {mockPortfolioData.portfolioSummary.assets}
          </p>
          <p className="text-sm text-blue-400 mt-1">Tokens</p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800/80 border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-orange-400" />
            <p className="text-sm text-gray-300 font-medium">Active Alerts</p>
          </div>
          <p className="font-bold text-white text-2xl">
            {mockAlerts.filter((a) => a.isActive).length}
          </p>
          <p className="text-sm text-orange-400 mt-1">Monitoring</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <EnhancedSEOHead seoData={seoData} />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <Link to="/">
              <Button
                variant="ghost"
                className="mb-4 text-gray-300 hover:bg-gray-700/50 hover:text-white border-gray-700 bg-gray-800/60"
              >
                <ArrowLeft className="h-4 w-4 mr-2 text-blue-400" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Header with Wallet Info */}
          <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  AI Portfolio Analysis
                </h1>
                <p className="text-gray-300">
                  Advanced portfolio tracking with AI-powered insights
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-300">Connected</p>
                </div>
                <p className="text-xs text-gray-400 font-mono">
                  {mockWalletAddress.slice(0, 6)}...{mockWalletAddress.slice(-4)}
                </p>
                <p className="text-xs text-blue-400 mt-1">Ethereum Mainnet</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <QuickStats />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              <PerformanceChart data={mockPortfolioHistory} />

              <Tabs defaultValue="holdings" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800/80 border border-gray-700">
                  <TabsTrigger value="holdings">Holdings</TabsTrigger>
                  <TabsTrigger value="defi">DeFi</TabsTrigger>
                  <TabsTrigger value="alerts">Alerts</TabsTrigger>
                </TabsList>

                <TabsContent value="holdings" className="mt-4">
                  <HoldingsTable assets={mockPortfolioData.portfolioAssets} />
                </TabsContent>

                <TabsContent value="defi" className="mt-4">
                  <Card className="bg-gray-800/80 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">
                        DeFi Positions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {mockPortfolioData.defiPositions.map((position) => (
                        <div
                          key={position.id}
                          className="p-4 rounded-lg bg-gray-700/60 border border-gray-600/50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold text-white">
                                {position.protocol}
                              </p>
                              <p className="text-sm text-gray-400">
                                {position.type} • {position.asset}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-white">
                                ${position.totalValue.toLocaleString()}
                              </p>
                              <p className="text-sm text-green-400">
                                {position.apy}% APY
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Rewards</span>
                            <span className="text-green-400">
                              ${position.rewards.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="alerts" className="mt-4">
                  <Card className="bg-gray-800/80 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <AlertCircle className="h-4 w-4 text-orange-400" />
                        Active Alerts
                        <div className="ml-auto text-sm font-normal text-orange-300">
                          {mockAlerts.filter((a) => a.isActive).length} Active
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {mockAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="p-3 rounded-lg bg-gray-700/60 hover:bg-gray-700/80 transition-all duration-200 border border-gray-600/50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div
                                className={`w-3 h-3 rounded-full mt-1 ${
                                  alert.isActive
                                    ? "bg-green-400 shadow-lg shadow-green-400/20"
                                    : "bg-gray-500"
                                }`}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm font-semibold text-white">
                                    {alert.message}
                                  </p>
                                  <div
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${
                                      alert.type === "price"
                                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                        : alert.type === "volume"
                                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                        : alert.type === "portfolio"
                                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                        : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                                    }`}
                                  >
                                    {alert.type}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                  {alert.threshold && (
                                    <span>
                                      Threshold: ${alert.threshold.toLocaleString()}
                                    </span>
                                  )}
                                  {alert.asset && <span>Asset: {alert.asset}</span>}
                                  {alert.lastTriggered && (
                                    <span>
                                      Last triggered:{" "}
                                      {new Date(alert.lastTriggered).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              <Button
                                className={`text-xs border-0 ${
                                  alert.isActive
                                    ? "bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30"
                                    : "bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 border border-gray-500/30"
                                }`}
                              >
                                {alert.isActive ? "● Active" : "○ Inactive"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Insights & Risk */}
            <div className="space-y-6">
              <EnhancedAIInsights />
              <EnhancedRiskMetrics />
              <AssetAllocation assets={mockPortfolioData.portfolioAssets} />
              <RecentTransactions />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PortfolioDashboardMockup;
