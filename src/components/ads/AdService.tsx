import React, { useEffect, useRef } from "react";
import { adRefreshService } from '@/services/adRefreshService';

interface AdUnitProps {
  type:
    | "header"
    | "sidebar"
    | "square"
    | "mobile"
    | "skyscraper"
    | "leaderboard";
  className?: string;
  refreshKey?: string | number;
}

const adSlotMap = {
  header: {
    slotId: "div-gpt-ad-1752671486022-0",
    path: "/23308796269/header",
    sizes: [728, 90],
  },
  sidebar: {
    slotId: "div-gpt-ad-1752671827201-0",
    path: "/23308796269/Leaderboard",
    sizes: [300, 600],
  },
  square: {
    slotId: "div-gpt-ad-1752672242624-0",
    path: "/23308796269/square",
    sizes: [300, 250],
  },
  mobile: {
    slotId: "div-gpt-ad-1752672714102-0",
    path: "/23308796269/mobilebanner",
    sizes: [
      [320, 50],
      [300, 31],
      [300, 75],
      [300, 100],
      [300, 50],
    ],
  },
  skyscraper: {
    slotId: "div-gpt-ad-1752673179630-0",
    path: "/23308796269/skyscraper",
    sizes: [160, 600],
  },
  leaderboard: {
    slotId: "div-gpt-ad-1752671486022-0",
    path: "/23308796269/header",
    sizes: [728, 90],
  },
} as const;

declare global {
  interface Window {
    googletag: any;
    _ctScriptLoaded?: boolean;
  }
}

export const AdUnit: React.FC<AdUnitProps> = ({ type, className, refreshKey }) => {
  const slotConfig = adSlotMap[type];
  const isDisplayedRef = useRef(false);
  
  if (!slotConfig) {
    console.warn(`Unknown ad type: ${type}`);
    return null;
  }

  const { slotId, path, sizes } = slotConfig;
  const [width, height] = Array.isArray(sizes[0]) ? sizes[0] : sizes;

  useEffect(() => {
    // Inject CT verification script only once
    if (!window._ctScriptLoaded) {
      const ctScript = document.createElement("script");
      ctScript.src =
        "https://appsha-prm.ctengine.io/js/script.js?wkey=Fkrv2lWxUV";
      ctScript.async = true;
      document.body.appendChild(ctScript);
      window._ctScriptLoaded = true;
    }

    // Simply display the ad - GPT is already loaded and slots are defined in HTML
    const displayAd = () => {
      if (window.googletag && window.googletag.cmd) {
        window.googletag.cmd.push(() => {
          try {
            if (!isDisplayedRef.current) {
              window.googletag.display(slotId);
              isDisplayedRef.current = true;
            }
            adRefreshService.markSlotAsDisplayed(slotId);
            console.log(`Displaying ad slot: ${slotId}`);
          } catch (error) {
            console.error(`Error displaying ad slot ${slotId}:`, error);
          }
        });
      } else {
        console.warn('Google Tag Manager not loaded yet');
      }
    };

    // Small delay to ensure GPT is fully loaded
    const timer = setTimeout(displayAd, 100);
    
    return () => clearTimeout(timer);
  }, [slotId]);

  // Handle refresh when refreshKey changes
  useEffect(() => {
    if (refreshKey && isDisplayedRef.current) {
      const timer = setTimeout(() => {
        adRefreshService.refreshSlot(slotId);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [refreshKey, slotId]);

  return <div id={slotId} className={className} style={{ width, height }} />;
};
