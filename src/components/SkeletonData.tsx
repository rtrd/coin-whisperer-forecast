
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, TrendingUp, Activity, BarChart3, Zap } from "lucide-react";

export const PredictionSkeleton = () => (
  <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-700/50">
    <CardHeader>
      <CardTitle className="text-white flex items-center gap-2">
        <Brain className="h-5 w-5 text-purple-400" />
        AI Prediction Analysis
        <Badge className="bg-purple-600">PREMIUM</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Price Target (7 days)</span>
            <div className="flex items-center gap-1 text-green-400">
              <TrendingUp className="h-4 w-4" />
              <Skeleton className="h-6 w-16 bg-gray-700" />
            </div>
          </div>
          <Skeleton className="h-2 w-full bg-gray-700" />
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-24 bg-gray-700" />
                <Skeleton className="h-4 w-12 bg-gray-700" />
              </div>
              <Skeleton className="h-3 w-full bg-gray-700 mb-2" />
              <Skeleton className="h-1 w-full bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const TechnicalAnalysisSkeleton = () => (
  <Card className="bg-gray-800/50 border-gray-700">
    <CardHeader>
      <CardTitle className="text-white flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-blue-400" />
        Technical Indicators
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-3 bg-gray-700/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-4 w-16 bg-gray-600" />
              <Skeleton className="h-4 w-12 bg-gray-600" />
            </div>
            <Skeleton className="h-2 w-full bg-gray-600" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const SentimentSkeleton = () => (
  <Card className="bg-gray-800/50 border-gray-700">
    <CardHeader>
      <CardTitle className="text-white flex items-center gap-2">
        <Activity className="h-5 w-5 text-green-400" />
        Market Sentiment
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="text-center">
          <Skeleton className="h-8 w-20 bg-gray-700 mx-auto mb-2" />
          <Skeleton className="h-4 w-32 bg-gray-700 mx-auto" />
        </div>
        
        <div className="space-y-3">
          {['Social Media', 'News Sentiment', 'Trading Volume'].map((item) => (
            <div key={item} className="flex justify-between items-center">
              <span className="text-gray-300">{item}</span>
              <Skeleton className="h-4 w-16 bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const AITradingSignalsSkeleton = () => (
  <Card className="mb-6 bg-gray-800/50 border-gray-700 shadow-2xl">
    <CardHeader>
      <CardTitle className="text-white flex items-center gap-2">
        <Brain className="h-5 w-5 text-purple-400" />
        AI Trading Signals
        <Badge className="bg-green-600">Live Data</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Market Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Market Sentiment
            </h3>
            <Skeleton className="h-6 w-12 bg-gray-700" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 bg-gray-700" />
            <Skeleton className="h-4 w-full bg-gray-700" />
            <Skeleton className="h-2 w-full bg-gray-700" />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-white font-medium flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-blue-400" />
            Live Market Alerts
          </h3>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-2 p-2 border border-gray-600 rounded">
                <Skeleton className="h-3 w-3 bg-gray-700 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-20 bg-gray-700 mb-1" />
                  <Skeleton className="h-2 w-full bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trading Recommendations */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-white font-medium flex items-center gap-2 mb-4">
          <BarChart3 className="h-4 w-4 text-purple-400" />
          AI Trading Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-700/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-12 bg-gray-600" />
                <Skeleton className="h-5 w-16 bg-gray-600" />
              </div>
              <Skeleton className="h-3 w-full bg-gray-600" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16 bg-gray-600" />
                <Skeleton className="h-3 w-12 bg-gray-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);
