import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Crown, Volume2, Flame, RefreshCw, LayoutGrid, LayoutList } from "lucide-react";
import { usePopularMemecoins, SortOption } from "@/hooks/usePopularMemecoins";
import { openAffiliateLink } from "@/utils/affiliateLinks";

export const PopularMemecoins = () => {
  const { memecoins, loading, error, sortBy, setSortBy, refresh } = usePopularMemecoins();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(2);
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  const getPumpScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-600/20 text-green-400 border-green-500/30';
    if (score >= 6) return 'bg-orange-600/20 text-orange-400 border-orange-500/30';
    if (score >= 4) return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
    return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) return <Crown className="h-3 w-3 text-yellow-400" />;
    if (rank <= 10) return <Flame className="h-3 w-3 text-orange-400" />;
    return null;
  };

  if (loading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Popular Memecoins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-gray-700/30 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Popular Memecoins
            <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
              Real-time
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 z-50">
                <SelectItem value="volume" className="text-white hover:bg-gray-700 focus:bg-gray-700">Volume</SelectItem>
                <SelectItem value="market_cap" className="text-white hover:bg-gray-700 focus:bg-gray-700">Market Cap</SelectItem>
                <SelectItem value="price_change_24h" className="text-white hover:bg-gray-700 focus:bg-gray-700">24h Change</SelectItem>
                <SelectItem value="pump_score" className="text-white hover:bg-gray-700 focus:bg-gray-700">Pump Score</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 bg-gray-700/50 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`h-8 w-8 p-0 ${
                  viewMode === "grid" 
                    ? "bg-gray-600 text-white" 
                    : "text-gray-400 hover:text-white hover:bg-gray-600/50"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`h-8 w-8 p-0 ${
                  viewMode === "list" 
                    ? "bg-gray-600 text-white" 
                    : "text-gray-400 hover:text-white hover:bg-gray-600/50"
                }`}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-400 text-sm mb-4 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
            {error} - Showing cached data
          </div>
        )}
        
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memecoins.map((coin, index) => (
              <Card 
                key={coin.id}
                className="bg-gray-700/30 border-gray-600 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={coin.image} 
                          alt={coin.name}
                          className="w-10 h-10 rounded-full"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        {getRankBadge(coin.market_cap_rank) && (
                          <div className="absolute -top-1 -right-1 bg-gray-800 rounded-full p-1">
                            {getRankBadge(coin.market_cap_rank)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{coin.symbol}</h4>
                        <p className="text-gray-400 text-xs truncate max-w-20">{coin.name}</p>
                      </div>
                    </div>
                    <Badge className={`text-xs px-2 py-1 ${getPumpScoreColor(coin.pumpScore)}`}>
                      {coin.pumpScore.toFixed(1)}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Price</span>
                      <span className="text-white font-mono text-sm">{formatPrice(coin.current_price)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">24h Change</span>
                      <div className={`flex items-center gap-1 text-sm ${
                        coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {coin.price_change_percentage_24h >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span className="font-mono">
                          {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                          {coin.price_change_percentage_24h.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Volume2 className="h-3 w-3" />
                        Volume
                      </span>
                      <span className="text-gray-300 text-sm font-mono">${formatNumber(coin.total_volume)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Market Cap</span>
                      <span className="text-gray-300 text-sm font-mono">${formatNumber(coin.market_cap)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Rank</span>
                      <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                        #{coin.market_cap_rank}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xs h-8 font-semibold"
                      onClick={() => openAffiliateLink(coin.symbol)}
                    >
                      Trade on eToro
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {memecoins.map((coin, index) => (
              <Card 
                key={coin.id}
                className="bg-gray-700/30 border-gray-600 hover:bg-gray-700/50 transition-all duration-300"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={coin.image} 
                            alt={coin.name}
                            className="w-10 h-10 rounded-full"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                          {getRankBadge(coin.market_cap_rank) && (
                            <div className="absolute -top-1 -right-1 bg-gray-800 rounded-full p-1">
                              {getRankBadge(coin.market_cap_rank)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{coin.symbol}</h4>
                          <p className="text-gray-400 text-xs">{coin.name}</p>
                        </div>
                      </div>
                      
                      <Badge className={`text-xs px-2 py-1 ${getPumpScoreColor(coin.pumpScore)}`}>
                        {coin.pumpScore.toFixed(1)}
                      </Badge>
                      
                      <div className="text-white font-mono text-sm">
                        {formatPrice(coin.current_price)}
                      </div>
                      
                      <div className={`flex items-center gap-1 text-sm ${
                        coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {coin.price_change_percentage_24h >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span className="font-mono">
                          {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                          {coin.price_change_percentage_24h.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-gray-300 text-sm">
                        <Volume2 className="h-3 w-3" />
                        <span className="font-mono">${formatNumber(coin.total_volume)}</span>
                      </div>
                      
                      <div className="text-gray-300 text-sm font-mono">
                        ${formatNumber(coin.market_cap)}
                      </div>
                      
                      <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                        #{coin.market_cap_rank}
                      </Badge>
                    </div>
                    
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xs h-8 px-4 font-semibold"
                      onClick={() => openAffiliateLink(coin.symbol)}
                    >
                      Trade on eToro
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};