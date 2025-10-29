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
      amount: 12.5,
      currentPrice: 3456.78,
      averageBuyPrice: 2800.0,
      totalValue: 43209.75,
      pnl: 8209.75,
      pnlPercentage: 23.45,
      allocation: 42.5,
      change24h: 5.2,
      volume24h: 12500000000,
      marketCap: 415000000000,
    },
    {
      id: "2",
      symbol: "BTC",
      name: "Bitcoin",
      icon: "₿",
      amount: 0.85,
      currentPrice: 68500.0,
      averageBuyPrice: 52000.0,
      totalValue: 58225.0,
      pnl: 14025.0,
      pnlPercentage: 31.77,
      allocation: 28.3,
      change24h: 3.8,
      volume24h: 28000000000,
      marketCap: 1350000000000,
    },
    {
      id: "3",
      symbol: "SOL",
      name: "Solana",
      icon: "◎",
      amount: 450.0,
      currentPrice: 145.67,
      averageBuyPrice: 98.0,
      totalValue: 65551.5,
      pnl: 21451.5,
      pnlPercentage: 48.64,
      allocation: 18.7,
      change24h: 8.9,
      volume24h: 2100000000,
      marketCap: 67000000000,
    },
    {
      id: "4",
      symbol: "LINK",
      name: "Chainlink",
      icon: "🔗",
      amount: 1200.0,
      currentPrice: 14.23,
      averageBuyPrice: 12.5,
      totalValue: 17076.0,
      pnl: 2076.0,
      pnlPercentage: 13.84,
      allocation: 6.8,
      change24h: 2.1,
      volume24h: 580000000,
      marketCap: 8300000000,
    },
    {
      id: "5",
      symbol: "AVAX",
      name: "Avalanche",
      icon: "🔺",
      amount: 320.0,
      currentPrice: 38.92,
      averageBuyPrice: 35.0,
      totalValue: 12454.4,
      pnl: 1254.4,
      pnlPercentage: 11.2,
      allocation: 3.7,
      change24h: 1.5,
      volume24h: 420000000,
      marketCap: 15200000000,
    },
  ],
  portfolioSummary: {
    totalValue: 196516.65,
    totalPnL: 47016.65,
    totalPnLPercentage: 31.44,
    assets: 5,
    change24h: {
      absolute: 8234.56,
      percent: 4.37,
    },
  },
  transactions: [
    {
      id: "1",
      type: "buy",
      asset: "ETH",
      amount: 5.0,
      price: 3450.0,
      totalValue: 17250.0,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      hash: "0x1234...5678",
      fee: 12.5,
      status: "completed",
    },
    {
      id: "2",
      type: "sell",
      asset: "SOL",
      amount: 100.0,
      price: 148.5,
      totalValue: 14850.0,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      hash: "0x2345...6789",
      fee: 8.2,
      status: "completed",
    },
    {
      id: "3",
      type: "buy",
      asset: "BTC",
      amount: 0.25,
      price: 67800.0,
      totalValue: 16950.0,
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      hash: "0x3456...7890",
      fee: 15.3,
      status: "completed",
    },
    {
      id: "4",
      type: "buy",
      asset: "LINK",
      amount: 500.0,
      price: 14.1,
      totalValue: 7050.0,
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      hash: "0x4567...8901",
      fee: 5.5,
      status: "completed",
    },
    {
      id: "5",
      type: "buy",
      asset: "AVAX",
      amount: 200.0,
      price: 38.5,
      totalValue: 7700.0,
      timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      hash: "0x5678...9012",
      fee: 6.8,
      status: "completed",
    },
  ],
  defiPositions: [
    {
      id: "1",
      protocol: "Aave",
      type: "lending",
      asset: "USDC",
      amount: 15000.0,
      apy: 4.2,
      rewards: 52.5,
      totalValue: 15052.5,
      risk: "low",
    },
    {
      id: "2",
      protocol: "Uniswap",
      type: "liquidity",
      asset: "ETH-USDC",
      amount: 8500.0,
      apy: 12.8,
      rewards: 91.33,
      totalValue: 8591.33,
      risk: "medium",
    },
  ],
};

// Mock portfolio history
const mockPortfolioHistory = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const baseValue = 180000;
  const variation = Math.sin(i / 5) * 15000 + Math.random() * 5000;
  const totalValue = baseValue + variation;
  const pnl = totalValue - 150000;

  return {
    timestamp: date,
    date: date,
    totalValue,
    pnl,
    assets: {
      ETH: {
        value: totalValue * 0.425,
        amount: 12.5,
        price: (totalValue * 0.425) / 12.5,
      },
      BTC: {
        value: totalValue * 0.283,
        amount: 0.85,
        price: (totalValue * 0.283) / 0.85,
      },
      SOL: {
        value: totalValue * 0.187,
        amount: 450,
        price: (totalValue * 0.187) / 450,
      },
      LINK: {
        value: totalValue * 0.068,
        amount: 1200,
        price: (totalValue * 0.068) / 1200,
      },
      AVAX: {
        value: totalValue * 0.037,
        amount: 320,
        price: (totalValue * 0.037) / 320,
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
      "Your ETH allocation is 7% above target. Consider taking profits and diversifying into underweight positions.",
    priority: "high",
    potential_impact: 3.5,
    reasoning:
      "Maintaining target allocation reduces concentration risk and improves risk-adjusted returns.",
    actions: ["Sell 2 ETH (~$6,900)", "Buy additional SOL or AVAX positions"],
  },
  {
    id: "2",
    type: "risk_management",
    title: "Set Stop-Loss on SOL Position",
    description:
      "SOL has gained 48.6%. Consider setting a trailing stop-loss to protect profits.",
    priority: "medium",
    potential_impact: 5.2,
    reasoning:
      "Protecting gains during volatile periods helps preserve portfolio value.",
    actions: ["Set 15% trailing stop-loss on SOL", "Monitor resistance levels"],
  },
  {
    id: "3",
    type: "diversification",
    title: "Consider Adding Stablecoin Position",
    description:
      "Portfolio has 0% stablecoin allocation. Adding 10-15% could reduce volatility.",
    priority: "medium",
    potential_impact: 2.8,
    reasoning:
      "Stablecoins provide liquidity and downside protection during market corrections.",
    actions: [
      "Allocate 10% to USDC or DAI",
      "Deploy stables in yield opportunities (Aave, Compound)",
    ],
  },
];

// Mock alerts
const mockAlerts = [
  {
    id: "1",
    type: "price",
    asset: "ETH",
    condition: "above",
    threshold: 3500,
    isActive: true,
    lastTriggered: new Date(Date.now() - 3 * 60 * 60 * 1000),
    message: "ETH price crossed $3,500",
  },
  {
    id: "2",
    type: "portfolio",
    condition: "total_value",
    threshold: 200000,
    isActive: true,
    message: "Portfolio approaching $200,000",
  },
  {
    id: "3",
    type: "volume",
    asset: "SOL",
    condition: "spike",
    threshold: 50,
    isActive: true,
    message: "SOL volume spike detected",
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
