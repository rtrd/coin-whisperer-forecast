
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageSEOData } from '@/utils/pageSeo';

export const useSEO = (seoData: PageSEOData) => {
  useEffect(() => {
    // Update the document title
    document.title = seoData.title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', seoData.description);
    }
    
    // Update canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', seoData.canonical);
    }
  }, [seoData]);

  return seoData;
};
