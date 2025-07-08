import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, ArrowRight, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TokenDetailOtherTokensProps {
  tokenId: string;
  cryptoOptions: any[];
}

export const TokenDetailOtherTokens: React.FC<TokenDetailOtherTokensProps> = ({
  tokenId,
  cryptoOptions,
}) => {
  const isMobile = useIsMobile();
  return (
    <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-400" />
            Other Tokens
          </CardTitle>
          <Link to="/tokens" state={{ AllCryptosData: cryptoOptions }}>
            <Button
              variant="outline"
              className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View All Tokens
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isMobile ? (
          /* Mobile: Horizontal scroll */
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
            {cryptoOptions
              .filter((token) => token.value !== tokenId)
              .sort(() => Math.random() - 0.5)
              .slice(0, 8)
              .map((token) => (
                <Link
                  key={token.value}
                  to={`/token/${token.name}`}
                  className="flex-shrink-0 w-32"
                >
                  <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/70 hover:bg-gradient-to-br hover:from-gray-700/70 hover:to-gray-800/70 transition-all duration-300 h-full shadow-lg hover:shadow-xl transform hover:scale-105">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <span className="text-xl">
                        <img
                          src={token.image}
                          alt={token.label}
                          className="w-6 h-6 object-contain rounded-full flex-shrink-0"
                        />
                      </span>
                      <div>
                        <div className="text-white text-xs font-bold">
                          {token.symbol.toUpperCase()}
                        </div>
                        <div className="text-gray-400 text-[10px] truncate">
                          {token.name}
                        </div>
                      </div>
                      <div className="text-center">
                        {/* <div
                          className={`text-[10px] font-bold ${
                            token.prediction.startsWith("+")
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {token.prediction}
                        </div> */}
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-2.5 w-2.5 text-yellow-400" />
                          <span className="text-gray-400 text-[10px] font-medium">
                            {token.score}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        ) : (
          /* Desktop: Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {cryptoOptions
              .filter((token) => token.value !== tokenId)
              .sort(() => Math.random() - 0.5)
              .slice(0, 6)
              .map((token) => (
                <Link
                  key={token.value}
                  to={`/token/${token.name}`}
                  className="block"
                >
                  <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-5 border border-gray-700/50 hover:border-gray-600/70 hover:bg-gradient-to-br hover:from-gray-700/70 hover:to-gray-800/70 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <span className="text-3xl">
                        <img
                          src={token.image}
                          alt={token.label}
                          className="w-6 h-6 object-contain rounded-full flex-shrink-0"
                        />
                      </span>
                      <div>
                        <div className="text-white text-sm font-bold">
                          {token.symbol.toUpperCase()}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {token.name}
                        </div>
                      </div>
                      <div className="text-center">
                        {/* <div
                          className={`text-sm font-bold ${
                            token.prediction.startsWith("+")
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {token.prediction}
                        </div> */}
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-400" />
                          <span className="text-gray-400 text-xs font-medium">
                            {token.score}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
