import { useEffect } from "react";

const AdUnit = ({ adUnit, style }: { adUnit: string; style?: React.CSSProperties }) => {
  useEffect(() => {
    const refreshAd = () => {
      const winAny = window as any; // 👈 safely cast
      if (winAny.aa && typeof winAny.aa.requestBids === "function") {
        winAny.aa.requestBids();
      } else {
        // Retry after 1s if Adapex script hasn't loaded yet
        setTimeout(refreshAd, 1000);
      }
    };

    refreshAd();
  }, [adUnit]);

  return (
    <div
      data-aaad="true"
      data-aa-adunit={adUnit}
      style={style || { width: "100%", height: "auto", margin: "auto" }}
    ></div>
  );
};

export default AdUnit;
