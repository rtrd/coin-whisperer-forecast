import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, TrendingUp } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { useEffect } from 'react';

const NotFound = () => {
  useEffect(() => {
    // Track 404 errors
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: '404 - Page Not Found',
        page_location: window.location.href,
        custom_parameters: {
          error_type: '404',
          referrer: document.referrer
        }
      });
    }
  }, []);

  const seoData = {
    title: '404 - Page Not Found | Pump Parade',
    description: 'The page you are looking for could not be found. Explore our crypto analysis tools, AI predictions, and market data instead.',
    canonical: 'https://pumpparade.com/404',
    keywords: 'error, 404, not found, crypto analysis, pump parade',
    openGraph: {
      title: '404 - Page Not Found | Pump Parade',
      description: 'The page you are looking for could not be found. Explore our crypto analysis tools instead.',
      url: 'https://pumpparade.com/404',
      type: 'website' as const,
      image: 'https://pumpparade.com/og-image.jpg'
    },
    twitter: {
      title: '404 - Page Not Found | Pump Parade',
      description: 'The page you are looking for could not be found. Explore our crypto analysis tools instead.',
      card: 'summary_large_image' as const,
      image: 'https://pumpparade.com/og-image.jpg'
    }
  };

  return (
    <>
      <SEOHead seoData={seoData} />
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-8 p-8 max-w-lg mx-auto">
          {/* 404 Display */}
          <div className="space-y-2">
            <h1 className="text-9xl font-bold text-primary/20 select-none">404</h1>
            <h2 className="text-3xl font-bold text-foreground">Page Not Found</h2>
            <p className="text-muted-foreground text-lg">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">
              Explore our crypto tools instead:
            </h3>
            
            <div className="grid gap-3">
              <Button asChild variant="default" className="w-full">
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Homepage
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link to="/tokens" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Browse All Tokens
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link to="/ai-prediction" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  AI Predictions
                </Link>
              </Button>
            </div>
          </div>

          {/* Search Suggestion */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Looking for a specific token? Try searching from our{' '}
              <Link to="/" className="text-primary hover:underline">
                homepage
              </Link>{' '}
              or browse our{' '}
              <Link to="/blog" className="text-primary hover:underline">
                blog
              </Link>{' '}
              for the latest crypto insights.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;

declare global {
  function gtag(...args: any[]): void;
}
