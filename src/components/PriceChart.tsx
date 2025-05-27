
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

interface PriceData {
  timestamp: number;
  price: number;
  volume?: number;
}

interface PredictionData {
  timestamp: number;
  predictedPrice: number;
  confidence: number;
}

interface PriceChartProps {
  data: PriceData[] | null;
  prediction: PredictionData[] | null;
  isLoading: boolean;
  crypto: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, prediction, isLoading, crypto }) => {
  if (isLoading) {
    return (
      <div className="h-96 space-y-4">
        <Skeleton className="h-8 w-48 bg-gray-700" />
        <Skeleton className="h-80 w-full bg-gray-700" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <p className="text-gray-400">No price data available</p>
      </div>
    );
  }

  // Combine historical and prediction data
  const chartData = [
    ...data.map(d => ({
      timestamp: d.timestamp,
      date: new Date(d.timestamp).toLocaleDateString(),
      price: d.price,
      volume: d.volume,
      type: 'historical'
    })),
    ...(prediction || []).map(p => ({
      timestamp: p.timestamp,
      date: new Date(p.timestamp).toLocaleDateString(),
      predictedPrice: p.predictedPrice,
      confidence: p.confidence,
      type: 'prediction'
    }))
  ];

  const formatPrice = (value: number) => `$${value.toFixed(2)}`;
  const formatVolume = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            tickFormatter={formatPrice}
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6'
            }}
            formatter={(value: number, name: string) => [
              name === 'price' ? formatPrice(value) : 
              name === 'predictedPrice' ? formatPrice(value) :
              name === 'volume' ? formatVolume(value) : value,
              name === 'price' ? 'Historical Price' :
              name === 'predictedPrice' ? 'Predicted Price' :
              name === 'volume' ? 'Volume' : name
            ]}
          />
          
          {/* Historical price line */}
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
          
          {/* Prediction line */}
          <Line 
            type="monotone" 
            dataKey="predictedPrice" 
            stroke="#10B981" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3, fill: '#10B981' }}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
