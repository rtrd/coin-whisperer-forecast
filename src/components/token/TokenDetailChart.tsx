
import React from 'react';
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
import {
  BarChart3,
  Activity,
  Brain,
  Target,
} from "lucide-react";
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
  handleClearPrediction
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
                <SelectItem value="7d" className="text-white hover:bg-gray-700/80 focus:bg-gray-700/80 focus:text-white">7 Days</SelectItem>
                <SelectItem value="30d" className="text-white hover:bg-gray-700/80 focus:bg-gray-700/80 focus:text-white">30 Days</SelectItem>
                <SelectItem value="90d" className="text-white hover:bg-gray-700/80 focus:bg-gray-700/80 focus:text-white">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <PriceChart
          data={cryptoData || []}
          isLoading={dataLoading}
          prediction={showPrediction && prediction ? prediction.predictions : null}
          crypto={cryptoId}
          onClearPrediction={handleClearPrediction}
        />

        {/* AI Prediction Engine - Inside chart container */}
        <div className="bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-xl p-6 border border-gray-600/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                AI Prediction Engine
                <Badge className="bg-purple-600">Advanced</Badge>
              </h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-gray-200">
                Timeframe
              </label>
              <Select value={predictionDays.toString()} onValueChange={(value) => setPredictionDays(Number(value))}>
                <SelectTrigger className="w-full h-12 bg-gray-600/70 border-gray-500/60 text-white hover:bg-gray-600/90 transition-colors shadow-lg backdrop-blur-sm rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 backdrop-blur-sm border-gray-600 shadow-xl rounded-xl z-50">
                  <SelectItem value="7" className="text-white hover:bg-gray-700/80 focus:bg-gray-700/80 focus:text-white rounded-lg">7 Days</SelectItem>
                  <SelectItem value="30" className="text-white hover:bg-gray-700/80 focus:bg-gray-700/80 focus:text-white rounded-lg">30 Days</SelectItem>
                  <SelectItem value="90" className="text-white hover:bg-gray-700/80 focus:bg-gray-700/80 focus:text-white rounded-lg">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-200">
                  Logic
                </label>
                <ModelTypeTooltip modelType={modelType} />
              </div>
              <Select value={modelType} onValueChange={setModelType}>
                <SelectTrigger className="w-full h-12 bg-gray-600/70 border-gray-500/60 text-white hover:bg-gray-600/90 transition-colors shadow-lg backdrop-blur-sm rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 backdrop-blur-sm border-gray-600 shadow-xl rounded-xl z-50">
                  <SelectItem value="technical" className="text-white hover:bg-gray-700/80 focus:bg-gray-700/80 focus:text-white rounded-lg">Technical Analysis</SelectItem>
                  <SelectItem value="sentiment" className="text-white hover:bg-gray-700/80 focus:bg-gray-700/80 focus:text-white rounded-lg">Sentiment Analysis</SelectItem>
                  <SelectItem value="mixed" className="text-white hover:bg-gray-700/80 focus:bg-gray-700/80 focus:text-white rounded-lg">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-3 justify-end">
              <div className="h-6"></div> {/* Spacer to align with other columns */}
              <Button
                onClick={handlePredict}
                disabled={predictionLoading}
                className="h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:hover:scale-100 rounded-xl font-semibold"
              >
                {predictionLoading ? (
                  <>
                    <Activity className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Target className="h-5 w-5 mr-2" />
                    Generate Prediction
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
