
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CryptoSearchSelector } from '@/components/CryptoSearchSelector';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface IndexHeaderProps {
  selectedCrypto: string;
  cryptoOptions: any[];
  currentPrice: number;
  priceChange: number;
}

export const IndexHeader: React.FC<IndexHeaderProps> = ({
  selectedCrypto,
  cryptoOptions,
  currentPrice,
  priceChange
}) => {
  const selectedToken = cryptoOptions.find(c => c.value === selectedCrypto) || cryptoOptions[0];

  console.log('IndexHeader - currentPrice:', currentPrice, 'priceChange:', priceChange);

  return (
    <div className="mb-6 md:mb-8">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 md:mb-4">
          AI Crypto Prediction
        </h1>
        <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Advanced machine learning algorithms analyze market trends to predict cryptocurrency prices with unprecedented accuracy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
        {/* Crypto Selection Card - Updated background */}
        <Card className="bg-gray-800/50 border-gray-700 shadow-xl backdrop-blur-sm">
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Cryptocurrency
                </label>
                <CryptoSearchSelector
                  selectedCrypto={selectedCrypto}
                  cryptoOptions={cryptoOptions}
                />
              </div>
              
              {selectedToken && (
                <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white text-lg">{selectedToken.label}</h3>
                      <p className="text-gray-400 text-sm">{selectedToken.description || 'Cryptocurrency'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">${currentPrice.toFixed(4)}</div>
                      <div className={`flex items-center gap-1 text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {priceChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Score Card */}
        <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-700/50 shadow-xl backdrop-blur-sm">
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Confidence Score</h3>
                  <p className="text-purple-300 text-sm">Real-time analysis</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-400">
                    {selectedToken?.score || '8.5'}/10
                  </div>
                  <div className="text-green-400 text-sm font-medium">
                    {selectedToken?.prediction || '+12.5%'} predicted
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Market Sentiment</span>
                  <span className="text-green-400">Bullish</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Technical Analysis</span>
                  <span className="text-blue-400">Strong</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Risk Level</span>
                  <span className="text-yellow-400">Moderate</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
