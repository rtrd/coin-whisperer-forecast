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
        {/* AI Prediction Engine Controls */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">AI Prediction Engine</h3>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              Advanced
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Prediction Days */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Prediction Days</label>
              <Select value={predictionDays.toString()} onValueChange={(value) => setPredictionDays(Number(value))}>
                <SelectTrigger className="bg-gray-700/80 border-gray-600/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="7" className="text-white hover:bg-gray-700/80">7 Days</SelectItem>
                  <SelectItem value="14" className="text-white hover:bg-gray-700/80">14 Days</SelectItem>
                  <SelectItem value="30" className="text-white hover:bg-gray-700/80">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Model Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-1">
                Model Type
                <ModelTypeTooltip modelType={modelType} />
              </label>
              <Select value={modelType} onValueChange={setModelType}>
                <SelectTrigger className="bg-gray-700/80 border-gray-600/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="technical" className="text-white hover:bg-gray-700/80">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Technical
                    </div>
                  </SelectItem>
                  <SelectItem value="sentiment" className="text-white hover:bg-gray-700/80">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Sentiment
                    </div>
                  </SelectItem>
                  <SelectItem value="hybrid" className="text-white hover:bg-gray-700/80">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Hybrid
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Predict Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 opacity-0">Action</label>
              <Button 
                onClick={handlePredict}
                disabled={predictionLoading || !cryptoData}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
              >
                {predictionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Predict
                  </>
                )}
              </Button>
            </div>

            {/* Clear Button */}
            {showPrediction && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 opacity-0">Clear</label>
                <Button 
                  onClick={handleClearPrediction}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50"
                >
                  Clear Prediction
                </Button>
              </div>
            )}
          </div>

          {/* Prediction Status */}
          {prediction && showPrediction && (
            <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              AI prediction active for {predictionDays} days • {modelType} model
            </div>
          )}
        </div>

        <PriceChart
          data={cryptoData || []}
          isLoading={dataLoading}
          prediction={
            showPrediction && prediction ? prediction.predictions : null
          }
          crypto={cryptoId}
          onClearPrediction={handleClearPrediction}
        />
      </CardContent>
    </Card>
  );
};
