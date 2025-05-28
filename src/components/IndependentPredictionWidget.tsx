
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Activity, Brain, Target, Info, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { CryptoSearchSelector } from "./CryptoSearchSelector";
import { PriceChart } from "./PriceChart";
import { useCryptoData } from "@/hooks/useCryptoData";
import { usePrediction } from "@/hooks/usePrediction";
import { toast } from "sonner";

interface CryptoOption {
  value: string;
  label: string;
  icon: string;
  category: string;
  score: number;
  prediction: string;
}

interface IndependentPredictionWidgetProps {
  cryptoOptions: CryptoOption[];
}

export const IndependentPredictionWidget: React.FC<IndependentPredictionWidgetProps> = ({
  cryptoOptions
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [timeframe, setTimeframe] = useState('7d');
  const [predictionDays, setPredictionDays] = useState(7);
  const [modelType, setModelType] = useState('advanced');
  const [showPrediction, setShowPrediction] = useState(false);

  const { data: cryptoData, isLoading: dataLoading } = useCryptoData(selectedCrypto, timeframe);
  const { prediction, isLoading: predictionLoading, generatePrediction } = usePrediction();

  const handlePredict = async () => {
    if (!cryptoData) {
      toast.error("No data available for prediction");
      return;
    }
    
    await generatePrediction(cryptoData, selectedCrypto, predictionDays);
    setShowPrediction(true);
    toast.success("Prediction generated successfully!");
  };

  const currentPrice = cryptoData && cryptoData.length > 0 ? cryptoData[cryptoData.length - 1]?.price : 0;
  const previousPrice = cryptoData && cryptoData.length > 1 ? cryptoData[cryptoData.length - 2]?.price : 0;
  const priceChange = currentPrice && previousPrice ? ((currentPrice - previousPrice) / previousPrice) * 100 : 0;

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 100) return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString()}`;
  };

  const selectedOption = cryptoOptions.find(option => option.value === selectedCrypto);

  return (
    <TooltipProvider>
      <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-shadow-lg">
            <Target className="h-5 w-5 text-green-400" />
            Independent AI Prediction Analysis
            <Badge className="bg-blue-600">Advanced</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="text-sm font-medium text-gray-200 mb-2 block">Cryptocurrency</label>
              <CryptoSearchSelector
                cryptoOptions={cryptoOptions}
                selectedCrypto={selectedCrypto}
                onSelectCrypto={setSelectedCrypto}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-200 mb-2 flex items-center gap-1">
                Time Period
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Historical data period used for analysis and prediction generation</p>
                  </TooltipContent>
                </Tooltip>
              </label>
              <Select value={timeframe} onValueChange={setTimeframe}>
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
              <label className="text-sm font-medium text-gray-200 mb-2 flex items-center gap-1">
                Prediction Days
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of days into the future to generate price predictions</p>
                  </TooltipContent>
                </Tooltip>
              </label>
              <Select value={predictionDays.toString()} onValueChange={(value) => setPredictionDays(Number(value))}>
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
              <label className="text-sm font-medium text-gray-200 mb-2 block">Model Type</label>
              <Select value={modelType} onValueChange={setModelType}>
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
            
            <div className="flex items-end sm:col-span-2 lg:col-span-4 xl:col-span-1">
              <Button 
                onClick={handlePredict}
                disabled={dataLoading || predictionLoading || !cryptoData}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {predictionLoading ? (
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Analyzing...</span>
                    <span className="sm:hidden">...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span className="hidden sm:inline">Generate Prediction</span>
                    <span className="sm:hidden">Predict</span>
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Expanded Prediction Results */}
          {showPrediction && prediction && (
            <div className="space-y-6 border-t border-gray-700 pt-6">
              {/* Current Token Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg">
                <span className="text-2xl">{selectedOption?.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedOption?.label}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <span>Current Price: {formatPrice(currentPrice)}</span>
                    <span className={`flex items-center gap-1 ${
                      priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {priceChange >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Chart with Predictions */}
              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Price Chart & AI Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PriceChart 
                    data={cryptoData} 
                    prediction={prediction.predictions}
                    isLoading={dataLoading}
                    crypto={selectedCrypto}
                  />
                </CardContent>
              </Card>

              {/* AI Analysis Summary */}
              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-400" />
                    AI Analysis Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-white">{prediction.accuracy.toFixed(1)}%</div>
                      <div className="text-sm text-gray-400">Confidence</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <div className={`text-2xl font-bold capitalize ${
                        prediction.trend === 'bullish' ? 'text-green-400' : 
                        prediction.trend === 'bearish' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {prediction.trend}
                      </div>
                      <div className="text-sm text-gray-400">Market Trend</div>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-white">{predictionDays}d</div>
                      <div className="text-sm text-gray-400">Forecast Period</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-white">Key Factors Analysis:</h4>
                    {prediction.factors.map((factor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            factor.impact === 'positive' ? 'bg-green-400' : 
                            factor.impact === 'negative' ? 'bg-red-400' : 'bg-yellow-400'
                          }`} />
                          <span className="text-white">{factor.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">{(factor.weight * 100).toFixed(0)}% weight</span>
                          <Badge variant="outline" className={
                            factor.impact === 'positive' ? 'text-green-400 border-green-400' : 
                            factor.impact === 'negative' ? 'text-red-400 border-red-400' : 
                            'text-yellow-400 border-yellow-400'
                          }>
                            {factor.impact}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                    <p className="text-blue-200 text-sm leading-relaxed">
                      <strong>AI Generated Insight:</strong> Based on our advanced neural network analysis of {selectedOption?.label}, 
                      the model shows {prediction.trend} sentiment with {prediction.accuracy.toFixed(1)}% confidence. 
                      The prediction considers technical indicators, market sentiment, and historical patterns over the selected {timeframe} period. 
                      Key factors include {prediction.factors[0]?.name.toLowerCase()} ({(prediction.factors[0]?.weight * 100).toFixed(0)}% impact) 
                      and current market volatility. This analysis suggests a {prediction.trend} outlook for the next {predictionDays} days.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
