import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PremiumFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight?: boolean;
}

export const PremiumFeatureCard: React.FC<PremiumFeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  highlight = false
}) => {
  return (
    <div className={`
      relative p-6 rounded-xl transition-all duration-300 hover:scale-105
      ${highlight 
        ? 'bg-gray-800/50 border-2 border-premium/50 animate-glow' 
        : 'bg-gray-800/50 border border-gray-700'
      }
    `}>
      <div className="flex items-start gap-4">
        <div className={`
          p-3 rounded-lg
          ${highlight 
            ? 'bg-gradient-to-br from-premium to-premium-end text-primary-foreground' 
            : 'bg-gray-700/50 text-premium'
          }
        `}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
      
      {highlight && (
        <div className="absolute -top-3 -right-3 bg-yellow-500 text-black text-xs px-3 py-1 rounded-full font-bold animate-pulse-slow">
          MOST POPULAR
        </div>
      )}
    </div>
  );
};