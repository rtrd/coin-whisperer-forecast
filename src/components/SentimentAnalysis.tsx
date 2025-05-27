
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, MessageCircle, TrendingUp, Users, Globe } from "lucide-react";

interface SentimentData {
  score: number;
  label: 'Very Bearish' | 'Bearish' | 'Neutral' | 'Bullish' | 'Very Bullish';
  sources: {
    name: string;
    sentiment: number;
    mentions: number;
  }[];
}

interface SentimentAnalysisProps {
  crypto: string;
}

export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ crypto }) => {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate sentiment analysis data
    const generateSentimentData = (): SentimentData => {
      const score = Math.random() * 100;
      const getSentimentLabel = (score: number) => {
        if (score < 20) return 'Very Bearish';
        if (score < 40) return 'Bearish';
        if (score < 60) return 'Neutral';
        if (score < 80) return 'Bullish';
        return 'Very Bullish';
      };

      return {
        score,
        label: getSentimentLabel(score),
        sources: [
          {
            name: 'Twitter/X',
            sentiment: Math.random() * 100,
            mentions: Math.floor(Math.random() * 10000) + 1000
          },
          {
            name: 'Reddit',
            sentiment: Math.random() * 100,
            mentions: Math.floor(Math.random() * 5000) + 500
          },
          {
            name: 'News Media',
            sentiment: Math.random() * 100,
            mentions: Math.floor(Math.random() * 1000) + 100
          },
          {
            name: 'Crypto Forums',
            sentiment: Math.random() * 100,
            mentions: Math.floor(Math.random() * 2000) + 200
          }
        ]
      };
    };

    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setSentiment(generateSentimentData());
      setIsLoading(false);
    }, 1500);
  }, [crypto]);

  const getSentimentColor = (score: number) => {
    if (score < 20) return 'text-red-500 border-red-500';
    if (score < 40) return 'text-red-400 border-red-400';
    if (score < 60) return 'text-yellow-400 border-yellow-400';
    if (score < 80) return 'text-green-400 border-green-400';
    return 'text-green-500 border-green-500';
  };

  const getSentimentIcon = (score: number) => {
    if (score < 40) return <TrendingUp className="h-4 w-4 rotate-180" />;
    if (score < 60) return <Heart className="h-4 w-4" />;
    return <TrendingUp className="h-4 w-4" />;
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Twitter/X': return <MessageCircle className="h-4 w-4 text-blue-400" />;
      case 'Reddit': return <Users className="h-4 w-4 text-orange-400" />;
      case 'News Media': return <Globe className="h-4 w-4 text-purple-400" />;
      default: return <MessageCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-400" />
            Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
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
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Unable to load sentiment data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-400" />
          Market Sentiment
        </CardTitle>
        <CardDescription className="text-gray-300">
          Social media and news sentiment for {crypto.toUpperCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Sentiment */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            {getSentimentIcon(sentiment.score)}
            <Badge variant="outline" className={getSentimentColor(sentiment.score)}>
              {sentiment.label}
            </Badge>
          </div>
          <div className="text-3xl font-bold text-white">
            {sentiment.score.toFixed(0)}/100
          </div>
          <Progress value={sentiment.score} className="h-3" />
        </div>

        {/* Source Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Sentiment by Source</h4>
          <div className="space-y-3">
            {sentiment.sources.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getSourceIcon(source.name)}
                    <span className="text-sm text-gray-300">{source.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {source.mentions.toLocaleString()} mentions
                    </span>
                    <Badge variant="outline" className={`${getSentimentColor(source.sentiment)} text-xs`}>
                      {source.sentiment.toFixed(0)}
                    </Badge>
                  </div>
                </div>
                <Progress value={source.sentiment} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Indicators */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-700/30 rounded-lg text-center">
            <p className="text-xs text-gray-400">Fear & Greed</p>
            <p className="text-lg font-bold text-white">{(sentiment.score * 0.8 + 10).toFixed(0)}</p>
            <p className="text-xs text-gray-400">
              {sentiment.score > 50 ? 'Greed' : 'Fear'}
            </p>
          </div>
          <div className="p-3 bg-gray-700/30 rounded-lg text-center">
            <p className="text-xs text-gray-400">Social Volume</p>
            <p className="text-lg font-bold text-white">
              {sentiment.sources.reduce((acc, s) => acc + s.mentions, 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">24h mentions</p>
          </div>
        </div>

        {/* Recent Trends */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Recent Trends</h4>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">vs Yesterday</span>
              <span className={sentiment.score > 50 ? 'text-green-400' : 'text-red-400'}>
                {sentiment.score > 50 ? '+' : ''}{(sentiment.score - 50).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">vs Last Week</span>
              <span className={sentiment.score > 45 ? 'text-green-400' : 'text-red-400'}>
                {sentiment.score > 45 ? '+' : ''}{(sentiment.score - 45).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
