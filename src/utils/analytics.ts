// Google Analytics 4 and Google Tag Manager utility functions

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Track page views for SPA navigation
export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-S1WNYHG54S', {
      page_path: path,
    });
  }
  
  // Push to dataLayer for GTM
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_path: path,
    });
  }
};

// Track custom events
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
  
  // Push to dataLayer for GTM
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...parameters,
    });
  }
};

// Track navigation clicks
export const trackNavClick = (destination: string, source: string = 'navigation') => {
  trackEvent('navigation_click', {
    destination,
    source,
    event_category: 'navigation',
  });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location: string = 'unknown') => {
  trackEvent('button_click', {
    button_name: buttonName,
    location,
    event_category: 'engagement',
  });
};

// Track article clicks
export const trackArticleClick = (articleTitle: string, position: number = 0) => {
  trackEvent('article_click', {
    article_title: articleTitle,
    position,
    event_category: 'content',
  });
};

// Track token clicks
export const trackTokenClick = (tokenName: string, source: string = 'token_list') => {
  trackEvent('token_click', {
    token_name: tokenName,
    source,
    event_category: 'crypto',
  });
};