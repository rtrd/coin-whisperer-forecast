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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <Brain className="h-5 w-5 text-blue-400" />
            AI Portfolio Insights
            <Star className="h-4 w-4 text-yellow-400" />
          </CardTitle>
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
        <div className="mt-2 space-y-2">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Investment Strategy</label>
            <select 
              className="max-w-xs bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              onChange={(e) => setSelectedStrategy(e.target.value)}
              value={selectedStrategy}
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          {selectedStrategy === 'custom' && (
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Custom Strategy</label>
              <input 
                type="text" 
                placeholder="Describe your custom strategy..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400"
                value={customStrategy}
                onChange={(e) => setCustomStrategy(e.target.value)}
              />
            </div>
          )}
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
                  <Card className="bg-gray-800/80 border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg">All Holdings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0">
                      {mockPortfolioAssets.map((asset) => (
                        <div key={asset.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-700/60 hover:bg-gray-700/80 transition-colors border border-gray-600/50">
                          <div>
                            <p className="font-semibold text-white text-sm">{asset.symbol}</p>
                            <p className="text-xs text-gray-400">{asset.name}</p>
                            <p className="text-xs text-gray-500">{asset.amount.toFixed(4)} tokens</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-white text-sm">${asset.totalValue.toLocaleString()}</p>
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
                  <Card className="bg-gray-800/80 border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg">Smart Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0">
                      {mockSmartAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/60 hover:bg-gray-700/80 transition-colors border border-gray-600/50">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${alert.isActive ? 'bg-green-400' : 'bg-gray-500'}`} />
                            <div>
                              <p className="text-sm font-semibold text-white">{alert.message}</p>
                              <p className="text-xs text-gray-400">{alert.type} alert • Threshold: {alert.threshold}</p>
                              {alert.lastTriggered && (
                                <p className="text-xs text-gray-500">Last: {new Date(alert.lastTriggered).toLocaleString()}</p>
                              )}
                            </div>
                          </div>
                          <Button 
                            className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 text-xs"
                            onClick={(e) => {
                              e.preventDefault();
                              console.log('Alert button clicked:', alert.id);
                            }}
                          >
                            {alert.isActive ? 'Active' : 'Inactive'}
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-4">
              <EnhancedRiskMetrics />
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