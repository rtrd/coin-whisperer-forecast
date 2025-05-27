
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Activity, Brain } from "lucide-react";
import { CryptoSearchSelector } from "@/components/CryptoSearchSelector";
import { ModelTypeTooltip } from "@/components/ModelTypeTooltip";

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
          AI Prediction Parameters
          <Badge className="bg-blue-600">Advanced</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Cryptocurrency</label>
            <CryptoSearchSelector
              cryptoOptions={filteredCryptos}
              selectedCrypto={selectedCrypto}
              onSelectCrypto={onSelectCrypto}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Historical Data Period</label>
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
            <label className="text-sm font-medium text-gray-300 mb-2 block">Prediction Horizon</label>
            <Input
              type="number"
              value={predictionDays}
              onChange={(e) => onPredictionDaysChange(Number(e.target.value))}
              min="1"
              max="30"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center">
              AI Model Type
              <ModelTypeTooltip modelType={modelType} />
            </label>
            <Select value={modelType} onValueChange={onModelTypeChange}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="basic" className="text-white">Technical Trend Spotter</SelectItem>
                <SelectItem value="advanced" className="text-white">AI Market Prophet</SelectItem>
                <SelectItem value="ensemble" className="text-white">Multi-Brain Consensus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={onPredict}
              disabled={dataLoading || predictionLoading || !cryptoData}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
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
