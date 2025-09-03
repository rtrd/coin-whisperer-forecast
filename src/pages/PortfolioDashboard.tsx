import React, { useState, useEffect } from 'react';
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

  // Mock components for demo purposes
  const HoldingsTable = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Holdings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockPortfolioAssets.map((asset) => (
            <div key={asset.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-2xl">{asset.icon}</div>
                <div>
                  <p className="font-semibold">{asset.symbol}</p>
                  <p className="text-sm text-muted-foreground">{asset.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${asset.totalValue.toLocaleString()}</p>
                <p className={`text-sm ${asset.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {asset.pnl >= 0 ? '+' : ''}{asset.pnlPercentage.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const AIRecommendations = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Portfolio Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAIRecommendations.map((rec) => (
            <div key={rec.id} className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{rec.title}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {rec.priority} priority
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
              <div className="space-y-1">
                {rec.actions.map((action, index) => (
                  <p key={index} className="text-sm">• {action}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const RiskAnalysis = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Risk Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 rounded-lg border bg-card">
            <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
            <p className="text-lg font-bold">{mockRiskMetrics.sharpeRatio}</p>
          </div>
          <div className="p-3 rounded-lg border bg-card">
            <p className="text-sm text-muted-foreground">Volatility</p>
            <p className="text-lg font-bold">{mockRiskMetrics.volatility}%</p>
          </div>
          <div className="p-3 rounded-lg border bg-card">
            <p className="text-sm text-muted-foreground">Max Drawdown</p>
            <p className="text-lg font-bold text-red-600">{mockRiskMetrics.maxDrawdown}%</p>
          </div>
          <div className="p-3 rounded-lg border bg-card">
            <p className="text-sm text-muted-foreground">Beta</p>
            <p className="text-lg font-bold">{mockRiskMetrics.beta}</p>
          </div>
          <div className="p-3 rounded-lg border bg-card">
            <p className="text-sm text-muted-foreground">VaR (95%)</p>
            <p className="text-lg font-bold text-red-600">{mockRiskMetrics.var95}%</p>
          </div>
          <div className="p-3 rounded-lg border bg-card">
            <p className="text-sm text-muted-foreground">Diversification</p>
            <p className="text-lg font-bold">{mockRiskMetrics.diversificationRatio}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SmartAlerts = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Smart Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockSmartAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${alert.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                <div>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.type} alert</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                {alert.isActive ? 'Active' : 'Inactive'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const DeFiIntegration = () => (
    <Card>
      <CardHeader>
        <CardTitle>DeFi Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockDeFiPositions.map((position) => (
            <div key={position.id} className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-semibold">{position.protocol}</p>
                <p className="text-sm text-muted-foreground">{position.type} • {position.asset}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${position.totalValue.toLocaleString()}</p>
                <p className="text-sm text-green-600">{position.apy}% APY</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (!isWalletConnected) {
    return (
      <>
        <Helmet>
          <title>Portfolio Dashboard - Connect Your Wallet | CryptoPrediction.ai</title>
          <meta name="description" content="Advanced portfolio tracking dashboard with AI-powered insights, risk analysis, and DeFi integration. Connect your wallet to get started." />
        </Helmet>

        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <Link to="/portfolio-tracking">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Portfolio Info
                </Button>
              </Link>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                  Portfolio Dashboard
                </h1>
                <p className="text-lg text-muted-foreground">
                  Advanced portfolio tracking with AI-powered insights and professional-grade analytics
                </p>
              </div>

              <WalletConnector onConnect={handleWalletConnect} />

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold mb-1">Advanced Analytics</h3>
                    <p className="text-sm text-muted-foreground">Risk metrics, correlations, Sharpe ratio</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold mb-1">AI Recommendations</h3>
                    <p className="text-sm text-muted-foreground">Smart rebalancing and risk management</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Coins className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold mb-1">DeFi Integration</h3>
                    <p className="text-sm text-muted-foreground">Track yields, staking, liquidity pools</p>
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

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/portfolio-tracking">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portfolio Info
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Portfolio Dashboard
            </h1>
          </div>

          <div className="space-y-6">
            {/* Portfolio Overview */}
            <PortfolioOverview metrics={mockPortfolioMetrics} />

            {/* Main Dashboard Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="ai">AI Insights</TabsTrigger>
                <TabsTrigger value="defi">DeFi</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PerformanceChart data={portfolioHistory} />
                  <AssetAllocation assets={mockPortfolioAssets} />
                </div>
                <HoldingsTable />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RiskAnalysis />
                  <PerformanceChart data={portfolioHistory} />
                </div>
                <AssetAllocation assets={mockPortfolioAssets} />
              </TabsContent>

              <TabsContent value="ai" className="space-y-6">
                <AIRecommendations />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RiskAnalysis />
                  <AssetAllocation assets={mockPortfolioAssets} />
                </div>
              </TabsContent>

              <TabsContent value="defi" className="space-y-6">
                <DeFiIntegration />
                <PerformanceChart data={portfolioHistory} />
              </TabsContent>

              <TabsContent value="alerts" className="space-y-6">
                <SmartAlerts />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <HoldingsTable />
                  <RiskAnalysis />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PortfolioDashboard;