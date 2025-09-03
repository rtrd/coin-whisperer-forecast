import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PortfolioAsset } from '@/types/portfolio';
import { formatPrice, formatPercentage } from '@/utils/formatters';

interface AssetAllocationProps {
  assets: PortfolioAsset[];
}

export const AssetAllocation: React.FC<AssetAllocationProps> = ({ assets }) => {
  const colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];

  const chartData = assets.map((asset, index) => ({
    name: asset.symbol,
    value: asset.allocation,
    amount: asset.totalValue,
    color: colors[index % colors.length],
    icon: asset.icon
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-lg">{data.icon}</div>
            <span className="font-semibold">{data.name}</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span>Allocation:</span>
              <span className="font-medium">{formatPercentage(data.value)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Value:</span>
              <span className="font-medium">{formatPrice(data.amount)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-lg mr-1">{entry.payload.icon}</span>
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white">Asset Allocation</CardTitle>
        <CardDescription>
          Portfolio distribution by asset value
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Asset List */}
          <div className="space-y-3">
            {assets.map((asset, index) => (
              <div 
                key={asset.id} 
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <div className="text-xl">{asset.icon}</div>
                  <div>
                    <p className="font-medium">{asset.symbol}</p>
                    <p className="text-sm text-muted-foreground">{asset.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPercentage(asset.allocation)}</p>
                  <p className="text-sm text-muted-foreground">{formatPrice(asset.totalValue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};