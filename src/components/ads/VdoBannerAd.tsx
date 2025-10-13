import { useEffect } from "react";

/**
 * Reusable Adapex Ad Unit Component
 * @param {string} adUnit - The GAM ad unit path (e.g., "/22181265/pumpparade_300s_1")
 * @param {object} style - Optional inline styles for the ad container
 */
const AdUnit = ({ adUnit, style }) => {
  useEffect(() => {
    // Refresh ad if Adapex is already initialized
    const winAny = window as any;
    if (winAny.aa && typeof winAny.aa.requestBids === "function") {
      winAny.aa.requestBids();
    }
  }, [adUnit]); // re-run when adUnit changes

  return (
    <div
      data-aaad="true"
      data-aa-adunit={adUnit}
      style={style || { width: "100%", height: "auto", margin: "auto" }}
    ></div>
  );
};

export default AdUnit;
