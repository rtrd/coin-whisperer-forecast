import React from 'react';
import { cn } from '@/lib/utils';

interface MotiScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MotiScoreRing: React.FC<MotiScoreRingProps> = ({ 
  score, 
  size = 'md', 
  className 
}) => {
  const percentage = (score / 5) * 100;
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };
  
  const strokeWidth = size === 'sm' ? 3 : size === 'md' ? 4 : 5;
  const radius = size === 'sm' ? 28 : size === 'md' ? 36 : 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'stroke-orange-400';
    if (score >= 3.5) return 'stroke-yellow-400';
    if (score >= 2.5) return 'stroke-red-400';
    return 'stroke-gray-400';
  };
  
  const getGlowColor = (score: number) => {
    if (score >= 4.5) return 'drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]';
    if (score >= 3.5) return 'drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]';
    if (score >= 2.5) return 'drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]';
    return 'drop-shadow-[0_0_8px_rgba(156,163,175,0.4)]';
  };

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="rgba(55, 65, 81, 0.3)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            'transition-all duration-1000 ease-out',
            getScoreColor(score),
            getGlowColor(score)
          )}
          style={{
            filter: score >= 4.5 ? 'drop-shadow(0 0 8px rgba(251,146,60,0.6))' : 
                    score >= 3.5 ? 'drop-shadow(0 0 8px rgba(250,204,21,0.6))' :
                    score >= 2.5 ? 'drop-shadow(0 0 8px rgba(248,113,113,0.6))' :
                    'drop-shadow(0 0 4px rgba(156,163,175,0.4))'
          }}
        />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={score >= 4.5 ? '#fb923c' : score >= 3.5 ? '#facc15' : score >= 2.5 ? '#f87171' : '#9ca3af'} />
            <stop offset="100%" stopColor={score >= 4.5 ? '#ea580c' : score >= 3.5 ? '#eab308' : score >= 2.5 ? '#dc2626' : '#6b7280'} />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={cn(
            'font-black text-transparent bg-gradient-to-br bg-clip-text',
            score >= 4.5 ? 'from-orange-400 to-red-500' :
            score >= 3.5 ? 'from-yellow-400 to-orange-500' :
            score >= 2.5 ? 'from-red-400 to-pink-500' :
            'from-gray-400 to-gray-600',
            size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
          )}>
            {score.toFixed(1)}
          </div>
          <div className={cn(
            'text-gray-400 font-medium',
            size === 'sm' ? 'text-[0.6rem]' : size === 'md' ? 'text-[0.7rem]' : 'text-xs'
          )}>
            /5
          </div>
        </div>
      </div>
    </div>
  );
};