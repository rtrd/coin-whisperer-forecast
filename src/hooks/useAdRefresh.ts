import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { adRefreshService } from '@/services/adRefreshService';

export const useAdRefresh = () => {
  const location = useLocation();
  const previousPath = useRef<string>('');
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Handle route changes
    if (previousPath.current && previousPath.current !== location.pathname) {
      // Clear any pending refresh
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      // Delay refresh slightly to allow new page to render
      refreshTimeoutRef.current = setTimeout(() => {
        adRefreshService.refreshAllVisibleSlots();
      }, 1000);
    }
    
    previousPath.current = location.pathname;

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    // Handle page refresh/reload
    const handlePageShow = (event: PageTransitionEvent) => {
      // If page is loaded from cache (back/forward navigation) or fresh load
      if (event.persisted || performance.navigation.type === 1) {
        setTimeout(() => {
          adRefreshService.refreshAllVisibleSlots();
        }, 1500);
      }
    };

    const handleBeforeUnload = () => {
      adRefreshService.reset();
    };

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const refreshSpecificSlot = (slotId: string) => {
    adRefreshService.refreshSlot(slotId);
  };

  const refreshAllSlots = () => {
    adRefreshService.refreshAllVisibleSlots();
  };

  return {
    refreshSpecificSlot,
    refreshAllSlots
  };
};