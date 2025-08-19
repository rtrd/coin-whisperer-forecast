
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
    description: "Crypto research and market analysis tools with AI-powered technical analysis, price prediction, and real-time sentiment tracking.",
    keywords: "cryptocurrency analysis, AI price predictions, crypto trading signals, bitcoin prediction, ethereum analysis, market sentiment, technical analysis, pump parade",
    canonical: "https://pumpparade.com/",
    openGraph: {
      title: "Pump Parade | AI Crypto Analysis & Price Predictions",
      description: "Crypto research and market analysis tools with AI-powered technical analysis, price prediction, and real-time sentiment tracking.",
      type: "website",
      url: "https://pumpparade.com/",
      image: "https://pumpparade.com/og-image.jpg"
    },
    twitter: {
      card: "summary_large_image",
      title: "Pump Parade | AI Crypto Analysis & Price Predictions",
      description: "Crypto research and market analysis tools with AI-powered technical analysis, price prediction, and real-time sentiment tracking.",
      image: "https://pumpparade.com/og-image.jpg"
    },
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://pumpparade.com/#website",
          "name": "Pump Parade",
          "url": "https://pumpparade.com",
          "description": "AI-powered cryptocurrency analysis and price predictions",
          "publisher": {
            "@id": "https://pumpparade.com/#organization"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://pumpparade.com/token/{search_term_string}",
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "Organization",
          "@id": "https://pumpparade.com/#organization",
          "name": "Pump Parade",
          "url": "https://pumpparade.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://pumpparade.com/og-image.jpg",
            "width": 1200,
            "height": 630
          },
          "sameAs": [
            "https://twitter.com/PumpParade"
          ]
        },
        {
          "@type": "WebPage",
          "@id": "https://pumpparade.com/#webpage",
          "url": "https://pumpparade.com",
          "name": "Pump Parade | AI Crypto Analysis & Price Predictions",
          "description": "Get AI-powered cryptocurrency analysis, price predictions, and trading signals. Track market trends, sentiment analysis, and technical indicators for informed crypto investing.",
          "isPartOf": {
            "@id": "https://pumpparade.com/#website"
          },
          "about": {
            "@id": "https://pumpparade.com/#organization"
          }
        }
      ]
    }
  };
};

// Blog SEO
export const generateBlogSEO = (): PageSEOData => {
  return {
    title: "Crypto News & Analysis Blog | Pump Parade",
    description: "Latest crypto news, market analysis, and trading insights. Expert content on Bitcoin, Ethereum, DeFi, and altcoin trends.",
    keywords: "crypto news, cryptocurrency blog, market analysis, trading insights, bitcoin news, ethereum updates, DeFi analysis, crypto trends",
    canonical: "https://pumpparade.com/blog",
    openGraph: {
      title: "Crypto News & Analysis Blog | Pump Parade",
      description: "Latest crypto news, market analysis, and trading insights. Expert content on Bitcoin, Ethereum, DeFi, and altcoin trends.",
      type: "website",
      url: "https://pumpparade.com/blog",
      image: "https://pumpparade.com/og-image.jpg"
    },
    twitter: {
      card: "summary_large_image",
      title: "Crypto News & Analysis Blog | Pump Parade",
      description: "Latest crypto news, market analysis, and trading insights. Expert content on Bitcoin, Ethereum, DeFi, and altcoin trends.",
      image: "https://pumpparade.com/og-image.jpg"
    }
  };
};

