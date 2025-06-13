
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice, formatVolume, formatMarketCap } from "./MarketDataUtils";

interface MarketDataRowProps {
  token: any;
  index: number;
  isUnlocked: boolean;
  activeFilter: string;
}

// Map CoinGecko IDs to URL-friendly token IDs
const getTokenUrlId = (coinGeckoId: string) => {
  const urlMap: { [key: string]: string } = {
    'bitcoin': 'bitcoin',
    'ethereum': 'ethereum', 
    'binancecoin': 'bnb',
    'solana': 'solana',
    'cardano': 'cardano',
    'ripple': 'xrp',
    'dogecoin': 'doge',
    'shiba-inu': 'shib',
    'pepe': 'pepe',
    'bonk': 'bonk',
    'uniswap': 'uniswap',
    'aave': 'aave',
    'fetch-ai': 'fetch-ai',
    'render-token': 'render-token',
    'matic-network': 'polygon',
    'avalanche-2': 'avalanche-2',
    'chainlink': 'chainlink',
    'polkadot': 'polkadot',
    'litecoin': 'litecoin'
  };
  
  return urlMap[coinGeckoId] || coinGeckoId;
};

export const MarketDataRow: React.FC<MarketDataRowProps> = ({
  token,
  index,
  isUnlocked,
  activeFilter,
}) => {
  const tokenUrlId = getTokenUrlId(token.value);

  return (
    <TableRow
      key={token.value}
      className="border-gray-700 hover:bg-gray-700/50 h-16"
    >
      <TableCell className="text-gray-300 font-medium w-12 px-2 py-3">{index + 1}</TableCell>
      <TableCell className="w-48 px-2 py-3">
        <Link
          to={`/token/${tokenUrlId}`}
          className="flex items-center gap-2 hover:text-blue-400 transition-colors"
        >
          <span className="text-lg">
            <img 
              src={token.image} 
              alt={token.label} 
              className="w-8 h-8 object-contain rounded-full flex-shrink-0"
            />
          </span>
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
              token.predictionPercentage >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {token.predictionPercentage >= 0 ? "+" : ""}
            {token.predictionPercentage.toFixed(2)}%
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-yellow-400" />
            <span className="text-yellow-400 text-xs">Premium</span>
          </div>
        )}
      </TableCell>
      <TableCell className="w-28 px-2 py-3">
        {isUnlocked ? (
          <div className="flex items-center gap-1">
            <div
              className={`font-mono ${
                token.aiScore >= 80
                  ? "text-green-400"
                  : token.aiScore >= 60
                  ? "text-yellow-400"
                  : token.aiScore >= 40 
                  ? "text-orange-400"
                  : "text-red-400"
              }`}
            >
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
      <TableCell className="text-gray-300 font-mono w-40 px-2 py-3">
        {formatVolume(token.volume24h)}
      </TableCell>
      <TableCell className="text-gray-300 font-mono w-32 px-2 py-3">
        {formatMarketCap(token.marketCap)}
      </TableCell>
      <TableCell className="w-36 px-2 py-3">
        <Badge
          variant="outline"
          className={`
             ${
               token.category === "Layer 1 (L1)"
                 ? "border-blue-500 text-blue-400"
                 : token.category === "DeFi"
                 ? "border-green-500 text-green-400"
                 : token.category === "Meme Coin"
                 ? "border-purple-500 text-purple-400"
                 : token.category === "AI"
                 ? "border-cyan-500 text-cyan-400"
                 : token.category === "Gaming"
                 ? "border-orange-500 text-orange-400"
                 : token.category === "New"
                 ? "border-yellow-500 text-yellow-400"
                 : token.category === "L2"
                 ? "border-indigo-500 text-indigo-400"
                 : token.category === "Privacy"
                 ? "border-gray-500 text-gray-400"
                 : token.category === "Stablecoin"
                 ? "border-gray-500 text-gray-400"
                 : token.category === "Payment Token"
                 ? "border-emerald-500 text-emerald-400"
                 : "border-red-500 text-red-400"
             }
          `}
        >
          {token.category}
        </Badge>
      </TableCell>
    </TableRow>
  );
};
