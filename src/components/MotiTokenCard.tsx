import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MotiScoreRing } from './MotiScoreRing';
import { MotiProgressBar } from './MotiProgressBar';
import { MotiToken } from '@/types/motiMeter';
import { Flame, ShoppingCart, TrendingDown, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MotiTokenCardProps {
  token: MotiToken;
  rank: number;
  onBuy: (token: MotiToken) => void;
  onSell: (token: MotiToken) => void;
}

export const MotiTokenCard: React.FC<MotiTokenCardProps> = ({
  token,
  rank,
  onBuy,
  onSell
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getMotiLabel = (score: number) => {
    if (score >= 4.5) return { label: 'FIRE', emoji: '🔥', color: 'from-orange-400 to-red-500' };
    if (score >= 3.5) return { label: 'HOT', emoji: '🌶️', color: 'from-yellow-400 to-orange-500' };
    if (score >= 2.5) return { label: 'WARM', emoji: '🌡️', color: 'from-red-400 to-pink-500' };
    return { label: 'COLD', emoji: '❄️', color: 'from-gray-400 to-gray-600' };
  };
  
  const motiInfo = getMotiLabel(token.motiScore);
  
  const getRankBadgeColor = (rank: number) => {
    if (rank <= 3) return 'from-yellow-400 to-yellow-600';
    if (rank <= 7) return 'from-orange-400 to-orange-600';
    return 'from-purple-400 to-purple-600';
  };

  return (
    <Card className={cn(
      'group relative overflow-hidden transition-all duration-500 hover:shadow-2xl',
      'bg-gradient-to-br from-gray-800/90 via-gray-800/95 to-gray-900/90',
      'border-gray-700/50 hover:border-purple-500/30',
      'backdrop-blur-sm',
      rank <= 3 && 'ring-2 ring-yellow-500/20 hover:ring-yellow-500/40',
      'hover:scale-[1.02] hover:-translate-y-1'
    )}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-pink-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Rank badge */}
      <div className="absolute -top-2 -left-2 z-10">
        <div className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center shadow-xl',
          'bg-gradient-to-br text-white font-black text-sm',
          'ring-4 ring-gray-800/50',
          getRankBadgeColor(rank)
        )}>
          #{rank}
        </div>
      </div>
      
      {rank <= 3 && (
        <div className="absolute top-2 right-2 z-10">
          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/30">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span className="text-xs font-bold text-yellow-400">TOP</span>
          </div>
        </div>
      )}
      
      <CardContent className="p-6">
        {/* Main content */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            {/* Token image with enhanced styling */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-purple-500/20 shadow-xl">
                <img 
                  src={token.image || '/placeholder.svg'} 
                  alt={token.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                <Flame className="w-3 h-3 text-white" />
              </div>
            </div>
            
            {/* Token info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-white">{token.name}</h3>
                <Badge className={cn(
                  'px-3 py-1 text-sm font-bold shadow-lg border-0',
                  `bg-gradient-to-r ${motiInfo.color} text-white`
                )}>
                  {motiInfo.label} {motiInfo.emoji}
                </Badge>
              </div>
              <p className="text-gray-400 text-base font-semibold uppercase tracking-wider">
                ${token.symbol}
              </p>
            </div>
          </div>
          
          {/* MOTI Score Ring */}
          <MotiScoreRing score={token.motiScore} size="lg" />
        </div>
        
        {/* Price and stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900/50 rounded-lg p-3 border border-blue-400/30 backdrop-blur-sm">
            <div className="text-xs text-blue-300 uppercase tracking-wide mb-1 font-semibold">Price</div>
            <div className="text-lg font-bold text-gray-100">
              ${token.current_price?.toFixed(6) || 'N/A'}
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-600/30 backdrop-blur-sm">
            <div className="text-xs text-gray-300 uppercase tracking-wide mb-1 font-semibold">24h Change</div>
            <div className={cn(
              'text-lg font-bold',
              token.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
            )}>
              {token.price_change_percentage_24h >= 0 ? '+' : ''}{token.price_change_percentage_24h?.toFixed(2) || '0'}%
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-3 border border-purple-400/30 backdrop-blur-sm">
            <div className="text-xs text-purple-300 uppercase tracking-wide mb-1 font-semibold">Market Cap</div>
            <div className="text-lg font-bold text-gray-100">
              ${token.market_cap ? (token.market_cap / 1000000).toFixed(1) : 'N/A'}M
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3 mb-4">
          <Button
            size="lg"
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-green-500/25 transition-all duration-300 border-0"
            onClick={() => onBuy(token)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Buy Now
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-red-500/25 transition-all duration-300 border-0"
            onClick={() => onSell(token)}
          >
            <TrendingDown className="h-4 w-4 mr-2" />
            Sell
          </Button>
        </div>
        
        {/* Expand/Collapse button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Show Detailed Analysis
            </>
          )}
        </Button>
        
        {/* Expandable detailed analysis */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-gray-700 space-y-4 animate-fade-in">
            {/* Score breakdown with progress bars */}
            <div className="space-y-3">
              <MotiProgressBar score={token.scores.twitterInteraction} label="Twitter Interaction" color="orange" />
              <MotiProgressBar score={token.scores.goodTicker} label="Ticker Quality" color="red" />
              <MotiProgressBar score={token.scores.culturalRefs} label="Cultural References" color="pink" />
              <MotiProgressBar score={token.scores.ageOfProject} label="Project Maturity" color="purple" />
              <MotiProgressBar score={token.scores.volumeConsistency} label="Volume Consistency" color="blue" />
              <MotiProgressBar score={token.scores.holderGrowth} label="Holder Growth" color="green" />
              <MotiProgressBar score={token.scores.higherLows} label="Technical Strength" color="yellow" />
            </div>
            
            {/* AI Summary */}
            <div className="bg-gradient-to-br from-gray-900/80 via-purple-900/20 to-gray-900/80 rounded-xl p-6 border border-purple-400/30 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-purple-300 font-bold text-lg mb-3 flex items-center gap-2">
                    MOTI Analysis
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  </h4>
                  <p className="text-gray-100 text-base leading-relaxed">
                    {token.aiSummary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};