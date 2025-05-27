
import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModelTypeTooltipProps {
  modelType: string;
}

export const ModelTypeTooltip = ({ modelType }: ModelTypeTooltipProps) => {
  const getModelInfo = (type: string) => {
    switch (type) {
      case 'basic':
        return {
          name: 'Technical Trend Spotter',
          description: 'Uses moving averages, RSI, and basic chart patterns. Great for beginners who want simple, reliable signals based on price action.',
          accuracy: '65-70%',
          bestFor: 'Short-term trends, day trading'
        };
      case 'advanced':
        return {
          name: 'AI Market Prophet',
          description: 'Advanced neural networks analyzing 50+ indicators including sentiment, volume patterns, whale movements, and macro trends.',
          accuracy: '78-85%',
          bestFor: 'Medium-term predictions, swing trading'
        };
      case 'ensemble':
        return {
          name: 'Multi-Brain Consensus',
          description: 'Combines 5 different AI models: Technical analyst, Sentiment tracker, Whale watcher, News processor, and Market correlator.',
          accuracy: '82-88%',
          bestFor: 'High-confidence predictions, portfolio decisions'
        };
      default:
        return {
          name: 'Unknown Model',
          description: 'Model information not available',
          accuracy: 'N/A',
          bestFor: 'N/A'
        };
    }
  };

  const modelInfo = getModelInfo(modelType);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-4 w-4 text-blue-400 cursor-help ml-2" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs p-4 bg-gray-800 border-gray-600">
        <div className="space-y-2">
          <h4 className="font-bold text-blue-400">{modelInfo.name}</h4>
          <p className="text-sm text-gray-200">{modelInfo.description}</p>
          <div className="border-t border-gray-600 pt-2 mt-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Accuracy:</span>
              <span className="text-green-400 font-medium">{modelInfo.accuracy}</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-400">Best for:</span>
              <span className="text-yellow-400 font-medium">{modelInfo.bestFor}</span>
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
