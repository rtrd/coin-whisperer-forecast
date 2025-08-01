import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { PageSEOData } from '@/utils/pageSeo';

interface EnhancedSEOHeadProps {
  seoData: PageSEOData;
}

export const EnhancedSEOHead = ({ seoData }: EnhancedSEOHeadProps) => {
  const location = useLocation();
  const currentUrl = `https://pumpparade.com${location.pathname}`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoData.title}</title>
      <meta name="title" content={seoData.title} />
      <meta name="description" content={seoData.description} />
      {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
      
      {/* Enhanced Robot Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Canonical URL */}
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
          {seoData.twitter.image && (
            <meta name="twitter:image" content={seoData.twitter.image} />
          )}
        </>
      )}
      
      {/* Article-specific Meta Tags */}
      {seoData.openGraph?.type === 'article' && (
        <>
          <meta property="article:publisher" content="https://pumpparade.com" />
          <meta property="article:section" content="Cryptocurrency" />
          <meta property="article:tag" content="cryptocurrency" />
          <meta property="article:tag" content="analysis" />
          <meta property="article:tag" content="trading" />
        </>
      )}
      
      {/* Enhanced Structured Data */}
      {seoData.structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(seoData.structuredData)}
        </script>
      )}
      
      {/* Performance Optimization */}
      <link rel="preload" href="/src/index.css" as="style" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* Mobile Optimization */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="format-detection" content="address=no" />
      <meta name="HandheldFriendly" content="true" />
      <meta name="MobileOptimized" content="width" />
    </Helmet>
  );
};