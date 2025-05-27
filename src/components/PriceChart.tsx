
import React from 'react';
import { ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, Bar } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

interface PriceData {
  timestamp: number;
  price: number;
  volume?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
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

// Custom Candlestick component
const Candlestick = (props: any) => {
  const { payload, x, y, width, height } = props;
  
  if (!payload || !payload.open || !payload.close || !payload.high || !payload.low) {
    return null;
  }

  const { open, close, high, low } = payload;
  const isUp = close > open;
  const color = isUp ? '#10B981' : '#EF4444';
  const wickColor = '#6B7280';

  // Calculate positions
  const yScale = height / (Math.max(...Object.values(payload)) - Math.min(...Object.values(payload)));
  const bodyTop = Math.min(open, close) * yScale;
  const bodyHeight = Math.abs(close - open) * yScale;
  
  return (
    <g>
      {/* Wick */}
      <line
        x1={x + width / 2}
        y1={y + high * yScale}
        x2={x + width / 2}
        y2={y + low * yScale}
        stroke={wickColor}
        strokeWidth={1}
      />
      {/* Body */}
      <rect
        x={x + width * 0.2}
        y={y + bodyTop}
        width={width * 0.6}
        height={Math.max(bodyHeight, 1)}
        fill={color}
        stroke={color}
      />
    </g>
  );
};

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

  // Generate OHLC data from price data
  const ohlcData = data.map((d, index) => {
    const basePrice = d.price;
    const volatility = 0.02; // 2% volatility for demo
    
    const open = index > 0 ? data[index - 1].price : basePrice * (1 + (Math.random() - 0.5) * volatility);
    const close = basePrice;
    const high = Math.max(open, close) * (1 + Math.random() * volatility);
    const low = Math.min(open, close) * (1 - Math.random() * volatility);

    return {
      timestamp: d.timestamp,
      date: new Date(d.timestamp).toLocaleDateString(),
      price: d.price,
      open,
      high,
      low,
      close,
      volume: d.volume,
      type: 'historical'
    };
  });

  // Combine with prediction data
  const chartData = [
    ...ohlcData,
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
              name === 'open' || name === 'high' || name === 'low' || name === 'close' || name === 'price' ? formatPrice(value) : 
              name === 'predictedPrice' ? formatPrice(value) :
              name === 'volume' ? formatVolume(value) : value,
              name === 'open' ? 'Open' :
              name === 'high' ? 'High' :
              name === 'low' ? 'Low' :
              name === 'close' ? 'Close' :
              name === 'price' ? 'Price' :
              name === 'predictedPrice' ? 'Predicted Price' :
              name === 'volume' ? 'Volume' : name
            ]}
          />
          
          {/* Volume bars */}
          <Bar 
            dataKey="volume" 
            fill="#374151"
            opacity={0.3}
            yAxisId="volume"
          />
          
          {/* Candlestick bodies */}
          {chartData.map((entry, index) => {
            if (entry.type === 'historical' && entry.open && entry.close && entry.high && entry.low) {
              const isUp = entry.close > entry.open;
              return (
                <Bar 
                  key={index}
                  dataKey={() => Math.abs(entry.close - entry.open)}
                  fill={isUp ? '#10B981' : '#EF4444'}
                  opacity={0.8}
                />
              );
            }
            return null;
          })}
          
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
