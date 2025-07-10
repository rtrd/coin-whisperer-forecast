
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Brain, Zap, Target, Layers } from "lucide-react";

interface ModelTypeTooltipProps {
  modelType: string;
}

export const ModelTypeTooltip: React.FC<ModelTypeTooltipProps> = ({ modelType }) => {
  const getModelInfo = (type: string) => {
    switch (type) {
      case 'technical':
        return {
          icon: <Zap className="h-4 w-4 text-blue-400" />,
          title: 'Technical Analysis Model',
          description: 'Advanced neural network that analyzes price patterns, volume trends, and technical indicators to predict future price movements.',
          bestFor: 'Short to medium-term predictions (7-30 days)',
          features: [
            'RSI, MACD, and Bollinger Bands analysis',
            'Support and resistance level detection',
            'Volume pattern recognition',
            'Moving average convergence analysis',
            'Candlestick pattern identification'
          ],
          recommendation: 'Best for traders who rely on chart analysis and technical indicators. Highly effective for established cryptocurrencies with consistent trading patterns.'
        };
      case 'sentiment':
        return {
          icon: <Brain className="h-4 w-4 text-purple-400" />,
          title: 'Sentiment Analysis Model',
          description: 'AI model that processes social media sentiment, news analysis, and market psychology indicators to predict price movements based on crowd behavior.',
          bestFor: 'Short-term predictions during high volatility (7-14 days)',
          features: [
            'Social media sentiment analysis',
            'News impact assessment',
            'Fear & Greed index integration',
            'Institutional sentiment tracking',
            'Community engagement metrics'
          ],
          recommendation: 'Ideal for volatile markets and trending cryptocurrencies. Particularly effective during major news events or social media campaigns.'
        };
      case 'hybrid':
        return {
          icon: <Target className="h-4 w-4 text-green-400" />,
          title: 'Hybrid Ensemble Model',
          description: 'Combines technical analysis and sentiment data using advanced ensemble learning techniques for the most comprehensive price predictions.',
          bestFor: 'All timeframes with highest accuracy (7-90 days)',
          features: [
            'Technical + sentiment data fusion',
            'Multiple AI model voting system',
            'Cross-validation and error correction',
            'Adaptive learning algorithms',
            'Market regime detection'
          ],
          recommendation: 'Recommended for most users seeking the highest accuracy. Balances technical patterns with market sentiment for optimal predictions across all market conditions.'
        };
      default:
        return {
          icon: <Info className="h-4 w-4 text-gray-400" />,
          title: 'Model Information',
          description: 'Select a model type to see detailed information.',
          bestFor: 'Various use cases',
          features: ['Different capabilities'],
          recommendation: 'Choose based on your prediction needs.'
        };
    }
  };

  const modelInfo = getModelInfo(modelType);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info className="h-4 w-4 text-gray-400 hover:text-white transition-colors" />
        </TooltipTrigger>
        <TooltipContent className="max-w-md p-5 bg-gray-800 border-gray-600 shadow-2xl z-[99999]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {modelInfo.icon}
              <h4 className="font-semibold text-white text-base">{modelInfo.title}</h4>
            </div>
            
            <p className="text-sm text-gray-300 leading-relaxed">{modelInfo.description}</p>
            
            <div>
              <h5 className="text-sm font-medium text-white mb-2">Best For:</h5>
              <p className="text-sm text-blue-300 font-medium">{modelInfo.bestFor}</p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-white mb-2">Key Features:</h5>
              <ul className="text-sm text-gray-300 space-y-1">
                {modelInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-gray-600 pt-3">
              <p className="text-sm text-green-300 font-medium mb-1">💡 Recommendation:</p>
              <p className="text-sm text-gray-300 leading-relaxed">{modelInfo.recommendation}</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
