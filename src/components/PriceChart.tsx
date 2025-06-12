
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { X, Brain } from 'lucide-react';

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
  onClearPrediction?: () => void;
}

// Define chart data type that includes both historical and prediction data
interface ChartDataPoint {
  timestamp: number;
  date: string;
  price: number | null;
  volume: number;
  predictedPrice?: number;
  confidence?: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({ 
  data, 
  prediction, 
  isLoading, 
  crypto,
  onClearPrediction 
}) => {
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

  // Prepare historical chart data
  const chartData: ChartDataPoint[] = data.map(d => ({
    timestamp: d.timestamp,
    date: new Date(d.timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: window.innerWidth < 768 ? undefined : '2-digit'
    }),
    price: d.price,
    volume: d.volume || 0
  }));

  // Add prediction data if available - create smoother transition
  if (prediction && prediction.length > 0) {
    // Get the last historical price point for connecting the prediction line
    const lastHistoricalPrice = data[data.length - 1]?.price;

    // Add a bridge point that connects historical to prediction smoothly
    const firstPredictionTime = prediction[0].timestamp;
    const bridgePoint = {
      timestamp: firstPredictionTime,
      date: new Date(firstPredictionTime).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: window.innerWidth < 768 ? undefined : '2-digit'
      }),
      price: lastHistoricalPrice, // Keep historical price for smooth connection
      predictedPrice: lastHistoricalPrice, // Start prediction from same point
      confidence: prediction[0].confidence,
      volume: 0
    };

    chartData.push(bridgePoint);

    // Add remaining prediction points
    prediction.forEach((p, index) => {
      if (index > 0) { // Skip first point as we already added bridge
        chartData.push({
          timestamp: p.timestamp,
          date: new Date(p.timestamp).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: window.innerWidth < 768 ? undefined : '2-digit'
          }),
          price: null, // No historical price for future points
          predictedPrice: p.predictedPrice,
          confidence: p.confidence,
          volume: 0
        });
      }
    });
  }

  const formatPrice = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-gray-600/50 rounded-xl p-4 shadow-2xl">
          <p className="text-gray-300 text-sm font-medium mb-2">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-white font-semibold">
                {entry.dataKey === 'price' ? 'Historical Price: ' : 'AI Prediction: '}
                {formatPrice(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Chart Container with integrated header and legend */}
      <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl border border-gray-600/30 backdrop-blur-sm shadow-2xl overflow-hidden">
        {/* Chart Header with Clear Button - Inside chart container */}
        {prediction && prediction.length > 0 && (
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-500/15 to-green-500/15 border-b border-gray-600/30 px-6 py-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-400" />
                <span className="text-green-300 font-semibold">AI Prediction Active</span>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            {onClearPrediction && (
              <Button
                onClick={onClearPrediction}
                variant="outline"
                size="sm"
                className="bg-gray-700/60 border-gray-500/50 text-white hover:bg-red-600/30 hover:border-red-400/50 hover:text-red-300 transition-all duration-200"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Prediction
              </Button>
            )}
          </div>
        )}

        {/* Chart */}
        <div className="h-64 md:h-96 p-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <defs>
                {/* Enhanced gradients */}
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4}/>
                  <stop offset="50%" stopColor="#1D4ED8" stopOpacity={0.2}/>
                  <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="50%" stopColor="#059669" stopOpacity={0.15}/>
                  <stop offset="100%" stopColor="#047857" stopOpacity={0.05}/>
                </linearGradient>
                
                {/* Glowing effects */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="2 4" 
                stroke="#374151" 
                opacity={0.4}
                horizontal={true}
                vertical={false}
              />
              
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={window.innerWidth < 768 ? 11 : 13}
                interval="preserveStartEnd"
                tick={{ fill: '#D1D5DB', fontWeight: 500 }}
                axisLine={{ stroke: '#4B5563', strokeWidth: 1 }}
                tickLine={{ stroke: '#6B7280' }}
              />
              
              <YAxis 
                stroke="#9CA3AF"
                tickFormatter={formatPrice}
                fontSize={window.innerWidth < 768 ? 11 : 13}
                tick={{ fill: '#D1D5DB', fontWeight: 500 }}
                width={window.innerWidth < 768 ? 70 : 90}
                axisLine={{ stroke: '#4B5563', strokeWidth: 1 }}
                tickLine={{ stroke: '#6B7280' }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* Historical Price Area */}
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#3B82F6" 
                strokeWidth={3}
                fill="url(#priceGradient)"
                connectNulls={false}
                dot={false}
                activeDot={false}
              />
              
              {/* Prediction Area */}
              {prediction && prediction.length > 0 && (
                <Area 
                  type="monotone" 
                  dataKey="predictedPrice" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  strokeDasharray="8 6"
                  fill="url(#predictionGradient)"
                  connectNulls={true}
                  dot={false}
                  activeDot={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Enhanced Legend */}
        <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-t border-gray-600/30 px-6 py-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/15 rounded-xl border border-blue-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
              </div>
              <span className="text-blue-300 font-semibold">Historical Price</span>
            </div>
            
            {prediction && prediction.length > 0 && (
              <div className="flex items-center gap-3 px-4 py-2 bg-green-500/15 rounded-xl border border-green-500/30 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 border-t-2 border-dashed border-green-400 rounded"></div>
                </div>
                <span className="text-green-300 font-semibold">AI Prediction</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
