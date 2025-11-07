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
    <div className="relative w-full py-6 px-2 overflow-hidden">
      {/* Timeline line */}
      <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-red-500/30 via-amber-500/30 to-emerald-500/30" />

      {/* Events */}
      <div className="relative flex justify-between items-center px-2">
        {events.map((event, index) => {
          const Icon = getSentimentIcon(event.sentiment);
          return (
            <div key={index} className="flex flex-col items-center gap-1 relative group min-w-0">
              {/* Emoji */}
              <div className="text-lg sm:text-xl animate-bounce" style={{ animationDelay: `${index * 100}ms` }}>
                {getSentimentEmoji(event.sentiment)}
              </div>

              {/* Dot */}
              <div className={`w-2 h-2 rounded-full border-2 ${getSentimentColor(event.sentiment)} shrink-0`} />

              {/* Date label */}
              <div className="text-[10px] text-gray-400 mt-1 truncate max-w-[40px]">
                {event.date}
              </div>

              {/* Info card - appears on hover */}
              <div className="absolute top-full mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                <div className={`px-2 py-1.5 rounded-lg border ${getSentimentColor(event.sentiment)} whitespace-nowrap shadow-lg`}>
                  <div className="text-[10px] font-semibold">{event.date}</div>
                  <div className="text-xs font-bold mt-0.5">{event.value}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Icon className="w-2.5 h-2.5" />
                    <span className="text-[10px]">{event.change > 0 ? "+" : ""}{event.change.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Animated pulse traveling */}
      <div className="absolute top-1/2 left-4 w-1.5 h-1.5 rounded-full bg-primary animate-pulse">
        <div className="absolute inset-0 rounded-full bg-primary/50 animate-ping" />
      </div>
    </div>
  );
};
