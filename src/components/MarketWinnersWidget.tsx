import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export const MarketWinnersWidget = ({ topGainnersandLoosers }) => {
  const valid = topGainnersandLoosers.filter(
    (c) => typeof c.price_change_percentage_24h === "number"
  );
  // Top 4 winners
  const winners = [...valid]
    .sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    )
    .slice(0, 4)
    .map((coin) => ({
      ...coin,
    }));

  const losers = [...valid]
    .sort(
      (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
    )
    .slice(0, 4)
    .map((coin) => ({
      ...coin,
    }));

  return (
    <Card
      className="bg-gray-800/60 border-gray-600/50 backdrop-blur-sm shadow-xl"
      style={{ width: "300px" }}
    >
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-600/50">
        <CardTitle className="text-white text-lg flex items-center gap-2 font-semibold">
          <TrendingUp className="h-5 w-5 text-green-400" />
          Market Movers
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-green-400 text-sm font-semibold mb-3 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Top Gainers
            </h4>
            <div className="space-y-2">
              {winners.slice(0, 3).map((token) => (
                <Link
                  key={token.symbol}
                  to={`/token/${token.name}`}
                  state={{ token }}
                  className="block"
                >
                  <div className="flex items-center justify-between p-2 hover:bg-gray-700/50 rounded-lg transition-all duration-200 group">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        <img
                          src={token.image}
                          alt={token.name}
                          className="w-6 h-6 rounded-full inline-block mr-2"
                        />
                      </span>
                      <div>
                        <div className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors">
                          {token.symbol.toUpperCase()}
                        </div>
                        <div className="text-gray-400 text-xs">
                          ${token.current_price}
                        </div>
                      </div>
                    </div>
                    <div className="text-green-400 font-semibold text-sm bg-green-400/10 px-2 py-1 rounded">
                      +{token.price_change_percentage_24h.toFixed(2)}%
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-600/50 pt-3">
            <h4 className="text-red-400 text-sm font-semibold mb-3 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              Top Losers
            </h4>
            <div className="space-y-2">
              {losers.slice(0, 3).map((token) => (
                <Link
                  key={token.symbol}
                  to={`/token/${token.name.toLowerCase()}`}
                  state={{ token }}
                  className="block"
                >
                  <div className="flex items-center justify-between p-2 hover:bg-gray-700/50 rounded-lg transition-all duration-200 group">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        <img
                          src={token.image}
                          alt={token.name}
                          className="w-6 h-6 rounded-full inline-block mr-2"
                        />
                      </span>
                      <div>
                        <div className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors">
                          {token.symbol.toUpperCase()}
                        </div>
                        <div className="text-gray-400 text-xs">
                          ${token.current_price}
                        </div>
                      </div>
                    </div>
                    <div className="text-red-400 font-semibold text-sm bg-red-400/10 px-2 py-1 rounded">
                      {token.price_change_percentage_24h.toFixed(2)}%
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
