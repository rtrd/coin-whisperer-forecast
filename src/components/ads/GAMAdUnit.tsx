import React, { useEffect, useRef } from 'react';
import { adRefreshService } from '@/services/adRefreshService';

declare global {
  interface Window {
    googletag: any;
  }
}

interface GAMAdUnitProps {
  adUnitId: string;
  size: [number, number];
  className?: string;
  refreshKey?: string | number; // Optional prop to force refresh
}

export const GAMAdUnit: React.FC<GAMAdUnitProps> = ({
  adUnitId,
  size,
  className = '',
  refreshKey
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isDisplayedRef = useRef(false);

  useEffect(() => {
    const displayAd = () => {
      if (window.googletag && window.googletag.cmd) {
        window.googletag.cmd.push(() => {
          try {
            if (!isDisplayedRef.current) {
              window.googletag.display(adUnitId);
              isDisplayedRef.current = true;
            }
            adRefreshService.markSlotAsDisplayed(adUnitId);
          } catch (error) {
            console.error(`Error displaying ad ${adUnitId}:`, error);
          }
        });
      }
    };

    // Small delay to ensure GPT is loaded
    const timer = setTimeout(displayAd, 100);

    return () => clearTimeout(timer);
  }, [adUnitId]);

  // Handle refresh when refreshKey changes
  useEffect(() => {
    if (refreshKey && isDisplayedRef.current) {
      const timer = setTimeout(() => {
        adRefreshService.refreshSlot(adUnitId);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [refreshKey, adUnitId]);

  return (
    <div className={`flex justify-center ${className}`}>
      <div
        ref={adRef}
        id={adUnitId}
        style={{
          minWidth: `${size[0]}px`,
          minHeight: `${size[1]}px`,
          display: 'block'
        }}
      />
    </div>
  );
};