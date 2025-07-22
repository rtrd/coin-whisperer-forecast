import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, TrendingUp, TrendingDown, Sparkles, LayoutList, LayoutGrid, Wifi, WifiOff, AlertCircle } from "lucide-react";
import { TokenSection } from "./pump/TokenSection";
import { MemecoinCarousel } from "./pump/MemecoinCarousel";
import { usePumpPortalData } from "@/hooks/usePumpPortalData";

export const PumpFunIntegration = () => {
  const { newLaunches, isConnected, error } = usePumpPortalData();
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  return (
    <div className="mb-6">
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
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`${
                  viewMode === "list" 
                    ? "text-white" 
                    : "text-gray-300 border-gray-600 bg-gray-700/50 hover:bg-gray-600/50 hover:text-white"
                }`}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`${
                  viewMode === "grid" 
                    ? "text-white" 
                    : "text-gray-300 border-gray-600 bg-gray-700/50 hover:bg-gray-600/50 hover:text-white"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}
          <TokenSection
            title="New Launches"
            icon={<Sparkles className="h-4 w-4 text-yellow-400" />}
            tokens={newLaunches}
            changeColorClass="text-green-400"
            viewMode={viewMode}
            showPrice={false}
            showChange={false}
          />

          <MemecoinCarousel />
        </CardContent>
      </Card>
    </div>
  );
};
