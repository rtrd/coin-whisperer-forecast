import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, TrendingUp, TrendingDown, Sparkles, LayoutList, LayoutGrid } from "lucide-react";
import { TokenSection } from "./pump/TokenSection";

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

export const PumpFunIntegration = () => {
  const [topPerformers, setTopPerformers] = useState<PumpToken[]>([]);
  const [topLosers, setTopLosers] = useState<PumpToken[]>([]);
  const [newLaunches, setNewLaunches] = useState<PumpToken[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  useEffect(() => {
    // Mock data for top performers - 8 items
    const mockTopPerformers: PumpToken[] = [
      { name: 'MoonShot', symbol: 'MOON', price: 0.0012, change24h: 1250, volume: 890000, marketCap: 2400000, icon: '🌙', pumpScore: 9.8 },
      { name: 'RocketCoin', symbol: 'ROCK', price: 0.00089, change24h: 890, volume: 650000, marketCap: 1800000, icon: '🚀', pumpScore: 9.5 },
      { name: 'LaserEyes', symbol: 'LASER', price: 0.0034, change24h: 650, volume: 1200000, marketCap: 5600000, icon: '👁️', pumpScore: 9.2 },
      { name: 'DiamondHands', symbol: 'DIAM', price: 0.0067, change24h: 450, volume: 980000, marketCap: 8900000, icon: '💎', pumpScore: 8.9 },
      { name: 'ToTheMoon', symbol: 'TTM', price: 0.0023, change24h: 320, volume: 750000, marketCap: 3400000, icon: '🌕', pumpScore: 8.7 },
      { name: 'FireCoin', symbol: 'FIRE', price: 0.0041, change24h: 280, volume: 520000, marketCap: 4200000, icon: '🔥', pumpScore: 8.5 },
      { name: 'Lightning', symbol: 'LIGHT', price: 0.0018, change24h: 245, volume: 680000, marketCap: 2900000, icon: '⚡', pumpScore: 8.3 },
      { name: 'StarBurst', symbol: 'STAR', price: 0.0025, change24h: 195, volume: 450000, marketCap: 2100000, icon: '⭐', pumpScore: 8.1 }
    ];

    // Mock data for top losers - 8 items
    const mockTopLosers: PumpToken[] = [
      { name: 'BearTrap', symbol: 'BEAR', price: 0.0008, change24h: -45, volume: 230000, marketCap: 890000, icon: '🐻', pumpScore: 3.2 },
      { name: 'RugPull', symbol: 'RUG', price: 0.0003, change24h: -67, volume: 150000, marketCap: 450000, icon: '🔻', pumpScore: 2.8 },
      { name: 'CrashCoin', symbol: 'CRASH', price: 0.0015, change24h: -38, volume: 340000, marketCap: 1200000, icon: '💥', pumpScore: 3.5 },
      { name: 'DownTrend', symbol: 'DOWN', price: 0.0021, change24h: -52, volume: 180000, marketCap: 780000, icon: '📉', pumpScore: 2.9 },
      { name: 'FallCoin', symbol: 'FALL', price: 0.0012, change24h: -42, volume: 290000, marketCap: 650000, icon: '📈', pumpScore: 3.1 },
      { name: 'DropToken', symbol: 'DROP', price: 0.0009, change24h: -35, volume: 210000, marketCap: 520000, icon: '⬇️', pumpScore: 3.3 },
      { name: 'SinkCoin', symbol: 'SINK', price: 0.0006, change24h: -58, volume: 160000, marketCap: 380000, icon: '🌊', pumpScore: 2.7 },
      { name: 'RedAlert', symbol: 'RED', price: 0.0014, change24h: -41, volume: 250000, marketCap: 720000, icon: '🚨', pumpScore: 3.0 }
    ];

    // Mock data for new launches - 8 items
    const mockNewLaunches: PumpToken[] = [
      { name: 'FreshStart', symbol: 'FRESH', price: 0.0005, change24h: 125, volume: 420000, marketCap: 650000, icon: '✨', pumpScore: 7.8 },
      { name: 'NewKid', symbol: 'NEWK', price: 0.0012, change24h: 89, volume: 380000, marketCap: 920000, icon: '🆕', pumpScore: 7.2 },
      { name: 'BabyToken', symbol: 'BABY', price: 0.0008, change24h: 67, volume: 290000, marketCap: 540000, icon: '👶', pumpScore: 6.9 },
      { name: 'Genesis', symbol: 'GEN', price: 0.0018, change24h: 156, volume: 510000, marketCap: 1100000, icon: '🌱', pumpScore: 8.1 },
      { name: 'FirstStep', symbol: 'FIRST', price: 0.0007, change24h: 98, volume: 340000, marketCap: 480000, icon: '👣', pumpScore: 7.5 },
      { name: 'Pioneer', symbol: 'PION', price: 0.0016, change24h: 134, volume: 460000, marketCap: 890000, icon: '🏗️', pumpScore: 7.9 },
      { name: 'Origin', symbol: 'ORIG', price: 0.0011, change24h: 76, volume: 320000, marketCap: 620000, icon: '🎯', pumpScore: 7.1 },
      { name: 'Launch', symbol: 'LNCH', price: 0.0013, change24h: 112, volume: 390000, marketCap: 780000, icon: '🎪', pumpScore: 7.7 }
    ];

    setTopPerformers(mockTopPerformers);
    setTopLosers(mockTopLosers);
    setNewLaunches(mockNewLaunches);
  }, []);

  return (
    <div className="mb-6">
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <Rocket className="h-5 w-5 text-purple-400" />
              Solana Memecoin Insights
              <Badge className="bg-green-600 text-white">LIVE</Badge>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
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
          <TokenSection
            title="Top Performers"
            icon={<TrendingUp className="h-4 w-4 text-green-400" />}
            tokens={topPerformers}
            changeColorClass="text-green-400"
            viewMode={viewMode}
          />

          <TokenSection
            title="Top Losers"
            icon={<TrendingDown className="h-4 w-4 text-red-400" />}
            tokens={topLosers}
            changeColorClass="text-red-400"
            viewMode={viewMode}
          />

          <TokenSection
            title="New Launches"
            icon={<Sparkles className="h-4 w-4 text-yellow-400" />}
            tokens={newLaunches}
            changeColorClass="text-green-400"
            viewMode={viewMode}
          />
        </CardContent>
      </Card>
    </div>
  );
};
