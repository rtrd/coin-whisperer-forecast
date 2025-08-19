// Performance optimization service for Core Web Vitals and caching
import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

interface PerformanceConfig {
  enableTracking: boolean;
  enableCaching: boolean;
  cacheTimeout: number;
}

class PerformanceService {
  private config: PerformanceConfig = {
    enableTracking: true,
    enableCaching: true,
    cacheTimeout: 5 * 60 * 1000 // 5 minutes
  };

  private cache = new Map<string, { data: any; timestamp: number }>();
  private pendingRequests = new Map<string, Promise<any>>();
  private initialized = false;

  constructor() {
    // Defer initialization to avoid issues during SSR or early loading
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    if (this.initialized) return;
    this.initialized = true;
    this.initWebVitals();
    this.initServiceWorker();
  }

  // Core Web Vitals tracking
  private initWebVitals() {
    if (!this.config.enableTracking || typeof window === 'undefined') return;

    const sendToAnalytics = (metric: Metric) => {
      // Only send if gtag is available (loaded asynchronously)
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        });
      }
    };

    // Track Core Web Vitals
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics); // Replaced FID with INP (Interaction to Next Paint)
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }

  // Service Worker initialization
  private async initServiceWorker() {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  }

  // Enhanced caching with deduplication
  async getCachedData<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    if (!this.config.enableCaching) {
      return fetcher();
    }

    // Check cache first
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout) {
      return cached.data;
    }

    // Check if request is already pending
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // Create new request
    const promise = fetcher().then(data => {
      this.cache.set(key, { data, timestamp: Date.now() });
      this.pendingRequests.delete(key);
      return data;
    }).catch(error => {
      this.pendingRequests.delete(key);
      throw error;
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  // Clear cache for specific key or all
  clearCache(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // Prefetch critical resources
  prefetchResources(urls: string[]) {
    if (typeof document === 'undefined') return;
    this.init(); // Ensure initialization
    
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  // Image optimization with intersection observer
  optimizeImages() {
    if (typeof document === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    this.init(); // Ensure initialization
    
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Memory cleanup
  cleanup() {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}

export const performanceService = new PerformanceService();