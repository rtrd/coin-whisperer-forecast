import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface CoreWebVitalsOptimizerProps {
  preloadResources?: string[];
  prefetchResources?: string[];
  criticalCSS?: string;
}

export const CoreWebVitalsOptimizer: React.FC<CoreWebVitalsOptimizerProps> = ({
  preloadResources = [],
  prefetchResources = [],
  criticalCSS
}) => {
  useEffect(() => {
    // Preload critical fonts
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ];

    // Create link elements for font preloading
    criticalFonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = fontUrl;
      link.as = 'style';
      link.onload = () => {
        link.rel = 'stylesheet';
      };
      document.head.appendChild(link);
    });

    // Prefetch next page resources
    const commonPrefetchUrls = [
      '/api/cryptos',
      '/api/predictions',
      'https://server.pumpparade.com/api/cryptos'
    ];

    commonPrefetchUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });

    // Optimize third-party scripts
    const optimizeScripts = () => {
      // Defer non-critical analytics
      if (typeof gtag !== 'undefined') {
        requestIdleCallback(() => {
          gtag('config', 'G-S1WNYHG54S', {
            page_title: document.title,
            page_location: window.location.href
          });
        });
      }
    };

    // Run optimizations when idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(optimizeScripts);
    } else {
      setTimeout(optimizeScripts, 100);
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <Helmet>
      {/* Critical resource hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://server.pumpparade.com" />
      <link rel="preconnect" href="https://api.coingecko.com" />
      
      {/* DNS prefetch for third-party domains */}
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://lunarcrush.com" />
      
      {/* Preload critical resources */}
      {preloadResources.map((resource, index) => (
        <link
          key={index}
          rel="preload"
          href={resource}
          as={resource.endsWith('.css') ? 'style' : 'script'}
          crossOrigin={resource.includes('googleapis') ? 'anonymous' : undefined}
        />
      ))}
      
      {/* Prefetch next-page resources */}
      {prefetchResources.map((resource, index) => (
        <link key={index} rel="prefetch" href={resource} />
      ))}
      
      {/* Critical CSS inlined */}
      {criticalCSS && (
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
      )}
      
      {/* Optimize viewport for mobile performance */}
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      
      {/* Resource hints for better performance */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      
      {/* Preload critical images */}
      <link rel="preload" href="/og-image.jpg" as="image" />
      <link rel="preload" href="/favicon.png" as="image" />
    </Helmet>
  );
};