import { useEffect, useRef } from "react";

declare global {
  interface Window {
    googletag: any;
  }
}

interface GAMAdUnitProps {
  adUnitId: string;
  size: number[] | number[][];
  className?: string;
}

export const GAMAdUnit = ({
  adUnitId,
  size,
  className = "",
}: GAMAdUnitProps) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.googletag) {
      window.googletag = { cmd: [] };
    }

    const loadGPTScript = () => {
      const gptScriptId = "gpt-script";
      if (document.getElementById(gptScriptId)) return;

      const script = document.createElement("script");
      script.id = gptScriptId;
      script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
      script.async = true;
      document.head.appendChild(script);
    };

    loadGPTScript();

    window.googletag.cmd.push(() => {
      const slotExists = window.googletag
        .pubads()
        .getSlots()
        .some((slot: any) => slot.getSlotElementId() === adUnitId);

      if (!slotExists) {
        window.googletag
          .defineSlot("/23308796269/leaderboard", size, adUnitId)
          .addService(window.googletag.pubads());
        window.googletag.enableServices();
      }

      window.googletag.display(adUnitId);
    });
  }, [adUnitId, size]);

  return (
    <div
      ref={adRef}
      id={adUnitId}
      className={className}
      style={{ width: "100%", height: "auto" }}
    />
  );
};

export default GAMAdUnit;
