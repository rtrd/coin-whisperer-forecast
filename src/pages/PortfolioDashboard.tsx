import { useState, useEffect } from "react";
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
import { WalletConnector } from "@/components/portfolio/WalletConnector";
import { EnhancedRiskAnalysis } from "@/components/portfolio/EnhancedRiskAnalysis";
import { PerformanceChart } from "@/components/portfolio/PerformanceChart";
import { HoldingsTable } from "@/components/portfolio/HoldingsTable";
import { mockRiskMetrics } from "@/services/portfolioMockData";
import axios from "axios";
import Alert from "@/components/Alert";

import {
  getPortfolioData,
  getAIPortfolioInsights,
  parseAIRecommendations,
} from "@/services/portfolioData";
import Footer from "@/components/Footer";
import { setAddressInStorage } from "@/lib/storage";
import { useDisconnect } from "@reown/appkit/react";

const BASE_URL = import.meta.env.VITE_API_URL;

export const PortfolioDashboard = () => {
  const seoData = generatePortfolioDashboardSEO();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [portfolioHistory, setPortfolioHistory] = useState<any>();
  const [selectedStrategy, setSelectedStrategy] = useState("moderate");
  const [walletAddress, setConnectedwalletAddress] = useState<any>(null);
  const [chainId, setChainId] = useState<any>(null);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [aiRecommendations, setaiRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [defiPosition, setDefiPosition] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  const { disconnect } = useDisconnect();

  const fetchAlerts = async (address: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/alerts?address=${address}`);
      setAlerts(Array.isArray(res?.data?.data) ? res?.data?.data : []);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
      setAlerts([]);
    }
  };

  const handleWalletConnect = async (address: string, chainId: number) => {
    setIsWalletConnected(true);
    setConnectedwalletAddress(address);
    setAddressInStorage(address); // Store address in localStorage
    setChainId(chainId);
    try {
      setLoadingPortfolio(true);
      const data = await getPortfolioData(address, chainId);
      setPortfolioData(data);
      setPortfolioHistory(data.portfolioHistory);
      setDefiPosition(data.defiPositions);
      setLoadingPortfolio(false);
      await fetchAlerts(address);
    } catch (error) {
      console.error("Failed to fetch portfolio data:", error);
      setPortfolioError("Failed to load portfolio data");
      setLoadingPortfolio(false);
    }
  };

  const GetAIPortfolioInsights = async (
    portfolioData: any,
    strategy: string,
    walletAddress: string
  ) => {
    try {
      setLoading(true);
      const aIPortfolioInsightsData = await getAIPortfolioInsights(
        portfolioData.portfolioAssets,
        strategy,
        walletAddress
      );
      const parsed = await parseAIRecommendations(aIPortfolioInsightsData);
      setaiRecommendations(parsed);
      console.log("aIPortfolioInsightsData", aIPortfolioInsightsData);
    } catch (err) {
      console.log("Error fetching AI insights:", err);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced AI Insights - More Prominent
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
              onClick={(e) => {
                GetAIPortfolioInsights(
                  portfolioData,
                  selectedStrategy,
                  walletAddress
                );
              }}
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
        {portfolioData.transactions.slice(0, 15).map((tx) => (
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
            ${portfolioData.portfolioSummary.totalValue.toLocaleString()}
          </p>
          <p className="text-sm text-green-400 mt-1">
            +{portfolioData.portfolioSummary.totalValue.toFixed(1)}%
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800/80 border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-blue-400" />
            <p className="text-sm text-gray-300 font-medium">24h Change</p>
          </div>

          {/* Absolute Change in $ */}
          <p className="font-bold text-white text-2xl">
            $
            {Math.abs(
              portfolioData.portfolioSummary.change24h.absolute
            ).toLocaleString()}
          </p>

          {/* Percentage Change */}
          <p
            className={`text-sm mt-1 ${
              portfolioData.portfolioSummary.change24h.percent >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {portfolioData.portfolioSummary.change24h.percent >= 0 ? "+" : ""}
            {portfolioData.portfolioSummary.change24h.percent.toFixed(1)}%
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
            {portfolioData.portfolioSummary.assets}
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
            {alerts.filter((a) => a.isActive).length}
          </p>
          <p className="text-sm text-orange-400 mt-1">Monitoring</p>
        </CardContent>
      </Card>
    </div>
  );

  if (!isWalletConnected) {
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

            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Portfolio Dashboard
                </h1>
                <p className="text-lg text-gray-300">
                  Advanced portfolio tracking with AI-powered insights and
                  professional-grade analytics
                </p>
              </div>

              <WalletConnector onConnect={handleWalletConnect} />

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center bg-gray-800/80 border-gray-700">
                  <CardContent className="pt-6">
                    <BarChart3 className="h-8 w-8 mx-auto mb-3 text-blue-400" />
                    <h3 className="font-semibold mb-2 text-white">
                      Advanced Analytics
                    </h3>
                    <p className="text-sm text-gray-300">
                      Risk metrics, correlations, Sharpe ratio
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center bg-gray-800/80 border-gray-700">
                  <CardContent className="pt-6">
                    <Brain className="h-8 w-8 mx-auto mb-3 text-blue-400" />
                    <h3 className="font-semibold mb-2 text-white">
                      AI Recommendations
                    </h3>
                    <p className="text-sm text-gray-300">
                      Smart rebalancing and risk management
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center bg-gray-800/80 border-gray-700">
                  <CardContent className="pt-6">
                    <Coins className="h-8 w-8 mx-auto mb-3 text-blue-400" />
                    <h3 className="font-semibold mb-2 text-white">
                      DeFi Integration
                    </h3>
                    <p className="text-sm text-gray-300">
                      Track yields, staking, liquidity pools
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <EnhancedSEOHead seoData={seoData} />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Link to="/">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:bg-gray-700/50 hover:text-white border-gray-700 bg-gray-800/60"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 text-blue-400" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">
                Portfolio Dashboard
              </h1>

              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={async () => {
                  console.log('Disconnect wallet button is triggered')
                  window.location.reload();
                  await disconnect();
                }}
              >
                Disconnect Wallet
              </Button>
            </div>
          </div>

          {/* Quick Stats Row */}
          {portfolioData != null ? <QuickStats /> : null}

          {/* AI Insights - Prominent Section */}
          <div className="mt-6">
            <EnhancedAIInsights />
          </div>

          {/* Main Content Grid */}
          <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Left Column - Chart and Analytics */}
            <div className="space-y-4">
              {portfolioHistory != null && portfolioHistory != undefined ? (
                <PerformanceChart data={portfolioHistory} />
              ) : null}

              <Tabs defaultValue="alerts" className="space-y-3">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800/80 border border-gray-700">
                  <TabsTrigger
                    value="holdings"
                    className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                  >
                    Holdings
                  </TabsTrigger>
                  <TabsTrigger
                    value="defi"
                    className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                  >
                    DeFi
                  </TabsTrigger>
                  <TabsTrigger
                    value="alerts"
                    className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                  >
                    Alerts
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="holdings" className="space-y-0">
                  {portfolioData != null ? (
                    <HoldingsTable assets={portfolioData.portfolioAssets} />
                  ) : null}
                </TabsContent>

                <TabsContent value="defi" className="space-y-0">
                  <Card className="bg-gray-800/80 border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg">
                        DeFi Positions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0">
                      {defiPosition != null ? (
                        defiPosition.map((position) => (
                          <div
                            key={position.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-700/60 hover:bg-gray-700/80 transition-colors border border-gray-600/50"
                          >
                            <div>
                              <p className="font-semibold text-white text-sm">
                                {position.protocol}
                              </p>
                              <p className="text-xs text-gray-400">
                                {position.type.replace("_", " ")} •{" "}
                                {position.asset}
                              </p>
                              <p className="text-xs text-gray-500">
                                Risk: {position.risk}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-white text-sm">
                                ${position.totalValue.toLocaleString()}
                              </p>
                              <p className="text-xs text-green-400">
                                {position.apy.toFixed(1)}% APY
                              </p>
                              <p className="text-xs text-gray-400">
                                Rewards: ${position.rewards.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-white-400">
                          No DeFi positions found.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="alerts" className="space-y-0">
                  <Alert
                    alerts={alerts as any}
                    setAlerts={setAlerts as any}
                    chainId={chainId}
                    walletAddress={walletAddress}
                    fetchAlerts={fetchAlerts}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-4">
              {portfolioData != null ? (
                <EnhancedRiskAnalysis riskMetrics={portfolioData.riskMetrics} />
              ) : null}
              {portfolioData != null ? <RecentTransactions /> : null}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PortfolioDashboard;
