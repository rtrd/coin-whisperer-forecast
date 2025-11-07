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
      case "bullish": return "#10B981";
      case "bearish": return "#EF4444";
      default: return "#F59E0B";
    }
  };

  return (
    <div className="relative w-full px-4 py-8 overflow-hidden">
      {/* Timeline line */}
      <div className="absolute left-8 right-8 top-1/2 h-1 bg-gradient-to-r from-border via-muted to-border rounded-full" />

      {/* Events */}
      <div className="relative flex justify-between items-center gap-2">
        {events.map((event, index) => {
          const Icon = getSentimentIcon(event.sentiment);
          const color = getSentimentColor(event.sentiment);

          return (
            <div 
              key={index} 
              className="relative flex flex-col items-center group flex-1 min-w-0"
            >
              {/* Emoji indicator */}
              <div className="relative z-10 mb-4">
                <div className="text-2xl group-hover:scale-110 transition-transform">
                  {getSentimentEmoji(event.sentiment)}
                </div>
              </div>

              {/* Timeline dot */}
              <div
                className="w-4 h-4 rounded-full border-2 border-background shadow-lg relative z-10 group-hover:scale-125 transition-all"
                style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}80` }}
              />

              {/* Date label */}
              <div className="mt-4 text-xs font-medium truncate" style={{ color }}>
                {event.date}
              </div>

              {/* Hover info card */}
              <div className="absolute top-full mt-12 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-30 transform group-hover:translate-y-0 translate-y-2">
                <div 
                  className="bg-popover border-2 rounded-lg p-4 shadow-xl backdrop-blur-sm min-w-[140px]"
                  style={{ borderColor: color }}
                >
                  <div className="text-xs text-muted-foreground mb-2 font-medium">{event.date}</div>
                  <div className="text-lg font-bold text-popover-foreground mb-2">{event.value}</div>
                  <div className={`flex items-center gap-1.5 text-sm font-semibold`} style={{ color: event.change >= 0 ? '#10B981' : '#EF4444' }}>
                    <Icon className="w-4 h-4" />
                    <span>{event.change >= 0 ? '+' : ''}{event.change.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
