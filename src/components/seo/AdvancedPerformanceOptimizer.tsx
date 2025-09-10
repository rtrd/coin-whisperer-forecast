import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface AdvancedPerformanceOptimizerProps {
  criticalResources?: string[];
  prefetchResources?: string[];
  pageType?: 'homepage' | 'article' | 'token' | 'blog';
}

export const AdvancedPerformanceOptimizer: React.FC<AdvancedPerformanceOptimizerProps> = ({
  criticalResources = [],
  prefetchResources = [],
  pageType = 'homepage'
}) => {
  
  useEffect(() => {
    // Optimize font loading with font-display: swap
    const optimizeFonts = () => {
      const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
      fontLinks.forEach(link => {
        if (link instanceof HTMLLinkElement) {
          const href = link.href;
          if (!href.includes('display=swap')) {
            const separator = href.includes('?') ? '&' : '?';
            link.href = `${href}${separator}display=swap`;
          }
        }
      });
    };

    // Implement service worker for caching (simplified)
    const registerServiceWorker = () => {
      if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Service worker registration failed - ignore silently
        });
      }
    };

    // Optimize third-party scripts loading
    const deferNonCriticalScripts = () => {
      // Defer analytics until page interaction
      const deferAnalytics = () => {
        if (typeof gtag !== 'undefined') {
          requestIdleCallback(() => {
            gtag('config', 'G-S1WNYHG54S', {
              page_title: document.title,
              page_location: window.location.href,
              page_path: window.location.pathname
            });
          });
        }
      };

      // Run analytics when user interacts or after delay
      const events = ['click', 'scroll', 'keydown', 'mousemove'];
      const runOnce = () => {
        deferAnalytics();
        events.forEach(event => {
          document.removeEventListener(event, runOnce);
        });
      };

      events.forEach(event => {
        document.addEventListener(event, runOnce, { passive: true });
      });

      // Fallback: run after 10 seconds
      setTimeout(deferAnalytics, 10000);
    };

    // Preload critical resources based on page type
    const preloadCriticalResources = () => {
      const commonResources = [
        '/src/index.css',
        '/favicon.png'
      ];

      const pageSpecificResources: Record<string, string[]> = {
        homepage: ['/og-image.jpg'],
        article: [],
        token: [],
        blog: []
      };

      const resources = [...commonResources, ...pageSpecificResources[pageType], ...criticalResources];
      
      resources.forEach(resource => {
        if (!document.querySelector(`link[href="${resource}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = resource;
          link.as = resource.endsWith('.css') ? 'style' : 
                   resource.match(/\.(jpg|jpeg|png|webp|avif)$/i) ? 'image' : 'fetch';
          link.crossOrigin = resource.includes('googleapis') ? 'anonymous' : '';
          document.head.appendChild(link);
        }
      });
    };

    // Run optimizations
    optimizeFonts();
    preloadCriticalResources();
    deferNonCriticalScripts();

    // Register service worker after page load
    window.addEventListener('load', registerServiceWorker);

    return () => {
      window.removeEventListener('load', registerServiceWorker);
    };
  }, [criticalResources, pageType]);

  return (
    <Helmet>
      {/* Critical Resource Hints */}
      <link rel="preconnect" href="https://api.coingecko.com" />
      <link rel="preconnect" href="https://server.pumpparade.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* Enhanced DNS Prefetch */}
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
      <link rel="dns-prefetch" href="//lunarcrush.com" />
      <link rel="dns-prefetch" href="//coinmarketcap.com" />
      <link rel="dns-prefetch" href="//cryptopanic.com" />
      
      {/* Preload Critical Fonts */}
      <link 
        rel="preload" 
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
        as="style" 
      />
      
      {/* Critical CSS for above-the-fold content */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .critical-loading {
            background: linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #7c3aed 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .critical-text {
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 1.125rem;
            opacity: 0.9;
          }
          
          @media (prefers-reduced-motion: no-preference) {
            .critical-loading {
              animation: gradient-shift 3s ease-in-out infinite alternate;
            }
          }
          
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
        `
      }} />
      
      {/* Prefetch next-page resources */}
      {prefetchResources.map((resource, index) => (
        <link key={index} rel="prefetch" href={resource} />
      ))}
      
      {/* Performance optimization meta tags */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
      
      {/* Web App Manifest for PWA capabilities */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#0f172a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Resource hints for better caching */}
      <meta httpEquiv="Cache-Control" content="public, max-age=31536000, immutable" />
    </Helmet>
  );
};