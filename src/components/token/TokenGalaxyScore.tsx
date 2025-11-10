import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, Users, MessageSquare, Target, Trophy, Activity, Info } from "lucide-react";
import { useLunarCrushMetrics } from "@/hooks/useLunarCrushMetrics";

interface TokenGalaxyScoreProps {
  tokenSymbol: string;
}

export const TokenGalaxyScore: React.FC<TokenGalaxyScoreProps> = ({ tokenSymbol }) => {
  const { data: metrics, isLoading, error } = useLunarCrushMetrics(tokenSymbol);

  if (isLoading) {
    return (
      <Card className="bg-card border-border animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-48 bg-muted rounded"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state with helpful message
  if (error || !metrics) {
    console.log('[TokenGalaxyScore] Error or no metrics:', { error, tokenSymbol });
    return null;
  }

  const galaxyScore = metrics.galaxy_score || 0;
  const getScoreColor = (score: number) => {
    if (score >= 70) return { color: "text-green-500", bg: "bg-green-500" };
    if (score >= 40) return { color: "text-yellow-500", bg: "bg-yellow-500" };
    return { color: "text-red-500", bg: "bg-red-500" };
  };

  const scoreColors = getScoreColor(galaxyScore);
  const bullishPercent = ((metrics.bullish_sentiment || 0.5) * 100).toFixed(0);
  const bearishPercent = ((metrics.bearish_sentiment || 0.5) * 100).toFixed(0);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Social Metrics & Galaxy Score
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Galaxy Score is a proprietary metric (0-100) that measures overall health based on social activity, price performance, and market sentiment.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Galaxy Score Gauge */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-48 h-48">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-muted"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={`${(galaxyScore / 100) * 552.92} 552.92`}
                className={`${scoreColors.bg} transition-all duration-1000 ease-out`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-bold ${scoreColors.color}`}>
                {galaxyScore}
              </span>
              <span className="text-sm text-muted-foreground mt-1">Galaxy Score</span>
              <Badge variant="outline" className="mt-2">
                {galaxyScore >= 70 ? "Excellent" : galaxyScore >= 40 ? "Good" : "Fair"}
              </Badge>
            </div>
          </div>

          {/* Sentiment Breakdown */}
          <div className="flex-1 w-full space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Market Sentiment</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-500 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Bullish
                  </span>
                  <span className="font-semibold text-green-500">{bullishPercent}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${bullishPercent}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm mt-3">
                  <span className="text-red-500 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 rotate-180" />
                    Bearish
                  </span>
                  <span className="font-semibold text-red-500">{bearishPercent}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{ width: `${bearishPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                Updated {new Date().toLocaleTimeString()} • Data from LunarCrush
              </p>
            </div>
          </div>
        </div>

        {/* Social Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <p className="text-xs text-muted-foreground">Social Volume</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {(metrics.social_volume_24h || 0).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">24h mentions</p>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-purple-500" />
              <p className="text-xs text-muted-foreground">Engagement</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {(metrics.social_engagement_24h || 0).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">24h interactions</p>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-green-500" />
              <p className="text-xs text-muted-foreground">Contributors</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {(metrics.social_contributors || 0).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">unique users</p>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-orange-500" />
              <p className="text-xs text-muted-foreground">Dominance</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {(metrics.social_dominance || 0).toFixed(2)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">market share</p>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <p className="text-xs text-muted-foreground">Alt Rank</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              #{metrics.alt_rank || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">global position</p>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-pink-500" />
              <p className="text-xs text-muted-foreground">Price Score</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {metrics.price_score || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">out of 100</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
