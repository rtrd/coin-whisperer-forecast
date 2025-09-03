import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { PortfolioHistory } from '@/types/portfolio';
import { formatPrice } from '@/utils/formatters';

interface PerformanceChartProps {
  data: PortfolioHistory[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const [timeframe, setTimeframe] = useState('30d');
  const [chartType, setChartType] = useState<'value' | 'pnl'>('value');

  const timeframes = [
    { label: '7D', value: '7d', days: 7 },
    { label: '30D', value: '30d', days: 30 },
    { label: '90D', value: '90d', days: 90 },
    { label: '1Y', value: '1y', days: 365 }
  ];

  const filteredData = data.slice(-timeframes.find(t => t.value === timeframe)?.days || 30);

  const chartData = filteredData.map(item => ({
    date: item.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: item.timestamp,
    value: item.totalValue,
    pnl: item.pnl,
    btc: item.assets.BTC?.value || 0,
    eth: item.assets.ETH?.value || 0,
    sol: item.assets.SOL?.value || 0,
    others: (item.assets.LINK?.value || 0) + (item.assets.MATIC?.value || 0)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg">
          <p className="font-medium mb-2">{data.fullDate.toLocaleDateString('en-US', { 
            year: 'numeric',
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span>Portfolio Value:</span>
              <span className="font-semibold">{formatPrice(data.value)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>P&L:</span>
              <span className={`font-semibold ${data.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.pnl >= 0 ? '+' : ''}{formatPrice(data.pnl)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getGradientColor = () => {
    const lastValue = chartData[chartData.length - 1];
    const firstValue = chartData[0];
    if (!lastValue || !firstValue) return 'hsl(var(--primary))';
    
    return lastValue[chartType] >= firstValue[chartType] 
      ? 'hsl(142, 76%, 36%)' 
      : 'hsl(0, 84%, 60%)';
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Portfolio Performance</CardTitle>
            <CardDescription>
              Track your portfolio value and P&L over time
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="flex border border-gray-600 rounded-lg p-1 bg-gray-800/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChartType('value')}
                className={`h-8 px-3 ${chartType === 'value' ? 'bg-gray-700 text-white' : 'text-gray-200 hover:bg-gray-700/50 hover:text-white'}`}
              >
                Value
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChartType('pnl')}
                className={`h-8 px-3 ${chartType === 'pnl' ? 'bg-gray-700 text-white' : 'text-gray-200 hover:bg-gray-700/50 hover:text-white'}`}
              >
                P&L
              </Button>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <Button
              key={tf.value}
              variant="ghost"
              size="sm"
              onClick={() => setTimeframe(tf.value)}
              className={`h-8 px-3 ${timeframe === tf.value ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'}`}
            >
              {tf.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getGradientColor()} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={getGradientColor()} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatPrice(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={chartType}
                stroke={getGradientColor()}
                strokeWidth={2}
                fill="url(#colorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Asset Breakdown */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'BTC', value: chartData[chartData.length - 1]?.btc || 0, icon: '₿', color: 'bg-orange-500' },
            { label: 'ETH', value: chartData[chartData.length - 1]?.eth || 0, icon: 'Ξ', color: 'bg-blue-500' },
            { label: 'SOL', value: chartData[chartData.length - 1]?.sol || 0, icon: '◎', color: 'bg-purple-500' },
            { label: 'Others', value: chartData[chartData.length - 1]?.others || 0, icon: '⚡', color: 'bg-gray-500' }
          ].map((asset) => (
            <div key={asset.label} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
              <div className={`w-8 h-8 rounded-full ${asset.color} flex items-center justify-center text-white text-sm font-bold`}>
                {asset.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{asset.label}</p>
                <p className="text-sm text-muted-foreground">{formatPrice(asset.value)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};