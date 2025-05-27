
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
      className={`bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-lg flex items-center justify-center ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div className="text-center">
        <div className="text-white font-bold text-lg mb-2">
          {position === 'horizontal' ? 'Premium Ad Space' : 'Sidebar Ad'}
        </div>
        <div className="text-gray-400 text-sm">
          {width} x {height}
        </div>
        <div className="text-blue-400 text-xs mt-1">
          Advertise with CryptoPredictAI
        </div>
      </div>
    </div>
  );
};
