import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PortfolioHistory } from "@/types/portfolio";
import { formatPrice } from "@/utils/formatters";

interface PerformanceChartProps {
  data: PortfolioHistory[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const [timeframe, setTimeframe] = useState("30d");
  const [chartType, setChartType] = useState<"value" | "pnl">("value");

  const timeframes = [
    { label: "7D", value: "7d", days: 7 },
    { label: "30D", value: "30d", days: 30 },
    { label: "90D", value: "90d", days: 90 },
    { label: "1Y", value: "1y", days: 365 },
  ];

  // ✅ Filter data by timeframe
  const filteredData = data.slice(
    -(timeframes.find((t) => t.value === timeframe)?.days || 30)
  );

  // ✅ Dynamically detect all unique tokens
  const tokens = useMemo(() => {
    const set = new Set<string>();
    filteredData.forEach((item) => {
      Object.keys(item.assets || {}).forEach((symbol) => set.add(symbol));
    });
    return Array.from(set);
  }, [filteredData]);

  // ✅ Transform data into recharts format
  const chartData = useMemo(() => {
    return filteredData.map((item) => {
      // Make sure item.date is treated as string
      const dateStr = String(item.date); // <-- convert to string
      const [day, month, year] = dateStr.split("/");
      const dateObj = new Date(`${year}-${month}-${day}`);

      const row: any = {
        fullDate: dateObj.getTime(),
        value: item.totalValue ?? 0,
        pnl: item.pnl ?? 0,
      };

      tokens.forEach((t) => {
        row[t] = item.assets?.[t]?.value || 0;
      });

      return row;
    });
  }, [filteredData, tokens]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg p-4 shadow-lg text-white">
          <p className="font-medium mb-2">
            {new Date(data.fullDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>

          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span>Portfolio Value:</span>
              <span className="font-semibold">{formatPrice(data.value)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>P&L:</span>
              <span
                className={`font-semibold ${
                  data.pnl >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {data.pnl >= 0 ? "+" : ""}
                {formatPrice(data.pnl)}
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
    if (!lastValue || !firstValue) return "hsl(var(--primary))";

    return lastValue[chartType] >= firstValue[chartType]
      ? "hsl(142, 76%, 36%)"
      : "hsl(0, 84%, 60%)";
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
                onClick={() => setChartType("value")}
                className={`h-8 px-3 ${
                  chartType === "value"
                    ? "bg-gray-700 text-white"
                    : "text-gray-200 hover:bg-gray-700/50 hover:text-white"
                }`}
              >
                Value
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChartType("pnl")}
                className={`h-8 px-3 ${
                  chartType === "pnl"
                    ? "bg-gray-700 text-white"
                    : "text-gray-200 hover:bg-gray-700/50 hover:text-white"
                }`}
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
              className={`h-8 px-3 ${
                timeframe === tf.value
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
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
                  <stop
                    offset="5%"
                    stopColor={getGradientColor()}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={getGradientColor()}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="fullDate"
                tickFormatter={(timestamp: number) =>
                  new Date(timestamp).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
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

        {/* ✅ Dynamic Asset Breakdown */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {tokens.map((symbol, idx) => {
            const latest = chartData[chartData.length - 1];
            const value = latest?.[symbol] || 0;
            const COLORS = [
              "bg-orange-500",
              "bg-blue-500",
              "bg-purple-500",
              "bg-pink-500",
              "bg-green-500",
              "bg-red-500",
              "bg-yellow-500",
              "bg-gray-500",
            ];
            return (
              <div
                key={symbol}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/60 hover:bg-gray-700/80 transition-colors border border-gray-600/50"
              >
                <div
                  className={`w-8 h-8 rounded-full ${
                    COLORS[idx % COLORS.length]
                  } flex items-center justify-center text-white text-sm font-bold`}
                >
                  {symbol[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{symbol}</p>
                  <p className="text-sm text-gray-300">{formatPrice(value)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
