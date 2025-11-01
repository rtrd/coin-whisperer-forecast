import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Crown, Medal, Award } from "lucide-react";
import { DefiProtocol } from "@/hooks/useDefiData";

interface TopProtocolsTableProps {
  protocols: DefiProtocol[];
}

export const TopProtocolsTable: React.FC<TopProtocolsTableProps> = ({ protocols }) => {
  const [displayCount, setDisplayCount] = useState(20);

  const formatTVL = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-4 w-4 text-yellow-400" />;
    if (index === 1) return <Medal className="h-4 w-4 text-gray-300" />;
    if (index === 2) return <Award className="h-4 w-4 text-orange-400" />;
    return null;
  };

  return (
    <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-400" />
          Top DeFi Protocols by TVL
        </CardTitle>
        <p className="text-sm text-gray-400 mt-1">
          Leading protocols ranked by Total Value Locked from DeFi Llama
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700/50 hover:bg-transparent">
                <TableHead className="text-gray-300">Rank</TableHead>
                <TableHead className="text-gray-300">Protocol</TableHead>
                <TableHead className="text-gray-300">Category</TableHead>
                <TableHead className="text-gray-300">Chains</TableHead>
                <TableHead className="text-gray-300 text-right">TVL</TableHead>
                <TableHead className="text-gray-300 text-right">24h</TableHead>
                <TableHead className="text-gray-300 text-right">7d</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {protocols.slice(0, displayCount).map((protocol, index) => (
                <TableRow 
                  key={protocol.id} 
                  className="border-gray-700/30 hover:bg-gray-700/30 transition-colors"
                >
                  <TableCell className="font-medium text-gray-300">
                    <div className="flex items-center gap-2">
                      {getRankIcon(index)}
                      <span>{index + 1}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {protocol.logo && (
                        <img 
                          src={protocol.logo} 
                          alt={protocol.name}
                          className="w-6 h-6 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <div className="font-medium text-white">{protocol.name}</div>
                        <div className="text-xs text-gray-400">{protocol.symbol}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      {protocol.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-300">
                      {protocol.chains.slice(0, 3).join(', ')}
                      {protocol.chains.length > 3 && ` +${protocol.chains.length - 3}`}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-white">
                      {formatTVL(protocol.tvl)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end gap-1 ${
                      protocol.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {protocol.change24h >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="font-medium">
                        {protocol.change24h >= 0 ? '+' : ''}
                        {protocol.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end gap-1 ${
                      protocol.change7d >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {protocol.change7d >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="font-medium">
                        {protocol.change7d >= 0 ? '+' : ''}
                        {protocol.change7d.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {displayCount < protocols.length && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setDisplayCount(prev => Math.min(prev + 20, protocols.length))}
              className="px-6 py-2 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-600/50"
            >
              Load More ({protocols.length - displayCount} remaining)
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Layers = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);
