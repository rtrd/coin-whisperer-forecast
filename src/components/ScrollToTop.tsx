import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/utils/analytics';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Track page view for GA4 and GTM
    trackPageView(location.pathname);
  }, [location]);

  return null;
};

export default ScrollToTop;