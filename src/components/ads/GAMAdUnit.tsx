import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    googletag: any;
  }
}

interface GAMAdUnitProps {
  adUnitId: string;
  size: [number, number];
  className?: string;
}

export const GAMAdUnit: React.FC<GAMAdUnitProps> = ({
  adUnitId,
  size,
  className = ''
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const displayAd = () => {
      if (window.googletag && window.googletag.cmd) {
        window.googletag.cmd.push(() => {
          window.googletag.display(adUnitId);
        });
      }
    };

    // Small delay to ensure GPT is loaded
    const timer = setTimeout(displayAd, 100);

    return () => clearTimeout(timer);
  }, [adUnitId]);

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