import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, BarChart3, BookOpen, Zap, Target } from "lucide-react";
import { TokenInfo } from "@/hooks/useTokenInfo";
import { Link, useNavigate } from "react-router-dom";

interface TokenResourcesPanelProps {
  tokenInfo?: TokenInfo;
  tokenId: string;
  isLoading?: boolean;
  onNavigateToChart?: () => void;
  onNavigateToTab?: (tab: 'sentiment' | 'technical') => void;
}

export const TokenResourcesPanel: React.FC<TokenResourcesPanelProps> = ({ 
  tokenInfo, 
  tokenId,
  isLoading,
  onNavigateToChart,
  onNavigateToTab
}) => {
  const navigate = useNavigate();
  if (isLoading) {
    return (
      <Card className="bg-card border-border animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const tokenName = tokenInfo?.name || tokenId;
  const tokenSymbol = tokenInfo?.symbol || tokenId.toUpperCase();

  const handlePriceChartClick = () => {
    if (onNavigateToChart) {
      onNavigateToChart();
    }
  };

  const handleSentimentClick = () => {
    if (onNavigateToTab) {
      onNavigateToTab('sentiment');
    }
  };

  const handleTechnicalClick = () => {
    if (onNavigateToTab) {
      onNavigateToTab('technical');
    }
  };

  const handleBlogClick = () => {
    navigate('/blog', { state: { scrollToArchive: true } });
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Investment Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* AI Price Predictions */}
        <Button 
          variant="default" 
          className="w-full justify-start gap-2 bg-primary hover:bg-primary/90"
          onClick={handlePriceChartClick}
        >
          <Zap className="h-4 w-4" />
          AI Price Prediction for {tokenSymbol}
        </Button>

        {/* Market Sentiment */}
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 hover:bg-primary/10"
          onClick={handleSentimentClick}
        >
          <TrendingUp className="h-4 w-4 text-green-500" />
          Live Sentiment Analysis
        </Button>

        {/* Technical Analysis */}
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 hover:bg-primary/10"
          onClick={handleTechnicalClick}
        >
          <BarChart3 className="h-4 w-4 text-blue-500" />
          Technical Indicators
        </Button>

        {/* Portfolio Tracking */}
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Portfolio Tools</p>
          
          <Link to="/lock-portfolio">
            <Button variant="outline" className="w-full justify-start gap-2 mb-2 hover:bg-primary/10">
              <Target className="h-4 w-4 text-purple-500" />
              Track in Portfolio
            </Button>
          </Link>

          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 hover:bg-primary/10"
            onClick={handleBlogClick}
          >
            <BookOpen className="h-4 w-4 text-orange-500" />
            {tokenName} Analysis Articles
          </Button>
        </div>

        {/* Value Proposition */}
        <div className="pt-3 border-t border-primary/20">
          <div className="bg-primary/10 rounded-lg p-3">
            <p className="text-xs font-semibold text-primary mb-1">
              🚀 Get Better Predictions
            </p>
            <p className="text-xs text-muted-foreground">
              Use our AI tools to analyze {tokenSymbol} and make smarter investment decisions
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
