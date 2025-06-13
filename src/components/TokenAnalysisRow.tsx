
import React from 'react';
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TokenAnalysisRowProps {
  label: string;
  value: string;
  tooltipText: string;
  valueClassName?: string;
}

export const TokenAnalysisRow: React.FC<TokenAnalysisRowProps> = ({
  label,
  value,
  tooltipText,
  valueClassName = "text-white font-bold text-lg"
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-gray-100 font-medium">{label}</span>
        <Tooltip>
          <TooltipTrigger>
            <HelpCircle className="h-3 w-3 text-gray-300" />
          </TooltipTrigger>
          <TooltipContent className="bg-gray-700 border-gray-600">
            <p className="text-gray-100">{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <span className={valueClassName}>
        {value}
      </span>
    </div>
  );
};
