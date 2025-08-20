
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
    <div className="overflow-x-auto rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-slate-700/50">
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow className="border-slate-700/50 h-16 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
            <TableHead className="text-slate-300 font-semibold w-12 px-2 text-center">#</TableHead>
            <TableHead className="text-slate-300 font-semibold w-32 px-3">Token</TableHead>
            {showPrice && <TableHead className="text-slate-300 font-semibold w-28 px-2 text-right">Price</TableHead>}
            {showChange && <TableHead className="text-slate-300 font-semibold w-24 px-2 text-center">24h</TableHead>}
            <TableHead className="text-slate-300 font-semibold w-20 px-2 text-center">Score</TableHead>
            <TableHead className="text-slate-300 font-semibold w-24 px-2 text-right">Volume</TableHead>
            <TableHead className="text-slate-300 font-semibold w-32 px-6 text-center">Market Cap</TableHead>
            <TableHead className="text-slate-300 font-semibold w-40 px-6 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token, index) => (
            <TableRow key={index} className="border-slate-700/30 hover:bg-gradient-to-r hover:from-slate-800/30 hover:to-slate-700/30 transition-all duration-200 group">
              <TableCell className="text-slate-400 text-sm font-medium px-2 text-center group-hover:text-slate-300">
                #{index + 1}
              </TableCell>
              <TableCell className="px-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl p-1 rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-600/50 group-hover:from-slate-600/50 group-hover:to-slate-500/50 transition-all duration-200">
                    {token.icon}
                  </div>
                  <div className="flex flex-col">
                    <div className="text-white font-bold text-sm group-hover:text-slate-100">{token.symbol.toUpperCase()}</div>
                    <div className="text-slate-400 text-xs truncate max-w-24 group-hover:text-slate-300">{token.name}</div>
                  </div>
                </div>
              </TableCell>
              {showPrice && (
                <TableCell className="text-white font-mono text-sm px-2 text-right group-hover:text-slate-100 font-semibold">
                  ${token.price.toFixed(4)}
                </TableCell>
              )}
              {showChange && (
                <TableCell className="px-2">
                  <div className={`flex items-center justify-center gap-1 ${changeColorClass} font-medium`}>
                    {token.change24h >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="font-mono text-sm">
                      {token.change24h >= 0 ? "+" : ""}{token.change24h.toFixed(1)}%
                    </span>
                  </div>
                </TableCell>
              )}
              <TableCell className="px-2 text-center">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-3 py-1 shadow-lg">
                  {token.pumpScore}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-300 font-mono text-sm px-2 text-right group-hover:text-slate-200 font-medium">
                ${formatNumber(token.volume)}
              </TableCell>
              <TableCell className="text-slate-300 font-mono text-sm px-6 text-center group-hover:text-slate-200 font-medium">
                ${formatNumber(token.marketCap)}
              </TableCell>
              <TableCell className="px-6">
                <div className="flex flex-col gap-2">
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xs h-8 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    size="sm"
                    onClick={() => openAffiliateLink(token.symbol)}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    eToro
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs h-8 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    size="sm"
                    onClick={() => window.open('https://app.andmilo.com/?code=@pumpparade', '_blank')}
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
