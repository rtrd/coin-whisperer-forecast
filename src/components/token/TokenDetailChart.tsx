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
        <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-sm border border-gray-600/50 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-lg">
                <Brain className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <span className="text-white font-semibold text-base">AI Price Prediction</span>
                <p className="text-gray-400 text-xs">Advanced machine learning analysis</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-300">Days:</span>
                <Select value={predictionDays.toString()} onValueChange={(value) => setPredictionDays(Number(value))}>
                  <SelectTrigger className="w-24 h-9 bg-gray-700/80 border-gray-600/60 text-white text-sm font-medium hover:bg-gray-600/80 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 shadow-xl z-50">
                    <SelectItem value="7" className="text-white hover:bg-gray-700 focus:bg-gray-700 py-2">7 days</SelectItem>
                    <SelectItem value="14" className="text-white hover:bg-gray-700 focus:bg-gray-700 py-2">14 days</SelectItem>
                    <SelectItem value="30" className="text-white hover:bg-gray-700 focus:bg-gray-700 py-2">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-300">Model:</span>
                <Select value={modelType} onValueChange={setModelType}>
                  <SelectTrigger className="w-36 h-9 bg-gray-700/80 border-gray-600/60 text-white text-sm font-medium hover:bg-gray-600/80 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 shadow-xl z-50">
                    <SelectItem value="technical" className="text-white hover:bg-gray-700 focus:bg-gray-700 py-2">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-400" />
                        Technical
                      </div>
                    </SelectItem>
                    <SelectItem value="sentiment" className="text-white hover:bg-gray-700 focus:bg-gray-700 py-2">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-400" />
                        Sentiment
                      </div>
                    </SelectItem>
                    <SelectItem value="hybrid" className="text-white hover:bg-gray-700 focus:bg-gray-700 py-2">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-400" />
                        Hybrid
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <ModelTypeTooltip modelType={modelType} />
              </div>

              <Button 
                onClick={handlePredict}
                disabled={predictionLoading || !cryptoData}
                className="h-9 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {predictionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generate Prediction
                  </>
                )}
              </Button>

              {showPrediction && (
                <Button 
                  onClick={handleClearPrediction}
                  variant="outline"
                  className="h-9 px-4 border-gray-500 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-400 transition-all duration-200"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {prediction && showPrediction && (
            <div className="mt-4 pt-4 border-t border-gray-600/50">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">Prediction Active</span>
                </div>
                <div className="text-gray-300">
                  <span className="font-medium">{predictionDays} days</span> forecast using <span className="font-medium capitalize">{modelType}</span> model
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
