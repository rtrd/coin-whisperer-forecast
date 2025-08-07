import React from 'react';
import { Badge } from "@/components/ui/badge";
import { getSentimentIcon } from '@/utils/tradingSignalsHelpers';
import { MarketAnalysis } from '@/types/tradingSignals';

interface MarketSentimentOverviewProps {
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  sentimentScore: number;
  marketAnalysis: MarketAnalysis;
}

export const MarketSentimentOverview: React.FC<MarketSentimentOverviewProps> = ({
  marketSentiment,
  sentimentScore,
  marketAnalysis
}) => {
  const SentimentIcon = getSentimentIcon(marketSentiment);
  const currentAnalysis = marketAnalysis[marketSentiment];

  return (
    <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/40 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium flex items-center gap-2">
          <SentimentIcon className="h-4 w-4" />
          Market Sentiment
        </h3>
        <Badge variant="outline" className={`${currentAnalysis.color} border-current text-xs`}>
          {sentimentScore}%
        </Badge>
      </div>
      <div className="space-y-3">
        <div className={`font-semibold text-sm ${currentAnalysis.color}`}>
          {currentAnalysis.title}
        </div>
        <p className="text-gray-300 text-xs leading-relaxed">
          {currentAnalysis.description}
        </p>
        <div className="w-full bg-gray-700/50 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-1000 ${
              marketSentiment === 'bullish' ? 'bg-green-400' : 
              marketSentiment === 'bearish' ? 'bg-red-400' : 'bg-yellow-400'
            }`}
            style={{ width: `${sentimentScore}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};