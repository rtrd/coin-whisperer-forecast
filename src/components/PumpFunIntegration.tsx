import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, TrendingUp, TrendingDown, Sparkles, LayoutList, LayoutGrid, Wifi, WifiOff, AlertCircle } from "lucide-react";
import { LiveTokenFeed } from "./pump/LiveTokenFeed";
import { PopularMemecoins } from "./pump/PopularMemecoins";
import { usePumpPortalData } from "@/hooks/usePumpPortalData";
import { GAMAdUnit } from "./ads/GAMAdUnit";

export const PumpFunIntegration = () => {
  const { newLaunches, isConnected, error } = usePumpPortalData();
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Live Token Feed Section */}
        <Card className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border-gray-700/50 shadow-2xl backdrop-blur-sm">
          <CardHeader className="pb-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-t-lg border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-3 text-xl font-bold">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span>Solana Memecoin Insights</span>
                  <span className="text-sm text-gray-400 font-normal">Live new token launches</span>
                </div>
                {isConnected ? (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></div>
                      LIVE
                    </Badge>
                    <Wifi className="h-4 w-4 text-green-400" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">OFFLINE</Badge>
                    <WifiOff className="h-4 w-4 text-red-400" />
                  </div>
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/50">
            {error && (
              <div className="flex items-center gap-3 p-4 mb-6 bg-red-900/30 border border-red-700/50 rounded-xl backdrop-blur-sm">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <span className="text-red-300">{error}</span>
              </div>
            )}
            <LiveTokenFeed 
              tokens={newLaunches} 
              isConnected={isConnected}
            />
          </CardContent>
        </Card>

        {/* Ad Section */}
        <div className="flex justify-center py-6">
          <div className="w-full max-w-2xl">
            <GAMAdUnit 
              adUnitId="lovable_leaderboard"
              size={[728, 90]}
              className="mx-auto bg-gray-800/20 rounded-lg p-4 border border-gray-700/30"
            />
          </div>
        </div>

        {/* Popular Memecoins Section */}
        <div className="transform hover:scale-[1.005] transition-transform duration-300">
          <PopularMemecoins />
        </div>
      </div>
    </div>
  );
};
