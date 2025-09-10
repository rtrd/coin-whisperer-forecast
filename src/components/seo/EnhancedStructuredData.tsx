import React from 'react';
import { Helmet } from 'react-helmet-async';

interface TokenData {
  name: string;
  symbol: string;
  currentPrice: number;
  priceChange: number;
  marketCap?: number;
  description: string;
  category: string;
  url: string;
}

interface EnhancedStructuredDataProps {
  token?: TokenData;
  pageType?: 'homepage' | 'token' | 'article' | 'analysis';
  article?: {
    title: string;
    description: string;
    datePublished: string;
    dateModified?: string;
    author: string;
    url: string;
  };
}

export const EnhancedStructuredData: React.FC<EnhancedStructuredDataProps> = ({
  token,
  pageType = 'homepage',
  article
}) => {
  const baseUrl = 'https://pumpparade.com';
  
  // Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": "Pump Parade",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/og-image.jpg`,
      "width": 1200,
      "height": 630
    },
    "description": "AI-powered cryptocurrency analysis, price predictions, and trading signals for informed crypto investing.",
    "sameAs": [
      "https://twitter.com/pumpparade",
      "https://t.me/pumpparade"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": `${baseUrl}/contact`
    }
  };

  // Website schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "url": baseUrl,
    "name": "Pump Parade",
    "description": "AI-powered cryptocurrency analysis and price predictions",
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/token/{search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Financial product schema for tokens
  const tokenSchema = token ? {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "@id": `${token.url}#financial-product`,
    "name": `${token.name} (${token.symbol})`,
    "description": token.description,
    "category": token.category,
    "url": token.url,
    "offers": {
      "@type": "Offer",
      "price": token.currentPrice,
      "priceCurrency": "USD",
      "priceValidUntil": new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": "https://schema.org/InStock"
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "24h Price Change",
        "value": `${token.priceChange}%`
      },
      ...(token.marketCap ? [{
        "@type": "PropertyValue",
        "name": "Market Cap",
        "value": token.marketCap,
        "unitCode": "USD"
      }] : [])
    ],
    "sameAs": [
      `https://coinmarketcap.com/currencies/${token.name.toLowerCase().replace(/\s+/g, '-')}/`,
      `https://coingecko.com/en/coins/${token.name.toLowerCase().replace(/\s+/g, '-')}`
    ]
  } : null;

  // Article schema
  const articleSchema = article ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${article.url}#article`,
    "headline": article.title,
    "description": article.description,
    "url": article.url,
    "datePublished": article.datePublished,
    "dateModified": article.dateModified || article.datePublished,
    "author": {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`
    },
    "publisher": {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    },
    "image": {
      "@type": "ImageObject",
      "url": `${baseUrl}/og-image.jpg`,
      "width": 1200,
      "height": 630
    },
    "articleSection": "Cryptocurrency Analysis",
    "keywords": ["cryptocurrency", "price prediction", "technical analysis", "trading"]
  } : null;

  // FAQ schema for common questions
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Pump Parade?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pump Parade is an AI-powered cryptocurrency research platform that provides price predictions, technical analysis, and trading signals to help investors make informed decisions."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate are the AI predictions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI models use advanced machine learning algorithms and multiple data sources to provide predictions. While no prediction is guaranteed, our models are continuously trained on historical data and market indicators."
        }
      },
      {
        "@type": "Question",
        "name": "Is the platform free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pump Parade offers both free and premium features. Basic market data and some analysis tools are available for free, while advanced predictions and premium features require a subscription."
        }
      }
    ]
  };

  // Combine schemas based on page type
  const schemas: any[] = [organizationSchema, websiteSchema];
  
  if (tokenSchema) schemas.push(tokenSchema);
  if (articleSchema) schemas.push(articleSchema);
  if (pageType === 'homepage') schemas.push(faqSchema);

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": schemas
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(combinedSchema)}
      </script>
    </Helmet>
  );
};