import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Twitter,
  MessageSquare,
  Newspaper,
  Users,
  Zap,
  InfoIcon,
} from "lucide-react";
import { fetchSentimentData } from "@/services/aiPredictionService";
import { SentimentGauge } from "@/components/charts/SentimentGauge";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { SentimentHeatmap } from "@/components/charts/SentimentHeatmap";
import { DonutGaugeChart } from "@/components/charts/DonutGaugeChart";
import { ProgressGauge } from "@/components/charts/ProgressGauge";
import { HistogramChart } from "@/components/charts/HistogramChart";
import { TimelineChart } from "@/components/charts/TimelineChart";

interface SentimentData {
  score: number;
  label: "Very Bearish" | "Bearish" | "Neutral" | "Bullish" | "Very Bullish";
  sources: {
    name: string;
    sentiment: number;
    mentions: number;
    trend?: number[];
  }[];
  socialVolume?: { label: string; value: number }[];
  sentimentTimeline?: { date: string; value: number; change: number; sentiment: "bullish" | "bearish" | "neutral" }[];
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
              dataPayload.types_interactions?.[key] || 0,
          }));

        // Calculate overall average sentiment score
        const totalScore = sources.reduce(
          (sum, source) => sum + source.sentiment,
          0
        );
        avgScore = sources.length ? totalScore / sources.length : 0;
      } else if (dataPayload?.sentiment !== undefined) {
        // Use overall sentiment if detailed breakdown not available
        avgScore = dataPayload.sentiment;

        sources = [
          {
            name: "Twitter/X",
            sentiment: avgScore,
            mentions: dataPayload.types_interactions?.tweet || 0,
          },
          {
            name: "Reddit",
            sentiment: avgScore,
            mentions: dataPayload.types_interactions?.["reddit-post"] || 0,
          },
          {
            name: "News Media",
            sentiment: avgScore,
            mentions: dataPayload.types_interactions?.news || 0,
          },
          {
            name: "Crypto Forums",
            sentiment: avgScore,
            mentions: dataPayload.types_interactions?.["youtube-video"] || 0,
          },
        ];
      } else {
        throw new Error("Invalid sentiment data structure from API");
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
        // Fetch real sentiment data from LunarCrush API via backend
        const apiResponse = await fetchSentimentData(crypto);

        if (apiResponse && (apiResponse.data || apiResponse)) {
          const result = transformApiDataToSentiment(apiResponse);
          setSentiment(result);
        } else {
          console.error("No sentiment data received from API");
          setSentiment(null);
        }
      } catch (error) {
        console.error("Error fetching sentiment data:", error);
        setSentiment(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
    <TooltipProvider>
      <div className="space-y-6">
        {/* Hero Card - Large Donut Chart */}
        <Card className={`p-8 bg-gradient-to-br ${sentimentGradient} border-border/50 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-2">
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">Overall market sentiment combining social media, news, and community discussions. Higher scores indicate bullish sentiment.</p>
                </TooltipContent>
              </Tooltip>
            </div>
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
          // Use real historical data - no mock trend data
          const trendData = source.trend || [source.sentiment];
          
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
            <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary shrink-0" />
              <span>Fear & Greed Index</span>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">Measures market emotion. Extreme fear (low values) may signal buying opportunities, while extreme greed (high values) may signal caution.</p>
                </TooltipContent>
              </Tooltip>
            </h3>
          <ProgressGauge
            value={fearGreed}
            zones={[
              { min: 0, max: 25, color: "#EF4444", label: "Fear" },
              { min: 25, max: 45, color: "#F59E0B", label: "Caution" },
              { min: 45, max: 55, color: "#FBBF24", label: "Neutral" },
              { min: 55, max: 75, color: "#34D399", label: "Greed" },
              { min: 75, max: 100, color: "#10B981", label: "Extreme" },
            ]}
          />
        </Card>

          {/* Social Volume - 3D Bar Chart */}
          <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 overflow-hidden">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 truncate">
              <Zap className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="truncate">Social Volume (7 Days)</span>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">Total mentions across social platforms. Spikes often correlate with significant price movements or news events.</p>
                </TooltipContent>
              </Tooltip>
            </h3>
          <div className="overflow-hidden">
            <HistogramChart
              data={sentiment.socialVolume || [
                { label: "Mon", value: 0 },
                { label: "Tue", value: 0 },
                { label: "Wed", value: 0 },
                { label: "Thu", value: 0 },
                { label: "Fri", value: 0 },
                { label: "Sat", value: 0 },
                { label: "Sun", value: 0 },
              ]}
              height={120}
              positiveColor="#A855F7"
              negativeColor="#EC4899"
            />
          </div>
        </Card>
      </div>

        {/* Recent Trends - Timeline */}
        <Card className="p-6 bg-gradient-to-br from-background/95 to-background/80 border-border/50 overflow-hidden">
          <h3 className="text-sm font-semibold mb-6 flex items-center gap-2 truncate">
            <TrendingUp className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">Sentiment Timeline (7 Days)</span>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">Daily sentiment trends showing shifts in market mood. Look for consistent patterns or sudden changes that may signal trend reversals.</p>
              </TooltipContent>
            </Tooltip>
          </h3>
        <TimelineChart
          events={sentiment.sentimentTimeline || [
            { date: "Sun", value: sentiment.score, change: 0, sentiment: (sentiment.label === "Bullish" || sentiment.label === "Very Bullish" ? "bullish" : sentiment.label === "Bearish" || sentiment.label === "Very Bearish" ? "bearish" : "neutral") as "bullish" | "bearish" | "neutral" },
          ]}
        />

          {/* 7-Day Heatmap */}
          <div className="mt-8">
            <h4 className="text-sm font-semibold mb-3 text-center text-muted-foreground flex items-center justify-center gap-2">
              Weekly Sentiment Heatmap
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">Visual intensity map of daily sentiment. Darker colors indicate stronger sentiment (green for bullish, red for bearish).</p>
                </TooltipContent>
              </Tooltip>
            </h4>
            <SentimentHeatmap dailyValues={sentiment.sentimentTimeline?.map(t => t.value) || [sentiment.score]} />
          </div>
        </Card>
      </div>
    </TooltipProvider>
  );
};
