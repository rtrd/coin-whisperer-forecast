
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Link } from 'react-router-dom';

export const MarketWinnersWidget = () => {
  const winners = [
    { symbol: 'BONK', name: 'Bonk', change: '+45.2%', icon: '🔨' },
    { symbol: 'PEPE', name: 'Pepe', change: '+38.7%', icon: '🐸' },
    { symbol: 'FET', name: 'Fetch.ai', change: '+28.4%', icon: '🤖' },
    { symbol: 'RNDR', name: 'Render', change: '+22.1%', icon: '🎨' },
  ];

  const losers = [
    { symbol: 'DASH', name: 'Dash', change: '-8.5%', icon: '💨' },
    { symbol: 'XMR', name: 'Monero', change: '-6.2%', icon: '🔒' },
    { symbol: 'ZEC', name: 'Zcash', change: '-5.8%', icon: '🛡️' },
    { symbol: 'CAKE', name: 'PancakeSwap', change: '-4.3%', icon: '🥞' },
  ];

  return (
    <Card className="bg-gray-800/50 border-gray-700" style={{ width: '300px', height: '250px' }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-400" />
          Top Movers
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-3">
          <div>
            <h4 className="text-green-400 text-xs font-medium mb-2">Winners</h4>
            <div className="space-y-1">
              {winners.slice(0, 2).map((token) => (
                <Link key={token.symbol} to={`/token/${token.symbol.toLowerCase()}`} className="block">
                  <div className="flex items-center justify-between p-1 hover:bg-gray-700/50 rounded text-xs">
                    <div className="flex items-center gap-2">
                      <span>{token.icon}</span>
                      <span className="text-white">{token.symbol}</span>
                    </div>
                    <span className="text-green-400 font-medium">{token.change}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-red-400 text-xs font-medium mb-2">Losers</h4>
            <div className="space-y-1">
              {losers.slice(0, 2).map((token) => (
                <Link key={token.symbol} to={`/token/${token.symbol.toLowerCase()}`} className="block">
                  <div className="flex items-center justify-between p-1 hover:bg-gray-700/50 rounded text-xs">
                    <div className="flex items-center gap-2">
                      <span>{token.icon}</span>
                      <span className="text-white">{token.symbol}</span>
                    </div>
                    <span className="text-red-400 font-medium">{token.change}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-600">
          <Link to="/ai-prediction">
            <Button size="sm" className="w-full text-xs bg-blue-600 hover:bg-blue-700">
              Biggest Winners and Losers
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
