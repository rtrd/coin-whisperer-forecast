import type { ReactNode } from "react";

interface BitmedialAdManagerProps {
  children?: ReactNode;
}

export const BitmedialAdManager = ({ children }: BitmedialAdManagerProps) => {
  return <>{children}</>;
};

export default BitmedialAdManager;
