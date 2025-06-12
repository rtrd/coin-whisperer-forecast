
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, ExternalLink } from "lucide-react";
import { PriceChart } from "@/components/PriceChart";
import { PredictionCard } from "@/components/PredictionCard";
import { DynamicTokenAnalysis } from "@/components/DynamicTokenAnalysis";

interface IndexMainContentProps {
  cryptoData: any;
  prediction: any;
  selectedCrypto: string;
  dataLoading: boolean;
  cryptoOptions: any[];
  currentPrice: number;
  priceChange: number;
  onClearPrediction?: () => void;
}

export const IndexMainContent: React.FC<IndexMainContentProps> = ({
  cryptoData,
  prediction,
  selectedCrypto,
  dataLoading,
  cryptoOptions,
  currentPrice,
  priceChange,
  onClearPrediction
}) => {
  return (
    <div className="lg:col-span-3 space-y-6">
      {/* Price Chart */}
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              Advanced Candlestick Chart & AI Prediction
            </span>
            {cryptoData && (
              <Badge variant="outline" className="text-green-400 border-green-400">
                Live Data
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PriceChart 
            data={cryptoData} 
            prediction={prediction?.predictions || null}
            isLoading={dataLoading}
            crypto={selectedCrypto}
            onClearPrediction={onClearPrediction}
          />
        </CardContent>
      </Card>

      {/* Dynamic Token Analysis */}
      <DynamicTokenAnalysis
        selectedCrypto={selectedCrypto}
        currentPrice={currentPrice}
        priceChange={priceChange}
        cryptoOptions={cryptoOptions}
      />

      {/* Browse All Tokens Link */}
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-blue-400" />
            Explore More Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-300 mb-4">
              Want to explore more cryptocurrencies and their AI predictions?
            </p>
            <Link to="/tokens">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all">
                Browse All Tokens
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {prediction && (
        <PredictionCard prediction={prediction} crypto={selectedCrypto} />
      )}
    </div>
  );
};
