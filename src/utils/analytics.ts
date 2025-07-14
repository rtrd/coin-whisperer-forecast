// Google Analytics 4 and Google Tag Manager utility functions

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Debug mode - set to true for development
const DEBUG_MODE = process.env.NODE_ENV === 'development';

// Debug logging helper
const debugLog = (eventName: string, parameters: Record<string, any>) => {
  if (DEBUG_MODE) {
    console.log(`🔍 GA Event: ${eventName}`, parameters);
  }
};

// Enhanced error handling for tracking
const safeTrack = (trackingFn: () => void, eventName: string) => {
  try {
    trackingFn();
  } catch (error) {
    if (DEBUG_MODE) {
      console.error(`❌ GA Tracking Error for ${eventName}:`, error);
    }
  }
};

// Track page views for SPA navigation
export const trackPageView = (path: string) => {
  const parameters = { page_path: path };
  debugLog('page_view', parameters);
  
  safeTrack(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-S1WNYHG54S', parameters);
    }
    
    // Push to dataLayer for GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        ...parameters,
      });
    }
  }, 'page_view');
};

// Track custom events with enhanced error handling
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  debugLog(eventName, parameters);
  
  safeTrack(() => {
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
  }, eventName);
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

// Enhanced crypto-specific tracking
export const trackTokenPageView = (tokenName: string, tokenSymbol?: string, price?: number) => {
  trackEvent('token_page_view', {
    token_name: tokenName,
    token_symbol: tokenSymbol,
    token_price: price,
    event_category: 'crypto',
  });
};

export const trackPredictionTool = (action: string, tokenName?: string, predictionType?: string) => {
  trackEvent('prediction_tool', {
    action, // 'generate', 'view', 'adjust'
    token_name: tokenName,
    prediction_type: predictionType,
    event_category: 'crypto_tools',
  });
};

export const trackAnalysisTool = (toolType: string, action: string, tokenName?: string) => {
  trackEvent('analysis_tool', {
    tool_type: toolType, // 'technical', 'sentiment', 'ai_signals'
    action, // 'view', 'generate', 'interact'
    token_name: tokenName,
    event_category: 'crypto_tools',
  });
};

export const trackSearchFilter = (filterType: string, value: string, source: string = 'unknown') => {
  trackEvent('search_filter', {
    filter_type: filterType,
    filter_value: value,
    source,
    event_category: 'search',
  });
};

// Form tracking
export const trackFormSubmission = (formName: string, success: boolean = true) => {
  trackEvent('form_submission', {
    form_name: formName,
    success,
    event_category: 'engagement',
  });
};

export const trackFormError = (formName: string, errorType: string) => {
  trackEvent('form_error', {
    form_name: formName,
    error_type: errorType,
    event_category: 'errors',
  });
};

// Enhanced article tracking
export const trackArticleView = (articleTitle: string, category: string, author?: string, readTime?: string) => {
  trackEvent('article_view', {
    article_title: articleTitle,
    article_category: category,
    author,
    read_time: readTime,
    event_category: 'content',
  });
};

export const trackArticleEngagement = (action: string, articleTitle: string, position?: number) => {
  trackEvent('article_engagement', {
    action, // 'share', 'bookmark', 'scroll_50', 'scroll_100'
    article_title: articleTitle,
    position,
    event_category: 'content',
  });
};

// Navigation and UI tracking
export const trackMenuInteraction = (menuItem: string, action: string = 'click') => {
  trackEvent('menu_interaction', {
    menu_item: menuItem,
    action,
    event_category: 'navigation',
  });
};

export const trackFeatureUsage = (featureName: string, action: string, metadata?: Record<string, any>) => {
  trackEvent('feature_usage', {
    feature_name: featureName,
    action,
    event_category: 'features',
    ...metadata,
  });
};

// Subscription and monetization tracking
export const trackSubscriptionEvent = (action: string, plan?: string, source?: string) => {
  trackEvent('subscription', {
    action, // 'view_plans', 'start_checkout', 'complete', 'cancel'
    plan,
    source,
    event_category: 'monetization',
  });
};

// Error tracking
export const trackError = (errorType: string, errorMessage: string, context?: string) => {
  trackEvent('error', {
    error_type: errorType,
    error_message: errorMessage,
    context,
    event_category: 'errors',
  });
};

// Performance tracking
export const trackPerformance = (metric: string, value: number, context?: string) => {
  trackEvent('performance', {
    metric_name: metric,
    metric_value: value,
    context,
    event_category: 'performance',
  });
};

// Debug function to test tracking
export const testTracking = () => {
  if (DEBUG_MODE) {
    console.log('🧪 Testing Google Analytics tracking...');
    trackEvent('test_event', { test: true, timestamp: Date.now() });
    console.log('✅ Test event sent');
  }
};