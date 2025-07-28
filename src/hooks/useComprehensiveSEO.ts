import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageSEOData } from '@/utils/pageSeo';

export const useComprehensiveSEO = (seoData: PageSEOData) => {
  const location = useLocation();

  useEffect(() => {
    // Update document title
    document.title = seoData.title;
    
    // Update or create meta description
    updateMetaTag('name', 'description', seoData.description);
    
    // Update or create keywords
    if (seoData.keywords) {
      updateMetaTag('name', 'keywords', seoData.keywords);
    }
    
    // Update canonical URL
    updateLinkTag('canonical', seoData.canonical);
    
    // Update Open Graph tags
    if (seoData.openGraph) {
      updateMetaTag('property', 'og:title', seoData.openGraph.title);
      updateMetaTag('property', 'og:description', seoData.openGraph.description);
      updateMetaTag('property', 'og:url', seoData.openGraph.url);
      updateMetaTag('property', 'og:type', seoData.openGraph.type || 'website');
      updateMetaTag('property', 'og:site_name', 'Pump Parade');
      
      if (seoData.openGraph.image) {
        updateMetaTag('property', 'og:image', seoData.openGraph.image);
        updateMetaTag('property', 'og:image:width', '1200');
        updateMetaTag('property', 'og:image:height', '630');
        updateMetaTag('property', 'og:image:alt', seoData.openGraph.title);
      }
    }
    
    // Update Twitter Card tags
    if (seoData.twitter) {
      updateMetaTag('name', 'twitter:card', seoData.twitter.card || 'summary_large_image');
      updateMetaTag('name', 'twitter:site', '@PumpParade');
      updateMetaTag('name', 'twitter:creator', '@PumpParade');
      updateMetaTag('name', 'twitter:title', seoData.twitter.title);
      updateMetaTag('name', 'twitter:description', seoData.twitter.description);
      
      if (seoData.twitter.image) {
        updateMetaTag('name', 'twitter:image', seoData.twitter.image);
        updateMetaTag('name', 'twitter:image:alt', seoData.twitter.title);
      }
    }
    
    // Update structured data
    if (seoData.structuredData) {
      updateStructuredData(seoData.structuredData);
    }
    
    // Analytics: Track page view
    if (typeof gtag !== 'undefined') {
      gtag('config', 'G-S1WNYHG54S', {
        page_title: seoData.title,
        page_location: window.location.href,
        page_path: location.pathname
      });
    }
    
  }, [seoData, location.pathname]);

  return seoData;
};

// Helper function to update or create meta tags
const updateMetaTag = (attribute: string, name: string, content: string) => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
};

// Helper function to update or create link tags
const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`);
  
  if (element) {
    element.setAttribute('href', href);
  } else {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    element.setAttribute('href', href);
    document.head.appendChild(element);
  }
};

// Helper function to update structured data
const updateStructuredData = (structuredData: any) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]#dynamic-seo');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Add new structured data
  const script = document.createElement('script');
  script.id = 'dynamic-seo';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
};

// Global type declaration for gtag
declare global {
  function gtag(...args: any[]): void;
}