import { Helmet } from 'react-helmet-async';

export const HeadImprovements = () => {
  return (
    <Helmet>
      {/* Enhanced Performance Hints */}
      <link rel="preload" href="/src/index.css" as="style" />
      <link rel="preload" href="/favicon.png" as="image" type="image/png" />
      
      {/* Resource Hints for External Domains */}
      <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
      <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="" />
      <link rel="preconnect" href="https://securepubads.g.doubleclick.net" crossOrigin="" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//cdn.bmcdn6.com" />
      <link rel="dns-prefetch" href="//appsha-prm.ctengine.io" />
      
      {/* Enhanced Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      
      {/* Enhanced PWA Meta Tags */}
      <meta name="theme-color" content="#0f172a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Pump Parade" />
      <meta name="msapplication-TileColor" content="#0f172a" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="application-name" content="Pump Parade" />
      
      {/* Enhanced Format Detection */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="format-detection" content="address=no" />
      <meta name="format-detection" content="email=no" />
      
      {/* Enhanced Mobile Optimization */}
      <meta name="HandheldFriendly" content="true" />
      <meta name="MobileOptimized" content="width" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no, viewport-fit=cover" />
      
      {/* Enhanced Icons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
      <link rel="mask-icon" href="/favicon.png" color="#0f172a" />
      <link rel="shortcut icon" href="/favicon.png" />
    </Helmet>
  );
};