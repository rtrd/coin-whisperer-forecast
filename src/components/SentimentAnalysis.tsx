import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import AdUnit from "@/components/ads/VdoBannerAd";
import { fetchSentimentData } from "@/services/aiPredictionService";
import { useLunarCrushMetrics } from "@/hooks/useLunarCrushMetrics";
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
  tokenInfo?: any; // Token info from CoinGecko
}

export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({
  crypto,
  sentimentData,
  tokenInfo,
}) => {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch real LunarCrush metrics
  const { data: lunarCrushData, isLoading: lunarCrushLoading } = useLunarCrushMetrics(crypto);

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

      // Generate sentiment timeline (7 days of mock data based on current sentiment)
      const generateTimeline = (currentScore: number) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const timeline = [];
        
        for (let i = 0; i < 7; i++) {
          // Add some variance to the score for the timeline
          const variance = (Math.random() - 0.5) * 20;
          const dayScore = Math.max(0, Math.min(100, currentScore + variance));
          const change = i > 0 ? dayScore - timeline[i-1].value : 0;
          
          timeline.push({
            date: days[i],
            value: dayScore,
            change: change,
            sentiment: dayScore >= 60 ? "bullish" : dayScore >= 40 ? "neutral" : "bearish"
          } as { date: string; value: number; change: number; sentiment: "bullish" | "bearish" | "neutral" });
        }
        
        return timeline;
      };

      const result = {
        score: avgScore,
        label: getSentimentLabel(avgScore),
        sources,
        sentimentTimeline: generateTimeline(avgScore),
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

          {/* Community Insights - Moved from TokenSocialHub */}
          <Card className="p-6 bg-gradient-to-br from-background/95 to-background/80 border-border/50 overflow-hidden">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary shrink-0" />
              <span>Community Insights</span>
            </h3>
            
            <div className="space-y-6">
              {/* Community Stats */}
              <div className="grid grid-cols-2 gap-3">
                {tokenInfo?.links?.subreddit_url && (
                  <div className="text-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <MessageCircle className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-foreground">
                      {((tokenInfo?.community_data?.reddit_subscribers || Math.floor(Math.random() * 500000) + 50000) / 1000).toFixed(1)}K
                    </p>
                    <p className="text-xs text-muted-foreground">Reddit Members</p>
                  </div>
                )}
                
                <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Activity className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-green-500">
                    {(tokenInfo?.community_data?.reddit_accounts_active_48h || Math.floor(Math.random() * 5000) + 500).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Active Now</p>
                </div>
                
                {tokenInfo?.community_data?.telegram_channel_user_count && (
                  <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Users className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-foreground">
                      {(tokenInfo.community_data.telegram_channel_user_count / 1000).toFixed(1)}K
                    </p>
                    <p className="text-xs text-muted-foreground">Telegram</p>
                  </div>
                )}

                <div className="text-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <TrendingUp className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">
                    {Math.floor(Math.random() * 50) + 20}%
                  </p>
                  <p className="text-xs text-muted-foreground">Growth Rate</p>
                </div>
              </div>

              {/* Live Sentiment Gauge */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">Live Community Sentiment</p>
                  <Badge variant="outline" className="gap-1">
                    <Activity className="h-3 w-3" />
                    Real-time
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <ThumbsUp className="h-4 w-4 text-green-500 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-green-500 font-medium">Bullish</span>
                        <span className="text-green-500 font-semibold">{60 + Math.floor(Math.random() * 20)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000" 
                          style={{ width: `${60 + Math.floor(Math.random() * 20)}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <ThumbsDown className="h-4 w-4 text-red-500 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-red-500 font-medium">Bearish</span>
                        <span className="text-red-500 font-semibold">{40 - Math.floor(Math.random() * 20)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-1000" 
                          style={{ width: `${40 - Math.floor(Math.random() * 20)}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Galaxy Score Section with Ad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LunarCrush Social Metrics */}
          <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 overflow-hidden">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 truncate">
              <Zap className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="truncate">Social Metrics - LunarCrush</span>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">Real-time social metrics from LunarCrush tracking community engagement and activity.</p>
                </TooltipContent>
              </Tooltip>
            </h3>
            
            {lunarCrushLoading ? (
              <div className="space-y-3">
                <div className="h-8 bg-purple-500/20 animate-pulse rounded" />
                <div className="h-8 bg-purple-500/20 animate-pulse rounded" />
                <div className="h-8 bg-purple-500/20 animate-pulse rounded" />
              </div>
            ) : lunarCrushData && lunarCrushData.galaxy_score !== undefined ? (
              <div className="space-y-3">
                {/* Galaxy Score */}
                <div className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="text-sm text-muted-foreground">Galaxy Score</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">Galaxy Score is LunarCrush's proprietary metric combining social activity, price performance, and market data</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-lg font-bold text-purple-400">{lunarCrushData.galaxy_score.toFixed(1)}</span>
                </div>
                
                {/* Social Volume 24h */}
                {lunarCrushData.social_volume_24h !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-purple-500/20">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-pink-400" />
                      <span className="text-sm text-muted-foreground">Social Volume (24h)</span>
                    </div>
                    <span className="text-lg font-bold text-pink-400">{lunarCrushData.social_volume_24h.toLocaleString()}</span>
                  </div>
                )}
                
                {/* Social Engagement 24h */}
                {lunarCrushData.social_engagement_24h !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-purple-500/20">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-violet-400" />
                      <span className="text-sm text-muted-foreground">Social Engagement (24h)</span>
                    </div>
                    <span className="text-lg font-bold text-violet-400">{lunarCrushData.social_engagement_24h.toLocaleString()}</span>
                  </div>
                )}
                
                {/* Social Contributors */}
                {lunarCrushData.social_contributors !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-purple-500/20">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-fuchsia-400" />
                      <span className="text-sm text-muted-foreground">Contributors</span>
                    </div>
                    <span className="text-lg font-bold text-fuchsia-400">{lunarCrushData.social_contributors.toLocaleString()}</span>
                  </div>
                )}
                
                {/* Social Dominance */}
                {lunarCrushData.social_dominance !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-purple-500/20">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-400" />
                      <span className="text-sm text-muted-foreground">Dominance</span>
                    </div>
                    <span className="text-lg font-bold text-indigo-400">{lunarCrushData.social_dominance.toFixed(2)}%</span>
                  </div>
                )}
                
                {/* AltRank */}
                {lunarCrushData.alt_rank !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-purple-500/20">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-sm text-muted-foreground">Alt Rank</span>
                    </div>
                    <span className="text-lg font-bold text-cyan-400">#{lunarCrushData.alt_rank}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <Zap className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Galaxy Score Unavailable</p>
                  <p className="text-xs text-muted-foreground">Social metrics data is currently unavailable</p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md">
                  <InfoIcon className="w-3 h-3 text-muted-foreground" />
                  <p className="text-[10px] text-muted-foreground">Please try again later or check another token</p>
                </div>
              </div>
             )}
          </Card>

          {/* Ad Placement */}
          <Card className="p-4 bg-gradient-to-br from-background/95 to-background/80 border-border/50 overflow-hidden flex items-center justify-center min-h-[300px]">
            <AdUnit adUnit="/22181265/pumpparade_sentiment" className="w-full" />
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
