import { Helmet } from 'react-helmet-async';
import { PageSEOData } from '@/utils/pageSeo';

interface SEOHeadProps {
  seoData: PageSEOData;
}

export const SEOHead = ({ seoData }: SEOHeadProps) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoData.title}</title>
      <meta name="title" content={seoData.title} />
      <meta name="description" content={seoData.description} />
      {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={seoData.canonical} />
      
      {/* Open Graph / Facebook */}
      {seoData.openGraph && (
        <>
          <meta property="og:type" content={seoData.openGraph.type || 'website'} />
          <meta property="og:url" content={seoData.openGraph.url} />
          <meta property="og:title" content={seoData.openGraph.title} />
          <meta property="og:description" content={seoData.openGraph.description} />
          <meta property="og:site_name" content="Pump Parade" />
          {seoData.openGraph.image && (
            <>
              <meta property="og:image" content={seoData.openGraph.image} />
              <meta property="og:image:width" content="1200" />
              <meta property="og:image:height" content="630" />
              <meta property="og:image:alt" content={seoData.openGraph.title} />
            </>
          )}
        </>
      )}
      
      {/* Twitter */}
      {seoData.twitter && (
        <>
          <meta property="twitter:card" content={seoData.twitter.card || 'summary_large_image'} />
          <meta property="twitter:url" content={seoData.canonical} />
          <meta property="twitter:title" content={seoData.twitter.title} />
          <meta property="twitter:description" content={seoData.twitter.description} />
          <meta property="twitter:site" content="@PumpParade" />
          <meta property="twitter:creator" content="@PumpParade" />
          {seoData.twitter.image && (
            <>
              <meta property="twitter:image" content={seoData.twitter.image} />
              <meta property="twitter:image:alt" content={seoData.twitter.title} />
            </>
          )}
        </>
      )}
      
      {/* Structured Data */}
      {seoData.structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(seoData.structuredData)}
        </script>
      )}
      
      {/* Additional Performance Hints */}
      <link rel="preload" href="/src/index.css" as="style" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="format-detection" content="address=no" />
    </Helmet>
  );
};