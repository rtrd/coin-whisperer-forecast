import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, ArrowRight } from "lucide-react";
import { ArticleCard } from "./ArticleCard";
import { useWordPressPostsPage } from "@/hooks/useWordPressArticles";

interface WordPressIntegrationOptimizedProps {
  enabled?: boolean;
}

const HOMEPAGE_ARTICLE_COUNT = 4;

const ArticleFeedSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
    {Array.from({ length: HOMEPAGE_ARTICLE_COUNT }).map((_, index) => (
      <div key={index} className="space-y-3">
        <Skeleton className="aspect-[3/2] w-full rounded-lg" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    ))}
  </div>
);

const WordPressIntegrationOptimized: React.FC<WordPressIntegrationOptimizedProps> = ({
  enabled = true,
}) => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch, isFetching } = useWordPressPostsPage(
    {
      page: 1,
      perPage: HOMEPAGE_ARTICLE_COUNT,
    },
    {
      enabled,
    }
  );

  const articles = data?.articles || [];

  return (
    <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl hover:bg-gray-800/70 transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4 md:flex-nowrap">
          <CardTitle className="text-white flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-blue-400" />
            <h2>Latest Crypto News & Analysis</h2>
            <Badge className="bg-blue-600 whitespace-nowrap">
              {isFetching && !isLoading ? "Refreshing" : "Live Feed"}
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            onClick={() => navigate("/blog")}
          >
            View All Articles
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? <ArticleFeedSkeleton /> : null}

        {!isLoading && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} compact={true} />
            ))}
          </div>
        ) : null}

        {!isLoading && articles.length === 0 ? (
          <div className="py-8 text-center text-gray-300">
            <p>{isError ? "Unable to load latest articles." : "No articles available."}</p>
            {isError ? (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                onClick={() => refetch()}
              >
                Try Again
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default WordPressIntegrationOptimized;
