
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { PriceChart } from "@/components/PriceChart";
import { PredictionCard } from "@/components/PredictionCard";

interface IndexMainContentProps {
  cryptoData: any;
  prediction: any;
  selectedCrypto: string;
  dataLoading: boolean;
}

export const IndexMainContent: React.FC<IndexMainContentProps> = ({
  cryptoData,
  prediction,
  selectedCrypto,
  dataLoading
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

      {/* Prediction Results */}
      {prediction && (
        <PredictionCard prediction={prediction} crypto={selectedCrypto} />
      )}
    </div>
  );
};
