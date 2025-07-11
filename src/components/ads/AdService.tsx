import React from 'react';

export interface AdConfig {
  width: number;
  height: number;
  position?: 'horizontal' | 'vertical';
  className?: string;
}

// Centralized ad configurations
export const AD_CONFIGS = {
  header: { width: 728, height: 90, position: 'horizontal' as const },
  sidebar: { width: 300, height: 250, position: 'vertical' as const },
  square: { width: 300, height: 300, position: 'horizontal' as const },
  skyscraper: { width: 300, height: 600, position: 'vertical' as const },
  leaderboard: { width: 728, height: 120, position: 'horizontal' as const },
  mobile: { width: 320, height: 100, position: 'horizontal' as const },
} as const;

interface AdUnitProps {
  type: keyof typeof AD_CONFIGS;
  className?: string;
}

export const AdUnit: React.FC<AdUnitProps> = ({ type, className = '' }) => {
  const config = AD_CONFIGS[type];
  
  return (
    <div 
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ 
        width: `${config.width}px`, 
        height: `${config.height}px`,
        maxWidth: '100%'
      }}
    >
      <iframe 
        data-aa='2395516' 
        src='//acceptable.a-ads.com/2395516' 
        style={{
          border: '0px', 
          padding: 0, 
          width: '100%', 
          height: '100%', 
          overflow: 'hidden', 
          backgroundColor: 'transparent'
        }}
        title="Advertisement"
      />
    </div>
  );
};