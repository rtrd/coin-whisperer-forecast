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
    path: "/23308796269/header",
    size: [728, 90],
  },
  sidebar: {
    slotId: "div-gpt-ad-1752671827201-0",
    path: "/23308796269/sidebar",
    size: [300, 600],
  },
  square: {
    slotId: "div-gpt-ad-1752672242624-0",
    path: "/23308796269/square",
    size: [300, 250],
  },
  mobile: {
    slotId: "div-gpt-ad-1752672714102-0",
    path: "/23308796269/mobile",
    size: [320, 100],
  },
  skyscraper: {
    slotId: "div-gpt-ad-1752673179630-0",
    path: "/23308796269/skyscraper",
    size: [160, 600],
  },
  leaderboard: {
    slotId: "div-gpt-ad-1752671486022-1",
    path: "/23308796269/leaderboard",
    size: [728, 90],
  },
};

export const AdUnit = ({ type, className }: AdUnitProps) => {
  const adRef = useRef<HTMLDivElement | null>(null);
  const { slotId, path, size } = adSlotMap[type];

  useEffect(() => {
    if (!window.googletag?.cmd || !adRef.current) return;

    window.googletag.cmd.push(() => {
      const existingSlot = window.googletag
        .pubads()
        .getSlots()
        .find((slot) => slot.getSlotElementId() === slotId);

      // Define the slot only once
      if (!existingSlot) {
        window.googletag
          .defineSlot(path, size, slotId)
          .addService(window.googletag.pubads());
        window.googletag.enableServices();
      }

      // Now display it
      window.googletag.display(slotId);
    });
  }, [slotId, path, size]);

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
