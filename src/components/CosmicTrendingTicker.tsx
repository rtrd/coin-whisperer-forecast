import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Zap, Star } from 'lucide-react';
import { TrendingMover } from '@/services/marketPulseService';

interface CosmicTrendingTickerProps {
  movers: TrendingMover[];
}

export const CosmicTrendingTicker: React.FC<CosmicTrendingTickerProps> = ({ movers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (movers.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % movers.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [movers.length]);

  if (!movers || movers.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="h-8 w-8 text-gray-500 mx-auto animate-spin" />
        <p className="text-gray-400 mt-2">Scanning cosmic markets...</p>
      </div>
    );
  }

  const getMomentumIcon = (momentum: string) => {
    switch (momentum) {
      case 'strong': return <Zap className="h-4 w-4" />;
      case 'moderate': return <TrendingUp className="h-3 w-3" />;
      default: return <Star className="h-3 w-3" />;
    }
  };

  const getMomentumColor = (momentum: string, category: string) => {
    const isGainer = category === 'gainer';
    switch (momentum) {
      case 'strong': 
        return isGainer ? 'text-green-300 bg-green-500/20' : 'text-red-300 bg-red-500/20';
      case 'moderate': 
        return isGainer ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10';
      default: 
        return isGainer ? 'text-green-500 bg-green-500/5' : 'text-red-500 bg-red-500/5';
    }
  };

  return (
    <div className="space-y-6">
      {/* Featured Mover */}
      <div className="relative p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/30 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(147,51,234,0.1),transparent)]" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-300">
              Cosmic Spotlight
            </h3>
            <div className="flex items-center space-x-1">
              {movers.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-purple-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {movers[currentIndex] && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {movers[currentIndex].change >= 0 ? (
                      <TrendingUp className="h-6 w-6 text-green-400" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-400" />
                    )}
                    <div>
                      <p className="text-xl font-bold text-white">
                        {movers[currentIndex].symbol}
                      </p>
                      <p className="text-sm text-gray-400">
                        {movers[currentIndex].name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">
                      ${movers[currentIndex].price.toFixed(6)}
                    </p>
                    <p className={`text-sm font-medium ${
                      movers[currentIndex].change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {movers[currentIndex].change >= 0 ? '+' : ''}
                      {movers[currentIndex].change.toFixed(2)}%
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-center px-3 py-1 rounded-full ${
                  getMomentumColor(movers[currentIndex].momentum, movers[currentIndex].category)
                }`}>
                  {getMomentumIcon(movers[currentIndex].momentum)}
                  <span className="ml-1 text-xs font-medium">
                    {movers[currentIndex].momentum.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scrolling Ticker */}
      <div className="relative overflow-hidden bg-gray-900/50 rounded-lg border border-gray-700/50">
        <div className="flex items-center py-3 animate-marquee">
          {[...movers, ...movers].map((mover, index) => (
            <div key={`${mover.symbol}-${index}`} className="flex items-center space-x-3 mx-6 whitespace-nowrap">
              <span className="text-sm font-medium text-gray-300">
                {mover.symbol}
              </span>
              <span className={`text-sm font-bold ${
                mover.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {mover.change >= 0 ? '+' : ''}{mover.change.toFixed(2)}%
              </span>
              <div className="w-px h-4 bg-gray-600" />
            </div>
          ))}
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {movers.slice(0, 8).map((mover, index) => (
          <div 
            key={mover.symbol}
            className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30 hover:border-purple-500/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">
                {mover.symbol}
              </span>
              {mover.change >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-400" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-400" />
              )}
            </div>
            <p className={`text-lg font-bold ${
              mover.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {mover.change >= 0 ? '+' : ''}{mover.change.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500">
              ${mover.price.toFixed(6)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};