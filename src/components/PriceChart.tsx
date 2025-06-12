
import React from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
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
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  predictedPrice?: number;
  confidence?: number;
}

// Transform price data into OHLC candlestick data
const transformToOHLC = (data: PriceData[]): ChartDataPoint[] => {
  if (!data || data.length === 0) return [];
  
  // Group data points to create candlesticks
  const candlesticks: ChartDataPoint[] = [];
  const groupSize = Math.max(1, Math.floor(data.length / 50)); // Limit to ~50 candlesticks for readability
  
  for (let i = 0; i < data.length; i += groupSize) {
    const group = data.slice(i, Math.min(i + groupSize, data.length));
    if (group.length === 0) continue;
    
    const open = group[0].price;
    const close = group[group.length - 1].price;
    const high = Math.max(...group.map(d => d.price));
    const low = Math.min(...group.map(d => d.price));
    const volume = group.reduce((sum, d) => sum + (d.volume || 0), 0) / group.length;
    
    candlesticks.push({
      timestamp: group[0].timestamp,
      date: new Date(group[0].timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      }),
      open,
      high,
      low,
      close,
      volume
    });
  }
  
  return candlesticks;
};

// Custom Candlestick Bar Component
const CandlestickBar = (props: any) => {
  const { payload, x, y, width, height } = props;
  if (!payload) return null;
  
  const { open, high, low, close } = payload;
  const isGreen = close >= open;
  const color = isGreen ? '#10B981' : '#EF4444';
  const bodyHeight = Math.abs(close - open) * height / (payload.high - payload.low);
  const bodyY = y + (Math.max(high, Math.max(open, close)) - Math.max(open, close)) * height / (high - low);
  
  const centerX = x + width / 2;
  const wickTop = y + (high - Math.max(open, close)) * height / (high - low);
  const wickBottom = y + (high - Math.min(open, close)) * height / (high - low);
  
  return (
    <g>
      {/* High-Low Wick */}
      <line
        x1={centerX}
        y1={wickTop}
        x2={centerX}
        y2={wickBottom}
        stroke={color}
        strokeWidth={1}
      />
      {/* Open-Close Body */}
      <rect
        x={x + width * 0.2}
        y={bodyY}
        width={width * 0.6}
        height={Math.max(bodyHeight, 1)}
        fill={isGreen ? color : color}
        stroke={color}
        strokeWidth={1}
        fillOpacity={isGreen ? 0.8 : 1}
      />
    </g>
  );
};

export const PriceChart: React.FC<PriceChartProps> = ({ 
  data, 
  prediction, 
  isLoading, 
  crypto,
  onClearPrediction 
}) => {
  if (isLoading) {
    return (
      <div className="h-80 md:h-[500px] space-y-4">
        <Skeleton className="h-8 w-48 bg-gray-700" />
        <Skeleton className="h-full w-full bg-gray-700" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-80 md:h-[500px] flex items-center justify-center">
        <p className="text-gray-400">No price data available for {crypto}</p>
      </div>
    );
  }

  // Transform to OHLC data
  const candlestickData = transformToOHLC(data);

  // Add prediction data if available
  if (prediction && prediction.length > 0) {
    const lastCandlestick = candlestickData[candlestickData.length - 1];
    
    prediction.forEach((p, index) => {
      candlestickData.push({
        timestamp: p.timestamp,
        date: new Date(p.timestamp).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        }),
        open: index === 0 ? lastCandlestick.close : prediction[index - 1].predictedPrice,
        high: p.predictedPrice * 1.02,
        low: p.predictedPrice * 0.98,
        close: p.predictedPrice,
        predictedPrice: p.predictedPrice,
        confidence: p.confidence,
        volume: 0
      });
    });
  }

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else if (value >= 1) {
      return `$${value.toFixed(0)}`;
    } else {
      return `$${value.toFixed(4)}`;
    }
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length && payload[0].payload) {
      const data = payload[0].payload;
      const isPrediction = data.predictedPrice !== undefined;
      
      return (
        <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-gray-600/50 rounded-xl p-4 shadow-2xl">
          <p className="text-gray-300 text-sm font-medium mb-2">{`Date: ${label}`}</p>
          {isPrediction ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-white font-semibold">
                  AI Prediction: {formatPrice(data.predictedPrice)}
                </span>
              </div>
              <p className="text-green-300 text-xs ml-5">
                Confidence: {(data.confidence * 100).toFixed(1)}%
              </p>
            </div>
          ) : (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Open:</span>
                <span className="text-white font-semibold">{formatPrice(data.open)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">High:</span>
                <span className="text-green-400 font-semibold">{formatPrice(data.high)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Low:</span>
                <span className="text-red-400 font-semibold">{formatPrice(data.low)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Close:</span>
                <span className="text-white font-semibold">{formatPrice(data.close)}</span>
              </div>
            </div>
          )}
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
        <div className="h-80 md:h-[500px] p-2 md:p-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={candlestickData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="50%" stopColor="#059669" stopOpacity={0.15}/>
                  <stop offset="100%" stopColor="#047857" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="2 4" 
                stroke="#374151" 
                opacity={0.3}
                horizontal={true}
                vertical={false}
              />
              
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={window.innerWidth < 768 ? 10 : 12}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={40}
                tick={{ 
                  fill: '#D1D5DB', 
                  fontWeight: 500,
                  fontSize: window.innerWidth < 768 ? 10 : 12
                }}
                axisLine={{ stroke: '#4B5563', strokeWidth: 1 }}
                tickLine={{ stroke: '#6B7280', strokeWidth: 1 }}
                tickMargin={4}
              />
              
              <YAxis 
                stroke="#9CA3AF"
                tickFormatter={formatPrice}
                fontSize={window.innerWidth < 768 ? 10 : 12}
                tick={{ 
                  fill: '#D1D5DB', 
                  fontWeight: 500,
                  fontSize: window.innerWidth < 768 ? 10 : 12
                }}
                width={window.innerWidth < 768 ? 50 : 60}
                axisLine={{ stroke: '#4B5563', strokeWidth: 1 }}
                tickLine={{ stroke: '#6B7280', strokeWidth: 1 }}
                tickCount={8}
                domain={['dataMin * 0.98', 'dataMax * 1.02']}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* Candlestick bars for historical data */}
              <Bar 
                dataKey="high" 
                shape={<CandlestickBar />}
                isAnimationActive={false}
              />
              
              {/* Prediction line */}
              {prediction && prediction.length > 0 && (
                <Line 
                  type="monotone" 
                  dataKey="predictedPrice" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  strokeDasharray="8 6"
                  dot={false}
                  connectNulls={true}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Enhanced Legend */}
        <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-t border-gray-600/30 px-6 py-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-3 px-4 py-2 bg-green-500/15 rounded-xl border border-green-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-4 bg-green-400 border border-green-600"></div>
                <div className="w-3 h-4 bg-red-400 border border-red-600"></div>
              </div>
              <span className="text-white font-semibold">Candlestick Price</span>
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
