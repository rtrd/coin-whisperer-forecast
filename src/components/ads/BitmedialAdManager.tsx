import { useEffect } from 'react';
import { useAdScript } from '@/hooks/useAdScript';

interface BitmedialAdManagerProps {
  children?: React.ReactNode;
}

export const BitmedialAdManager: React.FC<BitmedialAdManagerProps> = ({ children }) => {
  // Use the enhanced ad script hook that handles refreshing
  useAdScript();

  return <>{children}</>;
};

export default BitmedialAdManager;