
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ShoppingCart, Wallet, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface TokenDetailActionsProps {
  selectedToken: any;
  currentPrice: number;
}

export const TokenDetailActions: React.FC<TokenDetailActionsProps> = ({
  selectedToken,
  currentPrice
}) => {
  const handleBuy = () => {
    toast.success("Redirecting to buy...", {
      description: "This would redirect to a trading platform"
    });
  };

  const handleSell = () => {
    toast.success("Redirecting to sell...", {
      description: "This would redirect to a trading platform"
    });
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-white text-sm font-medium mb-1">{selectedToken.name}</div>
              <div className="text-gray-300 text-xs">
                ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-3">
                <Button
                  onClick={handleBuy}
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  BUY
                </Button>
                <Button
                  onClick={handleSell}
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  SELL
                </Button>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-yellow-400 cursor-help">Risk Warning</span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    Crypto investments are risky and highly volatile. Tax may apply. Understand the risks here{' '}
                    <a href="https://etoro.tw/3PI44nZ" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                      https://etoro.tw/3PI44nZ
                    </a>
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
