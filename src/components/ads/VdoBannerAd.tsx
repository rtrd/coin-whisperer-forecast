import { useEffect } from "react";

const VdoBannerAd = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script if still present
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div id="b_pumpparade_300x250_ATF_168a42c06b454f"></div>
  );
};

export default VdoBannerAd;
