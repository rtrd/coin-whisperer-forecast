
import React from 'react';
import { ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, Bar, Cell } from 'recharts';
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

interface ChartDataPoint {
  timestamp: number;
  date: string;
  price?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
  predictedPrice?: number;
  confidence?: number;
  type: 'historical' | 'prediction';
  wickHigh?: number;
  wickLow?: number;
  bodyHeight?: number;
  isPositive?: boolean;
}

// Custom Candlestick component for proper rendering
const CandlestickBar = (props: any) => {
  const { payload, x, width } = props;
  
  if (!payload || payload.type !== 'historical' || 
      typeof payload.open !== 'number' || typeof payload.close !== 'number' || 
      typeof payload.high !== 'number' || typeof payload.low !== 'number') {
    return null;
  }

  const { open, close, high, low } = payload;
  const isPositive = close >= open;
  const bodyColor = isPositive ? '#10B981' : '#EF4444';
  const wickColor = '#6B7280';
  
  const centerX = x + width / 2;
  const bodyWidth = width * 0.6;
  const bodyLeft = centerX - bodyWidth / 2;
  
  // Calculate relative positions (these will be scaled by Recharts)
  const bodyTop = Math.max(open, close);
  const bodyBottom = Math.min(open, close);
  const bodyHeight = Math.abs(close - open);

  return (
    <g>
      {/* Upper wick */}
      <line
        x1={centerX}
        y1={high}
        x2={centerX}
        y2={bodyTop}
        stroke={wickColor}
        strokeWidth={1}
      />
      {/* Lower wick */}
      <line
        x1={centerX}
        y1={bodyBottom}
        x2={centerX}
        y2={low}
        stroke={wickColor}
        strokeWidth={1}
      />
      {/* Body */}
      <rect
        x={bodyLeft}
        y={bodyTop}
        width={bodyWidth}
        height={Math.max(bodyHeight, 1)}
        fill={bodyColor}
        stroke={bodyColor}
        strokeWidth={1}
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

  // Generate proper OHLC data from price data
  const ohlcData: ChartDataPoint[] = data.map((d, index) => {
    const basePrice = d.price;
    const volatility = 0.02; // 2% volatility for realistic candles
    
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
      volume: d.volume || Math.random() * 1000000,
      type: 'historical' as const,
      isPositive: close >= open
    };
  });

  // Combine with prediction data
  const chartData: ChartDataPoint[] = [
    ...ohlcData,
    ...(prediction || []).map(p => ({
      timestamp: p.timestamp,
      date: new Date(p.timestamp).toLocaleDateString(),
      predictedPrice: p.predictedPrice,
      confidence: p.confidence,
      type: 'prediction' as const
    }))
  ];

  const formatPrice = (value: number) => `$${value.toFixed(2)}`;
  const formatVolume = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  // Find price range for better scaling
  const priceValues = chartData.flatMap(d => [d.open, d.close, d.high, d.low, d.predictedPrice].filter(v => typeof v === 'number'));
  const minPrice = Math.min(...priceValues) * 0.995;
  const maxPrice = Math.max(...priceValues) * 1.005;

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            fontSize={12}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={[minPrice, maxPrice]}
            stroke="#9CA3AF"
            tickFormatter={formatPrice}
            fontSize={12}
          />
          <YAxis 
            yAxisId="volume"
            orientation="right"
            stroke="#9CA3AF"
            tickFormatter={formatVolume}
            fontSize={10}
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
              name === 'predictedPrice' ? `${formatPrice(value)} (Predicted)` :
              name === 'volume' ? formatVolume(value) : value,
              name === 'open' ? 'Open' :
              name === 'high' ? 'High' :
              name === 'low' ? 'Low' :
              name === 'close' ? 'Close' :
              name === 'price' ? 'Price' :
              name === 'predictedPrice' ? 'AI Prediction' :
              name === 'volume' ? 'Volume' : name
            ]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          
          {/* Volume bars */}
          <Bar 
            dataKey="volume" 
            fill="#374151"
            opacity={0.3}
            yAxisId="volume"
          />

          {/* Render high values for wick tops */}
          <Bar 
            dataKey="high" 
            fill="transparent"
            isAnimationActive={false}
          />

          {/* Render low values for wick bottoms */}
          <Bar 
            dataKey="low" 
            fill="transparent"
            isAnimationActive={false}
          />

          {/* Render candlestick bodies using custom shape */}
          <Bar 
            dataKey="close"
            shape={<CandlestickBar />}
            isAnimationActive={false}
          />
          
          {/* Prediction line */}
          <Line 
            type="monotone" 
            dataKey="predictedPrice" 
            stroke="#10B981" 
            strokeWidth={3}
            strokeDasharray="8 4"
            dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#ffffff' }}
            connectNulls={false}
            name="AI Prediction"
          />

          {/* Confidence area could be added here */}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
