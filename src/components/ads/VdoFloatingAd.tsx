import { useEffect } from "react";

const VdoFloatingAd = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.setAttribute("data-cfasync", "false");
    script.innerHTML = `(function(v,d,o,ai){
      ai=d.createElement('script');
      ai.defer=true;
      ai.async=true;
      ai.src=v.location.protocol+o;
      d.head.appendChild(ai);
    })(window, document, '//a.vdo.ai/core/v-pumpparade/vdo.ai.js');`;

    document.body.appendChild(script);  

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return <div id="v-pumpparade"></div>;
};

export default VdoFloatingAd;
