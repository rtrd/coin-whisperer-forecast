import { useEffect } from 'react';
import { bitmedialAdService } from '@/services/bitmedialAdService';

interface BitmedialAdManagerProps {
  children?: React.ReactNode;
}

export const BitmedialAdManager: React.FC<BitmedialAdManagerProps> = ({ children }) => {
  useEffect(() => {
    // Initialize Bitmedia ads only once when the manager loads
    console.log('BitmedialAdManager: Initializing Bitmedia ads');
    bitmedialAdService.initializeAds();

    // Cleanup on unmount
    return () => {
      console.log('BitmedialAdManager: Cleaning up Bitmedia ads');
      bitmedialAdService.cleanup();
    };
  }, []);

  return <>{children}</>;
};

export default BitmedialAdManager;