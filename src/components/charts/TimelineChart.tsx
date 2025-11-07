import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TimelineEvent {
  date: string;
  value: number;
  change: number;
  sentiment: "bullish" | "bearish" | "neutral";
}

interface TimelineChartProps {
  events: TimelineEvent[];
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ events }) => {
  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case "bullish": return "🤑";
      case "bearish": return "😰";
      default: return "😐";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish": return TrendingUp;
      case "bearish": return TrendingDown;
      default: return Minus;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish": return "text-emerald-400 bg-emerald-900/30 border-emerald-500/50";
      case "bearish": return "text-red-400 bg-red-900/30 border-red-500/50";
      default: return "text-amber-400 bg-amber-900/30 border-amber-500/50";
    }
  };

  return (
    <div className="relative w-full py-6">
      {/* Timeline line */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500/30 via-amber-500/30 to-emerald-500/30" />

      {/* Events */}
      <div className="relative flex justify-between items-center">
        {events.map((event, index) => {
          const Icon = getSentimentIcon(event.sentiment);
          return (
            <div key={index} className="flex flex-col items-center gap-2 relative group">
              {/* Emoji */}
              <div className="text-2xl animate-bounce" style={{ animationDelay: `${index * 100}ms` }}>
                {getSentimentEmoji(event.sentiment)}
              </div>

              {/* Dot */}
              <div className={`w-3 h-3 rounded-full border-2 ${getSentimentColor(event.sentiment)}`} />

              {/* Info card - appears on hover */}
              <div className="absolute top-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <div className={`px-3 py-2 rounded-lg border ${getSentimentColor(event.sentiment)} whitespace-nowrap`}>
                  <div className="text-xs font-semibold">{event.date}</div>
                  <div className="text-sm font-bold mt-1">{event.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Icon className="w-3 h-3" />
                    <span className="text-xs">{event.change > 0 ? "+" : ""}{event.change.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Animated pulse traveling */}
      <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-primary animate-pulse">
        <div className="absolute inset-0 rounded-full bg-primary/50 animate-ping" />
      </div>
    </div>
  );
};
