import React, { useEffect } from "react";

interface AdUnitProps {
  type:
    | "header"
    | "sidebar"
    | "square"
    | "mobile"
    | "skyscraper"
    | "leaderboard";
  className?: string;
}

const adSlotMap = {
  header: {
    slotId: "div-gpt-ad-1752671486022-0",
    path: "/23308796269/header",
    sizes: [728, 90],
  },
  sidebar: {
    slotId: "div-gpt-ad-1752671827201-0",
    path: "/23308796269/leaderboard",
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

export const AdUnit: React.FC<AdUnitProps> = ({ type, className }) => {
  const slotConfig = adSlotMap[type];
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

    const loadGPT = async () => {
      if (!window.googletag || !window.googletag.apiReady) {
        const gptScript = document.createElement("script");
        gptScript.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
        gptScript.async = true;
        gptScript.crossOrigin = "anonymous";
        document.head.appendChild(gptScript);
        await new Promise((resolve) => {
          gptScript.onload = resolve;
        });
      }

      window.googletag = window.googletag || { cmd: [] };
      window.googletag.cmd.push(() => {
        window.googletag._slots = window.googletag._slots || [];

        if (!window.googletag._slots.includes(slotId)) {
          window.googletag
            .defineSlot(path, sizes, slotId)
            .addService(window.googletag.pubads());

          window.googletag.pubads().enableSingleRequest();
          window.googletag.enableServices();

          window.googletag._slots.push(slotId);
        }

        window.googletag.display(slotId);
      });
    };

    loadGPT();
  }, [slotId, path, sizes]);

  return <div id={slotId} className={className} style={{ width, height }} />;
};
