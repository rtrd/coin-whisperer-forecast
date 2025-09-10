import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, BarChart3, Bot, Activity } from 'lucide-react';

interface RelatedLink {
  title: string;
  href: string;
  description: string;
  icon?: React.ReactNode;
}

interface InternalLinkingProps {
  currentPage: string;
  tokenSymbol?: string;
  category?: string;
}

export const InternalLinking: React.FC<InternalLinkingProps> = ({
  currentPage,
  tokenSymbol,
  category
}) => {
  const getRelatedLinks = (): RelatedLink[] => {
    const baseLinks: RelatedLink[] = [
      {
        title: 'AI Price Predictions',
        href: '/ai-prediction',
        description: 'Advanced AI models for cryptocurrency price forecasting',
        icon: <Bot className="h-4 w-4" />
      },
      {
        title: 'Technical Analysis',
        href: '/technical-analysis',
        description: 'Professional technical indicators and chart analysis',
        icon: <BarChart3 className="h-4 w-4" />
      },
      {
        title: 'Market Sentiment',
        href: '/sentiment-analysis',
        description: 'Real-time social sentiment and market psychology',
        icon: <Activity className="h-4 w-4" />
      },
      {
        title: 'Real-Time Data',
        href: '/real-time-data',
        description: 'Live market data and trading opportunities',
        icon: <TrendingUp className="h-4 w-4" />
      }
    ];

    // Add token-specific links if on token page
    if (currentPage === 'token' && tokenSymbol) {
      const tokenLinks: RelatedLink[] = [
        {
          title: `${tokenSymbol.toUpperCase()} Analysis`,
          href: `/token/${tokenSymbol.toLowerCase()}`,
          description: `Comprehensive analysis and predictions for ${tokenSymbol.toUpperCase()}`,
          icon: <BarChart3 className="h-4 w-4" />
        }
      ];
      return [...tokenLinks, ...baseLinks];
    }

    // Add category-specific links
    if (category) {
      const categoryLinks: RelatedLink[] = [
        {
          title: 'All Tokens',
          href: '/tokens',
          description: 'Explore all supported cryptocurrencies and tokens',
          icon: <TrendingUp className="h-4 w-4" />
        }
      ];
      return [...categoryLinks, ...baseLinks];
    }

    return baseLinks;
  };

  const relatedLinks = getRelatedLinks().filter(link => 
    link.href !== `/${currentPage}` && 
    link.href !== window.location.pathname
  ).slice(0, 4);

  if (relatedLinks.length === 0) return null;

  return (
    <Card className="bg-card/50 border-border">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Related Tools & Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relatedLinks.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="group block p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="text-primary mt-1">
                  {link.icon}
                </div>
                <div>
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {link.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {link.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Component for contextual token links
interface TokenLinksProps {
  currentToken: string;
  popularTokens?: string[];
}

export const TokenLinks: React.FC<TokenLinksProps> = ({
  currentToken,
  popularTokens = ['bitcoin', 'ethereum', 'solana', 'cardano', 'polygon', 'chainlink']
}) => {
  const relatedTokens = popularTokens
    .filter(token => token !== currentToken)
    .slice(0, 6);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Popular Cryptocurrencies
      </h3>
      <div className="flex flex-wrap gap-2">
        {relatedTokens.map((token) => (
          <Link
            key={token}
            to={`/token/${token}`}
            className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm capitalize"
          >
            {token}
          </Link>
        ))}
      </div>
    </div>
  );
};