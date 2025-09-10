import { useEffect, useRef } from "react";
interface GAMAdUnitProps {
  adUnitId: string;
  size: [number, number] | [number, number][];
  className?: string;
}
const definedSlots = new Set<string>();
const displayedSlots = new Set<string>();
export const GAMAdUnit = ({
  adUnitId,
  size,
  className = ""
}: GAMAdUnitProps) => {
  const adRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!window.googletag?.cmd) return;
    const initAd = () => {
      if (!adRef.current) return; // extra safety

      if (!definedSlots.has(adUnitId)) {
        const slot = window.googletag.defineSlot(`/23308796269/${adUnitId}`, size, adUnitId)?.addService(window.googletag.pubads());
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

    // Use requestAnimationFrame to ensure div is mounted
    const id = requestAnimationFrame(() => {
      window.googletag.cmd.push(initAd);
    });
    return () => cancelAnimationFrame(id);
  }, [adUnitId, size]);
  return;
};
export default GAMAdUnit;