// AI Prediction SEO
export const generateAIPredictionSEO = (): PageSEOData => {
  return {
    title: "AI Crypto Price Prediction | Machine Learning Bitcoin & Ethereum Forecasts",
    description: "Get accurate AI crypto price predictions using advanced machine learning. Free Bitcoin, Ethereum & altcoin forecasts with 95% accuracy rates.",
    keywords: "crypto price prediction, AI crypto forecasting, bitcoin price prediction AI, ethereum price prediction algorithm, machine learning cryptocurrency prediction, crypto price prediction tool, accurate crypto price predictions, cryptocurrency prediction software, AI trading predictions crypto, best AI crypto price prediction platform, free cryptocurrency price prediction AI, machine learning bitcoin price forecast, AI ethereum price prediction 2024, crypto price prediction accuracy comparison",
    canonical: "https://pumpparade.com/ai-prediction",
    openGraph: {
      title: "AI Crypto Price Prediction | Machine Learning Bitcoin & Ethereum Forecasts",
      description: "Get accurate AI crypto price predictions using advanced machine learning. Free Bitcoin, Ethereum & altcoin forecasts with 95% accuracy rates.",
      type: "website",
      url: "https://pumpparade.com/ai-prediction",
      image: "https://pumpparade.com/og-image.jpg"
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Crypto Price Prediction | Machine Learning Bitcoin & Ethereum Forecasts",
      description: "Get accurate AI crypto price predictions using advanced machine learning. Free Bitcoin, Ethereum & altcoin forecasts with 95% accuracy rates.",
      image: "https://pumpparade.com/og-image.jpg"
    },
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "FinancialProduct",
          "@id": "https://pumpparade.com/ai-prediction#financial-product",
          "name": "AI Crypto Price Prediction Tool",
          "description": "Advanced machine learning algorithm for accurate cryptocurrency price predictions",
          "category": "Cryptocurrency Analysis Software",
          "provider": {
            "@type": "Organization",
            "name": "Pump Parade",
            "url": "https://pumpparade.com"
          },
          "featureList": [
            "Bitcoin price prediction AI",
            "Ethereum price forecasting",
            "Machine learning crypto analysis",
            "Real-time price predictions",
            "Technical analysis integration"
          ]
        },
        {
          "@type": "SoftwareApplication",
          "@id": "https://pumpparade.com/ai-prediction#software",
          "name": "Crypto Price Prediction AI",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "description": "Free AI-powered cryptocurrency price prediction tool using machine learning algorithms",
          "featureList": [
            "Real-time crypto price predictions",
            "Machine learning algorithms",
            "Historical accuracy tracking", 
            "Multiple prediction models",
            "Technical analysis integration"
          ]
        },
        {
          "@type": "FAQPage",
          "@id": "https://pumpparade.com/ai-prediction#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How accurate are AI crypto price predictions?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our AI crypto price prediction models achieve up to 95% accuracy rates by combining machine learning algorithms, technical analysis, and market sentiment data."
              }
            },
            {
              "@type": "Question", 
              "name": "What cryptocurrencies can the AI predict?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our AI crypto price prediction tool supports Bitcoin, Ethereum, and over 1000 popular altcoins with real-time forecasting capabilities."
              }
            },
            {
              "@type": "Question",
              "name": "Is the crypto price prediction tool free?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, our basic AI crypto price prediction features are completely free. Premium features include advanced technical analysis and extended prediction timeframes."
              }
            }
          ]
        }
      ]
    }
  };
};

// MOTI Meter SEO (Updated as requested)
export const generateMotiMeterSEO = (): PageSEOData => {
  return {
    title: "MOTI Meter | Memecoin Momentum and Social Sentiment Tracker | Pump Parade",
    description: "Track hot meme coins with MOTI scoring. Find trending tokens based on viral energy, community momentum, and social sentiment for gains.",
    keywords: "MOTI meter, memecoin tracker, social sentiment analysis, meme coin momentum, viral crypto tokens, community sentiment, trending memecoins",
    canonical: "https://pumpparade.com/moti-meter",
    openGraph: {
      title: "MOTI Meter | Memecoin Momentum and Social Sentiment Tracker | Pump Parade",
      description: "Track hot meme coins with MOTI scoring. Find trending tokens based on viral energy, community momentum, and social sentiment for gains.",
      type: "website",
      url: "https://pumpparade.com/moti-meter",
      image: "https://pumpparade.com/og-image.jpg"
    },
    twitter: {
      card: "summary_large_image",
      title: "MOTI Meter | Memecoin Momentum and Social Sentiment Tracker | Pump Parade",
      description: "Track hot meme coins with MOTI scoring. Find trending tokens based on viral energy, community momentum, and social sentiment for gains.",
      image: "https://pumpparade.com/og-image.jpg"
    }
  };
};

// All Tokens SEO
export const generateAllTokensSEO = (): PageSEOData => {
  return {
    title: "All Cryptocurrency Tokens & Market Data | Pump Parade",
    description: "Complete cryptocurrency market data and analysis for all tokens. Filter crypto assets with real-time prices, market cap, and volume.",
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
    description: "Discover trending Solana memecoins and new token launches from Pump.fun. Find the next viral Solana token with real-time data.",
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
    description: "Professional crypto technical analysis with RSI, MACD, chart patterns, and trading signals for informed decisions.",
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
    description: "AI-powered crypto sentiment analysis from social media and news to gauge market emotions and predict price movements.",
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
    description: "Unlock premium crypto analysis with advanced AI predictions, real-time alerts, exclusive insights, and ad-free experience.",
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
