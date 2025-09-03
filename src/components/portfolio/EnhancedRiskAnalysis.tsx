import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Shield, 
  Info, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  Brain,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';

interface RiskMetrics {
  sharpeRatio: number;
  volatility: number;
  maxDrawdown: number;
  beta: number;
  var95: number;
  sortino: number;
  calmar: number;
  correlationRisk: number;
  concentrationRisk: number;
  liquidityRisk: number;
}

interface RiskSuggestion {
  id: string;
  type: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  impact: string;
}

export const EnhancedRiskAnalysis: React.FC = () => {
  const mockRiskMetrics: RiskMetrics = {
    sharpeRatio: 1.42,
    volatility: 28.5,
    maxDrawdown: -15.2,
    beta: 1.35,
    var95: -12.8,
    sortino: 1.89,
    calmar: 0.94,
    correlationRisk: 65,
    concentrationRisk: 78,
    liquidityRisk: 23
  };

  const mockRiskSuggestions: RiskSuggestion[] = [
    {
      id: '1',
      type: 'high',
      title: 'High Concentration Risk',
      description: 'Your portfolio is heavily concentrated in crypto assets (78% exposure)',
      action: 'Consider diversifying into traditional assets or stablecoins',
      impact: 'Could reduce volatility by 15-20%'
    },
    {
      id: '2',
      type: 'medium',
      title: 'Beta Exposure',
      description: 'Portfolio beta of 1.35 indicates higher market sensitivity',
      action: 'Add low-beta assets or defensive positions',
      impact: 'Target beta reduction to 1.1-1.2'
    },
    {
      id: '3',
      type: 'low',
      title: 'Drawdown Management',
      description: 'Current max drawdown within acceptable range',
      action: 'Maintain stop-loss levels at current positions',
      impact: 'Preserve capital during market downturns'
    }
  ];

  const getRiskLevel = (metric: string, value: number): { level: string; color: string } => {
    switch (metric) {
      case 'sharpe':
        if (value >= 1.5) return { level: 'Excellent', color: 'text-green-400' };
        if (value >= 1.0) return { level: 'Good', color: 'text-yellow-400' };
        return { level: 'Poor', color: 'text-red-400' };
      case 'volatility':
        if (value <= 15) return { level: 'Low', color: 'text-green-400' };
        if (value <= 30) return { level: 'Medium', color: 'text-yellow-400' };
        return { level: 'High', color: 'text-red-400' };
      case 'concentration':
        if (value <= 40) return { level: 'Low', color: 'text-green-400' };
        if (value <= 70) return { level: 'Medium', color: 'text-yellow-400' };
        return { level: 'High', color: 'text-red-400' };
      default:
        return { level: 'Medium', color: 'text-yellow-400' };
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'medium': return <Target className="h-4 w-4 text-yellow-400" />;
      case 'low': return <Shield className="h-4 w-4 text-green-400" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getSuggestionBadgeColor = (type: string) => {
    switch (type) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Main Risk Analysis Card */}
        <Card className="bg-gray-800/60 border-gray-600/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-white text-xl">
                  <Shield className="h-5 w-5 text-blue-400" />
                  Advanced Risk Analysis
                </CardTitle>
                <CardDescription className="text-gray-400 mt-1">
                  Comprehensive portfolio risk assessment and metrics
                </CardDescription>
              </div>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => alert('Connect Supabase for AI-powered risk analysis')}
              >
                <Brain className="h-4 w-4 mr-2" />
                AI Analysis
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Core Risk Metrics */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-4 rounded-lg bg-gray-700/40 text-center cursor-help border border-gray-600/30 hover:bg-gray-700/60 transition-colors">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <BarChart3 className="h-4 w-4 text-blue-400" />
                      <p className="text-sm text-gray-300">Sharpe Ratio</p>
                      <Info className="h-3 w-3 text-blue-400" />
                    </div>
                    <p className="font-bold text-white text-xl">{mockRiskMetrics.sharpeRatio}</p>
                    <p className={`text-xs mt-1 ${getRiskLevel('sharpe', mockRiskMetrics.sharpeRatio).color}`}>
                      {getRiskLevel('sharpe', mockRiskMetrics.sharpeRatio).level}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">Sharpe Ratio</p>
                    <p className="text-xs">Measures risk-adjusted returns by comparing excess return to volatility.</p>
                    <p className="text-xs text-green-400">&gt;1.5 = Excellent • &gt;1.0 = Good • &lt;1.0 = Poor</p>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-4 rounded-lg bg-gray-700/40 text-center cursor-help border border-gray-600/30 hover:bg-gray-700/60 transition-colors">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Activity className="h-4 w-4 text-yellow-400" />
                      <p className="text-sm text-gray-300">Volatility</p>
                      <Info className="h-3 w-3 text-blue-400" />
                    </div>
                    <p className="font-bold text-white text-xl">{mockRiskMetrics.volatility}%</p>
                    <p className={`text-xs mt-1 ${getRiskLevel('volatility', mockRiskMetrics.volatility).color}`}>
                      {getRiskLevel('volatility', mockRiskMetrics.volatility).level}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">Volatility (Annualized)</p>
                    <p className="text-xs">Standard deviation of returns measuring price fluctuation risk.</p>
                    <p className="text-xs text-green-400">&lt;15% = Low • 15-30% = Medium • &gt;30% = High</p>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-4 rounded-lg bg-gray-700/40 text-center cursor-help border border-gray-600/30 hover:bg-gray-700/60 transition-colors">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <TrendingDown className="h-4 w-4 text-red-400" />
                      <p className="text-sm text-gray-300">Max Drawdown</p>
                      <Info className="h-3 w-3 text-blue-400" />
                    </div>
                    <p className="font-bold text-red-400 text-xl">{mockRiskMetrics.maxDrawdown}%</p>
                    <p className="text-xs text-gray-400 mt-1">Peak-to-trough</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">Maximum Drawdown</p>
                    <p className="text-xs">Largest peak-to-trough decline in portfolio value.</p>
                    <p className="text-xs text-green-400">&gt;-10% = Good • -10% to -20% = Moderate • &lt;-20% = High Risk</p>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-4 rounded-lg bg-gray-700/40 text-center cursor-help border border-gray-600/30 hover:bg-gray-700/60 transition-colors">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <TrendingUp className="h-4 w-4 text-purple-400" />
                      <p className="text-sm text-gray-300">Beta</p>
                      <Info className="h-3 w-3 text-blue-400" />
                    </div>
                    <p className="font-bold text-white text-xl">{mockRiskMetrics.beta}</p>
                    <p className="text-xs text-gray-400 mt-1">vs Market</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">Beta Coefficient</p>
                    <p className="text-xs">Measures sensitivity to overall market movements.</p>
                    <p className="text-xs text-green-400">1.0 = Market • &gt;1.0 = More Volatile • &lt;1.0 = Less Volatile</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Advanced Metrics */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gray-700/30 border border-gray-600/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Value at Risk (95%)</span>
                  <span className="font-semibold text-red-400">{mockRiskMetrics.var95}%</span>
                </div>
                <Progress value={Math.abs(mockRiskMetrics.var95)} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Maximum expected loss (95% confidence)</p>
              </div>

              <div className="p-4 rounded-lg bg-gray-700/30 border border-gray-600/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Sortino Ratio</span>
                  <span className="font-semibold text-green-400">{mockRiskMetrics.sortino}</span>
                </div>
                <Progress value={(mockRiskMetrics.sortino / 3) * 100} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Downside deviation adjusted returns</p>
              </div>

              <div className="p-4 rounded-lg bg-gray-700/30 border border-gray-600/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Calmar Ratio</span>
                  <span className="font-semibold text-yellow-400">{mockRiskMetrics.calmar}</span>
                </div>
                <Progress value={(mockRiskMetrics.calmar / 2) * 100} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Return vs maximum drawdown</p>
              </div>
            </div>

            {/* Risk Distribution */}
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-400" />
                Risk Distribution
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Concentration Risk</span>
                    <span className={getRiskLevel('concentration', mockRiskMetrics.concentrationRisk).color}>
                      {mockRiskMetrics.concentrationRisk}%
                    </span>
                  </div>
                  <Progress value={mockRiskMetrics.concentrationRisk} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Correlation Risk</span>
                    <span className="text-yellow-400">{mockRiskMetrics.correlationRisk}%</span>
                  </div>
                  <Progress value={mockRiskMetrics.correlationRisk} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Liquidity Risk</span>
                    <span className="text-green-400">{mockRiskMetrics.liquidityRisk}%</span>
                  </div>
                  <Progress value={mockRiskMetrics.liquidityRisk} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Risk Management Suggestions */}
        <Card className="bg-gray-800/60 border-gray-600/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI Risk Management Suggestions
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Personalized recommendations to optimize your portfolio risk profile
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                onClick={() => alert('Connect Supabase for real-time AI suggestions')}
              >
                Refresh Suggestions
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRiskSuggestions.map((suggestion) => (
              <div 
                key={suggestion.id} 
                className="p-4 rounded-lg bg-gray-700/40 border border-gray-600/30 hover:bg-gray-700/60 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0">
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold text-white">{suggestion.title}</h5>
                      <Badge className={getSuggestionBadgeColor(suggestion.type)}>
                        {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)} Priority
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300">{suggestion.description}</p>
                    <div className="bg-gray-800/50 p-3 rounded border border-gray-600/20 -ml-6">
                      <p className="text-sm text-blue-300 mb-1">
                        <strong>Recommended Action:</strong> {suggestion.action}
                      </p>
                      <p className="text-xs text-green-400">
                        <strong>Expected Impact:</strong> {suggestion.impact}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-blue-400" />
                <span className="font-semibold text-blue-300">AI Insight</span>
              </div>
              <p className="text-sm text-gray-300">
                Your portfolio shows strong returns but elevated risk. Consider reducing concentration in volatile assets 
                and implementing a gradual rebalancing strategy to maintain growth while improving risk-adjusted returns.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default EnhancedRiskAnalysis;