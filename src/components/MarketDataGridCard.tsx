import React, { memo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Lock, ExternalLink, Bot, RefreshCw, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice, formatVolume, formatMarketCap } from "./MarketDataUtils";
import { getCategoryBadgeStyle, getAIScoreColor } from "@/utils/categoryStyles";
import { MarketData } from "@/types/crypto";
import { SignupDialog } from "@/components/SignupDialog";
import { useAppContext } from "@/contexts/ConsolidatedAppProvider";

interface MarketDataGridCardProps {
  token: MarketData;
  index: number;
  isUnlocked: boolean;
  tokenUrlId: string;
  AllCryptosData?: any[]; // Optional, used for additional data display
}

export const MarketDataGridCard: React.FC<MarketDataGridCardProps> = memo(
  ({ token, index, isUnlocked, tokenUrlId, AllCryptosData }) => {
    const [showSignupDialog, setShowSignupDialog] = useState(false);
    const { getPredictionForToken, retryPrediction, isGenerating } = useAppContext();
    
    const tokenId = token.id || token.value;
    const prediction = getPredictionForToken(tokenId);
    const isLoading = isGenerating(tokenId);
    
    // Use prediction data if available, otherwise fall back to token data
    const displayPrediction = prediction.predictionPercentage ?? token.predictionPercentage;
    const displayAIScore = prediction.aiScore ?? token.aiScore;
    const predictionStatus = prediction.predictionStatus;

    const handleRetryPrediction = () => {
      retryPrediction(token);
    };

    const renderPredictionField = () => {
      if (!isUnlocked) {
        return (
          <div 
            className="flex items-center gap-1 cursor-pointer hover:bg-gray-600/30 px-2 py-1 rounded transition-colors"
            onClick={() => setShowSignupDialog(true)}
          >
            <Lock className="h-3 w-3 text-yellow-400" />
            <span className="text-yellow-400 text-xs">Premium</span>
          </div>
        );
      }

      if (token.category === "Stablecoin") {
        return <span className="text-gray-400">-</span>;
      }

      switch (predictionStatus) {
        case 'loading':
          return (
            <div className="flex items-center gap-2">
              <RefreshCw className="h-3 w-3 animate-spin text-blue-400" />
              <span className="text-blue-400 text-xs">Generating...</span>
            </div>
          );
        
        case 'success':
          return (
            <div className={`font-mono font-medium ${
              displayPrediction >= 0 ? "text-green-400" : "text-red-400"
            }`}>
              {displayPrediction >= 0 ? "+" : ""}
              {displayPrediction?.toFixed(2)}%
            </div>
          );
        
        case 'error':
          return (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRetryPrediction}
              className="h-6 px-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              <span className="text-xs">Retry</span>
            </Button>
          );
        
        case 'idle':
        default:
          return (
            <Link
              to={`/token/${tokenUrlId}#ai-prediction`}
              state={{ token, AllCryptosData }}
              className="inline-flex"
            >
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
              >
                <Bot className="h-3 w-3 mr-1" />
                <span className="text-xs">Generate</span>
              </Button>
            </Link>
          );
      }
    };
    
    return (
      <div className="bg-gray-800/60 border border-gray-600/50 rounded-xl p-4 flex flex-col h-full hover:bg-gray-800/80 transition-all duration-200 hover:border-gray-500/50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm font-medium">
                #{index + 1}
              </span>
              <Link
                to={`/token/${tokenUrlId}`}
                className="flex items-center gap-2 hover:text-blue-400 transition-colors min-w-0"
              >
                <img
                  src={token.image || "/placeholder.svg"}
                  alt={token.label || token.name || "Token"}
                  className="w-6 h-6 object-contain rounded-full flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                <div className="min-w-0">
                  <div className="text-white font-bold text-base truncate">
                    {token.name || "Unknown"}
                  </div>
                  <div className="text-gray-400 text-sm truncate">
                    {token.symbol?.toUpperCase() || ""}
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`text-xs shrink-0 ml-2 ${getCategoryBadgeStyle(
              token.category
            )}`}
          >
            {token.category}
          </Badge>
        </div>

        <div className="space-y-3 flex-1">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="text-gray-400 text-xs uppercase tracking-wide">
                Price
              </div>
              <div className="text-white font-mono font-medium">
                {formatPrice(token.price)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-400 text-xs uppercase tracking-wide">
                24h Change
              </div>
              <div
                className={`flex items-center gap-1 font-bold font-mono ${
                  (token.change24h || 0) >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {(token.change24h || 0) >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {(token.change24h || 0) >= 0 ? "+" : ""}
                {(token.change24h || 0).toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="text-gray-400 text-xs uppercase tracking-wide">
                Prediction %
              </div>
              {renderPredictionField()}
            </div>
            <div className="space-y-1">
              <div className="text-gray-400 text-xs uppercase tracking-wide">
                AI Score
              </div>
              {isUnlocked ? (
                <div
                  className={`font-mono font-medium ${
                    token.category === "Stablecoin" 
                      ? "text-gray-400" 
                      : getAIScoreColor(displayAIScore || 0)
                  }`}
                >
                  {token.category === "Stablecoin" 
                    ? "-" 
                    : predictionStatus === 'success' && displayAIScore !== null
                    ? `${displayAIScore.toFixed(0)}/100`
                    : "-"
                  }
                </div>
               ) : (
                 <div 
                   className="flex items-center gap-1 cursor-pointer hover:bg-gray-600/30 px-2 py-1 rounded transition-colors"
                   onClick={() => setShowSignupDialog(true)}
                 >
                   <Lock className="h-3 w-3 text-yellow-400" />
                   <span className="text-yellow-400 text-xs">Premium</span>
                 </div>
               )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="text-gray-400 text-xs uppercase tracking-wide">
                Volume
              </div>
              <div className="text-gray-300 font-mono">
                {formatVolume(token.volume24h)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-400 text-xs uppercase tracking-wide">
                Market Cap
              </div>
              <div className="text-gray-300 font-mono">
                {formatMarketCap(token.marketCap)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-600/30">
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            asChild
          >
            <Link to={`/token/${tokenUrlId}`} state={{ token, AllCryptosData }}>
              <ExternalLink className="h-3 w-3 mr-2" />
              View Details
            </Link>
          </Button>
        </div>
        
        <SignupDialog
          open={showSignupDialog}
          onOpenChange={setShowSignupDialog}
          title="Unlock AI Predictions"
          description="Get access to AI-powered predictions, market sentiment analysis, and technical indicators."
        />
      </div>
    );
  }
);

MarketDataGridCard.displayName = "MarketDataGridCard";
