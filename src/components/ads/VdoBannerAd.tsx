import React, { useEffect } from "react";

declare global {
  interface Window {
    aaw?: {
      processAdsOnPage?: () => void;
      loadAds?: () => void;
      refreshAds?: () => void;
    };
  }
}

interface AdUnitProps {
  adUnit?: string;
  className?: string;
  style?: React.CSSProperties;
  refreshInterval?: number; // default 120s
}

const AdUnit = ({
  adUnit = "/22181265/pumpparade_default",
  className,
  style,
  refreshInterval = 120000,
}: AdUnitProps) => {
  // Generate a unique div id for each adUnit
  const adDivId = `adunit-${adUnit?.replace(/\W/g, "")}`;

  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;
    let refreshTimer: NodeJS.Timeout;

    // Function to process ads
    const processAds = () => {
      try {
        if (window.aaw?.processAdsOnPage) {
          console.log(`📢 Rendering ad: ${adUnit}`);
          window.aaw.processAdsOnPage();
        } else {
          retryTimeout = setTimeout(processAds, 500);
        }
      } catch (err) {
        console.error("AdUnit render error:", err);
      }
    };

    // Wait for Adapex script to load
    const checkScript = () => {
      try {
        const script = document.querySelector(
          "script[src*='cdn.adapex.io/hb/aaw.pumpparade.js']"
        ) as HTMLScriptElement | null;
        if (script) {
          if (script.getAttribute("data-loaded") === "true") processAds();
          else {
            script.addEventListener("load", () => {
              script.setAttribute("data-loaded", "true");
              processAds();
            });
          }
        } else {
          retryTimeout = setTimeout(checkScript, 500);
        }
      } catch (err) {
        console.error("Ad script check error:", err);
      }
    };

    checkScript();

    // Auto-refresh ads
    refreshTimer = setInterval(() => {
      if (window.aaw?.processAdsOnPage) {
        console.log(`♻️ Auto-refreshing ad: ${adUnit}`);
        window.aaw.processAdsOnPage();
      }
    }, refreshInterval);

    return () => {
      clearTimeout(retryTimeout);
      clearInterval(refreshTimer);
    };
  }, [adUnit, adDivId, refreshInterval]);

  return (
    <div
      id={adDivId}
      className={className}
      data-aaad="true"
      data-aa-adunit={adUnit}
      style={{
        width: "100%",
        height: "auto",
        minHeight: 100,
        ...style,
      }}
    />
  );
};

export default AdUnit;
