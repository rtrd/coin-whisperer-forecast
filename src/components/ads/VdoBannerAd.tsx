import { useEffect } from "react";

declare global {
  interface Window {
    aa?: any;
  }
}

interface AdUnitProps {
  adUnit: string;
  style?: React.CSSProperties;
  refreshInterval?: number; // default 60 s
}

const AdUnit = ({
  adUnit,
  style,
  refreshInterval = 60000,
}: AdUnitProps) => {
  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;
    let refreshTimer: NodeJS.Timeout;

    const requestAd = () => {
      if (window.aa && typeof window.aa.requestBids === "function") {
        console.log(`🔁 Requesting bids for: ${adUnit}`);
        window.aa.requestBids();
      } else {
        retryTimeout = setTimeout(requestAd, 1000);
      }
    };

    const checkScriptReady = () => {
      const script = document.querySelector(
        "script[src*='cdn.adapex.io/hb/aaw.pumpparade.js']"
      ) as HTMLScriptElement | null;

      if (script) {
        if (script.getAttribute("data-loaded") === "true") {
          requestAd();
        } else {
          script.addEventListener("load", () => {
            script.setAttribute("data-loaded", "true");
            requestAd();
          });
        }
      } else {
        retryTimeout = setTimeout(checkScriptReady, 1000);
      }
    };

    checkScriptReady();

    // ♻️ Auto-refresh bids every N ms
    refreshTimer = setInterval(() => {
      if (window.aa && typeof window.aa.requestBids === "function") {
        console.log(`♻️ Auto-refreshing ad: ${adUnit}`);
        window.aa.requestBids();
      }
    }, refreshInterval);

    return () => {
      clearTimeout(retryTimeout);
      clearInterval(refreshTimer);
    };
  }, [adUnit, refreshInterval]);

  return (
    <div
      data-aaad="true"
      data-aa-adunit={adUnit}
      style={{
        width: "100%",
        height: "auto",
        minHeight: 100,
        margin: "auto",
        ...style,
      }}
    ></div>
  );
};

export default AdUnit;
