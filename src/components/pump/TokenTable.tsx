
import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react";

interface PumpToken {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  icon: string;
  pumpScore: number;
}

interface TokenTableProps {
  tokens: PumpToken[];
  changeColorClass: string;
}

export const TokenTable: React.FC<TokenTableProps> = ({ tokens, changeColorClass }) => {
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
            <TableHead className="text-gray-300 w-12 px-2">#</TableHead>
            <TableHead className="text-gray-300 w-48 px-2">Token</TableHead>
            <TableHead className="text-gray-300 w-32 px-2">Price</TableHead>
            <TableHead className="text-gray-300 w-32 px-2">24h Change</TableHead>
            <TableHead className="text-gray-300 w-28 px-2">Pump Score</TableHead>
            <TableHead className="text-gray-300 w-40 px-2">Trading Volume</TableHead>
            <TableHead className="text-gray-300 w-32 px-2">Market Cap</TableHead>
            <TableHead className="text-gray-300 w-28 px-2">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token, index) => (
            <TableRow key={index} className="border-gray-700 hover:bg-gray-700/50">
              <TableCell className="text-gray-300 text-sm font-medium px-2">
                #{index + 1}
              </TableCell>
              <TableCell className="px-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{token.icon}</span>
                  <div>
                    <div className="text-white font-bold text-sm">{token.symbol}</div>
                    <div className="text-gray-400 text-xs">{token.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-white font-mono text-sm px-2">
                ${token.price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
              </TableCell>
              <TableCell className="px-2">
                <div className={`flex items-center gap-1 ${changeColorClass}`}>
                  {token.change24h >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span className="font-mono text-sm">
                    {token.change24h >= 0 ? "+" : ""}{token.change24h.toLocaleString('en-US')}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                  {token.pumpScore}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-300 font-mono text-sm px-2">
                ${formatNumber(token.volume)}
              </TableCell>
              <TableCell className="text-gray-300 font-mono text-sm px-2">
                ${formatNumber(token.marketCap)}
              </TableCell>
              <TableCell className="px-2">
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="sm"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Trade
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
