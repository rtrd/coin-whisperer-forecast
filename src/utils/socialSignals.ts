// Social signals and external SEO utilities

export interface SocialPlatform {
  name: string;
  url: string;
  handle?: string;
  description: string;
}

export const PUMP_PARADE_SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    name: "Twitter",
    url: "https://twitter.com/PumpParade",
    handle: "@PumpParade",
    description: "Follow for real-time crypto updates and market insights"
  },
  {
    name: "Facebook",
    url: "https://facebook.com/PumpParade", // To be created
    description: "Join our community for crypto discussions and analysis"
  },
  {
    name: "Telegram",
    url: "https://t.me/pumpparade", // To be created
    handle: "@pumpparade",
    description: "Get instant trading signals and market alerts"
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@PumpParade", // To be created
    handle: "@PumpParade",
    description: "Watch crypto analysis videos and tutorials"
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/company/pump-parade", // To be created
    description: "Professional crypto market insights and industry news"
  }
];

/**
 * Generate social media structured data for enhanced SEO
 */
export const generateSocialMediaSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Pump Parade",
    "url": "https://pumpparade.com",
    "logo": "https://pumpparade.com/og-image.jpg",
    "sameAs": PUMP_PARADE_SOCIAL_PLATFORMS.map(platform => platform.url),
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "founder": {
      "@type": "Organization",
      "name": "Pump Parade Team"
    },
    "foundingDate": "2024",
    "description": "AI-powered cryptocurrency analysis and trading signals platform"
  };
};

/**
 * Social sharing optimization utilities
 */
export const generateSocialShareData = (
  title: string,
  description: string,
  url: string,
  image?: string
) => {
  const shareData = {
    title,
    text: description,
    url
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&via=PumpParade`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  return {
    shareData,
    socialUrls: {
      twitter: twitterUrl,
      facebook: facebookUrl,
      linkedin: linkedinUrl,
      telegram: telegramUrl
    }
  };
};

/**
 * Generate social proof indicators for conversion optimization
 */
export const generateSocialProofData = () => {
  return {
    userCount: "10,000+",
    signalsGenerated: "50,000+",
    accuracyRate: "87%",
    testimonials: [
      {
        text: "Pump Parade's AI predictions helped me identify profitable trades consistently.",
        author: "Sarah Chen",
        role: "Crypto Trader",
        rating: 5
      },
      {
        text: "The MOTI meter is incredibly accurate for finding trending memecoins early.",
        author: "Mike Rodriguez", 
        role: "DeFi Investor",
        rating: 5
      },
      {
        text: "Best crypto analysis platform I've used. The insights are invaluable.",
        author: "Alex Thompson",
        role: "Portfolio Manager",
        rating: 5
      }
    ]
  };
};