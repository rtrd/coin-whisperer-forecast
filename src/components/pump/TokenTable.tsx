
import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { openAffiliateLink } from "@/utils/affiliateLinks";
import { PumpToken } from "../../hooks/usePumpPortalData";

interface TokenTableProps {
  tokens: PumpToken[];
  changeColorClass: string;
  showPrice?: boolean;
  showChange?: boolean;
}

export const TokenTable: React.FC<TokenTableProps> = ({ tokens, changeColorClass, showPrice = true, showChange = true }) => {
  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
    if (num >= 1e3) return `${(num / 1e3).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}K`;
    return num.toLocaleString('en-US');
  };

  return (
    <div className="overflow-x-auto">
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow className="border-gray-700 h-14">
            <TableHead className="text-gray-300 w-8 px-1">#</TableHead>
            <TableHead className="text-gray-300 w-40 px-2">Token</TableHead>
            {showPrice && <TableHead className="text-gray-300 w-24 px-1">Price</TableHead>}
            {showChange && <TableHead className="text-gray-300 w-24 px-1">24h</TableHead>}
            <TableHead className="text-gray-300 w-20 px-1">Score</TableHead>
            <TableHead className="text-gray-300 w-24 px-1">Volume</TableHead>
            <TableHead className="text-gray-300 w-24 px-1">MCap</TableHead>
            <TableHead className="text-gray-300 w-32 px-1">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token, index) => (
            <TableRow key={index} className="border-gray-700 hover:bg-gray-700/50">
              <TableCell className="text-gray-300 text-sm font-medium px-1">
                #{index + 1}
              </TableCell>
              <TableCell className="px-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{token.icon}</span>
                  <div>
                    <div className="text-white font-bold text-xs">{token.symbol}</div>
                    <div className="text-gray-400 text-xs truncate max-w-20">{token.name}</div>
                  </div>
                </div>
              </TableCell>
              {showPrice && (
                <TableCell className="text-white font-mono text-xs px-1">
                  ${token.price.toFixed(4)}
                </TableCell>
              )}
              {showChange && (
                <TableCell className="px-1">
                  <div className={`flex items-center gap-1 ${changeColorClass}`}>
                    {token.change24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span className="font-mono text-xs">
                      {token.change24h >= 0 ? "+" : ""}{token.change24h.toFixed(1)}%
                    </span>
                  </div>
                </TableCell>
              )}
              <TableCell className="px-1">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                  {token.pumpScore}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-300 font-mono text-xs px-1">
                ${formatNumber(token.volume)}
              </TableCell>
              <TableCell className="text-gray-300 font-mono text-xs px-1">
                ${formatNumber(token.marketCap)}
              </TableCell>
              <TableCell className="px-1">
                <div className="flex flex-col gap-1">
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xs h-7"
                    size="sm"
                    onClick={() => openAffiliateLink(token.symbol)}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    eToro
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs h-7"
                    size="sm"
                    onClick={() => window.open('https://app.andmilo.com/auth/signin/b103d893-d5b8-4cb3-8b67-1f356abb314f', '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    AI Agent
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
