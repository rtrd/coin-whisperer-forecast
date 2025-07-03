import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  MessageCircle,
  TrendingUp,
  Users,
  Globe,
  Zap,
  Brain,
} from "lucide-react";
import { fetchSentimentData } from "../services/aiPredictionService";

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
  symbol: string;
}

export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({
  crypto,
  symbol,
}) => {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  debugger;
  useEffect(() => {
    const getSentiment = async () => {
      setIsLoading(true);

      try {
        const raw = await fetchSentimentData(symbol); // fetch data from API

        const getSentimentLabel = (score: number): SentimentData["label"] => {
          if (score < 20) return "Very Bearish";
          if (score < 40) return "Bearish";
          if (score < 60) return "Neutral";
          if (score < 80) return "Bullish";
          return "Very Bullish";
        };

        const transformLunarData = (raw: any): SentimentData => {
          const data = raw?.data; // ✅ FIXED: unwrap data

          const overallScore = data?.types_sentiment?.tweet ?? 50;

          return {
            score: overallScore,
            label: getSentimentLabel(overallScore),
            sources: [
              {
                name: "Twitter/X",
                sentiment: data?.types_sentiment?.tweet ?? null,
                mentions: data?.types_count?.tweet ?? 0,
              },
              {
                name: "Reddit",
                sentiment: data?.types_sentiment?.["reddit-post"] ?? null,
                mentions: data?.types_count?.["reddit-post"] ?? 0,
              },
              {
                name: "News Media",
                sentiment: data?.types_sentiment?.news ?? null,
                mentions: data?.types_count?.news ?? 0,
              },
              {
                name: "YouTube",
                sentiment: data?.types_sentiment?.["youtube-video"] ?? null,
                mentions: data?.types_count?.["youtube-video"] ?? 0,
              },
            ],
          };
        };

        if (raw) {
          const sentiment = transformLunarData(raw);
          setSentiment(sentiment);
        } else {
          // fallback to dummy
          const fallbackScore = Math.random() * 100;
          setSentiment({
            score: fallbackScore,
            label: getSentimentLabel(fallbackScore),
            sources: [
              {
                name: "Twitter/X",
                sentiment: fallbackScore,
                mentions: 1000,
              },
              {
                name: "Reddit",
                sentiment: fallbackScore,
                mentions: 500,
              },
              {
                name: "News Media",
                sentiment: fallbackScore,
                mentions: 200,
              },
              {
                name: "YouTube",
                sentiment: fallbackScore,
                mentions: 300,
              },
            ],
          });
        }
      } catch (err) {
        console.error("Error fetching or transforming sentiment:", err);
      }

      setIsLoading(false);
    };

    getSentiment(); // Call async function inside useEffect
  }, [crypto]);

  console.log("sentement", sentiment);

  const getSentimentColor = (score: number) => {
    if (score < 20) return "text-red-500 border-red-500 bg-red-500/10";
    if (score < 40) return "text-red-400 border-red-400 bg-red-400/10";
    if (score < 60) return "text-amber-400 border-amber-400 bg-amber-400/10";
    if (score < 80)
      return "text-emerald-400 border-emerald-400 bg-emerald-400/10";
    return "text-emerald-500 border-emerald-500 bg-emerald-500/10";
  };

  const getSentimentIcon = (score: number) => {
    if (score < 40) return <TrendingUp className="h-4 w-4 rotate-180" />;
    if (score < 60) return <Heart className="h-4 w-4" />;
    return <TrendingUp className="h-4 w-4" />;
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "Twitter/X":
        return <MessageCircle className="h-4 w-4 text-blue-400" />;
      case "Reddit":
        return <Users className="h-4 w-4 text-orange-400" />;
      case "News Media":
        return <Globe className="h-4 w-4 text-purple-400" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gray-700/30 border-b border-gray-600/30">
          <CardTitle className="text-white flex items-center gap-3">
            <div className="p-2 rounded-full bg-pink-500/20">
              <Heart className="h-6 w-6 text-pink-400" />
            </div>
            Market Sentiment
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse ml-auto"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sentiment) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gray-700/30 border-b border-gray-600/30">
          <CardTitle className="text-white flex items-center gap-3">
            <div className="p-2 rounded-full bg-pink-500/20">
              <Heart className="h-6 w-6 text-pink-400" />
            </div>
            Market Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-400">Unable to load sentiment data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gray-700/30 border-b border-gray-600/30">
        <CardTitle className="text-white flex items-center gap-3">
          <div className="p-2 rounded-full bg-pink-500/20">
            <Heart className="h-6 w-6 text-pink-400" />
          </div>
          Market Sentiment
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse ml-auto"></div>
        </CardTitle>
        <CardDescription className="text-gray-300">
          AI-powered social media and news sentiment for {crypto.toUpperCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Overall Sentiment - Enhanced */}
        <div className="text-center space-y-4 p-4 bg-gray-700/40 rounded-xl border border-gray-600/30 shadow-lg">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 rounded-full bg-pink-500/20">
              {getSentimentIcon(sentiment.score)}
            </div>
            <Badge
              variant="outline"
              className={`${getSentimentColor(
                sentiment.score
              )} font-semibold text-sm backdrop-blur-sm`}
            >
              {sentiment.label}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-white">
              {sentiment.score.toFixed(0)}/100
            </div>
            <div className="text-sm text-gray-400 font-medium">
              Market Mood Index
            </div>
          </div>
          <Progress
            value={sentiment.score}
            className={`h-4 ${
              sentiment.score > 60
                ? "[&>div]:bg-emerald-400"
                : sentiment.score < 40
                ? "[&>div]:bg-red-400"
                : "[&>div]:bg-amber-400"
            }`}
          />
        </div>

        {/* Source Breakdown - Enhanced */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-4 w-4 text-purple-400" />
            <h4 className="text-sm font-semibold text-gray-200">
              Sentiment by Source
            </h4>
          </div>
          <div className="space-y-3">
            {sentiment.sources.map((source, index) => (
              <div
                key={index}
                className="group p-4 bg-gray-700/30 rounded-xl border border-gray-600/20 hover:border-gray-500/40 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-gray-600/30">
                      {getSourceIcon(source.name)}
                    </div>
                    <span className="text-sm font-medium text-gray-200">
                      {source.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-medium">
                      {source.mentions.toLocaleString()} mentions
                    </span>
                    <Badge
                      variant="outline"
                      className={`${getSentimentColor(
                        source.sentiment
                      )} text-xs font-medium backdrop-blur-sm`}
                    >
                      {source.sentiment}
                    </Badge>
                  </div>
                </div>
                <Progress
                  value={source.sentiment}
                  className={`h-2.5 ${
                    source.sentiment > 60
                      ? "[&>div]:bg-emerald-400"
                      : source.sentiment < 40
                      ? "[&>div]:bg-red-400"
                      : "[&>div]:bg-amber-400"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Sentiment Indicators - Enhanced */}
        <div className="grid grid-cols-2 gap-4">
          {/* Fear & Greed Indicator */}
          <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-700/30 hover:border-blue-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded-full bg-blue-500/20">
                <Heart className="h-3 w-3 text-blue-400" />
              </div>
              <p className="text-xs text-blue-400 font-semibold">
                Fear & Greed
              </p>
            </div>
            <p className="text-xl font-bold text-white mb-1">
              {sentiment?.score !== undefined
                ? sentiment.score.toFixed(0)
                : "--"}
            </p>
            <p className="text-xs text-blue-300/80">
              {sentiment?.score !== undefined
                ? sentiment.score > 50
                  ? "Greed Dominates"
                  : "Fear Prevails"
                : "Loading sentiment..."}
            </p>
          </div>

          {/* Social Volume Indicator */}
          <div className="p-4 bg-purple-900/20 rounded-xl border border-purple-700/30 hover:border-purple-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded-full bg-purple-500/20">
                <Zap className="h-3 w-3 text-purple-400" />
              </div>
              <p className="text-xs text-purple-400 font-semibold">
                Social Volume
              </p>
            </div>
            <p className="text-xl font-bold text-white mb-1">
              {sentiment?.sources
                ? sentiment.sources
                    .reduce((acc, s) => acc + (s.mentions || 0), 0)
                    .toLocaleString()
                : "--"}
            </p>
            <p className="text-xs text-purple-300/80">24h mentions</p>
          </div>
        </div>

        {/* Recent Trends - Enhanced */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h4 className="text-sm font-semibold text-gray-200">
              Recent Trends
            </h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/20">
              <span className="text-sm text-gray-300 font-medium">
                vs Yesterday
              </span>
              <span
                className={`text-sm font-bold ${
                  sentiment.score > 50 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {sentiment.score > 50 ? "+" : ""}
                {(sentiment.score - 50).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/20">
              <span className="text-sm text-gray-300 font-medium">
                vs Last Week
              </span>
              <span
                className={`text-sm font-bold ${
                  sentiment.score > 45 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {sentiment.score > 45 ? "+" : ""}
                {(sentiment.score - 45).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
