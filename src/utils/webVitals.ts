// Web Vitals tracking utilities
export const trackWebVitals = () => {
  // Track Core Web Vitals with web-vitals library fallback
  if (typeof window !== 'undefined') {
    // First Contentful Paint (FCP)
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          trackVital('FCP', entry.startTime);
        }
      }
    });
    
    try {
      observer.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('Paint timing not supported');
    }

    // Time to First Byte (TTFB)
    window.addEventListener('load', () => {
      const [navigationEntry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        trackVital('TTFB', ttfb);
      }
    });

    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      trackVital('Load', loadTime);
    });
  }
};

const trackVital = (name: string, value: number) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'web_vitals', {
      name,
      value: Math.round(value),
      event_category: 'Performance'
    });
  }
  
  console.log(`${name}:`, Math.round(value), 'ms');
};

// Enhanced performance monitoring
export const trackResourceTiming = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          // Track slow resources (>1s)
          if (resourceEntry.duration > 1000) {
            if (typeof gtag !== 'undefined') {
              gtag('event', 'slow_resource', {
                resource_url: resourceEntry.name,
                duration: Math.round(resourceEntry.duration),
                resource_type: resourceEntry.initiatorType,
                event_category: 'Performance'
              });
            }
          }
        }
      }
    });
    
    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.warn('Resource timing not supported');
    }
  }
};

declare global {
  function gtag(...args: any[]): void;
}