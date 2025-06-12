
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Activity, Brain, Target, Info, BarChart3, TrendingUp, TrendingDown, Clock, Calendar } from "lucide-react";
import { CryptoSearchSelector } from "./CryptoSearchSelector";
import { PriceChart } from "./PriceChart";
import { ModelTypeTooltip } from "./ModelTypeTooltip";
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

const TimePeriodTooltip: React.FC<{ timeframe: string }> = ({ timeframe }) => {
  const getTimePeriodInfo = (period: string) => {
    switch (period) {
      case '1d':
        return {
          icon: <Clock className="h-4 w-4 text-blue-400" />,
          title: '1 Day Period',
          description: 'Ultra short-term analysis using the last 24 hours of price data.',
          bestFor: 'Scalping and high-frequency trading',
          features: ['Real-time patterns', 'Immediate market reactions', 'Intraday volatility'],
          recommendation: 'Best for experienced day traders who can monitor positions closely and react quickly to market changes.'
        };
      case '7d':
        return {
          icon: <Calendar className="h-4 w-4 text-green-400" />,
          title: '7 Days Period',
          description: 'Short-term analysis incorporating weekly trading patterns and trends.',
          bestFor: 'Swing trading and weekly strategies',
          features: ['Weekly trend analysis', 'Market cycle patterns', 'Technical breakouts'],
          recommendation: 'Ideal for most traders. Provides good balance between recent trends and pattern recognition.'
        };
      case '30d':
        return {
          icon: <BarChart3 className="h-4 w-4 text-purple-400" />,
          title: '30 Days Period',
          description: 'Medium-term analysis using a full month of historical price data.',
          bestFor: 'Position trading and monthly cycles',
          features: ['Monthly trend analysis', 'Support/resistance levels', 'Market sentiment shifts'],
          recommendation: 'Great for identifying medium-term trends and major support/resistance levels for position trading.'
        };
      case '90d':
        return {
          icon: <TrendingUp className="h-4 w-4 text-orange-400" />,
          title: '90 Days Period',
          description: 'Long-term analysis incorporating quarterly patterns and seasonal trends.',
          bestFor: 'Long-term investment decisions',
          features: ['Quarterly patterns', 'Seasonal trends', 'Major market cycles'],
          recommendation: 'Perfect for long-term investors looking to identify major trend reversals and market cycles.'
        };
      default:
        return {
          icon: <Info className="h-4 w-4 text-gray-400" />,
          title: 'Time Period',
          description: 'Select a time period to see detailed information.',
          bestFor: 'Various trading strategies',
          features: ['Different analysis depths'],
          recommendation: 'Choose based on your trading timeframe and strategy.'
        };
    }
  };

  const periodInfo = getTimePeriodInfo(timeframe);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info className="h-3 w-3 text-gray-400 hover:text-white transition-colors" />
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-4 bg-gray-800 border-gray-600">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {periodInfo.icon}
              <h4 className="font-semibold text-white">{periodInfo.title}</h4>
            </div>
            
            <p className="text-sm text-gray-300">{periodInfo.description}</p>
            
            <div>
              <h5 className="text-sm font-medium text-white mb-1">Best For:</h5>
              <p className="text-sm text-blue-300">{periodInfo.bestFor}</p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-white mb-1">Key Features:</h5>
              <ul className="text-sm text-gray-300 space-y-1">
                {periodInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-gray-600 pt-2">
              <p className="text-sm text-green-300 font-medium">💡 Recommendation:</p>
              <p className="text-sm text-gray-300 mt-1">{periodInfo.recommendation}</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const PredictionDaysTooltip: React.FC<{ predictionDays: number }> = ({ predictionDays }) => {
  const getPredictionDaysInfo = (days: number) => {
    if (days <= 1) {
      return {
        icon: <Target className="h-4 w-4 text-green-400" />,
        title: '1 Day Prediction',
        description: 'Ultra-precise short-term forecast for the next 24 hours.',
        bestFor: 'Day trading and scalping strategies',
        features: ['Highest accuracy', 'Immediate actionable insights', 'Real-time market reactions'],
        recommendation: 'Perfect for day traders who need high-confidence predictions for quick market entry and exit decisions.'
      };
    } else if (days <= 3) {
      return {
        icon: <Activity className="h-4 w-4 text-blue-400" />,
        title: '3 Days Prediction',
        description: 'Short-term forecast covering the next 2-3 trading days.',
        bestFor: 'Short-term swing trading',
        features: ['High accuracy', 'Multi-day trend analysis', 'Weekend gap considerations'],
        recommendation: 'Ideal for swing traders looking to capitalize on short-term price movements over a few days.'
      };
    } else if (days <= 7) {
      return {
        icon: <Calendar className="h-4 w-4 text-purple-400" />,
        title: '7 Days Prediction',
        description: 'Weekly forecast incorporating full trading week patterns.',
        bestFor: 'Weekly swing trading strategies',
        features: ['Weekly trend prediction', 'Pattern completion analysis', 'Market cycle timing'],
        recommendation: 'Best balance of accuracy and timeframe for most traders. Great for weekly position planning.'
      };
    } else if (days <= 14) {
      return {
        icon: <TrendingUp className="h-4 w-4 text-orange-400" />,
        title: '14 Days Prediction',
        description: 'Bi-weekly forecast for medium-term position planning.',
        bestFor: 'Position trading and trend following',
        features: ['Medium-term trend analysis', 'Support/resistance forecasting', 'Momentum predictions'],
        recommendation: 'Suitable for position traders who want to identify and ride medium-term trends with good confidence.'
      };
    } else {
      return {
        icon: <BarChart3 className="h-4 w-4 text-red-400" />,
        title: '30 Days Prediction',
        description: 'Long-term forecast for major trend and cycle analysis.',
        bestFor: 'Long-term investment decisions',
        features: ['Long-term trend forecasting', 'Major cycle predictions', 'Investment planning'],
        recommendation: 'Best for long-term investors planning major position changes. Lower accuracy but valuable for strategic decisions.'
      };
    }
  };

  const daysInfo = getPredictionDaysInfo(predictionDays);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info className="h-3 w-3 text-gray-400 hover:text-white transition-colors" />
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-4 bg-gray-800 border-gray-600">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {daysInfo.icon}
              <h4 className="font-semibold text-white">{daysInfo.title}</h4>
            </div>
            
            <p className="text-sm text-gray-300">{daysInfo.description}</p>
            
            <div>
              <h5 className="text-sm font-medium text-white mb-1">Best For:</h5>
              <p className="text-sm text-blue-300">{daysInfo.bestFor}</p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-white mb-1">Key Features:</h5>
              <ul className="text-sm text-gray-300 space-y-1">
                {daysInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-gray-600 pt-2">
              <p className="text-sm text-green-300 font-medium">💡 Recommendation:</p>
              <p className="text-sm text-gray-300 mt-1">{daysInfo.recommendation}</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

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
          <CardTitle className="text-white flex items-center gap-2">
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
              <label className="text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                Time Period
                <TimePeriodTooltip timeframe={timeframe} />
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
              <label className="text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                Prediction Days
                <PredictionDaysTooltip predictionDays={predictionDays} />
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
              <label className="text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                Model Type
                <ModelTypeTooltip modelType={modelType} />
              </label>
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
