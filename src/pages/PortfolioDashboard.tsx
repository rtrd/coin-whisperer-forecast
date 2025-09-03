import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BarChart3, PieChart, TrendingUp, AlertCircle, Brain, Shield, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WalletConnector } from '@/components/portfolio/WalletConnector';
import { PortfolioOverview } from '@/components/portfolio/PortfolioOverview';
import { AssetAllocation } from '@/components/portfolio/AssetAllocation';
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

  const handleWalletConnect = (address: string) => {
    setIsWalletConnected(true);
  };

  // Compact Holdings Component
  const CompactHoldings = () => (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Coins className="h-4 w-4 text-blue-400" />
          Holdings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {mockPortfolioAssets.slice(0, 4).map((asset) => (
          <div key={asset.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-lg">{asset.icon}</span>
              <div>
                <p className="font-medium text-white text-sm">{asset.symbol}</p>
                <p className="text-xs text-gray-400">{asset.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white text-sm">${asset.totalValue.toLocaleString()}</p>
              <p className={`text-xs ${asset.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {asset.pnl >= 0 ? '+' : ''}{asset.pnlPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  // Compact Risk Metrics
  const CompactRiskMetrics = () => (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Shield className="h-4 w-4 text-blue-400" />
          Risk Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 rounded-md bg-gray-700/30 text-center">
            <p className="text-xs text-gray-400">Sharpe Ratio</p>
            <p className="font-bold text-white">{mockRiskMetrics.sharpeRatio}</p>
          </div>
          <div className="p-2 rounded-md bg-gray-700/30 text-center">
            <p className="text-xs text-gray-400">Volatility</p>
            <p className="font-bold text-white">{mockRiskMetrics.volatility}%</p>
          </div>
          <div className="p-2 rounded-md bg-gray-700/30 text-center">
            <p className="text-xs text-gray-400">Max Drawdown</p>
            <p className="font-bold text-red-400">{mockRiskMetrics.maxDrawdown}%</p>
          </div>
          <div className="p-2 rounded-md bg-gray-700/30 text-center">
            <p className="text-xs text-gray-400">Beta</p>
            <p className="font-bold text-white">{mockRiskMetrics.beta}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Compact AI Insights
  const CompactAIInsights = () => (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Brain className="h-4 w-4 text-blue-400" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockAIRecommendations.slice(0, 2).map((rec) => (
          <div key={rec.id} className="p-3 rounded-md bg-gray-700/30 border-l-2 border-blue-400">
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-medium text-white text-sm">{rec.title}</h4>
              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                rec.priority === 'high' ? 'bg-red-900/60 text-red-300' :
                rec.priority === 'medium' ? 'bg-yellow-900/60 text-yellow-300' :
                'bg-green-900/60 text-green-300'
              }`}>
                {rec.priority}
              </span>
            </div>
            <p className="text-xs text-gray-300 line-clamp-2">{rec.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  // Quick Stats Component
  const QuickStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Total Value</p>
          <p className="font-bold text-white text-lg">${mockPortfolioMetrics.totalValue.toLocaleString()}</p>
          <p className="text-xs text-green-400">+{mockPortfolioMetrics.totalPnLPercentage.toFixed(1)}%</p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">24h Change</p>
          <p className="font-bold text-white text-lg">${Math.abs(mockPortfolioMetrics.totalPnL).toLocaleString()}</p>
          <p className={`text-xs ${mockPortfolioMetrics.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {mockPortfolioMetrics.totalPnL >= 0 ? '+' : ''}{mockPortfolioMetrics.totalPnLPercentage.toFixed(1)}%
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Assets</p>
          <p className="font-bold text-white text-lg">{mockPortfolioAssets.length}</p>
          <p className="text-xs text-blue-400">Tokens</p>
        </CardContent>
      </Card>
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Alerts</p>
          <p className="font-bold text-white text-lg">{mockSmartAlerts.filter(a => a.isActive).length}</p>
          <p className="text-xs text-orange-400">Active</p>
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
                <Button variant="ghost" className="mb-4 text-gray-300 hover:bg-gray-700/50 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2 text-blue-400" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">Portfolio Dashboard</h1>
                <p className="text-lg text-gray-300">
                  Advanced portfolio tracking with AI-powered insights and professional-grade analytics
                </p>
              </div>

              <WalletConnector onConnect={handleWalletConnect} />

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="text-center bg-gray-800/50 border-gray-700">
                  <CardContent className="pt-6">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                    <h3 className="font-semibold mb-1 text-white">Advanced Analytics</h3>
                    <p className="text-sm text-gray-300">Risk metrics, correlations, Sharpe ratio</p>
                  </CardContent>
                </Card>
                <Card className="text-center bg-gray-800/50 border-gray-700">
                  <CardContent className="pt-6">
                    <Brain className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                    <h3 className="font-semibold mb-1 text-white">AI Recommendations</h3>
                    <p className="text-sm text-gray-300">Smart rebalancing and risk management</p>
                  </CardContent>
                </Card>
                <Card className="text-center bg-gray-800/50 border-gray-700">
                  <CardContent className="pt-6">
                    <Coins className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                    <h3 className="font-semibold mb-1 text-white">DeFi Integration</h3>
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" className="text-gray-300 hover:bg-gray-700/50 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2 text-blue-400" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-white">Portfolio Dashboard</h1>
            </div>
          </div>

          {/* Quick Stats Row */}
          <QuickStats />

          {/* Main Content Grid */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Chart */}
            <div className="lg:col-span-2 space-y-6">
              <PerformanceChart data={portfolioHistory} />
              
              <Tabs defaultValue="holdings" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
                  <TabsTrigger value="holdings" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Holdings</TabsTrigger>
                  <TabsTrigger value="defi" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">DeFi</TabsTrigger>
                  <TabsTrigger value="alerts" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Alerts</TabsTrigger>
                </TabsList>

                <TabsContent value="holdings">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg">All Holdings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {mockPortfolioAssets.map((asset) => (
                        <div key={asset.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{asset.icon}</span>
                            <div>
                              <p className="font-medium text-white text-sm">{asset.symbol}</p>
                              <p className="text-xs text-gray-400">{asset.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-white text-sm">${asset.totalValue.toLocaleString()}</p>
                            <p className={`text-xs ${asset.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {asset.pnl >= 0 ? '+' : ''}{asset.pnlPercentage.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="defi">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg">DeFi Positions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {mockDeFiPositions.map((position) => (
                        <div key={position.id} className="flex items-center justify-between p-3 rounded-md bg-gray-700/30">
                          <div>
                            <p className="font-medium text-white text-sm">{position.protocol}</p>
                            <p className="text-xs text-gray-400">{position.type} • {position.asset}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-white text-sm">${position.totalValue.toLocaleString()}</p>
                            <p className="text-xs text-green-400">{position.apy}% APY</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="alerts">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg">Smart Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {mockSmartAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-3 rounded-md bg-gray-700/30">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${alert.isActive ? 'bg-green-400' : 'bg-gray-500'}`} />
                            <div>
                              <p className="text-sm font-medium text-white">{alert.message}</p>
                              <p className="text-xs text-gray-400">{alert.type} alert</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-gray-700/50 hover:text-white text-xs">
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
            <div className="space-y-6">
              <AssetAllocation assets={mockPortfolioAssets} />
              <CompactRiskMetrics />
              <CompactAIInsights />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PortfolioDashboard;