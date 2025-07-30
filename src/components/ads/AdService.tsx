import React, { useEffect, useRef } from "react";
import { adRefreshService } from "@/services/adRefreshService";

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
} as const;

declare global {
  interface Window {
    googletag: any;
    _ctScriptLoaded?: boolean;
    _gptSlotMap?: Record<string, any>;
  }
}

export const AdUnit: React.FC<AdUnitProps> = ({
  type,
  className,
  refreshKey,
}) => {
  const slotConfig = adSlotMap[type];
  const isDisplayedRef = useRef(false);

  if (!slotConfig) {
    console.warn(`Unknown ad type: ${type}`);
    return null;
  }

  const { slotId, path, sizes } = slotConfig;
  const [width, height] = Array.isArray(sizes[0]) ? sizes[0] : sizes;

  useEffect(() => {
    // Load CT verification script only once
    if (!window._ctScriptLoaded) {
      const ctScript = document.createElement("script");
      ctScript.src =
        "https://appsha-prm.ctengine.io/js/script.js?wkey=Fkrv2lWxUV";
      ctScript.async = true;
      document.body.appendChild(ctScript);
      window._ctScriptLoaded = true;
    }

    // Initialize GPT ad slot
    const initializeAdSlot = () => {
      if (!window.googletag || !window.googletag.cmd) {
        console.warn("GPT not ready");
        return;
      }

      window.googletag.cmd.push(() => {
        try {
          if (!window._gptSlotMap) window._gptSlotMap = {};

          if (!window._gptSlotMap[slotId]) {
            const slot = window.googletag
              .defineSlot(path, sizes, slotId)
              .addService(window.googletag.pubads());

            window._gptSlotMap[slotId] = slot;

            window.googletag.pubads().enableSingleRequest();
            window.googletag.enableServices();
          }

          if (!isDisplayedRef.current) {
            window.googletag.display(slotId);
            isDisplayedRef.current = true;
            adRefreshService.markSlotAsDisplayed(slotId);
            console.log(`Ad displayed for slot: ${slotId}`);
          }
        } catch (err) {
          console.error(`Failed to display ad slot ${slotId}:`, err);
        }
      });
    };

    const timer = setTimeout(initializeAdSlot, 100); // Small delay to ensure GPT is ready

    return () => clearTimeout(timer);
  }, [slotId]);

  // Refresh ad on refreshKey change
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
