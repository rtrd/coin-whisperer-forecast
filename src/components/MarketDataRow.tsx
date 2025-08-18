import React, { memo, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice, formatVolume, formatMarketCap } from "./MarketDataUtils";
import { getTokenUrlId } from "@/utils/tokenMapping";
import { getCategoryBadgeStyle, getAIScoreColor } from "@/utils/categoryStyles";
import { CryptoToken, MarketData } from "@/types/crypto";
import { SignupDialog } from "@/components/SignupDialog";

interface MarketDataRowProps {
  token: MarketData;
  index: number;
  isUnlocked: boolean;
  activeFilter: string;
  AllCryptosData: CryptoToken[];
}

export const MarketDataRow: React.FC<MarketDataRowProps> = memo(
  ({ token, index, isUnlocked, AllCryptosData }) => {
    const [showSignupDialog, setShowSignupDialog] = useState(false);
    const tokenUrlId = getTokenUrlId(token.value);

    return (
      <>
        <TableRow className="border-gray-700 hover:bg-gray-700/50 h-16">
          <TableCell className="text-gray-300 font-medium w-12 px-2 py-3">
            {index + 1}
          </TableCell>
          <TableCell className="w-48 px-2 py-3">
            <Link
              to={`/token/${tokenUrlId}`}
              state={{ token, AllCryptosData }}
              className="flex items-center gap-2 hover:text-blue-400 transition-colors"
            >
              <img
                src={token.image}
                alt={token.label}
                className="w-8 h-8 object-contain rounded-full flex-shrink-0"
              />
              <div>
                <div className="text-white font-medium">
                  {token.name.split(" ")[0]}
                </div>
                <div className="text-gray-400 text-sm">
                  {token.name.split(" ")[1]}
                </div>
              </div>
            </Link>
          </TableCell>

          <TableCell className="text-white font-mono w-32 px-2 py-3">
            {formatPrice(token.price)}
          </TableCell>

          <TableCell className="w-32 px-2 py-3">
            <div
              className={`flex items-center gap-1 ${
                token.change24h >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {token.change24h >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {token.change24h >= 0 ? "+" : ""}
              {token.change24h.toFixed(2)}%
            </div>
          </TableCell>

          <TableCell className="w-32 px-2 py-3">
            {isUnlocked ? (
              <div
                className={`flex items-center gap-1 ${
                  token.category === "Stablecoin" 
                    ? "text-gray-400" 
                    : token.predictionPercentage >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {token.category === "Stablecoin" 
                  ? "-" 
                  : `${token.predictionPercentage >= 0 ? "+" : ""}${token.predictionPercentage.toFixed(2)}%`
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
          </TableCell>

          <TableCell className="w-28 px-2 py-3">
            {isUnlocked ? (
              <div className="flex items-center gap-1">
                <div className={`font-mono ${
                  token.category === "Stablecoin" 
                    ? "text-gray-400" 
                    : getAIScoreColor(token.aiScore)
                }`}>
                  {token.category === "Stablecoin" 
                    ? "-" 
                    : token.aiScore.toFixed(0)
                  }
                </div>
                {token.category !== "Stablecoin" && (
                  <div className="text-gray-400 text-xs">/100</div>
                )}
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
          </TableCell>

          <TableCell className="text-gray-300 font-mono w-40 px-2 py-3">
            {formatVolume(token.volume24h)}
          </TableCell>

          <TableCell className="text-gray-300 font-mono w-32 px-2 py-3">
            {formatMarketCap(token.marketCap)}
          </TableCell>

          <TableCell className="w-36 px-2 py-3">
            <Badge
              variant="outline"
              className={getCategoryBadgeStyle(token.category)}
            >
              {token.category}
            </Badge>
          </TableCell>
        </TableRow>
        
        <SignupDialog
          open={showSignupDialog}
          onOpenChange={setShowSignupDialog}
          title="Unlock AI Predictions"
          description="Get access to AI-powered predictions, market sentiment analysis, and technical indicators."
        />
      </>
    );
  }
);

MarketDataRow.displayName = "MarketDataRow";
