import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useTechnicalAnalysis } from "@/hooks/useTechnicalAnalysis";
import { TechnicalAnalysisLoading } from "@/components/shared/LoadingStates";
import { OverallSignalCard } from "./OverallSignalCard";
import { IndicatorsList } from "./IndicatorsList";
import { KeyPriceLevels } from "./KeyPriceLevels";

interface PriceData {
  timestamp: number;
  price: number;
  volume?: number;
}

interface TechnicalAnalysisContainerProps {
  data: PriceData[] | null;
  isLoading: boolean;
}

export const TechnicalAnalysisContainer: React.FC<TechnicalAnalysisContainerProps> = ({
  data,
  isLoading,
}) => {
  const technicalData = useTechnicalAnalysis(data);

  if (isLoading) {
    return <TechnicalAnalysisLoading />;
  }

  if (!data || data.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm">
        <CardHeader className="bg-gray-700/30 border-b border-gray-600/30">
          <CardTitle className="text-white flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-500/20">
              <BarChart3 className="h-6 w-6 text-blue-400" />
            </div>
            Technical Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-400">No data available for analysis</p>
        </CardContent>
      </Card>
    );
  }

  if (!technicalData) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm">
        <CardHeader className="bg-gray-700/30 border-b border-gray-600/30">
          <CardTitle className="text-white flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-500/20">
              <BarChart3 className="h-6 w-6 text-blue-400" />
            </div>
            Technical Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-400">Unable to analyze data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gray-700/30 border-b border-gray-600/30">
        <CardTitle className="text-white flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-500/20">
            <BarChart3 className="h-6 w-6 text-blue-400" />
          </div>
          Technical Analysis
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse ml-auto"></div>
        </CardTitle>
        <CardDescription className="text-gray-300">
          AI-powered technical indicators and trading signals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <OverallSignalCard
          overallTrend={technicalData.overallTrend}
          overallSignal={technicalData.overallSignal}
        />
        
        <IndicatorsList indicators={technicalData.indicators} />
        
        <KeyPriceLevels
          supportLevel={technicalData.supportLevel}
          resistanceLevel={technicalData.resistanceLevel}
        />
      </CardContent>
    </Card>
  );
};