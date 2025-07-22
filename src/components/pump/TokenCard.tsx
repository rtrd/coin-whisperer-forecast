
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { openAffiliateLink } from "@/utils/affiliateLinks";
import { PumpToken } from "../../hooks/usePumpPortalData";

interface TokenCardProps {
  token: PumpToken;
  changeColorClass: string;
}

export const TokenCard: React.FC<TokenCardProps> = ({ token, changeColorClass }) => {
  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
    if (num >= 1e3) return `${(num / 1e3).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}K`;
    return num.toLocaleString('en-US');
  };

  return (
    <div className="bg-gray-800/60 border border-gray-600/50 rounded-xl p-4 space-y-4 hover:bg-gray-800/80 transition-all duration-200 hover:border-gray-500/50">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{token.icon}</div>
          <div className="min-w-0">
            <div className="text-white font-bold text-base truncate">{token.symbol}</div>
            <div className="text-gray-400 text-sm truncate">{token.name}</div>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold shrink-0">
          {token.pumpScore}
        </Badge>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <div className="text-gray-400 text-xs uppercase tracking-wide">Price</div>
            <div className="text-white font-mono font-medium">${token.price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-400 text-xs uppercase tracking-wide">24h Change</div>
            <div className={`${changeColorClass} font-bold font-mono`}>
              {token.change24h >= 0 ? '+' : ''}{token.change24h.toLocaleString('en-US')}%
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <div className="text-gray-400 text-xs uppercase tracking-wide">Volume</div>
            <div className="text-gray-300 font-mono">${formatNumber(token.volume)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-400 text-xs uppercase tracking-wide">Market Cap</div>
            <div className="text-gray-300 font-mono">${formatNumber(token.marketCap)}</div>
          </div>
        </div>
      </div>

      <Button 
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
        size="sm"
        onClick={() => openAffiliateLink(token.symbol)}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Trade on eToro
      </Button>
    </div>
  );
};
