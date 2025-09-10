import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { PageSEOData } from '@/utils/pageSeo';

interface AdvancedSEOHeadProps {
  seoData: PageSEOData;
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
  readingTime?: string;
  pageType?: 'homepage' | 'article' | 'token' | 'blog' | 'general';
}

export const AdvancedSEOHead: React.FC<AdvancedSEOHeadProps> = ({
  seoData,
  author = "Pump Parade Team",
  publishDate,
  modifiedDate,
  readingTime,
  pageType = 'general'
}) => {
  const location = useLocation();
  const currentUrl = `https://pumpparade.com${location.pathname}`;
  
  // Generate robots directives based on page type
  const getRobotsDirective = () => {
    const base = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
    
    if (pageType === 'article' || pageType === 'blog') {
      return `${base}, max-snippet:300`;
    }
    
    return base;
  };

  return (
    <Helmet htmlAttributes={{ lang: 'en' }}>
      {/* Enhanced Primary Meta Tags */}
      <title>{seoData.title}</title>
      <meta name="title" content={seoData.title} />
      <meta name="description" content={seoData.description} />
      {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
      <meta name="author" content={author} />
      <meta name="publisher" content="Pump Parade" />
      
      {/* Enhanced Robots and Crawling */}
      <meta name="robots" content={getRobotsDirective()} />
      <meta name="googlebot" content={getRobotsDirective()} />
      <meta name="bingbot" content={getRobotsDirective()} />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content="en-US" />
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      
      {/* Canonical and Alternate */}
      <link rel="canonical" href={seoData.canonical} />
      
      {/* Enhanced Open Graph */}
      {seoData.openGraph && (
        <>
          <meta property="og:type" content={seoData.openGraph.type || 'website'} />
          <meta property="og:url" content={currentUrl} />
          <meta property="og:title" content={seoData.openGraph.title} />
          <meta property="og:description" content={seoData.openGraph.description} />
          <meta property="og:site_name" content="Pump Parade" />
          <meta property="og:locale" content="en_US" />
          {seoData.openGraph.image && (
            <>
              <meta property="og:image" content={seoData.openGraph.image} />
              <meta property="og:image:secure_url" content={seoData.openGraph.image} />
              <meta property="og:image:width" content="1200" />
              <meta property="og:image:height" content="630" />
              <meta property="og:image:alt" content={seoData.openGraph.title} />
              <meta property="og:image:type" content="image/jpeg" />
            </>
          )}
        </>
      )}
      
      {/* Enhanced Twitter Cards */}
      {seoData.twitter && (
        <>
          <meta name="twitter:card" content={seoData.twitter.card || 'summary_large_image'} />
          <meta name="twitter:site" content="@PumpParade" />
          <meta name="twitter:creator" content="@PumpParade" />
          <meta name="twitter:title" content={seoData.twitter.title} />
          <meta name="twitter:description" content={seoData.twitter.description} />
          <meta name="twitter:domain" content="pumpparade.com" />
          {seoData.twitter.image && (
            <>
              <meta name="twitter:image" content={seoData.twitter.image} />
              <meta name="twitter:image:alt" content={seoData.twitter.title} />
            </>
          )}
        </>
      )}
      
      {/* Article-specific Meta Tags */}
      {(pageType === 'article' || seoData.openGraph?.type === 'article') && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:publisher" content="https://pumpparade.com" />
          <meta property="article:section" content="Cryptocurrency" />
          <meta property="article:tag" content="cryptocurrency" />
          <meta property="article:tag" content="analysis" />
          <meta property="article:tag" content="trading" />
          {publishDate && <meta property="article:published_time" content={publishDate} />}
          {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
        </>
      )}
      
      {/* Reading Time and Content Indicators */}
      {readingTime && <meta name="twitter:label1" content="Reading time" />}
      {readingTime && <meta name="twitter:data1" content={readingTime} />}
      
      {/* Enhanced Performance Hints */}
      <link rel="preconnect" href="https://api.coingecko.com" />
      <link rel="preconnect" href="https://server.pumpparade.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
      <link rel="dns-prefetch" href="//lunarcrush.com" />
      
      {/* Security and Performance */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="format-detection" content="address=no" />
      <meta name="HandheldFriendly" content="true" />
      <meta name="MobileOptimized" content="width" />
      
      {/* Enhanced Structured Data */}
      {seoData.structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(seoData.structuredData)}
        </script>
      )}
    </Helmet>
  );
};