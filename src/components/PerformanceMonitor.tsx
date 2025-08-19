import { useEffect } from 'react';

declare global {
  function gtag(...args: any[]): void;
}

export const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    // Monitor React hydration performance
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure' && entry.name.includes('React')) {
          console.log(`React Performance: ${entry.name} took ${entry.duration}ms`);
          
          // Track performance metrics
          if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
              name: entry.name,
              value: Math.round(entry.duration)
            });
          }
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });

    // Monitor long tasks that might block React rendering
    const longTaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.warn(`Long task detected: ${entry.duration}ms`);
        
        if (typeof gtag !== 'undefined') {
          gtag('event', 'exception', {
            description: `Long task: ${entry.duration}ms`,
            fatal: false
          });
        }
      });
    });

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // longtask not supported in all browsers
    }

    return () => {
      observer.disconnect();
      longTaskObserver.disconnect();
    };
  }, []);

  return null;
};