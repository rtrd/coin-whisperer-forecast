import { useEffect } from "react";

export default function VdoBannerAd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://a.vdo.ai/core/b-pumpparade/vdo.ai.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // cleanup (optional): remove script if component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id="b_pumpparade_300x250_ATF_168a42c06b454f"></div>
  );
}
