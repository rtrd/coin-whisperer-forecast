import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, BarChart3, PieChart, TrendingUp, AlertCircle, Brain, Shield, Coins, Info, Star, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WalletConnector } from '@/components/portfolio/WalletConnector';
import { PortfolioOverview } from '@/components/portfolio/PortfolioOverview';
import { AssetAllocation } from '@/components/portfolio/AssetAllocation';
import { EnhancedRiskAnalysis } from '@/components/portfolio/EnhancedRiskAnalysis';
import { PerformanceChart } from '@/components/portfolio/PerformanceChart';
import { 
  mockPortfolioAssets, 
  mockPortfolioMetrics, 
  mockTransactions,
  mockDeFiPositions,
  mockRiskMetrics,
  mockAIRecommendations,
  mockSmartAlerts,
  mockCorrelationData,
  generateMockPortfolioHistory 
} from '@/services/portfolioMockData';
import Footer from '@/components/Footer';

const PortfolioDashboard = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [portfolioHistory, setPortfolioHistory] = useState(generateMockPortfolioHistory());
  const [selectedStrategy, setSelectedStrategy] = useState('moderate');
  const [customStrategy, setCustomStrategy] = useState('');

  const handleWalletConnect = (address: string) => {
    setIsWalletConnected(true);
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
            <label className="text-sm text-gray-300 mb-1 block">Investment Strategy</label>
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
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 pt-6">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white border-0"
              onClick={(e) => {
                e.preventDefault();
                alert('To get real AI insights, connect to Supabase to enable our Gemini AI integration. Click the green Supabase button in the top right.');
              }}
            >
              Generate Suggestions
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {mockAIRecommendations.slice(0, 3).map((rec) => (
          <div key={rec.id} className="p-3 rounded-lg bg-gray-700/60 border border-gray-600/50">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-white text-sm">{rec.title}</h4>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${
                  rec.priority === 'high' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                  rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                  'bg-green-500/20 text-green-300 border border-green-500/30'
                }`}>
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
                  <p className="font-bold text-white text-base">{mockRiskMetrics.sharpeRatio}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">Measures risk-adjusted returns. Higher is better (&gt;1 is good).</p>
              </TooltipContent>
            </Tooltip>

            <div className="p-2 rounded-lg bg-gray-700/40 text-center border border-gray-600/30">
              <p className="text-xs text-gray-300 mb-1">Volatility</p>
              <p className="font-bold text-white text-base">{mockRiskMetrics.volatility}%</p>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 rounded-lg bg-gray-700/40 text-center cursor-help border border-gray-600/30">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <p className="text-xs text-gray-300">Max Drawdown</p>
                    <Info className="h-3 w-3 text-blue-400" />
                  </div>
                  <p className="font-bold text-red-400 text-base">{mockRiskMetrics.maxDrawdown}%</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">Largest peak-to-trough decline. Lower is better.</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 rounded-lg bg-gray-700/40 text-center cursor-help border border-gray-600/30">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <p className="text-xs text-gray-300">Beta</p>
                    <Info className="h-3 w-3 text-blue-400" />
                  </div>
                  <p className="font-bold text-white text-base">{mockRiskMetrics.beta}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">Correlation with market. 1 = moves with market, &gt;1 = more volatile.</p>
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
        {mockTransactions.slice(0, 4).map((tx) => (
          <div key={tx.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-700/60 hover:bg-gray-700/80 transition-colors border border-gray-600/50">
            <div>
              <p className="font-medium text-white text-sm">{tx.type.toUpperCase()}</p>
              <p className="text-xs text-gray-400">{tx.asset} • {new Date(tx.timestamp).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white text-sm">${tx.totalValue.toLocaleString()}</p>
              <p className={`text-xs ${tx.type === 'buy' ? 'text-green-400' : tx.type === 'sell' ? 'text-red-400' : 'text-gray-400'}`}>
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
          <p className="font-bold text-white text-2xl">${mockPortfolioMetrics.totalValue.toLocaleString()}</p>
          <p className="text-sm text-green-400 mt-1">+{mockPortfolioMetrics.totalPnLPercentage.toFixed(1)}%</p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800/80 border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-blue-400" />
            <p className="text-sm text-gray-300 font-medium">24h Change</p>
          </div>
          <p className="font-bold text-white text-2xl">${Math.abs(mockPortfolioMetrics.dayChange).toLocaleString()}</p>
          <p className={`text-sm mt-1 ${mockPortfolioMetrics.dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {mockPortfolioMetrics.dayChange >= 0 ? '+' : ''}{mockPortfolioMetrics.dayChangePercentage.toFixed(1)}%
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800/80 border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coins className="h-4 w-4 text-blue-400" />
            <p className="text-sm text-gray-300 font-medium">Assets</p>
          </div>
          <p className="font-bold text-white text-2xl">{mockPortfolioAssets.length}</p>
          <p className="text-sm text-blue-400 mt-1">Tokens</p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800/80 border-gray-700">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-orange-400" />
            <p className="text-sm text-gray-300 font-medium">Active Alerts</p>
          </div>
          <p className="font-bold text-white text-2xl">{mockSmartAlerts.filter(a => a.isActive).length}</p>
          <p className="text-sm text-orange-400 mt-1">Monitoring</p>
        </CardContent>
      </Card>
    </div>
  );

  if (!isWalletConnected) {
    return (
      <>
        <Helmet>
          <title>Portfolio Dashboard - Connect Your Wallet | CryptoPrediction.ai</title>
          <meta name="description" content="Advanced portfolio tracking dashboard with AI-powered insights, risk analysis, and DeFi integration. Connect your wallet to get started." />
        </Helmet>

        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
              <Link to="/">
                <Button variant="ghost" className="mb-4 text-gray-300 hover:bg-gray-700/50 hover:text-white border-gray-700 bg-gray-800/60">
                  <ArrowLeft className="h-4 w-4 mr-2 text-blue-400" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">Portfolio Dashboard</h1>
                <p className="text-lg text-gray-300">
                  Advanced portfolio tracking with AI-powered insights and professional-grade analytics
                </p>
              </div>

              <WalletConnector onConnect={handleWalletConnect} />

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center bg-gray-800/80 border-gray-700">
                  <CardContent className="pt-6">
                    <BarChart3 className="h-8 w-8 mx-auto mb-3 text-blue-400" />
                    <h3 className="font-semibold mb-2 text-white">Advanced Analytics</h3>
                    <p className="text-sm text-gray-300">Risk metrics, correlations, Sharpe ratio</p>
                  </CardContent>
                </Card>
                <Card className="text-center bg-gray-800/80 border-gray-700">
                  <CardContent className="pt-6">
                    <Brain className="h-8 w-8 mx-auto mb-3 text-blue-400" />
                    <h3 className="font-semibold mb-2 text-white">AI Recommendations</h3>
                    <p className="text-sm text-gray-300">Smart rebalancing and risk management</p>
                  </CardContent>
                </Card>
                <Card className="text-center bg-gray-800/80 border-gray-700">
                  <CardContent className="pt-6">
                    <Coins className="h-8 w-8 mx-auto mb-3 text-blue-400" />
                    <h3 className="font-semibold mb-2 text-white">DeFi Integration</h3>
                    <p className="text-sm text-gray-300">Track yields, staking, liquidity pools</p>
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
      <Helmet>
        <title>Portfolio Dashboard - Advanced Analytics | CryptoPrediction.ai</title>
        <meta name="description" content="Professional portfolio tracking dashboard with real-time analytics, AI recommendations, and DeFi integration." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Link to="/">
                <Button variant="ghost" className="text-gray-300 hover:bg-gray-700/50 hover:text-white border-gray-700 bg-gray-800/60">
                  <ArrowLeft className="h-4 w-4 mr-2 text-blue-400" />
                  Back to Home
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-white">Portfolio Dashboard</h1>
          </div>

          {/* Quick Stats Row */}
          <QuickStats />

          {/* AI Insights - Prominent Section */}
          <div className="mt-6">
            <EnhancedAIInsights />
          </div>

          {/* Main Content Grid */}
          <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Left Column - Chart and Analytics */}
            <div className="space-y-4">
              <PerformanceChart data={portfolioHistory} />
              
              <Tabs defaultValue="holdings" className="space-y-3">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800/80 border border-gray-700">
                  <TabsTrigger value="holdings" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Holdings</TabsTrigger>
                  <TabsTrigger value="defi" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">DeFi</TabsTrigger>
                  <TabsTrigger value="alerts" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Alerts</TabsTrigger>
                </TabsList>

                <TabsContent value="holdings" className="space-y-0">
                  <Card className="bg-gradient-to-br from-gray-800/90 to-gray-700/90 border-2 border-blue-500/30 shadow-xl">
                    <CardHeader className="pb-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-blue-500/30">
                      <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
                        <Coins className="h-5 w-5 text-blue-400" />
                        All Holdings
                        <div className="ml-auto text-sm font-normal text-blue-300">
                          {mockPortfolioAssets.length} Assets
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      {mockPortfolioAssets.map((asset) => (
                        <div key={asset.id} className="flex items-center justify-between py-4 px-4 rounded-xl bg-gradient-to-r from-gray-700/80 to-gray-600/80 hover:from-gray-600/90 hover:to-gray-500/90 transition-all duration-300 border border-gray-500/40 hover:border-blue-400/60 shadow-lg hover:shadow-blue-500/20">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                              {asset.symbol.substring(0, 2)}
                            </div>
                            <div>
                              <p className="font-bold text-white text-base">{asset.symbol}</p>
                              <p className="text-sm text-gray-300">{asset.name}</p>
                              <p className="text-xs text-blue-300 font-medium">{asset.amount.toFixed(4)} tokens</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-white text-lg">${asset.totalValue.toLocaleString()}</p>
                            <p className={`text-xs ${asset.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {asset.pnl >= 0 ? '+' : ''}{asset.pnlPercentage.toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-400">{asset.allocation.toFixed(1)}% allocation</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="defi" className="space-y-0">
                  <Card className="bg-gray-800/80 border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg">DeFi Positions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0">
                      {mockDeFiPositions.map((position) => (
                        <div key={position.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/60 hover:bg-gray-700/80 transition-colors border border-gray-600/50">
                          <div>
                            <p className="font-semibold text-white text-sm">{position.protocol}</p>
                            <p className="text-xs text-gray-400">{position.type.replace('_', ' ')} • {position.asset}</p>
                            <p className="text-xs text-gray-500">Risk: {position.risk}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-white text-sm">${position.totalValue.toLocaleString()}</p>
                            <p className="text-xs text-green-400">{position.apy.toFixed(1)}% APY</p>
                            <p className="text-xs text-gray-400">Rewards: ${position.rewards.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="alerts" className="space-y-0">
                  <Card className="bg-gradient-to-br from-gray-800/90 to-gray-700/90 border-2 border-orange-500/30 shadow-xl">
                    <CardHeader className="pb-4 bg-gradient-to-r from-orange-600/20 to-red-600/20 border-b border-orange-500/30">
                      <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-400" />
                        Smart Alerts & Monitoring
                        <div className="ml-auto text-sm font-normal text-orange-300">
                          {mockSmartAlerts.filter(a => a.isActive).length} Active
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      {/* Add New Alert Button */}
                      <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 border-dashed">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-orange-400" />
                            <span className="text-sm text-orange-300">Create new alert</span>
                          </div>
                          <Button 
                            className="bg-orange-600 hover:bg-orange-700 text-white border-0 text-xs"
                            onClick={(e) => {
                              e.preventDefault();
                              alert('Alert creation feature coming soon! Connect to Supabase to enable alert management.');
                            }}
                          >
                            + Add Alert
                          </Button>
                        </div>
                      </div>

                      {/* Active Alerts */}
                      {mockSmartAlerts.map((alert) => (
                        <div key={alert.id} className="p-3 rounded-lg bg-gray-700/60 hover:bg-gray-700/80 transition-all duration-200 border border-gray-600/50 hover:border-orange-500/30">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`w-3 h-3 rounded-full mt-1 ${
                                alert.isActive 
                                  ? 'bg-green-400 shadow-lg shadow-green-400/20' 
                                  : 'bg-gray-500'
                              }`} />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm font-semibold text-white">{alert.message}</p>
                                  <div className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${
                                    alert.type === 'price' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                    alert.type === 'volume' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                    alert.type === 'portfolio' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                                    'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                                  }`}>
                                    {alert.type}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                  <span>Threshold: ${alert.threshold.toLocaleString()}</span>
                                  {alert.asset && <span>Asset: {alert.asset}</span>}
                                  {alert.lastTriggered && (
                                    <span>Last triggered: {new Date(alert.lastTriggered).toLocaleDateString()}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              <Button 
                                className={`text-xs border-0 ${
                                  alert.isActive 
                                    ? 'bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30' 
                                    : 'bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 border border-gray-500/30'
                                }`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  console.log('Alert status toggled:', alert.id);
                                }}
                              >
                                {alert.isActive ? '● Active' : '○ Inactive'}
                              </Button>
                              <Button 
                                className="bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600 text-xs"
                                onClick={(e) => {
                                  e.preventDefault();
                                  console.log('Alert settings opened:', alert.id);
                                }}
                              >
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Alert Summary */}
                      <div className="mt-4 p-3 rounded-lg bg-gray-800/60 border border-gray-600/50">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-gray-300">{mockSmartAlerts.filter(a => a.isActive).length} Active</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                              <span className="text-gray-300">{mockSmartAlerts.filter(a => !a.isActive).length} Inactive</span>
                            </div>
                          </div>
                          <span className="text-gray-400">Total: {mockSmartAlerts.length} alerts</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-4">
              <EnhancedRiskAnalysis />
              <RecentTransactions />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PortfolioDashboard;