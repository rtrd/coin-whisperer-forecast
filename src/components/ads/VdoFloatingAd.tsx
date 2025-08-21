import { useEffect } from "react";

const VdoFloatingAd = () => {
  useEffect(() => {
    // Prevent duplicate script load
    if (!document.getElementById("vdo-ai-script")) {
      const script = document.createElement("script");
      script.id = "vdo-ai-script";
      script.async = true;
      script.defer = true;
      script.src = "//a.vdo.ai/core/v-pumpparade/vdo.ai.js";
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div id="v-pumpparade" className="my-6">
      {/* vdo.ai will render ad here */}
    </div>
  );
};

export default VdoFloatingAd;
