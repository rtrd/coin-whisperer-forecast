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
    <div className="space-y-8">
      {/* Live Token Feed Section */}
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <Rocket className="h-5 w-5 text-purple-400" />
              Solana Memecoin Insights
              {isConnected ? (
                <>
                  <Badge className="bg-green-600 text-white">LIVE</Badge>
                  <Wifi className="h-4 w-4 text-green-400" />
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                </>
              ) : (
                <>
                  <Badge className="bg-red-600 text-white">OFFLINE</Badge>
                  <WifiOff className="h-4 w-4 text-red-400" />
                </>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
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
      <PopularMemecoins />
    </div>
  );
};
