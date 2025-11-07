import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Calendar, Target, Activity } from "lucide-react";
import { formatPrice } from "@/utils/formatters";

interface TokenPriceTimelineProps {
  currentPrice: number;
  ath?: number;
  atl?: number;
  priceChange1h?: number;
  priceChange24h?: number;
  priceChange7d?: number;
  priceChange14d?: number;
  priceChange30d?: number;
  priceChange60d?: number;
  priceChange200d?: number;
  priceChange1y?: number;
  athDate?: string;
  atlDate?: string;
}

export const TokenPriceTimeline: React.FC<TokenPriceTimelineProps> = ({
  currentPrice,
  ath,
  atl,
  priceChange24h,
  priceChange7d,
  priceChange30d,
  athDate,
  atlDate,
}) => {
  const calculatePercentFromATH = () => {
    if (!ath || !currentPrice) return null;
    return (((currentPrice - ath) / ath) * 100).toFixed(2);
  };

  const calculatePercentFromATL = () => {
    if (!atl || !currentPrice) return null;
    return (((currentPrice - atl) / atl) * 100).toFixed(2);
  };

  const percentFromATH = calculatePercentFromATH();
  const percentFromATL = calculatePercentFromATL();

  const timelineItems = [
    { period: "1H", change: priceChange24h, color: "from-purple-500 to-pink-500" },
    { period: "24H", change: priceChange24h, color: "from-blue-500 to-cyan-500" },
    { period: "7D", change: priceChange7d, color: "from-emerald-500 to-teal-500" },
    { period: "30D", change: priceChange30d, color: "from-orange-500 to-amber-500" },
  ];

  const getChangeColor = (change: number | undefined) => {
    if (!change) return "text-muted-foreground";
    return change > 0 ? "text-emerald-400" : change < 0 ? "text-red-400" : "text-muted-foreground";
  };

  const getChangeIcon = (change: number | undefined) => {
    if (!change) return Minus;
    return change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  };

  return (
    <Card className="bg-gradient-to-br from-background/95 to-background/80 border-border/50 shadow-xl overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Price Performance
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Historical price changes across different timeframes</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Modern Timeline Grid */}
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
            {timelineItems.map((item, index) => {
              const Icon = getChangeIcon(item.change);
              const colorClass = getChangeColor(item.change);
              const isPositive = item.change && item.change > 0;
              const isNegative = item.change && item.change < 0;
              
              return (
                <div 
                  key={item.period}
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card */}
                  <div className={`bg-gradient-to-br ${item.color} p-[2px] rounded-xl group-hover:scale-105 transition-all duration-300`}>
                    <div className="bg-background/95 backdrop-blur-sm rounded-xl p-4 h-full">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${item.color} bg-opacity-20`}>
                            <Icon className={`h-4 w-4 ${colorClass}`} />
                          </div>
                          <span className="text-xs font-semibold text-muted-foreground">{item.period}</span>
                        </div>
                        <Calendar className="h-3 w-3 text-muted-foreground/50" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className={`text-2xl font-bold ${colorClass}`}>
                          {item.change !== undefined ? (
                            <>
                              {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}%
                            </>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </div>
                        
                        {/* Mini progress bar */}
                        {item.change !== undefined && (
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 bg-gradient-to-r ${item.color}`}
                              style={{ 
                                width: `${Math.min(Math.abs(item.change) * 2, 100)}%`,
                                animation: 'slide-in-right 1s ease-out'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ATH/ATL Showcase */}
        <div className="grid md:grid-cols-2 gap-4 pt-2">
          {/* All Time High */}
          {ath && (
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 p-6 group hover:border-emerald-500/40 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <Target className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-emerald-400">All-Time High</div>
                      {athDate && (
                        <div className="text-[10px] text-muted-foreground">
                          {new Date(athDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-emerald-400/30" />
                </div>
                
                <div className="text-3xl font-bold text-foreground">{formatPrice(ath)}</div>
                
                {percentFromATH && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                        style={{ width: `${Math.min(Math.abs(parseFloat(percentFromATH)), 100)}%` }}
                      />
                    </div>
                    <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10 font-mono text-xs shrink-0">
                      {percentFromATH}%
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* All Time Low */}
          {atl && (
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent border border-cyan-500/20 p-6 group hover:border-cyan-500/40 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-cyan-500/20">
                      <Target className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-cyan-400">All-Time Low</div>
                      {atlDate && (
                        <div className="text-[10px] text-muted-foreground">
                          {new Date(atlDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <TrendingDown className="h-8 w-8 text-cyan-400/30" />
                </div>
                
                <div className="text-3xl font-bold text-foreground">{formatPrice(atl)}</div>
                
                {percentFromATL && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        style={{ width: `${Math.min(parseFloat(percentFromATL), 100)}%` }}
                      />
                    </div>
                    <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10 font-mono text-xs shrink-0">
                      +{percentFromATL}%
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
