import { useEffect, useState } from "react";

/**
 * useIsMobile - Optimized hook to detect if the screen width is below a given breakpoint.
 * Uses window.matchMedia for efficient updates.
 *
 * @param breakpoint - The maximum width (in px) to consider as mobile. Default is 768px.
 * @returns boolean - true if mobile, false otherwise.
 */

export const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);

    let timeout: NodeJS.Timeout;
    const update = (matches: boolean) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsMobile(matches), 300); // debounce 300ms
    };

    update(mq.matches);
    const listener = (e: MediaQueryListEvent) => update(e.matches);
    mq.addEventListener("change", listener);

    return () => {
      clearTimeout(timeout);
      mq.removeEventListener("change", listener);
    };
  }, [breakpoint]);

  return isMobile;
};
