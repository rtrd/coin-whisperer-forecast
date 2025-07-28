import React from "react";
import { TechnicalAnalysisContainer } from "@/components/technical/TechnicalAnalysisContainer";

interface PriceData {
  timestamp: number;
  price: number;
  volume?: number;
}

interface TechnicalAnalysisProps {
  data: PriceData[] | null;
  isLoading: boolean;
}

export const TechnicalAnalysis: React.FC<TechnicalAnalysisProps> = ({
  data,
  isLoading,
}) => {
  return <TechnicalAnalysisContainer data={data} isLoading={isLoading} />;
};
