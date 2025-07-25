
// Page-specific SEO utilities for dynamic meta tag generation

export interface PageSEOData {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  openGraph: {
    title: string;
    description: string;
    type: string;
    url: string;
    image: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
  structuredData?: any;
}

// Homepage SEO
export const generateHomepageSEO = (): PageSEOData => {
  return {
    title: "Pump Parade | AI Crypto Analysis & Price Predictions",
    description: "Get AI-powered cryptocurrency analysis, price predictions, and trading signals. Track market trends, sentiment analysis, and technical indicators for informed crypto investing.",
    keywords: "cryptocurrency analysis, AI price predictions, crypto trading signals, bitcoin prediction, ethereum analysis, market sentiment, technical analysis, pump parade",
    canonical: "https://pumpparade.com/",
    openGraph: {
      title: "Pump Parade | AI Crypto Analysis & Price Predictions",
      description: "Get AI-powered cryptocurrency analysis, price predictions, and trading signals. Track market trends, sentiment analysis, and technical indicators.",
      type: "website",
      url: "https://pumpparade.com/",
      image: "https://pumpparade.com/og-image.jpg"
    },
    twitter: {
      card: "summary_large_image",
      title: "Pump Parade | AI Crypto Analysis & Price Predictions",
      description: "Get AI-powered cryptocurrency analysis, price predictions, and trading signals. Track market trends, sentiment analysis, and technical indicators.",
      image: "https://pumpparade.com/og-image.jpg"
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Pump Parade",
      "url": "https://pumpparade.com",
      "description": "AI-powered cryptocurrency analysis and price predictions",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://pumpparade.com/token/{search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  };
};

// Blog SEO
export const generateBlogSEO = (): PageSEOData => {
  return {
    title: "Crypto News & Analysis Blog | Pump Parade",
    description: "Latest cryptocurrency news, market analysis, and trading insights. Stay updated with expert crypto content and market trends from industry professionals.",
    keywords: "crypto news, cryptocurrency blog, market analysis, trading insights, bitcoin news, ethereum updates, DeFi analysis, crypto trends",
    canonical: "https://pumpparade.com/blog",
    openGraph: {
      title: "Crypto News & Analysis Blog | Pump Parade",
      description: "Latest cryptocurrency news, market analysis, and trading insights. Stay updated with expert crypto content and market trends.",
      type: "website",
      url: "https://pumpparade.com/blog",
      image: "https://pumpparade.com/og-image.jpg"
    },
    twitter: {
      card: "summary_large_image",
      title: "Crypto News & Analysis Blog | Pump Parade",
      description: "Latest cryptocurrency news, market analysis, and trading insights. Stay updated with expert crypto content and market trends.",
      image: "https://pumpparade.com/og-image.jpg"
    }
  };
};

// AI Prediction SEO
export const generateAIPredictionSEO = (): PageSEOData => {
  return {
    title: "AI Cryptocurrency Price Predictions | Pump Parade",
    description: "Advanced AI-powered crypto price predictions using machine learning algorithms and market sentiment analysis for accurate forecasting of Bitcoin, Ethereum, and altcoins.",
    keywords: "AI crypto predictions, machine learning cryptocurrency, price forecasting, bitcoin prediction AI, ethereum price prediction, crypto AI analysis",
    canonical: "https://pumpparade.com/ai-prediction",
    openGraph: {
      title: "AI Cryptocurrency Price Predictions | Pump Parade",
      description: "Advanced AI-powered crypto price predictions using machine learning algorithms and market sentiment analysis for accurate forecasting.",
      type: "website",
      url: "https://pumpparade.com/ai-prediction",
      image: "https://pumpparade.com/og-image.jpg"
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Cryptocurrency Price Predictions | Pump Parade",
      description: "Advanced AI-powered crypto price predictions using machine learning algorithms and market sentiment analysis for accurate forecasting.",
      image: "https://pumpparade.com/og-image.jpg"
    }
  };
};

// MOTI Meter SEO (Updated as requested)
export const generateMotiMeterSEO = (): PageSEOData => {
  return {
    title: "MOTI Meter | Memecoin Momentum and Social Sentiment Tracker | Pump Parade",
    description: "Track the hottest meme coins with our MOTI scoring system. Find trending tokens based on viral energy, community momentum, and social sentiment analysis for maximum gains.",
    keywords: "MOTI meter, memecoin tracker, social sentiment analysis, meme coin momentum, viral crypto tokens, community sentiment, trending memecoins",
    canonical: "https://pumpparade.com/moti-meter",
    openGraph: {
      title: "MOTI Meter | Memecoin Momentum and Social Sentiment Tracker | Pump Parade",
      description: "Track the hottest meme coins with our MOTI scoring system. Find trending tokens based on viral energy, community momentum, and social sentiment analysis.",
      type: "website",
      url: "https://pumpparade.com/moti-meter",
      image: "https://pumpparade.com/og-image.jpg"
    },
    twitter: {
      card: "summary_large_image",
      title: "MOTI Meter | Memecoin Momentum and Social Sentiment Tracker | Pump Parade",
      description: "Track the hottest meme coins with our MOTI scoring system. Find trending tokens based on viral energy, community momentum, and social sentiment analysis.",
      image: "https://pumpparade.com/og-image.jpg"
    }
  };
};

// All Tokens SEO
export const generateAllTokensSEO = (): PageSEOData => {
  return {
    title: "All Cryptocurrency Tokens & Market Data | Pump Parade",
    description: "Complete cryptocurrency market data, prices, and analysis for all tokens. Filter and compare crypto assets with real-time data, market cap, volume, and price changes.",
    keywords: "all cryptocurrencies, crypto market data, token prices, cryptocurrency list, market cap rankings, crypto trading data, altcoin analysis",
    canonical: "https://pumpparade.com/tokens",
    openGraph: {
      title: "All Cryptocurrency Tokens & Market Data | Pump Parade",
      description: "Complete cryptocurrency market data, prices, and analysis for all tokens. Filter and compare crypto assets with real-time data.",
      type: "website",
      url: "https://pumpparade.com/tokens",
      image: "https://pumpparade.com/og-image.jpg"
    },
    twitter: {
      card: "summary_large_image",
      title: "All Cryptocurrency Tokens & Market Data | Pump Parade",
      description: "Complete cryptocurrency market data, prices, and analysis for all tokens. Filter and compare crypto assets with real-time data.",
      image: "https://pumpparade.com/og-image.jpg"
    }
  };
};

// Pump.fun SEO
export const generatePumpFunSEO = (): PageSEOData => {
  return {
    title: "Solana Memecoin Tracker | Pump.fun Integration | Pump Parade",
    description: "Discover and track trending Solana memecoins and new token launches from Pump.fun with real-time data and insights. Find the next viral Solana token early.",
    keywords: "pump.fun integration, Solana memecoins, new token launches, trending Solana tokens, memecoin tracker, Solana DeFi, viral tokens",
    canonical: "https://pumpparade.com/pump-fun",
    openGraph: {
      title: "Solana Memecoin Tracker | Pump.fun Integration | Pump Parade",
      description: "Discover and track trending Solana memecoins and new token launches from Pump.fun with real-time data and insights.",
      type: "website",
      url: "https://pumpparade.com/pump-fun",
      image: "https://pumpparade.com/og-image.jpg"
    },
    twitter: {
      card: "summary_large_image",
      title: "Solana Memecoin Tracker | Pump.fun Integration | Pump Parade",
      description: "Discover and track trending Solana memecoins and new token launches from Pump.fun with real-time data and insights.",
      image: "https://pumpparade.com/og-image.jpg"
    }
  };
};

// Technical Analysis SEO
export const generateTechnicalAnalysisSEO = (): PageSEOData => {
  return {
    title: "Cryptocurrency Technical Analysis Tools | Pump Parade",
    description: "Professional crypto technical analysis with advanced indicators, chart patterns, and trading signals for informed decisions. RSI, MACD, moving averages, and more.",
    keywords: "crypto technical analysis, trading indicators, chart patterns, RSI, MACD, moving averages, crypto trading signals, technical indicators",
    canonical: "https://pumpparade.com/technical-analysis",
    openGraph: {
      title: "Cryptocurrency Technical Analysis Tools | Pump Parade",
      description: "Professional crypto technical analysis with advanced indicators, chart patterns, and trading signals for informed decisions.",
      type: "website",
      url: "https://pumpparade.com/technical-analysis",
      image: "https://pumpparade.com/og-image.jpg"
    },
    twitter: {
      card: "summary_large_image",
      title: "Cryptocurrency Technical Analysis Tools | Pump Parade",
      description: "Professional crypto technical analysis with advanced indicators, chart patterns, and trading signals for informed decisions.",
      image: "https://pumpparade.com/og-image.jpg"
    }
  };
};

// Sentiment Analysis SEO
export const generateSentimentAnalysisSEO = (): PageSEOData => {
  return {
    title: "Crypto Market Sentiment Analysis | Pump Parade",
    description: "AI-powered cryptocurrency sentiment analysis from social media, news, and market data to gauge market emotions and predict price movements with advanced algorithms.",
    keywords: "crypto sentiment analysis, market sentiment, social media crypto analysis, news sentiment, market emotions, sentiment indicators, crypto psychology",
    canonical: "https://pumpparade.com/sentiment-analysis",
    openGraph: {
      title: "Crypto Market Sentiment Analysis | Pump Parade",
      description: "AI-powered cryptocurrency sentiment analysis from social media, news, and market data to gauge market emotions and predict price movements.",
      type: "website",
      url: "https://pumpparade.com/sentiment-analysis",
      image: "https://pumpparade.com/og-image.jpg"
    },
    twitter: {
      card: "summary_large_image",
      title: "Crypto Market Sentiment Analysis | Pump Parade",
      description: "AI-powered cryptocurrency sentiment analysis from social media, news, and market data to gauge market emotions and predict price movements.",
      image: "https://pumpparade.com/og-image.jpg"
    }
  };
};

// Subscribe SEO
export const generateSubscribeSEO = (): PageSEOData => {
  return {
    title: "Premium Crypto Analysis Subscription | Pump Parade",
    description: "Unlock premium cryptocurrency analysis features including advanced AI predictions, real-time alerts, exclusive insights, and ad-free experience. Join thousands of successful traders.",
    keywords: "crypto premium subscription, advanced crypto analysis, premium trading signals, crypto alerts, professional crypto tools, trading subscription",
    canonical: "https://pumpparade.com/subscribe",
    openGraph: {
      title: "Premium Crypto Analysis Subscription | Pump Parade",
      description: "Unlock premium cryptocurrency analysis features including advanced AI predictions, real-time alerts, exclusive insights, and ad-free experience.",
      type: "website",
      url: "https://pumpparade.com/subscribe",
      image: "https://pumpparade.com/og-image.jpg"
    },
    twitter: {
      card: "summary_large_image",
      title: "Premium Crypto Analysis Subscription | Pump Parade",
      description: "Unlock premium cryptocurrency analysis features including advanced AI predictions, real-time alerts, exclusive insights, and ad-free experience.",
      image: "https://pumpparade.com/og-image.jpg"
    }
  };
};

// Article SEO generator
export const generateArticleSEO = (article: any): PageSEOData => {
  const title = `${article.title} | Pump Parade`;
  const description = article.excerpt || article.description || "Read the latest cryptocurrency news and analysis on Pump Parade.";
  
  return {
    title,
    description,
    keywords: `${article.tags || article.tagNames?.join(', ') || ''}, cryptocurrency news, crypto analysis, ${article.category}`,
    canonical: `https://pumpparade.com/article/${article.id}`,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://pumpparade.com/article/${article.id}`,
      image: article.image || "https://pumpparade.com/og-image.jpg"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      image: article.image || "https://pumpparade.com/og-image.jpg"
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": description,
      "author": {
        "@type": "Person",
        "name": article.author || "Pump Parade Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Pump Parade",
        "logo": {
          "@type": "ImageObject",
          "url": "https://pumpparade.com/og-image.jpg"
        }
      },
      "datePublished": article.date,
      "dateModified": article.date,
      "image": article.image || "https://pumpparade.com/og-image.jpg",
      "url": `https://pumpparade.com/article/${article.id}`
    }
  };
};
