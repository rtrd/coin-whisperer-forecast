import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, BarChart3, BookOpen, Zap, Target } from "lucide-react";
import { TokenInfo } from "@/hooks/useTokenInfo";
import { Link } from "react-router-dom";

interface TokenResourcesPanelProps {
  tokenInfo?: TokenInfo;
  tokenId: string;
  isLoading?: boolean;
}

export const TokenResourcesPanel: React.FC<TokenResourcesPanelProps> = ({ 
  tokenInfo, 
  tokenId,
  isLoading 
}) => {
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
        <Link to="/ai-price-prediction">
          <Button variant="default" className="w-full justify-start gap-2 bg-primary hover:bg-primary/90">
            <Zap className="h-4 w-4" />
            AI Price Prediction for {tokenSymbol}
          </Button>
        </Link>

        {/* Market Sentiment */}
        <Link to="/sentiment-analysis">
          <Button variant="outline" className="w-full justify-start gap-2 hover:bg-primary/10">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Live Sentiment Analysis
          </Button>
        </Link>

        {/* Technical Analysis */}
        <Link to="/technical-analysis">
          <Button variant="outline" className="w-full justify-start gap-2 hover:bg-primary/10">
            <BarChart3 className="h-4 w-4 text-blue-500" />
            Technical Indicators
          </Button>
        </Link>

        {/* Portfolio Tracking */}
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Portfolio Tools</p>
          
          <Link to="/portfolio">
            <Button variant="outline" className="w-full justify-start gap-2 mb-2 hover:bg-primary/10">
              <Target className="h-4 w-4 text-purple-500" />
              Track in Portfolio
            </Button>
          </Link>

          <Link to="/blog">
            <Button variant="outline" className="w-full justify-start gap-2 hover:bg-primary/10">
              <BookOpen className="h-4 w-4 text-orange-500" />
              {tokenName} Analysis Articles
            </Button>
          </Link>
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
