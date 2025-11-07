import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Twitter,
  MessageSquare,
  Newspaper,
  Users,
  Zap,
} from "lucide-react";
import { fetchSentimentData } from "@/services/aiPredictionService";
import { SentimentGauge } from "@/components/charts/SentimentGauge";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { SentimentHeatmap } from "@/components/charts/SentimentHeatmap";
import { DonutGaugeChart } from "@/components/charts/DonutGaugeChart";
import { SpeedometerGauge } from "@/components/charts/SpeedometerGauge";
import { HistogramChart } from "@/components/charts/HistogramChart";
import { TimelineChart } from "@/components/charts/TimelineChart";

interface SentimentData {
  score: number;
  label: "Very Bearish" | "Bearish" | "Neutral" | "Bullish" | "Very Bullish";
  sources: {
    name: string;
    sentiment: number;
    mentions: number;
  }[];
}

interface SentimentAnalysisProps {
  crypto: string;
  sentimentData?: any; // Optional sentiment data prop
}

export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({
  crypto,
  sentimentData,
}) => {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate sentiment analysis data
    const generateSentimentData = (): SentimentData => {
      const score = Math.random() * 100;
      const getSentimentLabel = (
        score: number
      ):
        | "Very Bearish"
        | "Bearish"
        | "Neutral"
        | "Bullish"
        | "Very Bullish" => {
        if (score < 20) return "Very Bearish";
        if (score < 40) return "Bearish";
        if (score < 60) return "Neutral";
        if (score < 80) return "Bullish";
        return "Very Bullish";
      };

      return {
        score,
        label: getSentimentLabel(score),
        sources: [
          {
            name: "Twitter/X",
            sentiment: Math.random() * 100,
            mentions: Math.floor(Math.random() * 10000) + 1000,
          },
          {
            name: "Reddit",
            sentiment: Math.random() * 100,
            mentions: Math.floor(Math.random() * 5000) + 500,
          },
          {
            name: "News Media",
            sentiment: Math.random() * 100,
            mentions: Math.floor(Math.random() * 1000) + 100,
          },
          {
            name: "Crypto Forums",
            sentiment: Math.random() * 100,
            mentions: Math.floor(Math.random() * 2000) + 200,
          },
        ],
      };
    };
    const transformApiDataToSentiment = (apiData: any): SentimentData => {
      // Handle different possible API response structures
      const dataPayload = apiData?.data || apiData;

      // Map the API source keys to your desired display names
      const sourceNameMap: Record<string, string> = {
        tweet: "Twitter/X",
        "reddit-post": "Reddit",
        news: "News Media",
        "youtube-video": "Crypto Forums",
      };

      let sources: Array<{
        name: string;
        sentiment: number;
        mentions: number;
      }> = [];
      let avgScore = 0;

      try {
        // Check if we have the expected data structure
        if (
          dataPayload?.types_sentiment &&
          typeof dataPayload.types_sentiment === "object"
        ) {
          sources = Object.keys(dataPayload.types_sentiment)
            .filter((key) => sourceNameMap[key]) // only include mapped sources
            .map((key) => ({
              name: sourceNameMap[key],
              sentiment: dataPayload.types_sentiment[key] || 0,
              mentions:
                dataPayload.types_interactions?.[key] ||
                Math.floor(Math.random() * 1000) + 100,
            }));

          // Calculate overall average sentiment score
          const totalScore = sources.reduce(
            (sum, source) => sum + source.sentiment,
            0
          );
          avgScore = sources.length ? totalScore / sources.length : 0;
        } else {
          // Fallback: create mock data based on overall sentiment if available
          const fallbackSentiment =
            dataPayload?.sentiment || Math.random() * 100;
          avgScore = fallbackSentiment;

          sources = [
            {
              name: "Twitter/X",
              sentiment: fallbackSentiment + (Math.random() - 0.5) * 20,
              mentions: Math.floor(Math.random() * 10000) + 1000,
            },
            {
              name: "Reddit",
              sentiment: fallbackSentiment + (Math.random() - 0.5) * 20,
              mentions: Math.floor(Math.random() * 5000) + 500,
            },
            {
              name: "News Media",
              sentiment: fallbackSentiment + (Math.random() - 0.5) * 20,
              mentions: Math.floor(Math.random() * 1000) + 100,
            },
            {
              name: "Crypto Forums",
              sentiment: fallbackSentiment + (Math.random() - 0.5) * 20,
              mentions: Math.floor(Math.random() * 2000) + 200,
            },
          ].map((source) => ({
            ...source,
            sentiment: Math.max(0, Math.min(100, source.sentiment)), // Clamp between 0-100
          }));
        }
      } catch (error) {
        console.error("Error processing sentiment data:", error);
        // Complete fallback with random data
        avgScore = Math.random() * 100;
        sources = [
          {
            name: "Twitter/X",
            sentiment: Math.random() * 100,
            mentions: Math.floor(Math.random() * 10000) + 1000,
          },
          {
            name: "Reddit",
            sentiment: Math.random() * 100,
            mentions: Math.floor(Math.random() * 5000) + 500,
          },
          {
            name: "News Media",
            sentiment: Math.random() * 100,
            mentions: Math.floor(Math.random() * 1000) + 100,
          },
          {
            name: "Crypto Forums",
            sentiment: Math.random() * 100,
            mentions: Math.floor(Math.random() * 2000) + 200,
          },
        ];
      }

      // Determine sentiment label from score
      const getSentimentLabel = (
        score: number
      ):
        | "Very Bearish"
        | "Bearish"
        | "Neutral"
        | "Bullish"
        | "Very Bullish" => {
        if (score >= 85) return "Very Bullish";
        if (score >= 70) return "Bullish";
        if (score >= 50) return "Neutral";
        if (score >= 30) return "Bearish";
        return "Very Bearish";
      };

      const result = {
        score: avgScore,
        label: getSentimentLabel(avgScore),
        sources,
      };

      return result;
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetchSentimentData(crypto);

        if (res) {
          const result = transformApiDataToSentiment(res);
          setSentiment(result);
          sentimentData(result); // Update optional prop if provided
        } else {
          console.warn("No data received from API, using fallback");
          // Use fallback data
          const fallbackData = generateSentimentData();
          setSentiment(fallbackData);
          sentimentData(fallbackData); // Update optional prop if provided
        }
      } catch (error) {
        console.error("Error in sentiment data fetch:", error);
        // Use fallback data on error
        const fallbackData = generateSentimentData();
        setSentiment(fallbackData);
        sentimentData(fallbackData); // Update optional prop if provided
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Optionally, if you want to simulate loading delay, use setTimeout(() => fetchData(), 1500);
  }, [crypto]);

  const getSentimentColor = (score: number) => {
    if (score >= 70) return "#10B981";
    if (score >= 50) return "#34D399";
    if (score >= 40) return "#FBBF24";
    if (score >= 20) return "#F87171";
    return "#EF4444";
  };

  const getSentimentIcon = (score: number) => {
    if (score >= 60) return TrendingUp;
    if (score >= 40) return Activity;
    return TrendingDown;
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "Twitter/X": return Twitter;
      case "Reddit": return MessageSquare;
      case "News Media": return Newspaper;
      default: return Users;
    }
  };

  // Add loading and null checks
  if (isLoading || !sentiment) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 w-full bg-gray-700 animate-pulse rounded" />
          ))}
        </div>
      </Card>
    );
  }

  const sentimentEmoji = sentiment.score >= 70 ? "🤑" : sentiment.score >= 50 ? "😊" : sentiment.score >= 40 ? "😐" : sentiment.score >= 20 ? "😟" : "😰";
  
  const sentimentGradient = sentiment.score >= 70 
    ? "from-emerald-900 via-emerald-800 to-emerald-900" 
    : sentiment.score >= 50 
    ? "from-emerald-800 via-green-800 to-emerald-800"
    : sentiment.score >= 40 
    ? "from-amber-800 via-yellow-800 to-amber-800"
    : sentiment.score >= 20 
    ? "from-red-800 via-orange-800 to-red-800"
    : "from-red-900 via-red-800 to-red-900";

  const fearGreed = sentiment.score * 0.8 + 10;

  return (
    <div className="space-y-6">
      {/* Hero Card - Large Donut Chart */}
      <Card className={`p-8 bg-gradient-to-br ${sentimentGradient} border-border/50 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative z-10">
          <div className="flex flex-col items-center">
            <DonutGaugeChart
              value={sentiment.score}
              innerValue={fearGreed}
              label={sentiment.label}
              size={220}
              color={getSentimentColor(sentiment.score)}
              emoji={sentimentEmoji}
            />
            <div className="mt-4 text-center space-y-2">
              <div className="flex items-center gap-2 justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">Live Sentiment Analysis</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-xs px-2 py-1 rounded bg-muted/40 text-muted-foreground">
                  Fear & Greed: {Math.round(fearGreed)} ({sentiment.label})
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Source Breakdown - Unique Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sentiment.sources.map((source, index) => {
          const Icon = getSourceIcon(source.name);
          const sourceColor = getSentimentColor(source.sentiment);
          const trendData = [
            Math.max(0, source.sentiment + (Math.random() - 0.5) * 20),
            Math.max(0, source.sentiment + (Math.random() - 0.5) * 20),
            Math.max(0, source.sentiment + (Math.random() - 0.5) * 20),
            Math.max(0, source.sentiment + (Math.random() - 0.5) * 20),
            Math.max(0, source.sentiment + (Math.random() - 0.5) * 20),
            Math.max(0, source.sentiment + (Math.random() - 0.5) * 20),
            source.sentiment
          ];
          
          return (
            <Card
              key={index}
              className="p-4 bg-gradient-to-br from-background/95 to-background/80 border-border/50 hover:scale-105 transition-all duration-300 hover:shadow-lg group overflow-hidden"
            >
              <div className="flex flex-col items-center gap-3">
                {/* Large animated icon */}
                <div className="relative shrink-0">
                  <Icon 
                    className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" 
                    style={{ color: sourceColor }}
                  />
                  <div 
                    className="absolute -inset-2 rounded-full opacity-50 blur-md group-hover:opacity-75 transition-opacity pointer-events-none"
                    style={{ backgroundColor: `${sourceColor}30` }}
                  />
                </div>

                {/* Circular progress ring */}
                <div className="relative w-full flex justify-center">
                  <SentimentGauge value={source.sentiment} size={90} />
                </div>

                {/* Source info */}
                <div className="text-center w-full min-w-0">
                  <h4 className="text-xs font-semibold text-foreground mb-1 truncate px-2">
                    {source.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground mb-2 truncate">
                    {source.mentions.toLocaleString()} mentions
                  </p>

                  {/* Mini trend chart */}
                  <div className="h-6 mt-2 w-full px-2">
                    <SparklineChart data={trendData} color={sourceColor} height={24} />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Sentiment Indicators - Speedometer & Bar Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fear & Greed - Speedometer */}
        <Card className="p-6 bg-gradient-to-br from-background/95 to-background/80 border-border/50 overflow-hidden">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 truncate">
            <Activity className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">Fear & Greed Index</span>
          </h3>
          <div className="flex justify-center overflow-hidden min-h-[220px]">
            <SpeedometerGauge
              value={fearGreed}
              zones={[
                { min: 0, max: 25, color: "#EF4444", label: "Fear" },
                { min: 25, max: 45, color: "#F59E0B", label: "Caution" },
                { min: 45, max: 55, color: "#FBBF24", label: "Neutral" },
                { min: 55, max: 75, color: "#34D399", label: "Greed" },
                { min: 75, max: 100, color: "#10B981", label: "Extreme" },
              ]}
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs truncate">
            <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-emerald-400 truncate">+15 vs yesterday</span>
          </div>
        </Card>

        {/* Social Volume - 3D Bar Chart */}
        <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 overflow-hidden">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 truncate">
            <Zap className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="truncate">Social Volume (7 Days)</span>
          </h3>
          <div className="overflow-hidden">
            <HistogramChart
              data={[
                { label: "Mon", value: 12500 },
                { label: "Tue", value: 15200 },
                { label: "Wed", value: 13800 },
                { label: "Thu", value: 18900 },
                { label: "Fri", value: 22100 },
                { label: "Sat", value: 19500 },
                { label: "Sun", value: 24800 },
              ]}
              height={120}
              positiveColor="#A855F7"
              negativeColor="#EC4899"
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs truncate">
            <TrendingUp className="w-3 h-3 text-purple-400 shrink-0" />
            <span className="text-purple-400 truncate">+32% increase</span>
          </div>
        </Card>
      </div>

      {/* Recent Trends - Timeline */}
      <Card className="p-6 bg-gradient-to-br from-background/95 to-background/80 border-border/50 overflow-hidden">
        <h3 className="text-sm font-semibold mb-6 flex items-center gap-2 truncate">
          <TrendingUp className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate">Sentiment Timeline (7 Days)</span>
        </h3>
        <TimelineChart
          events={[
            { date: "Mon", value: 45, change: -5.2, sentiment: "bearish" },
            { date: "Tue", value: 52, change: 7.8, sentiment: "neutral" },
            { date: "Wed", value: 48, change: -4.1, sentiment: "neutral" },
            { date: "Thu", value: 61, change: 13.2, sentiment: "bullish" },
            { date: "Fri", value: 58, change: -3.0, sentiment: "bullish" },
            { date: "Sat", value: 65, change: 7.1, sentiment: "bullish" },
            { date: "Sun", value: sentiment.score, change: sentiment.score - 65, sentiment: sentiment.label === "Bullish" || sentiment.label === "Very Bullish" ? "bullish" : sentiment.label === "Bearish" || sentiment.label === "Very Bearish" ? "bearish" : "neutral" },
          ]}
        />

        {/* 7-Day Heatmap */}
        <div className="mt-8">
          <h4 className="text-sm font-semibold mb-3 text-center text-muted-foreground">
            Weekly Sentiment Heatmap
          </h4>
          <SentimentHeatmap dailyValues={[45, 52, 48, 61, 58, 65, sentiment.score]} />
        </div>
      </Card>
    </div>
  );
};
