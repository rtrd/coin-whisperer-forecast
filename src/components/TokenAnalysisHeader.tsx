
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { SelectedTokenInfo } from '@/types/tokenAnalysis';

interface TokenAnalysisHeaderProps {
  selectedToken: SelectedTokenInfo | undefined;
  tokenInfoError: any;
}

export const TokenAnalysisHeader: React.FC<TokenAnalysisHeaderProps> = ({
  selectedToken,
  tokenInfoError
}) => {
  return (
    <CardHeader>
      <CardTitle className="text-white flex items-center gap-2">
        <span className="text-yellow-400">
          {selectedToken?.icon}
        </span>
        Token Analysis
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </CardTitle>
      {tokenInfoError && (
        <div className="text-xs text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded">
          Using cached data (API unavailable)
        </div>
      )}
    </CardHeader>
  );
};
