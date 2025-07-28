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
        ? 'bg-gradient-to-br from-premium/20 to-premium-end/20 border-2 border-premium/50 animate-glow' 
        : 'bg-glass-bg backdrop-blur-sm border border-glass-border'
      }
    `}>
      <div className="flex items-start gap-4">
        <div className={`
          p-3 rounded-lg
          ${highlight 
            ? 'bg-gradient-to-br from-premium to-premium-end text-primary-foreground' 
            : 'bg-glass-bg text-premium'
          }
        `}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
      </div>
      
      {highlight && (
        <div className="absolute -top-3 -right-3 bg-crypto-gold text-primary-foreground text-xs px-3 py-1 rounded-full font-bold animate-pulse-slow">
          MOST POPULAR
        </div>
      )}
    </div>
  );
};