
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { getCoinGeckoId } from '@/utils/tokenMapping';
import { useSelectedToken } from '@/hooks/useSelectedToken';
import { useTokenAnalysis } from '@/hooks/useTokenAnalysis';
import { TokenAnalysisProps } from '@/types/tokenAnalysis';
import { TokenAnalysisRow } from './TokenAnalysisRow';

export const DynamicTokenAnalysis: React.FC<TokenAnalysisProps> = React.memo(({
  selectedCrypto,
  currentPrice,
  priceChange,
  cryptoOptions = []
}) => {
  // Get the proper CoinGecko ID for API calls
  const coinGeckoId = getCoinGeckoId(selectedCrypto);
  
  // Fetch token info from API with fallback to static data
  const { data: tokenInfo, isLoading: tokenInfoLoading, error: tokenInfoError } = useTokenInfo(coinGeckoId);

  // Get selected token with fallback logic
  const selectedToken = useSelectedToken(selectedCrypto, tokenInfo, cryptoOptions);

  // Get analysis data
  const analysis = useTokenAnalysis(
    selectedToken,
    currentPrice,
    priceChange,
    tokenInfo?.current_price,
    tokenInfo?.price_change_percentage_24h
  );

  // Show loading state only if we don't have fallback data
  if (tokenInfoLoading && !selectedToken) {
    return (
      <div>
        <p className="text-gray-400">Loading token data...</p>
      </div>
    );
  }

  if (!selectedToken) {
    return (
      <div>
        <p className="text-gray-400">Token not found</p>
      </div>
    );
  }

  // Use API data when available, otherwise use props
  const displayPrice = tokenInfo?.current_price || currentPrice;
  const displayPriceChange = tokenInfo?.price_change_percentage_24h || priceChange;

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {tokenInfoError && (
          <div className="text-xs text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded">
            Using cached data (API unavailable)
          </div>
        )}
        
        <TokenAnalysisRow
          label="Current Price"
          value={`$${displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`}
          tooltipText={tokenInfo ? 'Real-time market price from CoinGecko API' : 'Simulated price data'}
        />

        <TokenAnalysisRow
          label="AI Prediction"
          value={selectedToken?.prediction}
          tooltipText="Machine learning prediction based on 50+ indicators"
        />

        <TokenAnalysisRow
          label="Momentum Score"
          value={analysis.momentum.toFixed(1)}
          tooltipText="Price momentum indicator (-100 to +100)"
          valueClassName={`font-bold text-lg ${analysis.momentum > 0 ? 'text-green-400' : 'text-red-400'}`}
        />

        <TokenAnalysisRow
          label="Volatility"
          value={`${analysis.volatility.toFixed(1)}%`}
          tooltipText="Price volatility index (0-100)"
        />

        <TokenAnalysisRow
          label="Support Level"
          value={`$${analysis.supportLevel.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          tooltipText="Key support price level based on technical analysis"
        />

        <TokenAnalysisRow
          label="Resistance Level"
          value={`$${analysis.resistanceLevel.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          tooltipText="Key resistance price level based on technical analysis"
        />

        <TokenAnalysisRow
          label="Confidence Score"
          value={`${selectedToken?.score?.toFixed(1) || '0.0'}/10`}
          tooltipText="AI model confidence level in prediction accuracy"
        />

        <div className="flex items-center gap-2 mt-4">
          {displayPriceChange >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-400" />
          )}
          <span className={`text-sm ${displayPriceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {displayPriceChange >= 0 ? '+' : ''}{displayPriceChange.toFixed(2)}% (24h)
          </span>
          <Badge className={`ml-auto ${
            analysis.marketSentiment === 'bullish' ? 'bg-green-600 text-white' :
            analysis.marketSentiment === 'bearish' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-black'
          }`}>
            {analysis.marketSentiment.toUpperCase()}
          </Badge>
        </div>
      </div>
    </TooltipProvider>
  );
});

DynamicTokenAnalysis.displayName = 'DynamicTokenAnalysis';
