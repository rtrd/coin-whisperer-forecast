
import React from 'react';

interface AdBannerProps {
  width: number;
  height: number;
  position?: 'horizontal' | 'vertical';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  width, 
  height, 
  position = 'horizontal',
  className = '' 
}) => {
  return (
    <div 
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
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
