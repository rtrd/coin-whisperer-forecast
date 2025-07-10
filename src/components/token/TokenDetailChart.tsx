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
        <div className="bg-gradient-to-br from-gray-800/80 via-purple-900/30 to-gray-700/80 backdrop-blur-sm border-2 border-purple-500/40 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl border border-purple-400/50 shadow-lg">
                <Brain className="h-7 w-7 text-purple-300" />
              </div>
              <div>
                <span className="text-white font-bold text-xl tracking-wide">AI Price Prediction</span>
                <div className="w-20 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 mt-1"></div>
              </div>
            </div>
            
            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold text-purple-200">Timeline:</span>
                <Select value={predictionDays.toString()} onValueChange={(value) => setPredictionDays(Number(value))}>
                  <SelectTrigger className="w-32 h-12 bg-gray-900/80 border-purple-400/60 text-white text-base font-medium hover:bg-gray-800/90 hover:border-purple-300/80 transition-all duration-200 shadow-lg">
                    <SelectValue className="text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-purple-500/60 shadow-2xl z-[100]">
                    <SelectItem value="7" className="text-white hover:bg-purple-600/30 focus:bg-purple-600/30 py-3 text-base font-medium">7 Days</SelectItem>
                    <SelectItem value="30" className="text-white hover:bg-purple-600/30 focus:bg-purple-600/30 py-3 text-base font-medium">30 Days</SelectItem>
                    <SelectItem value="90" className="text-white hover:bg-purple-600/30 focus:bg-purple-600/30 py-3 text-base font-medium">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base font-semibold text-purple-200">Model:</span>
                <Select value={modelType} onValueChange={setModelType}>
                  <SelectTrigger className="w-44 h-12 bg-gray-900/80 border-purple-400/60 text-white text-base font-medium hover:bg-gray-800/90 hover:border-purple-300/80 transition-all duration-200 shadow-lg">
                    <SelectValue className="text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-purple-500/60 shadow-2xl z-[100]">
                    <SelectItem value="technical" className="text-white hover:bg-purple-600/30 focus:bg-purple-600/30 py-3 text-base font-medium">
                      Technical
                    </SelectItem>
                    <SelectItem value="sentiment" className="text-white hover:bg-purple-600/30 focus:bg-purple-600/30 py-3 text-base font-medium">
                      Sentiment
                    </SelectItem>
                    <SelectItem value="hybrid" className="text-white hover:bg-purple-600/30 focus:bg-purple-600/30 py-3 text-base font-medium">
                      Hybrid
                    </SelectItem>
                  </SelectContent>
                </Select>
                <ModelTypeTooltip modelType={modelType} />
              </div>

              <Button 
                onClick={handlePredict}
                disabled={predictionLoading || !cryptoData}
                className="h-12 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-base shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 border border-purple-400/30"
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
                  className="h-12 px-8 bg-gray-800/60 border-purple-400/60 text-white hover:bg-red-500/30 hover:text-white hover:border-red-400/60 transition-all duration-200 text-base font-medium shadow-lg"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {prediction && showPrediction && (
            <div className="mt-6 pt-6 border-t border-purple-400/30">
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-4 border border-purple-400/40">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg"></div>
                      <span className="text-purple-300 font-bold text-base">Active Prediction:</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 max-w-2xl">
                    <div className="text-center">
                      <div className="text-gray-400 text-sm font-medium">Token</div>
                      <div className="text-white font-bold text-lg uppercase">{cryptoId}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400 text-sm font-medium">Forecast Period</div>
                      <div className="text-white font-bold text-lg">{predictionDays} Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400 text-sm font-medium">Model Type</div>
                      <div className="text-white font-bold text-lg capitalize">{modelType}</div>
                    </div>
                  </div>
                </div>
                {prediction.predictions && prediction.predictions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-purple-400/20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-gray-400 text-sm font-medium">Current Price</div>
                        <div className="text-white font-bold text-lg">
                          ${cryptoData && cryptoData.length > 0 ? cryptoData[cryptoData.length - 1].price.toFixed(2) : 'N/A'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400 text-sm font-medium">Predicted Price</div>
                        <div className="text-green-400 font-bold text-lg">
                          ${prediction.predictions[prediction.predictions.length - 1].predictedPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400 text-sm font-medium">Price Change</div>
                        <div className={`font-bold text-lg ${
                          cryptoData && cryptoData.length > 0 && 
                          ((prediction.predictions[prediction.predictions.length - 1].predictedPrice - cryptoData[cryptoData.length - 1].price) / cryptoData[cryptoData.length - 1].price * 100) >= 0 
                            ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {cryptoData && cryptoData.length > 0 ? (
                            `${((prediction.predictions[prediction.predictions.length - 1].predictedPrice - cryptoData[cryptoData.length - 1].price) / cryptoData[cryptoData.length - 1].price * 100).toFixed(1)}%`
                          ) : 'N/A'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400 text-sm font-medium">Confidence</div>
                        <div className="text-blue-400 font-bold text-lg">
                          {prediction.predictions[prediction.predictions.length - 1].confidence.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
