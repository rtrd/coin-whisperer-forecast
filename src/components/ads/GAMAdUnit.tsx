import { useEffect, useRef } from "react";

interface GAMAdUnitProps {
  adUnitId: string;
  size: [number, number] | [number, number][];
  className?: string;
}

export const GAMAdUnit = ({
  adUnitId,
  size,
  className = "",
}: GAMAdUnitProps) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.googletag?.cmd || !adRef.current) return;

    const existingSlot = window.googletag
      ?.pubads()
      ?.getSlots()
      ?.find((slot: any) => slot.getSlotElementId() === adUnitId);

    if (existingSlot) {
      console.warn(
        `Slot with ID "${adUnitId}" already exists. Skipping defineSlot.`
      );
      return;
    }

    window.googletag.cmd.push(() => {
      const slot = window.googletag
        .defineSlot(`/23308796269/${adUnitId}`, size, adUnitId)
        ?.addService(window.googletag.pubads());

      if (slot) {
        window.googletag.enableServices();
        window.googletag.display(adUnitId);
      }
    });
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
