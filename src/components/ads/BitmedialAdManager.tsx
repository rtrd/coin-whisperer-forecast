import { useEffect } from 'react';
import { bitmedialAdService } from '@/services/bitmedialAdService';

interface BitmedialAdManagerProps {
  children?: React.ReactNode;
}

export const BitmedialAdManager: React.FC<BitmedialAdManagerProps> = ({ children }) => {
  useEffect(() => {
    // Initialize Bitmedia ads after a short delay to allow containers to register
    console.log('BitmedialAdManager: Starting ad initialization process');
    
    const initTimer = setTimeout(() => {
      console.log('BitmedialAdManager: Initializing Bitmedia ads');
      bitmedialAdService.initializeAds();
    }, 500);

    // Cleanup on unmount
    return () => {
      clearTimeout(initTimer);
      console.log('BitmedialAdManager: Cleaning up Bitmedia ads');
      bitmedialAdService.cleanup();
    };
  }, []);

  return <>{children}</>;
};

export default BitmedialAdManager;