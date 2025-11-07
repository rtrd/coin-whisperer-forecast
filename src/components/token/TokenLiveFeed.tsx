import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Twitter, MessageCircle, TrendingUp } from "lucide-react";

interface TokenLiveFeedProps {
  tokenSymbol: string;
  tokenName: string;
}

interface FeedItem {
  id: number;
  type: "twitter" | "reddit" | "news";
  text: string;
  sentiment: "bullish" | "bearish" | "neutral";
  timestamp: string;
}

export const TokenLiveFeed: React.FC<TokenLiveFeedProps> = ({ tokenSymbol, tokenName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Mock feed data (in production, fetch from social APIs)
  const feedItems: FeedItem[] = [
    {
      id: 1,
      type: "twitter",
      text: `${tokenName} showing strong support at current levels. Technical indicators suggest potential breakout.`,
      sentiment: "bullish",
      timestamp: "2m ago",
    },
    {
      id: 2,
      type: "reddit",
      text: `Discussion: Is ${tokenName} undervalued at current price? Community weighs in.`,
      sentiment: "neutral",
      timestamp: "15m ago",
    },
    {
      id: 3,
      type: "news",
      text: `${tokenName} social volume spikes 45% - LunarCrush trending`,
      sentiment: "bullish",
      timestamp: "1h ago",
    },
    {
      id: 4,
      type: "twitter",
      text: `Whale alert: Large ${tokenSymbol.toUpperCase()} transaction detected on-chain`,
      sentiment: "neutral",
      timestamp: "2h ago",
    },
    {
      id: 5,
      type: "reddit",
      text: `${tokenName} community reaches new milestone in active users`,
      sentiment: "bullish",
      timestamp: "3h ago",
    },
  ];

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % feedItems.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, feedItems.length]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "bearish":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      case "reddit":
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const currentItem = feedItems[currentIndex];

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Live Social Feed
          <Badge variant="outline" className="ml-auto">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex gap-4 transition-transform duration-500 ease-in-out">
            <div className="min-w-full">
              <div className={`p-4 rounded-lg border ${getSentimentColor(currentItem.sentiment)}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getIcon(currentItem.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground mb-2">{currentItem.text}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{currentItem.timestamp}</span>
                      <Badge variant="outline" className="text-xs">
                        {currentItem.sentiment}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-4">
            {feedItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
