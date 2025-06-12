
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { X, TrendingUp, Brain } from 'lucide-react';

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

  // Add prediction data if available
  if (prediction && prediction.length > 0) {
    // Get the last historical price point for connecting the prediction line
    const lastHistoricalPrice = data[data.length - 1]?.price;
    const lastHistoricalTimestamp = data[data.length - 1]?.timestamp;

    // Add all prediction points, starting from the last historical point
    prediction.forEach((p, index) => {
      chartData.push({
        timestamp: p.timestamp,
        date: new Date(p.timestamp).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: window.innerWidth < 768 ? undefined : '2-digit'
        }),
        price: index === 0 ? lastHistoricalPrice : null, // Connect first prediction point to historical data
        predictedPrice: p.predictedPrice,
        confidence: p.confidence,
        volume: 0
      });
    });
  }

  const formatPrice = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatVolume = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="space-y-4">
      {/* Chart Header with Clear Button */}
      {prediction && prediction.length > 0 && (
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg p-3 border border-gray-600/30">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Brain className="h-4 w-4 text-green-400" />
            <span>AI Prediction Active</span>
          </div>
          {onClearPrediction && (
            <Button
              onClick={onClearPrediction}
              variant="outline"
              size="sm"
              className="bg-gray-700/50 border-gray-600 text-white hover:bg-red-600/20 hover:border-red-500/50 hover:text-red-300"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Prediction
            </Button>
          )}
        </div>
      )}

      {/* Chart Container */}
      <div className="h-64 md:h-96 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-lg p-4 border border-gray-700/50">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
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
            
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            
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
            
            {/* Historical Price Line */}
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#3B82F6" 
              strokeWidth={2.5}
              connectNulls={false}
              dot={false}
              activeDot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#ffffff' }}
            />
            
            {/* Prediction Line - continuous from historical data */}
            <Line 
              type="monotone" 
              dataKey="predictedPrice" 
              stroke="#10B981" 
              strokeWidth={3}
              strokeDasharray="6 4"
              connectNulls={true}
              dot={false}
              activeDot={{ r: 5, fill: '#10B981', strokeWidth: 2, stroke: '#ffffff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Enhanced Legend */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-3 px-3 py-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-blue-500 rounded"></div>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </div>
            <span className="text-blue-300 font-medium">Historical Price</span>
          </div>
          
          {prediction && prediction.length > 0 && (
            <div className="flex items-center gap-3 px-3 py-2 bg-green-500/10 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 border-t-2 border-dashed border-green-500 rounded"></div>
                <Brain className="h-4 w-4 text-green-400" />
              </div>
              <span className="text-green-300 font-medium">AI Prediction</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
