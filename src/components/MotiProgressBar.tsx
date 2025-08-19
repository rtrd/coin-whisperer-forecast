import React from 'react';
import { cn } from '@/lib/utils';

interface MotiProgressBarProps {
  score: number;
  label: string;
  color: string;
  animated?: boolean;
  showValue?: boolean;
}

export const MotiProgressBar: React.FC<MotiProgressBarProps> = ({
  score,
  label,
  color,
  animated = true,
  showValue = true
}) => {
  const percentage = (score / 5) * 100;
  
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; glow: string; border: string }> = {
      orange: { bg: 'bg-orange-500', glow: 'shadow-orange-500/30', border: 'border-orange-500/30' },
      red: { bg: 'bg-red-500', glow: 'shadow-red-500/30', border: 'border-red-500/30' },
      pink: { bg: 'bg-pink-500', glow: 'shadow-pink-500/30', border: 'border-pink-500/30' },
      purple: { bg: 'bg-purple-500', glow: 'shadow-purple-500/30', border: 'border-purple-500/30' },
      blue: { bg: 'bg-blue-500', glow: 'shadow-blue-500/30', border: 'border-blue-500/30' },
      green: { bg: 'bg-green-500', glow: 'shadow-green-500/30', border: 'border-green-500/30' },
      yellow: { bg: 'bg-yellow-500', glow: 'shadow-yellow-500/30', border: 'border-yellow-500/30' },
    };
    return colorMap[color] || colorMap.orange;
  };
  
  const colors = getColorClasses(color);

  return (
    <div className={cn('p-4 bg-gray-900/50 rounded-lg border backdrop-blur-sm', colors.border)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        {showValue && (
          <span className={cn('text-sm font-bold', `text-${color}-400`)}>
            {score.toFixed(1)}
          </span>
        )}
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-1000 ease-out shadow-lg',
              colors.bg,
              colors.glow,
              animated && 'animate-pulse'
            )}
            style={{ 
              width: `${percentage}%`,
              boxShadow: `0 0 10px ${color === 'orange' ? 'rgba(249, 115, 22, 0.4)' : 
                                    color === 'red' ? 'rgba(239, 68, 68, 0.4)' :
                                    color === 'pink' ? 'rgba(236, 72, 153, 0.4)' :
                                    color === 'purple' ? 'rgba(168, 85, 247, 0.4)' :
                                    color === 'blue' ? 'rgba(59, 130, 246, 0.4)' :
                                    color === 'green' ? 'rgba(34, 197, 94, 0.4)' :
                                    color === 'yellow' ? 'rgba(234, 179, 8, 0.4)' : 'rgba(249, 115, 22, 0.4)'}`
            }}
          />
        </div>
      </div>
    </div>
  );
};