
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Brain, Zap, Target, Layers } from "lucide-react";

interface ModelTypeTooltipProps {
  modelType?: string;
}

export const ModelTypeTooltip: React.FC<ModelTypeTooltipProps> = ({ modelType = 'advanced' }) => {
  const getModelInfo = (type: string) => {
    switch (type) {
      case 'basic':
        return {
          icon: <Zap className="h-4 w-4 text-blue-400" />,
          title: 'Basic LSTM',
          description: 'Long Short-Term Memory neural network designed for basic time series prediction.',
          bestFor: 'Short-term predictions (1-3 days)',
          features: ['Fast processing', 'Simple pattern recognition', 'Good for stable markets'],
          recommendation: 'Choose this for quick predictions on well-established cryptocurrencies with stable price patterns.'
        };
      case 'advanced':
        return {
          icon: <Brain className="h-4 w-4 text-purple-400" />,
          title: 'Advanced Neural Network',
          description: 'Multi-layer neural network with advanced feature engineering and technical indicators.',
          bestFor: 'Medium-term predictions (3-14 days)',
          features: ['Technical indicator analysis', 'Volume pattern recognition', 'Market sentiment integration'],
          recommendation: 'Recommended for most users. Balances accuracy with processing speed for reliable predictions.'
        };
      case 'ensemble':
        return {
          icon: <Layers className="h-4 w-4 text-green-400" />,
          title: 'Ensemble Model',
          description: 'Combines multiple AI models (LSTM, Random Forest, SVM) for enhanced accuracy.',
          bestFor: 'All timeframes with higher accuracy',
          features: ['Multiple model voting', 'Reduced overfitting', 'Cross-validation'],
          recommendation: 'Best choice for important trading decisions. Higher accuracy but slower processing.'
        };
      case 'transformer':
        return {
          icon: <Target className="h-4 w-4 text-red-400" />,
          title: 'Transformer Model',
          description: 'State-of-the-art attention-based model similar to GPT, designed for complex pattern recognition.',
          bestFor: 'Long-term predictions (14-30 days)',
          features: ['Attention mechanisms', 'Complex pattern detection', 'Market regime changes'],
          recommendation: 'Choose for volatile cryptocurrencies or when market conditions are changing rapidly.'
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
          <Info className="h-3 w-3 text-gray-400 hover:text-white transition-colors" />
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-4 bg-gray-800 border-gray-600">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {modelInfo.icon}
              <h4 className="font-semibold text-white">{modelInfo.title}</h4>
            </div>
            
            <p className="text-sm text-gray-300">{modelInfo.description}</p>
            
            <div>
              <h5 className="text-sm font-medium text-white mb-1">Best For:</h5>
              <p className="text-sm text-blue-300">{modelInfo.bestFor}</p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-white mb-1">Key Features:</h5>
              <ul className="text-sm text-gray-300 space-y-1">
                {modelInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-gray-600 pt-2">
              <p className="text-sm text-green-300 font-medium">💡 Recommendation:</p>
              <p className="text-sm text-gray-300 mt-1">{modelInfo.recommendation}</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
