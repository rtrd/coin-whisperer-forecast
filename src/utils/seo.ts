// SEO utilities for dynamic meta tag generation

export interface TokenSEOData {
  name: string;
  symbol: string;
  currentPrice: number;
  priceChange: number;
  marketCap?: number;
  description: string;
  category: string;
}

export const generateTokenMetaTitle = (tokenData: TokenSEOData): string => {
  const changeText = tokenData.priceChange >= 0 ? "📈" : "📉";
  const priceFormatted = formatPrice(tokenData.currentPrice);
  return `${tokenData.name} (${tokenData.symbol}) Price $${priceFormatted} ${changeText} | Live Analysis & AI Predictions | Pump Parade`;
};

export const generateTokenMetaDescription = (tokenData: TokenSEOData): string => {
  const changeText = tokenData.priceChange >= 0 ? "up" : "down";
  const changeFormatted = Math.abs(tokenData.priceChange).toFixed(2);
  const priceFormatted = formatPrice(tokenData.currentPrice);
  
  return `${tokenData.name} (${tokenData.symbol}) is currently trading at $${priceFormatted}, ${changeText} ${changeFormatted}% in 24h. Get real-time ${tokenData.name} price analysis, AI predictions, technical indicators, and market insights. ${tokenData.description}`;
};

export const generateTokenKeywords = (tokenData: TokenSEOData): string => {
  return [
    `${tokenData.name}`,
    `${tokenData.symbol}`,
    `${tokenData.name} price`,
    `${tokenData.symbol} price prediction`,
    `${tokenData.name} analysis`,
    `${tokenData.name} AI prediction`,
    `${tokenData.symbol} trading signals`,
    `${tokenData.name} technical analysis`,
    `${tokenData.category}`,
    "cryptocurrency price prediction",
    "crypto AI analysis",
    "live crypto prices",
    "pump parade"
  ].join(", ");
};

export const generateTokenStructuredData = (tokenData: TokenSEOData, url: string) => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FinancialProduct",
        "@id": `${url}#financial-product`,
        "name": `${tokenData.name} (${tokenData.symbol})`,
        "description": tokenData.description,
        "category": tokenData.category,
        "offers": {
          "@type": "Offer",
          "price": tokenData.currentPrice,
          "priceCurrency": "USD",
          "priceValidUntil": new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        "sameAs": [
          `https://coinmarketcap.com/currencies/${tokenData.name.toLowerCase().replace(/\s+/g, '-')}/`,
          `https://coingecko.com/en/coins/${tokenData.name.toLowerCase().replace(/\s+/g, '-')}`
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        "url": url,
        "name": generateTokenMetaTitle(tokenData),
        "description": generateTokenMetaDescription(tokenData),
        "mainEntity": {
          "@id": `${url}#financial-product`
        },
        "isPartOf": {
          "@id": "https://pumpparade.com/#website"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://pumpparade.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Tokens",
              "item": "https://pumpparade.com/tokens"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": `${tokenData.name} (${tokenData.symbol})`,
              "item": url
            }
          ]
        }
      },
      {
        "@type": "Organization",
        "@id": "https://pumpparade.com/#organization",
        "name": "Pump Parade",
        "url": "https://pumpparade.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://pumpparade.com/og-image.jpg"
        },
        "description": "AI-powered cryptocurrency analysis, price predictions, and trading signals for informed crypto investing.",
        "sameAs": [
          "https://twitter.com/pumpparade",
          "https://t.me/pumpparade"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://pumpparade.com/#website",
        "url": "https://pumpparade.com",
        "name": "Pump Parade",
        "description": "AI-powered cryptocurrency analysis and price predictions",
        "publisher": {
          "@id": "https://pumpparade.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://pumpparade.com/token/{search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      }
    ]
  };
};

export const formatPrice = (price: number): string => {
  if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  }
  return price.toFixed(8).replace(/\.?0+$/, '');
};

export const generateCanonicalUrl = (tokenId: string): string => {
  return `https://pumpparade.com/token/${tokenId}`;
};