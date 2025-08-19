import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain } from "lucide-react";
import { ModelTypeTooltip } from "@/components/ModelTypeTooltip";

interface AIPredictionControlsProps {
  predictionDays: number;
  setPredictionDays: (value: number) => void;
  modelType: string;
  setModelType: (value: string) => void;
  predictionLoading: boolean;
  handlePredict: () => void;
  handleClearPrediction: () => void;
  showPrediction: boolean;
  cryptoData: any[] | undefined;
  selectedCrypto?: string;
  setSelectedCrypto?: (value: string) => void;
  cryptoOptions?: any[];
}

export const AIPredictionControls: React.FC<AIPredictionControlsProps> = ({
  predictionDays,
  setPredictionDays,
  modelType,
  setModelType,
  predictionLoading,
  handlePredict,
  handleClearPrediction,
  showPrediction,
  cryptoData,
  selectedCrypto,
  setSelectedCrypto,
  cryptoOptions,
}) => {
  return (
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
          {selectedCrypto && setSelectedCrypto && cryptoOptions && (
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold text-purple-200">Cryptocurrency:</span>
              <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                <SelectTrigger className="w-64 h-12 bg-gray-900/80 border-purple-400/60 text-white text-base font-medium hover:bg-gray-800/90 hover:border-purple-300/80 transition-all duration-200 shadow-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-purple-500/60 shadow-2xl z-[100] max-h-64 overflow-y-auto">
                  {cryptoOptions.slice(0, 20).map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="text-white hover:bg-purple-600/30 focus:bg-purple-600/30 focus:text-white py-3 text-base font-medium"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold text-purple-200">Timeline:</span>
            <Select value={predictionDays.toString()} onValueChange={(value) => setPredictionDays(Number(value))}>
              <SelectTrigger className="w-32 h-12 bg-gray-900/80 border-purple-400/60 text-white text-base font-medium hover:bg-gray-800/90 hover:border-purple-300/80 transition-all duration-200 shadow-lg">
                <SelectValue className="text-white" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-purple-500/60 shadow-2xl z-[100]">
                <SelectItem value="7" className="text-white hover:bg-purple-600/30 focus:bg-purple-600/30 focus:text-white py-3 text-base font-medium">7 Days</SelectItem>
                <SelectItem value="30" className="text-white hover:bg-purple-600/30 focus:bg-purple-600/30 focus:text-white py-3 text-base font-medium">30 Days</SelectItem>
                <SelectItem value="90" className="text-white hover:bg-purple-600/30 focus:bg-purple-600/30 focus:text-white py-3 text-base font-medium">90 Days</SelectItem>
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
                <SelectItem value="technical" className="text-white hover:bg-purple-600/30 focus:bg-purple-600/30 focus:text-white py-3 text-base font-medium">
                  Technical
                </SelectItem>
                <SelectItem value="sentiment" className="text-white hover:bg-purple-600/30 focus:bg-purple-600/30 focus:text-white py-3 text-base font-medium">
                  Sentiment
                </SelectItem>
                <SelectItem value="hybrid" className="text-white hover:bg-purple-600/30 focus:bg-purple-600/30 focus:text-white py-3 text-base font-medium">
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
    </div>
  );
};