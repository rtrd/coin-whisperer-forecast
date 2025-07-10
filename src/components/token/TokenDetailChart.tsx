import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, Activity, Brain, Target } from "lucide-react";
import { PriceChart } from "@/components/PriceChart";
import { ModelTypeTooltip } from "@/components/ModelTypeTooltip";

interface TokenDetailChartProps {
  cryptoData: any[] | undefined;
  dataLoading: boolean;
  prediction: any;
  showPrediction: boolean;
  cryptoId: string;
  timeframe: string;
  setTimeframe: (value: string) => void;
  predictionDays: number;
  setPredictionDays: (value: number) => void;
  modelType: string;
  setModelType: (value: string) => void;
  predictionLoading: boolean;
  handlePredict: () => void;
  handleClearPrediction: () => void;
}

export const TokenDetailChart: React.FC<TokenDetailChartProps> = ({
  cryptoData,
  dataLoading,
  prediction,
  showPrediction,
  cryptoId,
  timeframe,
  setTimeframe,
  predictionDays,
  setPredictionDays,
  modelType,
  setModelType,
  predictionLoading,
  handlePredict,
  handleClearPrediction,
}) => {
  return (
    <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            Price Chart
          </CardTitle>
          <div className="flex items-center gap-4">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-36 bg-gray-700/80 border-gray-600/50 text-white hover:bg-gray-600/80 transition-colors shadow-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 shadow-xl backdrop-blur-sm z-50">
                <SelectItem
                  value="7d"
                  className="text-white hover:bg-gray-700/80 focus:bg-gray-700/80 focus:text-white"
                >
                  7 Days
                </SelectItem>
                <SelectItem
                  value="30d"
                  className="text-white hover:bg-gray-700/80 focus:bg-gray-700/80 focus:text-white"
                >
                  30 Days
                </SelectItem>
                <SelectItem
                  value="90d"
                  className="text-white hover:bg-gray-700/80 focus:bg-gray-700/80 focus:text-white"
                >
                  90 Days
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <PriceChart
          data={cryptoData || []}
          isLoading={dataLoading}
          prediction={
            showPrediction && prediction ? prediction.predictions : null
          }
          crypto={cryptoId}
          onClearPrediction={handleClearPrediction}
        />

        {/* AI Prediction Engine Controls - Below Chart */}
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-blue-400" />
              <span className="text-white font-medium">AI Price Prediction</span>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Days:</span>
                <Select value={predictionDays.toString()} onValueChange={(value) => setPredictionDays(Number(value))}>
                  <SelectTrigger className="w-20 h-8 bg-gray-700/50 border-gray-600 text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="7" className="text-white hover:bg-gray-700">7</SelectItem>
                    <SelectItem value="14" className="text-white hover:bg-gray-700">14</SelectItem>
                    <SelectItem value="30" className="text-white hover:bg-gray-700">30</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Model:</span>
                <Select value={modelType} onValueChange={setModelType}>
                  <SelectTrigger className="w-32 h-8 bg-gray-700/50 border-gray-600 text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="technical" className="text-white hover:bg-gray-700">Technical</SelectItem>
                    <SelectItem value="sentiment" className="text-white hover:bg-gray-700">Sentiment</SelectItem>
                    <SelectItem value="hybrid" className="text-white hover:bg-gray-700">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                <ModelTypeTooltip modelType={modelType} />
              </div>

              <Button 
                onClick={handlePredict}
                disabled={predictionLoading || !cryptoData}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {predictionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                    Analyzing
                  </>
                ) : (
                  <>
                    <Brain className="h-3 w-3 mr-1" />
                    Predict
                  </>
                )}
              </Button>

              {showPrediction && (
                <Button 
                  onClick={handleClearPrediction}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {prediction && showPrediction && (
            <div className="mt-3 pt-3 border-t border-gray-700/50">
              <div className="flex items-center gap-2 text-sm text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Prediction active: {predictionDays} days ahead using {modelType} model</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
