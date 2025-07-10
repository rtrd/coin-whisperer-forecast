import React from 'react';
import { Shield, Activity, TrendingUp, Zap, AlertTriangle } from 'lucide-react';
import { MarketPulseData } from '@/services/marketPulseService';

interface MissionControlStatsProps {
  pulseData: MarketPulseData;
}

export const MissionControlStats: React.FC<MissionControlStatsProps> = ({ pulseData }) => {
  const getHealthStatus = (health: number) => {
    if (health >= 80) return { status: 'Optimal', color: 'text-green-400', bg: 'bg-green-400/10' };
    if (health >= 60) return { status: 'Good', color: 'text-blue-400', bg: 'bg-blue-400/10' };
    if (health >= 40) return { status: 'Caution', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    return { status: 'Critical', color: 'text-red-400', bg: 'bg-red-400/10' };
  };

  const getFearGreedStatus = (index: number) => {
    if (index >= 75) return { status: 'Extreme Greed', color: 'text-red-400' };
    if (index >= 55) return { status: 'Greed', color: 'text-orange-400' };
    if (index >= 45) return { status: 'Neutral', color: 'text-gray-400' };
    if (index >= 25) return { status: 'Fear', color: 'text-yellow-400' };
    return { status: 'Extreme Fear', color: 'text-green-400' };
  };

  const healthStatus = getHealthStatus(pulseData.marketHealth);
  const fearGreedStatus = getFearGreedStatus(pulseData.fearGreedIndex);

  return (
    <div className="space-y-4">
      {/* System Status Panel */}
      <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-blue-300">System Status</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-3 rounded-lg ${healthStatus.bg} border border-gray-600/30`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-300">Market Health</span>
              <Activity className={`h-4 w-4 ${healthStatus.color}`} />
            </div>
            <div className={`text-xl font-bold ${healthStatus.color}`}>
              {pulseData.marketHealth}%
            </div>
            <div className={`text-xs ${healthStatus.color}`}>
              {healthStatus.status}
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-purple-400/10 border border-gray-600/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-300">Fear & Greed</span>
              <Zap className={`h-4 w-4 ${fearGreedStatus.color}`} />
            </div>
            <div className={`text-xl font-bold ${fearGreedStatus.color}`}>
              {pulseData.fearGreedIndex}
            </div>
            <div className={`text-xs ${fearGreedStatus.color}`}>
              {fearGreedStatus.status}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-3">
        {/* Volatility Indicator */}
        <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-300">Volatility Index</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-yellow-400">
                {pulseData.volatilityIndex}%
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-yellow-400 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${pulseData.volatilityIndex}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Volume Activity */}
        <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-300">Volume Activity</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-400">
                {pulseData.volumeActivity}%
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-green-400 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${pulseData.volumeActivity}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Trend Strength */}
        <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-300">Trend Strength</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-400">
                {pulseData.trendStrength}%
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-blue-400 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${pulseData.trendStrength}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Status */}
      <div className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(147,51,234,0.1),transparent)]" />
        
        <div className="relative z-10">
          <h4 className="text-sm font-semibold text-purple-300 mb-2">
            Mission Status
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-white">
                {pulseData.marketPhase.toUpperCase()} PHASE
              </p>
              <p className="text-sm text-gray-400">
                Current market cycle detected
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};