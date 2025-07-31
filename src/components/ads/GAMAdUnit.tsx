import { useEffect, useRef } from "react";

interface GAMAdUnitProps {
  adUnitId: string;
  size: [number, number] | [number, number][];
  className?: string;
}

// Global maps to track defined and displayed slots
const definedSlots = new Set<string>();
const displayedSlots = new Set<string>();

export const GAMAdUnit = ({
  adUnitId,
  size,
  className = "",
}: GAMAdUnitProps) => {
  const adRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!adRef.current || !window.googletag?.cmd) return;

    const initAd = () => {
      if (!definedSlots.has(adUnitId)) {
        const slot = window.googletag
          .defineSlot(`/23308796269/${adUnitId}`, size, adUnitId)
          ?.addService(window.googletag.pubads());

        if (slot) {
          definedSlots.add(adUnitId);
          window.googletag.enableServices();
        }
      }

      if (!displayedSlots.has(adUnitId)) {
        window.googletag.display(adUnitId);
        displayedSlots.add(adUnitId);
      }
    };

    // Run only after DOM has mounted
    window.googletag.cmd.push(initAd);
  }, [adUnitId, size]);

  return (
    <div
      id={adUnitId}
      ref={adRef}
      className={className}
      style={{ minHeight: "100px" }}
    />
  );
};

export default GAMAdUnit;
