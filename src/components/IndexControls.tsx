
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Activity, Brain, Target } from "lucide-react";
import { CryptoSearchSelector } from "./CryptoSearchSelector";
import { ModelTypeTooltip } from "./ModelTypeTooltip";

interface IndexControlsProps {
  selectedCrypto: string;
  timeframe: string;
  predictionDays: number;
  modelType: string;
  filteredCryptos: any[];
  dataLoading: boolean;
  predictionLoading: boolean;
  cryptoData: any;
  onSelectCrypto: (crypto: string) => void;
  onTimeframeChange: (timeframe: string) => void;
  onPredictionDaysChange: (days: number) => void;
  onModelTypeChange: (model: string) => void;
  onPredict: () => void;
}

export const IndexControls: React.FC<IndexControlsProps> = ({
  selectedCrypto,
  timeframe,
  predictionDays,
  modelType,
  filteredCryptos,
  dataLoading,
  predictionLoading,
  cryptoData,
  onSelectCrypto,
  onTimeframeChange,
  onPredictionDaysChange,
  onModelTypeChange,
  onPredict
}) => {
  return (
    <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="h-5 w-5 text-green-400" />
          AI Prediction Controls
          <Badge className="bg-green-600">Enhanced</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-200 mb-2 block">Cryptocurrency</label>
            <CryptoSearchSelector
              cryptoOptions={filteredCryptos}
              selectedCrypto={selectedCrypto}
              onSelectCrypto={onSelectCrypto}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-200 mb-2 block">Time Period</label>
            <Select value={timeframe} onValueChange={onTimeframeChange}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="1d" className="text-white">1 Day</SelectItem>
                <SelectItem value="7d" className="text-white">7 Days</SelectItem>
                <SelectItem value="30d" className="text-white">30 Days</SelectItem>
                <SelectItem value="90d" className="text-white">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-200 mb-2 block">Prediction Days</label>
            <Select value={predictionDays.toString()} onValueChange={(value) => onPredictionDaysChange(Number(value))}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="1" className="text-white">1 Day</SelectItem>
                <SelectItem value="3" className="text-white">3 Days</SelectItem>
                <SelectItem value="7" className="text-white">7 Days</SelectItem>
                <SelectItem value="14" className="text-white">14 Days</SelectItem>
                <SelectItem value="30" className="text-white">30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
              Model Type
              <ModelTypeTooltip modelType={modelType} />
            </label>
            <Select value={modelType} onValueChange={onModelTypeChange}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="basic" className="text-white">Basic LSTM</SelectItem>
                <SelectItem value="advanced" className="text-white">Advanced Neural</SelectItem>
                <SelectItem value="ensemble" className="text-white">Ensemble Model</SelectItem>
                <SelectItem value="transformer" className="text-white">Transformer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={onPredict}
              disabled={dataLoading || predictionLoading || !cryptoData}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {predictionLoading ? (
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 animate-spin" />
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Generate Prediction
                </div>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
