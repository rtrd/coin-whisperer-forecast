import { useEffect, useRef } from "react";

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
    size: [728, 90], // Example
  },
  sidebar: {
    slotId: "div-gpt-ad-1752671827201-0",
    size: [300, 600],
  },
  square: {
    slotId: "div-gpt-ad-1752672242624-0",
    size: [300, 250],
  },
  mobile: {
    slotId: "div-gpt-ad-1752672714102-0",
    size: [320, 100],
  },
  skyscraper: {
    slotId: "div-gpt-ad-1752673179630-0",
    size: [160, 600],
  },
  leaderboard: {
    slotId: "div-gpt-ad-1752671486022-1",
    size: [728, 90],
  },
};

export const AdUnit = ({ type, className }: AdUnitProps) => {
  const adRef = useRef<HTMLDivElement | null>(null);
  const { slotId, size } = adSlotMap[type];

  useEffect(() => {
    if (!adRef.current || !window.googletag?.cmd) return;

    window.googletag.cmd.push(() => {
      try {
        window.googletag.display(slotId);
      } catch (err) {
        console.error(`[GPT] Failed to display ad for slotId ${slotId}`, err);
      }
    });
  }, [slotId]);

  return (
    <div
      ref={adRef}
      id={slotId}
      className={className}
      style={{
        width: `${size[0]}px`,
        height: `${size[1]}px`,
      }}
    />
  );
};

export default AdUnit;
