
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, ExternalLink } from "lucide-react";
import { PriceChart } from "@/components/PriceChart";
import { PredictionCard } from "@/components/PredictionCard";

interface IndexMainContentProps {
  cryptoData: any;
  prediction: any;
  selectedCrypto: string;
  dataLoading: boolean;
  cryptoOptions: any[];
}

export const IndexMainContent: React.FC<IndexMainContentProps> = ({
  cryptoData,
  prediction,
  selectedCrypto,
  dataLoading,
  cryptoOptions
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
          />
        </CardContent>
      </Card>

      {/* Token List */}
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-blue-400" />
            All Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cryptoOptions.map((token) => (
              <Link
                key={token.value}
                to={`/token/${token.value}`}
                className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600 hover:bg-gray-600/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{token.icon}</span>
                  <div>
                    <div className="text-white font-medium group-hover:text-blue-400 transition-colors">
                      {token.label.split(' ')[0]}
                    </div>
                    <div className="text-gray-400 text-xs">
                      Score: {token.score}/10
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    token.prediction.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {token.prediction}
                  </div>
                  <Badge variant="outline" className="text-xs text-gray-300 border-gray-500">
                    {token.category}
                  </Badge>
                </div>
              </Link>
            ))}
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
