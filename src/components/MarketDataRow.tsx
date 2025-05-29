
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Lock } from "lucide-react";
import { Link } from 'react-router-dom';
import { formatPrice, formatVolume, formatMarketCap } from './MarketDataUtils';

interface MarketDataRowProps {
  token: any;
  index: number;
  isUnlocked: boolean;
  activeFilter: string;
}

export const MarketDataRow: React.FC<MarketDataRowProps> = ({
  token,
  index,
  isUnlocked,
  activeFilter
}) => {
  return (
    <TableRow key={token.value} className="border-gray-700 hover:bg-gray-700/50">
      <TableCell className="text-gray-300 font-medium">
        {index + 1}
      </TableCell>
      <TableCell>
        <Link 
          to={`/token/${token.value}`}
          className="flex items-center gap-2 hover:text-blue-400 transition-colors"
        >
          <span className="text-lg">{token.icon}</span>
          <div>
            <div className="text-white font-medium">{token.label.split(' ')[0]}</div>
            <div className="text-gray-400 text-sm">{token.label.split(' ')[1]}</div>
          </div>
        </Link>
      </TableCell>
      <TableCell className="text-white font-mono">
        {formatPrice(token.price)}
      </TableCell>
      <TableCell>
        <div className={`flex items-center gap-1 ${
          token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {token.change24h >= 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
        </div>
      </TableCell>
      <TableCell>
        <div className={`flex items-center gap-1 ${
          token.predictionPercentage >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {token.predictionPercentage >= 0 ? '+' : ''}{token.predictionPercentage.toFixed(2)}%
        </div>
      </TableCell>
      <TableCell>
        {isUnlocked ? (
          <div className="flex items-center gap-1">
            <div className={`font-mono ${
              token.aiScore >= 80 ? 'text-green-400' : 
              token.aiScore >= 60 ? 'text-yellow-400' : 
              token.aiScore >= 40 ? 'text-orange-400' : 'text-red-400'
            }`}>
              {token.aiScore.toFixed(0)}
            </div>
            <div className="text-gray-400 text-xs">/100</div>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-yellow-400" />
            <span className="text-yellow-400 text-xs">Premium</span>
          </div>
        )}
      </TableCell>
      <TableCell className="text-gray-300 font-mono">
        {formatVolume(token.volume24h)}
      </TableCell>
      {activeFilter === 'market_cap' && (
        <TableCell className="text-gray-300 font-mono">
          {formatMarketCap(token.marketCap)}
        </TableCell>
      )}
      <TableCell>
        <Badge 
          variant="outline" 
          className={`
            ${token.category === 'Layer 1' ? 'border-blue-500 text-blue-400' : ''}
            ${token.category === 'DeFi' ? 'border-green-500 text-green-400' : ''}
            ${token.category === 'Meme' ? 'border-purple-500 text-purple-400' : ''}
            ${token.category === 'AI' ? 'border-cyan-500 text-cyan-400' : ''}
            ${token.category === 'Gaming' ? 'border-orange-500 text-orange-400' : ''}
            ${token.category === 'New' ? 'border-yellow-500 text-yellow-400' : ''}
            ${token.category === 'L2' ? 'border-indigo-500 text-indigo-400' : ''}
            ${token.category === 'Privacy' ? 'border-gray-500 text-gray-400' : ''}
            ${token.category === 'Stable' ? 'border-gray-500 text-gray-400' : ''}
            ${token.category === 'Enterprise' ? 'border-emerald-500 text-emerald-400' : ''}
          `}
        >
          {token.category}
        </Badge>
      </TableCell>
    </TableRow>
  );
};
