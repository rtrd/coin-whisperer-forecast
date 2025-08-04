import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { bitmedialAdService } from '@/services/bitmedialAdService';

export const useAdScript = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Bitmedia ads on first load
    bitmedialAdService.initializeAds();

    // Cleanup on unmount
    return () => {
      bitmedialAdService.cleanup();
    };
  }, []);

  useEffect(() => {
    // Refresh Bitmedia ads on route change (except initial load)
    if (location.pathname) {
      const timer = setTimeout(() => {
        bitmedialAdService.refreshAds();
      }, 1000); // Delay to let page content load first

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);
};