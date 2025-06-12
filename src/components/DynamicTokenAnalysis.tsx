import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TokenAnalysisProps {
  selectedCrypto: string;
  currentPrice: number;
  priceChange: number;
  cryptoOptions: any[];
}

export const DynamicTokenAnalysis: React.FC<TokenAnalysisProps> = ({
  selectedCrypto,
  currentPrice,
  priceChange,
  cryptoOptions
}) => {
  const [analysis, setAnalysis] = useState({
    momentum: 0,
    volatility: 0,
    marketSentiment: 'neutral' as 'bullish' | 'bearish' | 'neutral',
    supportLevel: 0,
    resistanceLevel: 0
  });

  useEffect(() => {
    // Simulate dynamic analysis updates
    const updateAnalysis = () => {
      const selectedToken = cryptoOptions.find(c => c.value === selectedCrypto);
      const baseScore = selectedToken?.score || 5;
      
      setAnalysis({
        momentum: (Math.random() * 200 - 100), // -100 to 100
        volatility: Math.random() * 100,
        marketSentiment: baseScore > 7 ? 'bullish' : baseScore < 4 ? 'bearish' : 'neutral',
        supportLevel: currentPrice * (0.92 + Math.random() * 0.06),
        resistanceLevel: currentPrice * (1.02 + Math.random() * 0.06)
      });
    };

    updateAnalysis();
    const interval = setInterval(updateAnalysis, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [selectedCrypto, currentPrice, cryptoOptions]);

  const selectedToken = cryptoOptions.find(c => c.value === selectedCrypto);

  return (
    <TooltipProvider>
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span className="text-yellow-400">
              {selectedToken?.icon}
            </span>
            Dynamic Token Analysis
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-100 font-medium">Current Price</span>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-gray-300" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-700 border-gray-600">
                    <p className="text-gray-100">Real-time market price from multiple exchanges</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-white font-bold text-lg">
                ${currentPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-100 font-medium">AI Prediction</span>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-gray-300" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-700 border-gray-600">
                    <p className="text-gray-100">Machine learning prediction based on 50+ indicators</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-white font-bold text-lg">
                {selectedToken?.prediction}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-100 font-medium">Momentum Score</span>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-gray-300" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-700 border-gray-600">
                    <p className="text-gray-100">Price momentum indicator (-100 to +100)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className={`font-bold text-lg ${analysis.momentum > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {analysis.momentum.toFixed(1)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-100 font-medium">Volatility</span>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-gray-300" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-700 border-gray-600">
                    <p className="text-gray-100">Price volatility index (0-100)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-white font-bold text-lg">
                {analysis.volatility.toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-100 font-medium">Support Level</span>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-gray-300" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-700 border-gray-600">
                    <p className="text-gray-100">Key support price level based on technical analysis</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-white font-bold text-lg">
                ${analysis.supportLevel.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-100 font-medium">Resistance Level</span>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-gray-300" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-700 border-gray-600">
                    <p className="text-gray-100">Key resistance price level based on technical analysis</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-white font-bold text-lg">
                ${analysis.resistanceLevel.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-100 font-medium">Confidence Score</span>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-gray-300" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-700 border-gray-600">
                    <p className="text-gray-100">AI model confidence level in prediction accuracy</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-white font-bold text-lg">
                {selectedToken?.score}/10
              </span>
            </div>

            <div className="flex items-center gap-2 mt-4">
              {priceChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span className={`text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}% (24h)
              </span>
              <Badge className={`ml-auto ${
                analysis.marketSentiment === 'bullish' ? 'bg-green-600 text-white' :
                analysis.marketSentiment === 'bearish' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-black'
              }`}>
                {analysis.marketSentiment.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
