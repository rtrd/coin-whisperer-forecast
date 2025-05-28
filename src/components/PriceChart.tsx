
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
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
      <div className="h-64 md:h-96 space-y-4">
        <Skeleton className="h-8 w-48 bg-gray-700" />
        <Skeleton className="h-full w-full bg-gray-700" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 md:h-96 flex items-center justify-center">
        <p className="text-gray-400">No price data available for {crypto}</p>
      </div>
    );
  }

  // Prepare chart data
  const chartData = data.map(d => ({
    timestamp: d.timestamp,
    date: new Date(d.timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: window.innerWidth < 768 ? undefined : '2-digit'
    }),
    price: d.price,
    volume: d.volume || 0
  }));

  // Get the last historical price point for connecting the prediction line
  const lastHistoricalPrice = data[data.length - 1]?.price;
  const lastHistoricalTimestamp = data[data.length - 1]?.timestamp;

  // Add prediction data if available
  if (prediction && prediction.length > 0) {
    // Add a connecting point at the boundary between historical and predicted data
    chartData.push({
      timestamp: lastHistoricalTimestamp,
      date: new Date(lastHistoricalTimestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: window.innerWidth < 768 ? undefined : '2-digit'
      }),
      price: null,
      predictedPrice: lastHistoricalPrice,
      confidence: 1,
      volume: 0
    });

    const predictionData = prediction.map(p => ({
      timestamp: p.timestamp,
      date: new Date(p.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: window.innerWidth < 768 ? undefined : '2-digit'
      }),
      price: null,
      predictedPrice: p.predictedPrice,
      confidence: p.confidence,
      volume: 0
    }));

    chartData.push(...predictionData);
  }

  const formatPrice = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatVolume = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="h-64 md:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
          
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            fontSize={window.innerWidth < 768 ? 10 : 12}
            interval="preserveStartEnd"
            tick={{ fill: '#9CA3AF' }}
          />
          
          <YAxis 
            stroke="#9CA3AF"
            tickFormatter={formatPrice}
            fontSize={window.innerWidth < 768 ? 10 : 12}
            tick={{ fill: '#9CA3AF' }}
            width={window.innerWidth < 768 ? 60 : 80}
          />
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6',
              fontSize: window.innerWidth < 768 ? '12px' : '14px'
            }}
            formatter={(value: number, name: string) => [
              name === 'price' ? formatPrice(value) : 
              name === 'predictedPrice' ? `${formatPrice(value)} (AI Prediction)` :
              name === 'volume' ? formatVolume(value) : value,
              name === 'price' ? 'Historical Price' :
              name === 'predictedPrice' ? 'AI Prediction' :
              name === 'volume' ? 'Volume' : name
            ]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          
          {/* Historical Price Area */}
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#3B82F6" 
            strokeWidth={2}
            fill="url(#priceGradient)"
            connectNulls={false}
            dot={false}
          />
          
          {/* Prediction Line - continuing from historical data */}
          <Line 
            type="monotone" 
            dataKey="predictedPrice" 
            stroke="#10B981" 
            strokeWidth={3}
            strokeDasharray="8 4"
            dot={{ r: 3, fill: '#10B981', strokeWidth: 2, stroke: '#ffffff' }}
            connectNulls={true}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      {prediction && prediction.length > 0 && (
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-500"></div>
            <span className="text-gray-300">Historical Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-500 border-dashed" style={{ borderTop: '2px dashed #10B981', height: '1px', backgroundColor: 'transparent' }}></div>
            <span className="text-gray-300">AI Prediction</span>
          </div>
        </div>
      )}
    </div>
  );
};
