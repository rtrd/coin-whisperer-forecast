import type { CSSProperties } from "react";

interface AdUnitProps {
  adUnit?: string;
  className?: string;
  style?: CSSProperties;
  isMobile?: boolean;
  refreshInterval?: number;
  type?: string;
  [key: string]: unknown;
}

const AdUnit = (_props: AdUnitProps) => null;

export default AdUnit;
