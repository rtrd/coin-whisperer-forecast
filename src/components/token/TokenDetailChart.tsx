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
        <div className="bg-gradient-to-r from-gray-800/60 via-purple-900/20 to-gray-700/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <Brain className="h-6 w-6 text-purple-400" />
              </div>
              <span className="text-white font-semibold text-xl">AI Price Prediction</span>
            </div>
            
            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-base font-medium text-gray-200">Timeline:</span>
                <Select value={predictionDays.toString()} onValueChange={(value) => setPredictionDays(Number(value))}>
                  <SelectTrigger className="w-32 h-12 bg-gray-700/80 border-purple-500/40 text-white text-base font-medium hover:bg-gray-600/80 hover:border-purple-400/60 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-purple-500/50 shadow-xl z-50">
                    <SelectItem value="7" className="text-white hover:bg-gray-700 focus:bg-gray-700 py-3 text-base">7 Days</SelectItem>
                    <SelectItem value="30" className="text-white hover:bg-gray-700 focus:bg-gray-700 py-3 text-base">30 Days</SelectItem>
                    <SelectItem value="90" className="text-white hover:bg-gray-700 focus:bg-gray-700 py-3 text-base">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base font-medium text-gray-200">Model:</span>
                <Select value={modelType} onValueChange={setModelType}>
                  <SelectTrigger className="w-44 h-12 bg-gray-700/80 border-purple-500/40 text-white text-base font-medium hover:bg-gray-600/80 hover:border-purple-400/60 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-purple-500/50 shadow-xl z-50">
                    <SelectItem value="technical" className="text-white hover:bg-gray-700 focus:bg-gray-700 py-3 text-base">
                      Technical
                    </SelectItem>
                    <SelectItem value="sentiment" className="text-white hover:bg-gray-700 focus:bg-gray-700 py-3 text-base">
                      Sentiment
                    </SelectItem>
                    <SelectItem value="hybrid" className="text-white hover:bg-gray-700 focus:bg-gray-700 py-3 text-base">
                      Hybrid
                    </SelectItem>
                  </SelectContent>
                </Select>
                <ModelTypeTooltip modelType={modelType} />
              </div>

              <Button 
                onClick={handlePredict}
                disabled={predictionLoading || !cryptoData}
                className="h-12 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {predictionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5 mr-2" />
                    Generate Prediction
                  </>
                )}
              </Button>

              {showPrediction && (
                <Button 
                  onClick={handleClearPrediction}
                  variant="outline"
                  className="h-12 px-8 border-purple-500/50 text-gray-200 hover:bg-purple-500/20 hover:text-white hover:border-purple-400/60 transition-all duration-200 text-base"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {prediction && showPrediction && (
            <div className="mt-5 pt-5 border-t border-purple-500/30">
              <div className="flex items-center gap-3 text-base">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-400 font-medium">Prediction Active</span>
                </div>
                <div className="text-gray-200">
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
