import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArticleCard } from '@/components/ArticleCard';
import { optimizedWordPressService } from '@/services/optimizedWordPressService';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface OptimizedWordPressIntegrationProps {
  enabled?: boolean;
}

// Memoized skeleton component
const OptimizedSkeleton = React.memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="space-y-2 animate-pulse">
        <div className="h-32 bg-muted rounded-lg" />
        <div className="space-y-1">
          <div className="h-3 bg-muted rounded w-3/4" />
          <div className="h-2 bg-muted rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
));

// Memoized article card with proper comparison
const MemoizedArticleCard = React.memo(ArticleCard, (prevProps, nextProps) => {
  return prevProps.article.id === nextProps.article.id &&
         prevProps.article.title === nextProps.article.title;
});

export const OptimizedWordPressIntegration: React.FC<OptimizedWordPressIntegrationProps> = ({ 
  enabled = true 
}) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const componentRef = useRef<HTMLDivElement>(null);

  // Use intersection observer for lazy loading
  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Combine refs
  const setRefs = useCallback((element: HTMLDivElement | null) => {
    componentRef.current = element;
    if (intersectionRef) {
      (intersectionRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
    }
  }, [intersectionRef]);

  // Optimized fetch function with error handling
  const fetchArticles = useCallback(async () => {
    if (!enabled || isLoading || hasLoaded) return;

    setIsLoading(true);
    setError(null);

    try {
      // First, try to get cached posts immediately
      const cachedPosts = optimizedWordPressService.getCachedData<any[]>('posts_6');
      if (cachedPosts && cachedPosts.length > 0) {
        setArticles(cachedPosts);
        setHasLoaded(true);
      }

      // Then fetch fresh data
      const posts = await optimizedWordPressService.getOptimizedPosts(4);
      
      if (posts && posts.length > 0) {
        setArticles(posts);
        setHasLoaded(true);
      } else {
        throw new Error('No posts received');
      }
    } catch (err) {
      console.warn('Failed to fetch WordPress posts:', err);
      setError('Unable to load latest articles');
      
      // Use fallback articles on error
      const fallbackArticles = [
        {
          id: 1,
          title: "Crypto Market Analysis",
          excerpt: "Latest insights into cryptocurrency market trends...",
          date: new Date().toISOString(),
          author: "Pump Parade Team",
          image: "/placeholder.svg",
          url: "#",
          category: "Analysis"
        }
      ];
      setArticles(fallbackArticles);
      setHasLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, isLoading, hasLoaded]);

  // Trigger fetch when component becomes visible
  useEffect(() => {
    if (isIntersecting && !hasLoaded) {
      fetchArticles();
    }
  }, [isIntersecting, hasLoaded, fetchArticles]);

  // Prefetch resources for better performance
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Preconnect to WordPress domain
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = 'https://pumpparade.com';
      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, []);

  const handleViewAllClick = useCallback(() => {
    navigate('/blog');
  }, [navigate]);

  // Show skeleton while loading or if not yet intersecting
  if (!isIntersecting || (isLoading && articles.length === 0)) {
    return (
      <Card ref={setRefs} className="mb-8 bg-card border-border shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-foreground">
                <h2>Latest Crypto News & Analysis</h2>
              </CardTitle>
              <Badge className="bg-green-600">Live Feed</Badge>
            </div>
            <Button variant="outline" size="sm" disabled>
              View All Articles
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <OptimizedSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={setRefs} className="mb-8 bg-card border-border shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-foreground">
              <h2>Latest Crypto News & Analysis</h2>
            </CardTitle>
            <Badge className="bg-green-600">
              {isLoading ? 'Updating...' : 'Live Feed'}
            </Badge>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewAllClick}
            disabled={isLoading}
          >
            View All Articles
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-center text-muted-foreground mb-4 p-4 bg-muted rounded-lg">
            {error} - Showing cached content
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {articles.slice(0, 4).map((article) => (
            <MemoizedArticleCard
              key={article.id}
              article={article}
              variant="blog"
              compact={true}
            />
          ))}
        </div>

        {articles.length === 0 && !isLoading && (
          <div className="text-center text-muted-foreground py-8">
            <p>No articles available at the moment.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchArticles}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};