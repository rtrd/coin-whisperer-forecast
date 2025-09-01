import React, { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { X, Brain } from "lucide-react";

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

interface ChartDataPoint {
  timestamp: number;
  date: string;
  price: number | null;
  volume: number;
  predictedPrice?: number;
  confidence?: number;
}

// ✅ Safe hook to get window width (no SSR crash)
function useWindowWidth() {
  const [width, setWidth] = useState<number>(1024); // default = desktop

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize(); // set initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  data,
  prediction,
  isLoading,
  crypto,
  onClearPrediction,
}) => {
  const width = useWindowWidth();

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
  const chartData: ChartDataPoint[] = data.map((d) => ({
    timestamp: d.timestamp,
    date: new Date(d.timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    price: d.price,
    volume: d.volume || 0,
  }));
  if (prediction && prediction.length > 0) {
    const lastHistoricalPrice = data[data.length - 1]?.price;
    const firstPredictionTime = prediction[0].timestamp;

    const bridgePoint = {
      timestamp: firstPredictionTime,
      date: new Date(firstPredictionTime).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      price: lastHistoricalPrice,
      predictedPrice: lastHistoricalPrice,
      confidence: prediction[0].confidence,
      volume: 0,
    };

    chartData.push(bridgePoint);

    prediction.forEach((p, index) => {
      if (index > 0) {
        chartData.push({
          timestamp: p.timestamp,
          date: new Date(p.timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          price: null,
          predictedPrice: p.predictedPrice,
          confidence: p.confidence,
          volume: 0,
        });
      }
    });
  }

  const formatPrice = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    if (value >= 1) return `$${value.toFixed(0)}`;
    return `$${value.toFixed(4)}`;
  };

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
                {entry.dataKey === "price"
                  ? "Historical Price: "
                  : "AI Prediction: "}
                {formatPrice(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const isMobile = width < 768;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl border border-gray-600/30 backdrop-blur-sm shadow-2xl overflow-hidden">
        {prediction && prediction.length > 0 && (
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-500/15 to-green-500/15 border-b border-gray-600/30 px-6 py-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-400" />
                <span className="text-green-300 font-semibold">
                  AI Prediction Active
                </span>
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

        <div className="h-64 sm:h-80 md:h-[500px] p-1 sm:p-2 md:p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: isMobile ? 10 : 20,
                right: isMobile ? 10 : 30,
                left: 0,
                bottom: isMobile ? 30 : 20,
              }}
            >
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="#1D4ED8" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient
                  id="predictionGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="50%" stopColor="#059669" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#047857" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="2 4"
                stroke="#374151"
                opacity={0.3}
                horizontal
                vertical={false}
              />

              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                interval={isMobile ? "preserveEnd" : 0}
                angle={isMobile ? -45 : -30}
                textAnchor="end"
                height={isMobile ? 50 : 40}
                tick={{
                  fill: "#D1D5DB",
                  fontWeight: 500,
                  fontSize: isMobile ? 9 : 12,
                }}
                axisLine={{ stroke: "#4B5563", strokeWidth: 1 }}
                tickLine={{ stroke: "#6B7280", strokeWidth: 1 }}
                tickMargin={isMobile ? 2 : 4}
              />

              <YAxis
                stroke="#9CA3AF"
                tickFormatter={formatPrice}
                tick={{
                  fill: "#D1D5DB",
                  fontWeight: 500,
                  fontSize: isMobile ? 9 : 12,
                }}
                width={isMobile ? 45 : 60}
                axisLine={{ stroke: "#4B5563", strokeWidth: 1 }}
                tickLine={{ stroke: "#6B7280", strokeWidth: 1 }}
                tickCount={isMobile ? 6 : 8}
                domain={["dataMin * 0.98", "dataMax * 1.02"]}
              />

              <Tooltip content={CustomTooltip} />


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

              {prediction && prediction.length > 0 && (
                <Area
                  type="monotone"
                  dataKey="predictedPrice"
                  stroke="#10B981"
                  strokeWidth={3}
                  strokeDasharray="8 6"
                  fill="url(#predictionGradient)"
                  connectNulls
                  dot={false}
                  activeDot={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
